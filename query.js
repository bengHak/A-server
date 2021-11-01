exports.SELECT_USER = `SELECT * FROM users WHERE id = ?`;

exports.SELECT_USER_BY_USERNAME = `SELECT * FROM users WHERE username = ?`;

exports.SELECT_USER_BY_EMAIL = `SELECT * FROM users WHERE email = ?`;

exports.SELECT_USER_BY_BLOG_TITLE = `SELECT * FROM users WHERE blog_title = ?`;

exports.INSERT_USER = `INSERT INTO users (email, password, username, blog_title, profile_image_path, blog_image_path, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

exports.UPDATE_USER_USERNAME = `UPDATE users SET username = ? WHERE id = ?`;

exports.UPDATE_USER_BLOG_TITLE = `UPDATE users SET blog_title = ? WHERE id = ?`;

exports.SELECT_POSTS_ORDERBY_CREATED_AT_PAGINATION = `SELECT * FROM posts ORDER BY created_at DESC LIMIT ?, ?`;
