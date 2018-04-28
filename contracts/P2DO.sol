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

    event NewPost(address indexed _author, string _content, uint256 _postNum);
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */

    string public version = "H0.1";       //human 0.1 standard. Just an arbitrary versioning scheme.

    function newPost(string _content) public {
        posts[postNum] = Post(msg.sender, _content);
        emit NewPost(msg.sender, _content, postNum++);
    }

    function getPostAuthor(uint256 _postIndex) public view returns (address _postAuthor){
        return posts[_postIndex].author;
    }

    function getPostContent(uint256 _postIndex) public view returns (string _postContent){
        return posts[_postIndex].content;
    }

    function getPostNum() public view returns (uint256 _postNum){
        return postNum;
    }
}
