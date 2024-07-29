const conn = require("../connection");

conn.connect((err) => {
  if (err) throw err;
  else {
    const sql = ` CREATE TABLE  IF NOT EXISTS users(
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  bio TEXT DEFAULT NULL,
                  gender ENUM("MALE","FEMALE","OTHERS") NOT NULL,
                  email VARCHAR(255) UNIQUE NOT NULL,
                  password VARCHAR(255) NOT NULL,
                  profilePicture VARCHAR(255) DEFAULT NULL,
                  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
                  CURRENT_TIMESTAMP
                  );`;
        conn.query(sql,(err,result)=>{
            if(err)
                throw err
            else
                console.log("users table created")
        })

        const followsql = ` CREATE TABLE IF NOT EXISTS follows (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            followerId INT NOT NULL,
                            followingId INT NOT NULL,
                            active BOOLEAN DEFAULT 1,
                            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (followerId) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (followingId) REFERENCES users(id) ON DELETE CASCADE
                            );`;
conn.query(followsql,(err,result)=>{
    if(err)
        throw err
    else
        console.log("follower table created")
})

  }
});
