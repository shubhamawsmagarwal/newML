import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
class User extends Component{
  render(){
    return(<div>
        <button className="btn btn-lg btn-success basicButtons" onClick={(event)=>{
          event.preventDefault();
          this.props.LogOut();
        }}>Logout</button>
        <button className="btn btn-lg text-info basicButtons ">{this.props.username}</button>
        <Link to="/" className="btn btn-lg btn-warning basicButtons">Home</Link>
        <form onSubmit={(event) => {
            event.preventDefault();
            const title = this.title.value;
            const description=this.description.value;
            this.props.Contribute(title,description,this.props.name,this.props.username);
          }}
            className="text-center border border-light p-3"
            style={{width:'30%'}}
          >
              <input
                type="text"
                ref={(input) => { this.title = input }}
                className="form-control mb-3"
                placeholder="Title"
                required />
              <textarea
                ref={(input) => { this.description = input }}
                className="form-control mb-4"
                placeholder="Description"
                required>
              </textarea>
              <button type="submit" className="btn btn-info my-4 btn-block">Contribute</button>
          </form>
          <div className="container content">
          {this.props.articles.length <= 0
          ?<p>no articles yet</p>
          :this.props.articles.map((article,key)=>(
          <div className="container p-3 my-3 border bg-light" key={key}>
             <div className="text-center  text-primary font-weight-bold">{article.title}</div>
             <div className="text-center p-3">{article.description}</div>
             <div className="text-center"><button className="btn btn-secondary">{article.category}</button></div>
          </div>
          ))}
          </div>
    </div>);
  }
}
export default User;
