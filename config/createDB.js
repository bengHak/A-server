var CREATE_USER_TABLE = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    password TEXT, 
    nickname TEXT, 
    blog_title TEXT,
    created_at DATETIME, 
    updated_at DATETIME)`;

var CREATE_POST_TABLE = `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id INTEGER, 
    title TEXT, 
    content TEXT, 
    created_at DATETIME, 
    updated_at DATETIME, 
    FOREIGN KEY(user_id) REFERENCES users(id))`;

var CREATE_COMMENT_TABLE = `CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    post_id INTEGER, 
    user_id INTEGER, 
    content TEXT, 
    created_at DATETIME, 
    updated_at DATETIME, 
    FOREIGN KEY(post_id) REFERENCES posts(id), 
    FOREIGN KEY(user_id) REFERENCES users(id))`;

var CREATE_LIKE_TABLE = `CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    post_id INTEGER, 
    user_id INTEGER, 
    created_at DATETIME, 
    updated_at DATETIME, 
    FOREIGN KEY(post_id) REFERENCES posts(id), 
    FOREIGN KEY(user_id) REFERENCES users(id))`;

var CREATE_IMAGE_TABLE = `CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    post_id INTEGER)`;
