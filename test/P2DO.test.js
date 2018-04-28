var P2DO = artifacts.require("./P2DO.sol");

contract('P2 Content Publish', (accounts) => {

    describe("New a post", () => {
        let p2DO
        beforeEach(async () => {
            p2DO = await P2DO.deployed()
        })

        it("should be able to new a post", async () => {
            await p2DO.newPost("Hello, Blockchain!")

            let postNum = await p2DO.getPostNum()

            assert.equal(postNum, 1, "can't new a post")
        })
    })
})