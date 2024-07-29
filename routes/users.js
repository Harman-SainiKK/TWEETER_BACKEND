const { checkUserLoggedInOrNot } = require("../middleware/auth");
const {
  handleCreateUser,
  handleLoginUser,
  handleGetProfileInfo,
  handleUpdateProfileInfo,
  handleFollowTheUsers,
  handleDeleteFollow,
  handleFetchAllFollowers,
  handleFetchAllFollowing,
  handleUpdateProfilePicture,
} = require("../controllers/users");

const express = require("express");
const UserRouter = express.Router();

UserRouter.patch("/:userid/profilepicture",checkUserLoggedInOrNot, handleUpdateProfilePicture);
UserRouter.post("/", handleCreateUser);
UserRouter.post("/login", handleLoginUser);
UserRouter.get("/profile", checkUserLoggedInOrNot, handleGetProfileInfo);
UserRouter.patch("/:id",checkUserLoggedInOrNot, handleUpdateProfileInfo);
UserRouter.put("/:userid/follow",checkUserLoggedInOrNot, handleFollowTheUsers);
UserRouter.delete("/:userid/follow",checkUserLoggedInOrNot, handleDeleteFollow);
UserRouter.get("/:userid/followers",checkUserLoggedInOrNot, handleFetchAllFollowers);
UserRouter.get("/:userid/followees",checkUserLoggedInOrNot, handleFetchAllFollowing);


module.exports = { UserRouter };
