const express = require("express");
const tweetsRouter = express.Router();
const { checkUserLoggedInOrNot } = require("../middleware/auth")

const {handleCreateTweet,handleGetUserTweet,handleEditTweet,handleDeleteTweet,handleLikeTweet,handleUnLikeTweet,handleCommentTweet,handleDeleteCommentTweet} = require("../controllers/tweets")

tweetsRouter.post("/",checkUserLoggedInOrNot,handleCreateTweet)
tweetsRouter.get("/:userId",checkUserLoggedInOrNot,handleGetUserTweet)
tweetsRouter.patch("/:tweetId",checkUserLoggedInOrNot,handleEditTweet)
tweetsRouter.delete("/:tweetId",checkUserLoggedInOrNot,handleDeleteTweet)
tweetsRouter.put("/:tweetId/like",checkUserLoggedInOrNot,handleLikeTweet)
tweetsRouter.delete("/:tweetId/like",checkUserLoggedInOrNot,handleUnLikeTweet)
tweetsRouter.put("/:tweetId/comment",checkUserLoggedInOrNot,handleCommentTweet)
tweetsRouter.delete("/:tweetId/comment",checkUserLoggedInOrNot,handleDeleteCommentTweet)

module.exports = {
    tweetsRouter
}