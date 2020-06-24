import React,{ Component } from 'react';
import axios from 'axios';
import {BrowserRouter as Router , Route , Switch} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import User from './components/User';
import Error from './components/Error';
import socketIOClient from "socket.io-client";
class App extends Component{
  socket = socketIOClient("http://:3002");
  constructor(props){
    super(props);
    this.state={
      user:null,
      isLoggedIn:false,
      loading:true,
      newsChain:[],
      url:"http://:3001"
    };
    this.LogIn=this.LogIn.bind(this);
    this.LogOut=this.LogOut.bind(this);
    this.Register=this.Register.bind(this);
    this.checkUsername=this.checkUsername.bind(this);
    this.Contribute=this.Contribute.bind(this);
  }
  async componentWillMount(){
    this.socket.on("new message",function(msg){
      const newUser=this.state.user;
      if(newUser!==null && newUser.username===msg.msg.authorUsername)
        newUser.articles.push(msg.msg);
      this.setState({newsChain:[...this.state.newsChain,msg.msg],user:newUser});
    }.bind(this));
    await axios.get(this.state.url+"/home",{withCredentials: true})
      .then(res => {this.setState({ isLoggedIn: res.data.isLoggedIn,user: res.data.user,newsChain:res.data.newsChain,loading:false })})
      .catch(err=>{console.log(err)});
  }
  async LogIn(username,password){
     await axios.post(this.state.url+"/login",{username: username,password: password},{withCredentials: true})
     .then(res => {this.setState({ isLoggedIn: res.data.isLoggedIn,user: res.data.user })})
     .catch(err=>{console.log(err)});
  }
  async Register(name,username,password){
    await axios.post(this.state.url+"/register",{name:name,username: username,password: password},{withCredentials: true})
     .then(res => {this.setState({ isLoggedIn: res.data.isLoggedIn,user: res.data.user })})
     .catch(err=>{console.log(err)});
  }
  async LogOut(){
    await axios.get(this.state.url+"/logout",{withCredentials: true})
    .then(res => {this.setState({ isLoggedIn: res.data.isLoggedIn,user: res.data.user })})
    .catch(err=>{console.log(err)});
  }
  async checkUsername(username){
    await axios.post(this.state.url+"/check",{username:username},{withCredentials: true})
     .then(res => {
       const data=res.data.success;
       if(data===true)
          alert("Username not available");
       else if(data===false)
          alert("Username available");
     })
     .catch(err=>{console.log(err)});
  }
  async Contribute(title,description,name,username){
     await this.socket.emit('send message',{title:title,description:description,name:name,username:username});
  }
  
  render(){
    return(
      <Router><div>
      {!this.state.loading
      ?<Switch>
        <Route exact path="/" render={(props)=><Home {...props} 
        isLoggedIn={this.state.isLoggedIn} newsChain={this.state.newsChain} LogOut={this.LogOut} username={!this.state.isLoggedIn?null:this.state.user.username}
        />}></Route>
        <Route exact path="/login"
        render={!this.state.isLoggedIn
        ?(props)=><Login {...props} LogIn={this.LogIn}/>
        :(props)=><User {...props} LogOut={this.LogOut} username={this.state.user.username} name={this.state.user.name} Contribute={this.Contribute} articles={this.state.user.articles}/> 
        }
        ></Route>
        <Route exact path="/register"
        render={!this.state.isLoggedIn
        ?(props)=><Register {...props} Register={this.Register} checkUsername={this.checkUsername}/>
        :(props)=><User {...props} LogOut={this.LogOut} username={this.state.user.username} name={this.state.user.name} Contribute={this.Contribute} articles={this.state.user.articles}/> 
        }
        ></Route>
        <Route exact path="/user"
        render={!this.state.isLoggedIn
        ?(props)=><Login {...props} LogIn={this.LogIn}/>
        :(props)=><User {...props} LogOut={this.LogOut} username={this.state.user.username} name={this.state.user.name} Contribute={this.Contribute} articles={this.state.user.articles}/> 
        }
        ></Route>
        <Route component={Error}></Route>
      </Switch>
      :<Route render={()=>(<div className="text-center">Loading....</div>)}></Route>
      }</div></Router>
    );
  }
}
export default App;
