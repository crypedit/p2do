pragma solidity ^0.4.17;

contract P2DO {
    function () public payable {
        revert();
    }

    /* Public variables of the token */

    mapping (uint256 => Post) posts;
    uint256 postNum;

    struct Post {
        address author;
        string content;
    }
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */

    string public version = 'H0.1';       //human 0.1 standard. Just an arbitrary versioning scheme.

    function NewPost(string _content) public returns (uint256 _postNum){
        posts[postNum] = Post(msg.sender, _content);
        postNum++;
        return _postNum;
    }

    function GetPostAuthor(uint256 _postIndex) public view returns (address _postAuthor){
        return posts[_postIndex].author;
    }

    function GetPostContent(uint256 _postIndex) public view returns (string _postContent){
        return posts[_postIndex].content;
    }

    function GetPostNum() public view returns (uint256 _postNum){
        return postNum;
    }
}
