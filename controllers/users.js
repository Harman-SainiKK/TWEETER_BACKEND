const conn = require("../connection");
const { setuser } = require("../services/auth");

function patternForMatchingDetails(userData) {
  let vaild = 0;
  const genderPattern = /^(male|female|others)$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (genderPattern.test(userData.gender)) vaild++;

  if (emailPattern.test(userData.email)) vaild++;

  return vaild;
}

async function handleCreateUser(req, res) {
  const userData = req.body;
  // console.log(userData)
  const output = patternForMatchingDetails(userData);
  if(output!=2)
    return res.json("some is wrong in email or gender")

  const sql =
    "insert into users(name,bio,gender,email,password,profilePicture) values(?)";
  const values = [
    userData.name,
    userData.bio,
    userData.gender,
    userData.email,
    userData.password,
    userData.profilePicture,
  ];
  conn.query(sql, [values], (err, result) => {
    if (err) return res.json("Duplicate entry not vaild");
    else return res.json({ insertedUser: userData });
  });
}

async function handleLoginUser(req, res) {
  const userData = req.body;
  const sql = "select email,password from users where email=? and password=?";
  const values = [userData.email, userData.password];
  conn.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    else {
      if (!result[0]) return res.json("given credientails not found!");
      const token = setuser(result[0].email);
      res.cookie("uid", token);
      return res.json({ userLoggedIn: result[0] });
    }
  });
}

async function handleGetProfileInfo(req, res) {
  const sql = "select * from users";
  conn.query(sql, (err, result) => {
    if (err) return res.json(err);
    else return res.json(result);
  });
}

async function handleUpdateProfileInfo(req, res) {
  const id = Number(req.params.id);
  const sql = "select * from users where id = ?";
  conn.query(sql, id, (err, result) => {
    if (err) return res.json(err);
    else {
      if (result == "") {
        return res.json("User not found!");
      }
      const userData = req.body;
      const updateSql = "update users set name=?,bio=?,password=? where id = ?";
      const values = [userData.name, userData.bio, userData.password, id];
      conn.query(updateSql, values, (err, result) => {
        if (err) return res.json(err);
        else return res.json({ updated: userData });
      });
      // return res.json(result)
    }
  });
}

async function handleFollowTheUsers(req, res) {
  const userid = Number(req.params.userid);
  const followUser = req.body;
  if (userid == followUser.followerId)
    return res.json("you cannot follow itself.");
  if (userid == 0 || followUser.followerId == 0)
    return res.json("0 id user not exists.");

  const userExistsOrNot =
    "select * from follows where followerId=? and followingId=?";
  const userValues = [followUser.followerId, userid];
  conn.query(userExistsOrNot, userValues, (err, result) => {
    if (err) return res.json(err);
    else {
      console.log(result);
      const length = result.length;
      if (result != "" && result[length - 1].active != 0)
        return res.json("You are not follow same id at multiple time");

      console.log(length);
      if (result == "" || result[length - 1].active == 0) {
        const sql =
          "insert into follows(followerId,followingId,active) values(?)";
        const values = [followUser.followerId, userid, followUser.active];
        conn.query(sql, [values], (err, result) => {
          if (err)
            return res.json({
              usernotExists: "user not exist which you want to follow",
            });
          else return res.json("successfully follow");
        });
        return;
      }

      const sql =
        "insert into follows(followerId,followingId,active) values(?)";
      const values = [followUser.followerId, userid, followUser.active];
      conn.query(sql, [values], (err, result) => {
        if (err)
          return res.json({
            usernotExists: "user not exist which you want to follow",
          });
        else return res.json("successfully follow");
      });
    }
  });
}

async function handleDeleteFollow(req, res) {
  const userid = Number(req.params.userid);
  const followUser = req.body;

  const checkActive =
    "select * from follows where followerId =? and followingId = ?";
  const checkValue = [followUser.followerId, userid];
  conn.query(checkActive, checkValue, (err, result) => {
    if (err) return res.json(err);
    console.log(result);
    if (result == "")
      return res.json("user not exists which you want to unfollow");
    const length = result.length;
    if (result[length - 1].active == 0)
      return res.json("you cannot unfollow the same id multiple time.");

    if (result[length - 1].active == 1) {
      const userid = Number(req.params.userid);
      const followUser = req.body;
      const sql =
        "update follows set active=false where followerId =? and followingId = ?";
      const values = [followUser.followerId, userid];
      conn.query(sql, values, (err, result) => {
        if (err) return res.json(err);
        res.json("success-fully deleted");
      });
      return;
    }
  });
}

async function handleFetchAllFollowers(req, res) {
  const userid = Number(req.params.userid);
  const checkUser = "select id from users where id =?";
  conn.query(checkUser, userid, (err, result) => {
    if (err) return res.json(err);
    else {
      if (result == "") return res.json("user not exists");

      const fetch =
        "select count(followingId) as followers from follows where followingId =? and active=1";
      conn.query(fetch, userid, (err, result) => {
        if (err) return res.json(err);
        else return res.json(result);
      });
    }
  });
}

async function handleFetchAllFollowing(req, res) {
  const userid = Number(req.params.userid);
  const checkUser = "select id from users where id =?";
  conn.query(checkUser, userid, (err, result) => {
    if (err) return res.json(err);
    else {
      if (result == "") return res.json("user not exists");

      const fetch =
        "select count(followerId) as following from follows where followerId =? and active=1";
      conn.query(fetch, userid, (err, result) => {
        if (err) return res.json(err);
        else return res.json(result);
      });
    }
  });
}

async function handleUpdateProfilePicture(req, res) {
  const userid = Number(req.params.userid);
  const picture = req.body;
  const checkUser = "select id from users where id =?";
  conn.query(checkUser, userid, (err, result) => {
    if (err) return res.json(err);
    else {
      if (result == "") return res.json("user not exists");

      const fetch = "update users set profilePicture=? where id = ?";
      const val = [picture.profilePicture, userid];
      conn.query(fetch, val, (err, result) => {
        if (err) return res.json(err);
        else return res.json({ affectedRows: result.affectedRows });
      });
    }
  });

  // return res.json("yes");
}

module.exports = {
  handleCreateUser,
  handleLoginUser,
  handleGetProfileInfo,
  handleUpdateProfileInfo,
  handleFollowTheUsers,
  handleDeleteFollow,
  handleFetchAllFollowing,
  handleFetchAllFollowers,
  handleUpdateProfilePicture,
};
