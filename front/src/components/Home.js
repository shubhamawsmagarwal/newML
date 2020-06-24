import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
class Home extends Component{
  render(){
    return(
        <div>
          {!this.props.isLoggedIn
            ?<span>
              <Link to="/login" className="btn btn-info btn-lg basicButtons">Login</Link>
              <Link to="/register" className="btn btn-info btn-lg basicButtons">Register</Link>
            </span>
            :<span>
              <Link to="/user" className="btn btn-lg text-info basicButtons">{this.props.username}</Link>
              <button className="btn btn-lg btn-success basicButtons" onClick={(event)=>{
                event.preventDefault();
                this.props.LogOut();
              }}>Logout</button>
            </span>
          }
          <div className="container content">
          {this.props.newsChain.map((article,key)=>(
            <div className="container p-3 my-3 border bg-light" key={key}>
               <div className="text-center  text-primary font-weight-bold">{article.title}</div>
               <div className="text-center p-3">{article.description}</div>
               <div className="text-center"><button className="btn btn-secondary">{article.category}</button></div>
               <div className="text-right text-success">Authors:-{"  "+article.author+"  "} By:-{"  "+article.authorUsername+"  "}</div>
            </div>
            ))}
          </div>
        </div>
    );
  }
}
export default Home;


