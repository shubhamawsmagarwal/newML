function NewsChain(){
    this.chain=[];
}
NewsChain.prototype.createNewArticle=function(author,authorUsername,title,description,category){
    const newArticle={
        author:author,
        authorUsername:authorUsername,
        title:title,
        description:description,
        category:category
    };
    this.chain.unshift(newArticle);
}
module.exports=NewsChain;