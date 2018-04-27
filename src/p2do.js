import contract from "truffle-contract";
import P2DOJSON from "./contracts/P2DO.json";

class P2DO {
  constructor(web3) {
    this.web3 = web3
    this.contract = contract(P2DOJSON);
    this.contract.setProvider(web3.currentProvider);
  }

  async myAddress() {
    return (await this.web3.eth.getAccounts())[0]
  }

  async p2doContract() {
    let currentNetwork = this.web3.currentProvider.publicConfigStore._state.networkVersion
    let exist
    if(currentNetwork === "1") { // mainnet
      exist = await this.contract.at('0x0')
    } else if (currentNetwork === "3") {  // ropsten
      exist = await this.contract.at('0x0')
    } else if (currentNetwork === "4") { // rinkeby
      exist = await this.contract.at('0xe9880eedd4d44ec0b25f3a362af5b8dfd2754c62')
    } else {
      exist = await this.contract.deployed()
    }
    return exist
  }

  newPost = async (title, content) => {
    let exist = await this.p2doContract()
    let owner = await this.myAddress()
    return await exist.NewPost(JSON.stringify({title: title, content: content}), {from: owner})
  }

  getPost = async (i) => {
    let exist = await this.p2doContract()
    let owner = await this.myAddress()
    let content = await exist.GetPostContent(i,{from: owner})
    let author = await exist.GetPostAuthor(i,{from: owner})
    console.log(content)
    var post = null
    try {
      post = JSON.parse(content)
      post.author = author
      return post
    } catch(err){
    }
    return post
  }

  getPostNum = async () => {
    let exist = await this.p2doContract()
    let owner = await this.myAddress()
    let num = await exist.GetPostNum({from: owner})
    return num
  }
}

export default P2DO
