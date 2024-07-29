const conn = require("../connection");

conn.connect((err) => {
  if (err) throw err;
  else {
    const sql = `CREATE TABLE if not exists comments (
 id INT AUTO_INCREMENT PRIMARY KEY,
 userId INT NOT NULL,
 tweetId INT NOT NULL,
 content TEXT NOT NULL,
 isDeleted BOOLEAN DEFAULT 0,
 createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (tweetId) REFERENCES tweets(id) ON DELETE CASCADE
 );`;
    conn.query(sql, (err, result) => {
      if (err) throw err;
      else console.log("comments table created");
    });
  }
});
