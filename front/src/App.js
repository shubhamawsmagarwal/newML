import React,{ Component } from 'react';
import axios from 'axios';
import {BrowserRouter as Router , Route , Switch} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import User from './components/User';
import Error from './components/Error';
class App extends Component{
  constructor(props){
    super(props);
    this.state={
      user:null,
      isLoggedIn:false,
      loading:true,
      newsChain:[],
      url:"https://22990a8e266148a38e780e0b2549f228.vfs.cloud9.us-east-1.amazonaws.com:8081",
    }
    this.LogIn=this.LogIn.bind(this);
    this.LogOut=this.LogOut.bind(this);
    this.Register=this.Register.bind(this);
    this.checkUsername=this.checkUsername.bind(this);
    this.Contribute=this.Contribute.bind(this);
  }
  async componentWillMount(){
  await axios.get(this.state.url+"/home",{withCredentials: true})
    .then(res => {this.setState({ isLoggedIn: res.data.isLoggedIn,user: res.data.user,newsChain:res.data.newsChain,loading:false })})
    .catch(err=>{console.log(err)});
    this.setState({loading:false});
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
  async Contribute(title,description){
     await axios.post(this.state.url+"/contribute",{title: title,description: description},{withCredentials: true})
     .then(res => {this.setState({ isLoggedIn: res.data.isLoggedIn,user: res.data.user,newsChain:res.data.newsChain})})
     .catch(err=>{console.log(err)});
  }
  
  render(){
    return(
      <Router><div>
      {!this.state.loading
      ?<Switch>
        <Route exact path="/" render={(props)=><Home {...props} 
        isLoggedIn={this.state.isLoggedIn} newsChain={this.state.newsChain} logOut={this.LogOut}
        username={!this.state.isLoggedIn
                  ?null
                  :this.state.user.username}
        />}></Route>
        <Route exact path="/login"
        render={!this.state.isLoggedIn
        ?(props)=><Login {...props} LogIn={this.LogIn}/>
        :(props)=><User {...props} LogOut={this.LogOut} username={this.state.user.username} Contribute={this.Contribute} articles={this.state.user.articles}/> 
        }
        ></Route>
        <Route exact path="/register"
        render={!this.state.isLoggedIn
        ?(props)=><Register {...props} Register={this.Register} checkUsername={this.checkUsername}/>
        :(props)=><User {...props} LogOut={this.LogOut} username={this.state.user.username} Contribute={this.Contribute} articles={this.state.user.articles}/> 
        }
        ></Route>
        <Route exact path="/user"
        render={!this.state.isLoggedIn
        ?(props)=><Login {...props} LogIn={this.LogIn}/>
        :(props)=><User {...props} LogOut={this.LogOut} username={this.state.user.username} Contribute={this.Contribute} articles={this.state.user.articles}/> 
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