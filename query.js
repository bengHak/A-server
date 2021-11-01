// USER
exports.SELECT_USER = `SELECT * FROM users WHERE id = ?`;
exports.SELECT_USER_WITHOUT_PASSWORD = `SELECT id, username, email, blog_title, profile_image_path, blog_image_path FROM users WHERE id = ?`;
exports.SELECT_USER_BY_USERNAME = `SELECT * FROM users WHERE username = ?`;
exports.SELECT_USER_BY_EMAIL = `SELECT * FROM users WHERE email = ?`;
exports.SELECT_USER_BY_BLOG_TITLE = `SELECT * FROM users WHERE blog_title = ?`;
exports.INSERT_USER = `INSERT INTO users (email, password, username, blog_title, profile_image_path, blog_image_path, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
exports.UPDATE_USER_USERNAME = `UPDATE users SET username = ? WHERE id = ?`;
exports.UPDATE_USER_BLOG_TITLE = `UPDATE users SET blog_title = ? WHERE id = ?`;
exports.UPDATE_USER_USERNAME_BLOG_TITLE = `UPDATE users SET username = ?, blog_title = ? WHERE id = ?`;
exports.UPDATE_USER_PROFILE_IMAGE_PATH = `UPDATE users SET profile_image_path = ? WHERE id = ?`;
exports.UPDATE_USER_BLOG_IMAGE_PATH = `UPDATE users SET blog_image_path = ? WHERE id = ?`;

// POST
exports.SELECT_POSTS_ORDERBY_CREATED_AT_PAGINATION = `SELECT * FROM posts ORDER BY created_at DESC LIMIT ?, ?`;
exports.SELECT_MY_POSTS_ORDERBY_CREATED_AT_PAGINATION = `SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT ?, ?`;
exports.SELECT_POST = `SELECT * FROM posts WHERE id = ?`;
exports.INSERT_POST = `INSERT INTO posts (title, content, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;
exports.DELETE_POST = `DELETE FROM posts WHERE id = ?`;
exports.UPDATE_POST = `UPDATE posts SET title = ?, content = ?, updated_at = ? WHERE id = ?`;

exports.LIKE_POST = `INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, ?, ?)`;
exports.UNLIKE_POST = `DELETE FROM likes WHERE user_id = ? AND post_id = ?`;

exports.INSERT_COMMENT = `INSERT INTO comments (user_id, post_id, content, created_at) VALUES (?, ?, ?, ?)`;
exports.UPDATE_COMMENT = `UPDATE comments SET content = ?, updated_at = ? WHERE id = ?`;
exports.SELECT_COMMENT = `SELECT * FROM comments WHERE id = ?`;
exports.DELETE_COMMENT = `DELETE FROM comments WHERE id = ?`;

exports.admin = {
    recent_7day_posts: `SELECT * FROM posts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY created_at DESC`,
    recent_comments_20: `SELECT * FROM comments ORDER BY created_at DESC LIMIT 0, 20`,
    recent_posts_20: `SELECT * FROM posts ORDER BY created_at DESC LIMIT 20`,
    post_liked_by_user: `SELECT * FROM posts WHERE id IN (SELECT post_id FROM likes WHERE user_id = ?) ORDER BY created_at DESC LIMIT 20`,
};
