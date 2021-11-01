const createUserTable = `CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  blog_title VARCHAR(255) NOT NULL,
  create_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id)
)`;

const createPostTable = `CREATE TABLE IF NOT EXISTS posts (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  create_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

const createCommentTable = `CREATE TABLE IF NOT EXISTS comments (
  id INT NOT NULL AUTO_INCREMENT,
  content TEXT NOT NULL,
  create_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  create_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

const createLikeTable = `CREATE TABLE IF NOT EXISTS likes (
  id INT NOT NULL AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  create_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

const createImagePathTable = `CREATE TABLE IF NOT EXISTS image_paths (
  id INT NOT NULL AUTO_INCREMENT,
  path VARCHAR(255) NOT NULL,
  post_id INT NOT NULL,
  image_order INT NOT NULL,
  create_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
)`;

const queries = [
    createUserTable,
    createPostTable,
    createCommentTable,
    createLikeTable,
    createImagePathTable,
];

const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "sdc",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection(async (err, conn) => {
    await queries.forEach((query) => {
        try {
            conn.query(query, (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("success ");
                }
            });
        } catch (err) {
            conn.rollback();
            console.log(err);
        } finally {
            console.log("connection released");
            conn.release();
        }
    });

    pool.end();
});
