import React, { Component } from 'react';
import Web3 from "web3";
import './App.css';
import P2DO from './p2do'
import P2NS from './p2ns'
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

const web3 = global.web3 && new Web3(global.web3.currentProvider);

class App extends Component {
  constructor() {
    super()
    let posts = []
    this.state = { posts: posts }
  }

  async componentDidMount() {
    if (!web3) {
      return;
    }
    this.p2do = new P2DO(web3);
    this.p2ns = new P2NS(web3);
    let postNum = await this.p2do.getPostNum();
    console.log("postNum: "+postNum)
    let posts = this.state.posts;
    for (let i = 0; i < postNum; i++) {
      let post = {author:"Loading...",title:"Loading...",content:"Loading..."}
      posts[i] = post;
      this.setState({posts: posts})
    }
    for (let i = 0; i < postNum; i++) {
      this.fetchPostContent(postNum, i)
      this.fetchPostAuthor(postNum, i)
    }
  }

  async fetchPostAuthor(postNum, i) {
    let posts = this.state.posts;
    let author = await this.p2do.getPostAuthor(postNum - 1 - i);
    posts[i].author = author;
    this.setState({posts: posts})

    author = await this.p2ns.nameOf(author);
    posts[i].author = author;
    this.setState({posts: posts})
  }

  async fetchPostContent(postNum, i){
    let posts = this.state.posts;
    let content = await this.p2do.getPostContent(postNum - 1 - i);
    console.log(content)
    try {
        let post = JSON.parse(content)
        posts[i].title = post.title;
        posts[i].content = post.content;
    } catch(err){
        posts[i].title = "Parse Error";
        posts[i].content = "Parse Error";
        console.log(err);
    }
    this.setState({posts: posts})
  }

  render() {
    var postCards = [];
    let posts = this.state.posts;
    for (var i = 0; i < posts.length; i++) {
        postCards.push(
          <div className="Row" key={i}>
            <Card className="Post">
              <CardHeader title={posts[i].title} subheader={"Author: "+posts[i].author}/>
              <CardContent className="Content">{posts[i].content}</CardContent>
            </Card>
          </div>
        );
    }
    return (
      <div className="container">
        <div className="Row" key={i}>
          <Card className="NewPost">
          <CardHeader title="Create A New Card"/>
          <TextField className="input" placeholder="title" fullWidth onChange={e => this.setState({title:e.target.value})}/>
          <TextField className="input" placeholder="content" multiline rows={2} rowsMax={4} onChange={e => this.setState({content:e.target.value})} />
          <Button onClick={async () => {
              try {
                  let {title,content} = this.state
                  await this.p2do.newPost(title, content)
              } catch(err) {
                  alert(err)
              }
          }}>POST</Button>
          </Card>
        </div>
        {postCards}
      </div>
    );
  }
}

export default App;
