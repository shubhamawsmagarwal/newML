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

/****** Importing dataStructure   ******/
const NewsChain=require('./models/newsChain');
const newsChainInstance=new NewsChain();

/********** get routes  *********/
app.get("/",function(req,res){
    if(req.isAuthenticated())
       res.json({isLoggedIn:true,user:req.user,newsChain:newsChainInstance.chain});
    else
       res.json({isLoggedIn:false,user:null,newsChain:newsChainInstance.chain});
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
app.post("/contribute",function(req,res){
    if(!req.isAuthenticated())
       res.json({data:"LoginFirst"});
    const title= req.sanitize(req.body.title);
    const description=req.sanitize(req.body.description);
    const articleInstance=title+" "+description;
    const category=getCategory(articleInstance);
    var newArticle=new article({
    title:title,
    description:description,
    category:category,
    author:req.user.name,
    authorUsername:req.user.username
    });
    newsChainInstance.createNewArticle(req.user.name,req.user.username,title,description,category);
    newArticle.save(function(err,art){
        if(err){
            console.log(err);
            res.redirect("/");
        }
        else{
            req.user.articles.unshift(art);
            req.user.save();
            res.redirect("/");
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