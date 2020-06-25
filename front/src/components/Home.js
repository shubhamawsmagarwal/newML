import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
class Home extends Component{
  constructor(props){
      super(props);
      this.state={
        articles:props.newsChain,
        loading:false
      };
  }
  render(){
    if(this.state.loading)
      return(<div className="text-center">Loading....</div>);
    else
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
            <div className="container p-3 my-3 border bg-light">
              <form onSubmit={(event) => {
                event.preventDefault();
                const authorUsername = this.authorUsername.value;
                const category=this.category.value;
                this.setState({loading:true});
                var newArticles=[];
                for(let i=0;i<this.props.newsChain.length;i++){
                  const article=this.props.newsChain[i];
                  if(authorUsername==="" && category===""){
                    newArticles=this.props.newsChain;
                    break;
                  }
                  else if(authorUsername!=="" && category===""){
                    if(article.authorUsername===authorUsername)
                      newArticles.push(article);
                  }
                  else if(authorUsername==="" && category!==""){
                    if(article.category===category)
                      newArticles.push(article);
                  }
                  else{
                    if((article.category===category) &&(article.authorUsername===authorUsername))
                      newArticles.push(article);
                  }
                }
                this.setState({loading:false,articles:newArticles});
              }}>
                <div className="row">
                  <div className="col-md-4">
                    <select className="form-control" ref={(input) => { this.category = input }}>
                      <option value="">Choose Category</option>
                      <option value="arts & culture">arts & culture</option>
                      <option value="black voices">black voices</option>
                      <option value="business">business</option>
                      <option value="crime">crime</option>
                      <option value="divorce">divorce</option>
                      <option value="education">education</option>
                      <option value="entertainment">entertainment</option>
                      <option value="environment">environment</option>
                      <option value="fifty">fifty</option>
                      <option value="food & drink">food & drink</option>
                      <option value="good news">good news</option>
                      <option value="healthy living">healthy living</option>
                      <option value="home & living">home & living</option>
                      <option value="impact">impact</option>
                      <option value="latino voices">latino voices</option>
                      <option value="media">media</option>
                      <option value="money">money</option>
                      <option value="parenting">parenting</option>
                      <option value="politics">politics</option>
                      <option value="queer voices">queer voices</option>
                      <option value="religion">religion</option>
                      <option value="science & technology">science & technology</option>
                      <option value="sports">sports</option>
                      <option value="style & beauty">style & beauty</option>
                      <option value="travel">travel</option>
                      <option value="weddings">weddings</option>
                      <option value="weird news">weird news</option>
                      <option value="women">women</option>
                      <option value="world news">world news</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      ref={(input) => { this.authorUsername = input }}
                      className="form-control"
                      placeholder="Enter username of author"
                      />
                  </div>
                  <div className="col-md-4"><button type="submit" className="btn btn-lg btn-warning">Apply Filter</button></div>
                </div>
              </form>
            </div>
          </div>
          <div className="container content">
          {this.state.articles.map((article,key)=>(
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


