const conn = require("../connection");

conn.connect((err) => {
  if (err) throw err;
  else {
    const sql = `  CREATE TABLE if not exists tweets (
 id INT AUTO_INCREMENT PRIMARY KEY,
 userId INT NOT NULL,
 content VARCHAR(280) NOT NULL,
 isDeleted BOOLEAN DEFAULT 0,
 createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
 CURRENT_TIMESTAMP,
 FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
 );`;
    conn.query(sql, (err, result) => {
      if (err) throw err;
      else console.log("tweets table created");
    });
  }
});
