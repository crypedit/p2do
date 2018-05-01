import React, { Component } from 'react';
import Web3 from "web3";
import './App.css';
import P2B from './p2b'
import P2DO from './p2do'
import P2NS from './p2ns'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Fade from 'material-ui/transitions/Fade';

const web3 = global.web3 && new Web3(global.web3.currentProvider);

class App extends Component {
  constructor() {
    super()
    let posts = []
    this.state = { posts: posts , thumbingUp: false}
  }

  async componentDidMount() {
    if (!web3) {
      return;
    }
    this.p2b = new P2B(web3);
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
    posts[i].authorRaw = author;
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
    let posts = this.state.posts;
    let that = this;
    let postCards =
      posts.map(function(post, i) {
          return (
          <div className="Post" key={i}>
            <Card className="PostCard">
              <CardHeader title={post.title} subheader={"作者: "+post.author}/>
              <CardContent className="Content">{post.content}</CardContent>
              <CardActions className="PostCardActions">
                <Button onClick={() => {
                    posts[i].thumbingUp = true;
                    that.setState(posts: posts);
                }}>打赏 P2B</Button>
              </CardActions>
            </Card>

            <Fade in={post.thumbingUp}>
            <Card className="ThumbUp">
              <CardHeader title="打赏 P2B" subheader={"作者: "+post.author}/>
              <div>
              <TextField className="input" style={{width:'2em'}} data-index={i} onChange={e => {
                  posts[i].value = e.target.value;
                  that.setState({posts: posts});
              }}/>
                  P2B
              </div>
              <CardActions className="ThumbUpActions">
                <Button data-index={i} onClick={async (e) => {
                  if (post.authorRaw && post.value > 0){
                    try {
                        await that.p2b.to(post.authorRaw, post.value);
                        alert("你已经成功打赏了 " + post.value + " 个 P2B 给 " + post.authorRaw);
                    } catch(err) {
                        alert(err);
                    }
                  } else {
                    alert("非法输入");
                  }
                }}>确认</Button>
              </CardActions>
            </Card>
            </Fade>
          </div>
          )
      });
    return (
      <div className="container">
        <div className="Row">
          <Card className="NewPost">
          <CardHeader title="新的卡片"/>
          <TextField className="input" placeholder="标题" fullWidth onChange={e => this.setState({title:e.target.value})}/>
          <TextField className="input" placeholder="内容" multiline rows={2} rowsMax={40} onChange={e => this.setState({content:e.target.value})} />
          <Button onClick={async () => {
              try {
                  let {title,content} = this.state
                  await this.p2do.newPost(title, content)
              } catch(err) {
                  alert(err)
              }
          }}>发布</Button>
          </Card>
        </div>
        {postCards}

      </div>
    );
  }
}
export default App;
