/********* Requiring packages and using them ********/
const dirName=__dirname;
var express=require("express");
var mongoose=require("mongoose");
var cors = require('cors');
var passport=require("passport");
var bodyParser=require("body-parser");
var localStrategy=require("passport-local").Strategy;
var passportLocalMongoose=require("passport-local-mongoose");
var user=require("./models/user");
var article=require("./models/article").article;
var expressSanitizer=require("express-sanitizer");
mongoose.connect("mongodb://localhost/newsDatabase");
var app=express();
var corsOptions = {
  origin: process.env.host+':'+process.env.clientPORT,
  credentials:true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true,useNewUrlParser:true}));
app.use(require("express-session")({
    secret:"hopeisagoodthing",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   next();
});
app.use(expressSanitizer());
var io=require('socket.io').listen(process.env.websocketPORT);

/****** Importing dataStructure   ******/
const NewsChain=require('./models/newsChain');
const newsChainInstance=new NewsChain();

/********** get routes  *********/
app.get("/",function(req,res){
    if(req.isAuthenticated())
       res.json({isLoggedIn:true,user:req.user});
    else
       res.json({isLoggedIn:false,user:null});
});
app.get("/home",function(req,res){
    if(req.isAuthenticated())
       res.json({isLoggedIn:true,user:req.user,newsChain:newsChainInstance.chain});
    else
       res.json({isLoggedIn:false,user:null,newsChain:newsChainInstance.chain});
});
app.get("/logout",function(req,res){
    if(req.isAuthenticated()){
       req.logout();
    }
    res.redirect("/");
});



/********* post routes  ******************/
app.post("/login",passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/"
}),function(req,res){
});
app.post("/register",function(req,res){
    var newUser=new user({
    username:req.sanitize(req.body.username),
    name:req.sanitize(req.body.name)
    });
    user.register(newUser,req.body.password,function(err,User){
        if(err){
            console.log(err);
            return res.redirect("/");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        });        
    });
});
app.post("/check",function(req,res){
    user.find({username:req.body.username},function(err,result){
       if(!err){
          if(Array.isArray(result))
          var count=result.length;
          if(count>=1)
             res.json({success:true});
          else
             res.json({success:false});
        }
    });
});



/********* ML scripts ************/
function getCategory(article){
    const spawn=require('child_process').spawnSync;
    const newProcess=spawn('python',['./ml/getCategory.py',article,dirName]);
    var category=newProcess.stdout.toString().trim();
    return category;
}



/******** Listening *************/
app.listen(process.env.serverPORT,process.env.IP,function(res,req){
    console.log("Server is running");
});



/*********** Websocket connection ****************/
var connections=[]
io.sockets.on('connection',function(socket){
   connections.push(socket);
   console.log("Connected : %s sockets connected",connections.length);
   //disconnect
   socket.on("disconnect",function(data){
        connections.splice(connections.indexOf(socket),1);
        console.log("Disconnected : %s sockets connected",connections.length);
   });
   //send message
   socket.on("send message",function(data){
        const title= data.title;
        const description=data.description;
        const category=getCategory(title+" "+description);
        newsChainInstance.createNewArticle(data.name,data.username,title,description,category);
        var articleInstance={title:title,description:description,category:category,author:data.name,authorUsername:data.username};
        var newArticle=new article(articleInstance);
        newArticle.save(function(err,art){
            if(err)
                console.log(err);
            else{
                user.find({username:data.username},function(err,result){
                   result.articles.unshift(art);
                   result.save();
                   io.sockets.emit('new message',{msg:articleInstance});
                });
            }
        });
   });
});
