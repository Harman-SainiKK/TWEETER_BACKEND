const conn = require("../connection");

async function handleCreateTweet(req, res) {
  const tweetData = req.body;
  const checkUser = "select id from users where id = ?";
  conn.query(checkUser, tweetData.userId, (err, result) => {
    if (err) return res.json(err);

    if (result == "") return res.json("you have no one account!");

    const sql = "insert into tweets(userId,content,isDeleted) values(?)";
    const values = [tweetData.userId, tweetData.content, tweetData.isDeleted];
    conn.query(sql, [values], (err, result) => {
      if (err) return res.json(err);
      else return res.json({ insertedTweet: tweetData });
    });
  });
}

async function handleGetUserTweet(req, res) {
  const userId = Number(req.params.userId);
  const checkUser = "select id from users where id = ?";
  conn.query(checkUser, userId, (err, userResult) => {
    if (err) return res.json(err);
    // console.log(userResult)
    if (userResult == "") return res.json("user not create any tweets");
    const sql = "select * from tweets where userId = ?";
    const userId = Number(req.params.userId);
    conn.query(sql, userId, (err, result) => {
      if (err) return res.json(err);

      if (result == "") return res.json("you UserId not have any tweets");

      return res.json(result);
    });
  });
}

async function handleEditTweet(req, res) {
  const tweetId = Number(req.params.tweetId);
  const checkTweet = "select * from tweets where id=?";
  conn.query(checkTweet,tweetId,(err,result)=>{
    if(err) return res.json(err)
      if(result=="") return res.json("tweet not exists")
        const length = result.length
      if(result[length-1].isDeleted==0)
        return res.json("you not edit the content of deleted post!")

      const tweetData = req.body;
      const tweetId = Number(req.params.tweetId);
      const sql = "update tweets set content=? where id = ?"
      const values = [tweetData.content,tweetId]      
      
      conn.query(sql,values,(err,result)=>{
        if(err) return res.json(err)
          return res.json("Successfully edited content!")
      })

      // return res.json("yes")
  })
  
  // return res.json(tweetId)
}

async function handleDeleteTweet(req,res){
  const tweetId = Number(req.params.tweetId);
  const tweetData = req.body;

  const checkTweet = "select * from tweets where id=?";
 
  conn.query(checkTweet,tweetId,(err,result)=>{
    if(err) return req.json(err)
      console.log(result)
      if(result=="") return res.json("tweet not exists")
        const length = result.length
        if(result[length-1].isDeleted==0)
          return res.json("you cannot delete same tweets multiple time.")

        const sql = "update tweets set isDeleted =false where id=?"
        const tweetId = Number(req.params.tweetId);
        conn.query(sql,tweetId,(err,result)=>{
          if(err) return res.json(err)
            return res.json("deleted tweet")
        })
      
  })
}

async function handleLikeTweet(req, res) {
  const tweetData = req.body;
  const tweetId = Number(req.params.tweetId);
  const checkUser = "select id from users where id = ?";
  conn.query(checkUser, tweetData.userId, (err, Userresult) => {
    if (err) return res.json(err);

    if (Userresult == "") return res.json("you have no one account!");

    const checkTweet = "select id,userId from tweets where id = ?";
    const tweetId = Number(req.params.tweetId);
    conn.query(checkTweet, tweetId, (err, Tweetresult) => {
      if (err) return res.json(err);

      if (Tweetresult == "") return res.json("you have no one tweet!");
      const checkLikeData = req.body;
      const tweetId = Number(req.params.tweetId);
      const checkLike = "select * from likes where userId =? and tweetId=?";
      const checkLikeVal = [checkLikeData.userId, tweetId];
      //   console.log(checkLikeData.userId,checkLikeData.tweetId)
      conn.query(checkLike, checkLikeVal, (err, finalResult) => {
        if (err) return res.json(err);
        const length = finalResult.length;
        // console.log(finalResult);
        if (finalResult == "") {
          const tweetData = req.body;
          const tweetId = Number(req.params.tweetId);
          const sql = "insert into likes(userId,tweetId,isDeleted) values(?)";
          const values = [
            tweetData.userId,
            tweetId,
            tweetData.isDeleted,
          ];
          conn.query(sql, [values], (err, result) => {
            if (err) return res.json(err);
            else return res.json({ Liked: tweetData });
          });
          return;
        }
        // return res.json("you cannot like single post at multiple times f.");

        if (finalResult[length - 1].isDeleted == 1)
          return res.json("you cannot like single post at multiple times.");

        if (finalResult[length - 1].isDeleted == 0) {
          const tweetData = req.body;
          const tweetId = Number(req.params.tweetId);
          const sql = "insert into likes(userId,tweetId,isDeleted) values(?)";
          const values = [
            tweetData.userId,
            tweetId,
            tweetData.isDeleted,
          ];
          conn.query(sql, [values], (err, result) => {
            if (err) return res.json(err);
            else return res.json({ Liked: tweetData });
          });
        }
      });
    });
  });
}

async function handleUnLikeTweet(req, res) {
  const tweetData = req.body;
  const tweetId = Number(req.params.tweetId);
  const checkUser = "select id from users where id = ?";
  conn.query(checkUser, tweetId, (err, Userresult) => {
    if (err) return res.json(err);

    if (Userresult == "") return res.json("you have no one account!");

    const checkTweet = "select id,userId from tweets where id = ?";
    const tweetId = Number(req.params.tweetId);
    conn.query(checkTweet, tweetId, (err, Tweetresult) => {
      if (err) return res.json(err);

      if (Tweetresult == "") return res.json("you have no one tweet!");
      const checkLikeData = req.body;
      const tweetId = Number(req.params.tweetId);
      const checkLike = "select * from likes where userId =? and tweetId=?";
      const checkLikeVal = [checkLikeData.userId, tweetId];
      conn.query(checkLike, checkLikeVal, (err, finalResult) => {
        if (err) return res.json(err);
        console.log(finalResult);
        if (finalResult == "" || finalResult[0].tweetId != tweetId)
          return res.json(
            "user not unliked the post because it is not like the post!"
          );
        if (finalResult[finalResult.length - 1].isDeleted == 0)
          return res.json("you cannot Unlike single post at multiple times.");

        const Data = req.body;
        const sql =
          "update likes set isDeleted=false where userId=? and tweetId=?";
        const values = [Data.userId, tweetId];
        conn.query(sql, values, (err, result) => {
          if (err) return res.json(err);
          else return res.json({ Unliked: Data });
        });
      });
    });
  });
}

async function handleCommentTweet(req, res) {
  const tweetId = Number(req.params.tweetId);
  const tweetData = req.body;

  const checkUser = "select id from users where id = ?";
  conn.query(checkUser, tweetData.userId, (err, Userresult) => {
    if (err) return res.json(err);

    if (Userresult == "") return res.json("you have no one account!");

    const checkTweet = "select id,userId from tweets where id = ?";
    conn.query(checkTweet, tweetId, (err, Tweetresult) => {
      if (err) return res.json(err);

      if (Tweetresult == "") return res.json("you have no one tweet!");
      const checkCommentData = req.body;
      const checkComment =
        "select * from comments where userId =? and tweetId=?";
      const checkCommentVal = [checkCommentData.userId, tweetId];
      console.log(checkCommentVal);
      conn.query(checkComment, checkCommentVal, (err, finalResult) => {
        if (err) return res.json(err);
        const length = finalResult.length;
        console.log(finalResult);
        if (finalResult == "") {
          const tweetData = req.body;
          const sql =
            "insert into comments(userId,tweetId,content,isDeleted) values(?)";
          const values = [
            tweetData.userId,
            tweetId,
            tweetData.content,
            tweetData.isDeleted,
          ];

          conn.query(sql, [values], (err, result) => {
            if (err) return res.json(err);
            else return res.json({ Comments_n: tweetData });
          });
          return;
        }
        // return res.json("you cannot like single post at multiple times f.");

        if (finalResult[length - 1].isDeleted == 1)
          return res.json(
            "you cannot comment on single post at multiple times."
          );

        if (finalResult[length - 1].isDeleted == 0) {
          const tweetData = req.body;
          const sql =
            "insert into comments(userId,tweetId,content,isDeleted) values(?)";
          const values = [
            tweetData.userId,
            tweetId,
            tweetData.content,
            tweetData.isDeleted,
          ];
          conn.query(sql, [values], (err, result) => {
            if (err) return res.json(err);
            else return res.json({ Comments_n: tweetData });
          });
          return;
        }
      });
    });
  });
  // return res.json({tweetId,tweetData})
}

async function handleDeleteCommentTweet(req, res) {
  const tweetId = Number(req.params.tweetId);
  const tweetData = req.body;
  const checkUser = "select id from users where id = ?";
  conn.query(checkUser, tweetData.userId, (err, Userresult) => {
    if (err) return res.json(err);

    if (Userresult == "") return res.json("you have no one account!");

    const checkTweet = "select id,userId from tweets where id = ?";
    conn.query(checkTweet, tweetId, (err, Tweetresult) => {
      if (err) return res.json(err);

      if (Tweetresult == "") return res.json("you have no one tweet!");
      const checkCommentData = req.body;
      const tweetId = Number(req.params.tweetId);
      const checkComment =
        "select * from comments where userId =? and tweetId=?";
      const checkCommentVal = [checkCommentData.userId, tweetId];
      // console.log(checkCommentVal);
      conn.query(checkComment, checkCommentVal, (err, finalResult) => {
        if (err) return res.json(err);
        const length = finalResult.length;
        console.log(finalResult);
        if (finalResult == "" || finalResult[0].tweetId != tweetId)
          return res.json(
            "user not delete comment the post because it is not comment the post!"
          );
        if (finalResult[finalResult.length - 1].isDeleted == 0)
          return res.json(
            "you cannot delete comment single post at multiple times."
          );

        const Data = req.body;

        const sql =
          "update comments set isDeleted=false where userId=? and tweetId=?";
        const values = [Data.userId, tweetId];
        conn.query(sql, values, (err, result) => {
          if (err) return res.json(err);
          else return res.json({ deletedComment: Data });
        });
      });
    });
  });
  // return res.json({tweetId,tweetData})
}

module.exports = {
  handleCreateTweet,
  handleGetUserTweet,
  handleEditTweet,
  handleDeleteTweet,
  handleLikeTweet,
  handleUnLikeTweet,
  handleCommentTweet,
  handleDeleteCommentTweet,
};
