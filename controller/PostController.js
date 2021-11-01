const query = require("../query");
const { getNow } = require("../lib");

// 전체 글 불러오기 (최신순, pagination)
exports.getAllPosts = async (req, res) => {
    const conn = await res.pool.getConnection();
    const limit = 20;
    const { page } = req.params;
    const offset = (page - 1) * limit;
    try {
        const [rows] = await conn.query(
            query.SELECT_POSTS_ORDERBY_CREATED_AT_PAGINATION,
            [limit, offset]
        );

        if (rows.length === 0) {
            res.status(404).json({
                message: "글이 없습니다.",
            });
        } else {
            res.status(200).json({
                message: "전체 글 불러오기 성공",
                posts: rows,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "get post error" });
    } finally {
        conn.release();
    }
};

// 내 글 불러오기 (최신순, pagination)
exports.getMyPosts = async (req, res) => {
    const conn = await res.pool.getConnection();
    const limit = 20;
    const { page } = req.params;
    const offset = (page - 1) * limit;
    try {
        const [rows] = await conn.query(
            query.SELECT_MY_POSTS_ORDERBY_CREATED_AT_PAGINATION,
            [res.user_id, limit, offset]
        );

        console.log([res.user_id, limit, offset]);

        if (rows.length === 0) {
            res.status(404).json({
                message: "글이 없습니다.",
            });
        } else {
            res.status(200).json({
                message: "내 글 불러오기 성공",
                posts: rows,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "get post error" });
    } finally {
        conn.release();
    }
};

// 글 작성
exports.postPost = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { title, content } = req.body;
    try {
        const now = await getNow();
        await conn.query(query.INSERT_POST, [
            res.user_id,
            title,
            content,
            now,
            now,
        ]);
        res.status(200).json({
            message: "글 작성 성공",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "post post error" });
    } finally {
        conn.release();
    }
};

// 개별 글 불러오기
exports.getPost = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_POST, [post_id]);
        if (rows.length === 0) {
            res.status(404).json({
                message: "글이 없습니다.",
            });
        } else {
            res.status(200).json({
                message: "개별 글 불러오기 성공",
                post: rows[0],
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "get post error" });
    } finally {
        conn.release();
    }
};

// 글 삭제
exports.deletePost = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_POST, [post_id]);
        if (rows.length === 0) {
            res.status(404).json({
                message: "글이 없습니다.",
            });
        } else if (rows[0].user_id !== res.user_id) {
            res.status(403).json({
                message: "글 작성자만 삭제 가능합니다.",
            });
        } else {
            await conn.query(query.DELETE_POST, [post_id]);
            res.status(200).json({
                message: "글 삭제 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "delete post error" });
    } finally {
        conn.release();
    }
};

// 글 수정
exports.updatePost = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const updated_at = await getNow();
        const [rows] = await conn.query(query.SELECT_POST, [post_id]);
        if (rows.length === 0) {
            res.status(404).json({
                message: "글이 없습니다.",
            });
        } else if (rows[0].user_id !== res.user_id) {
            res.status(403).json({
                message: "글 작성자만 수정 가능합니다.",
            });
        } else {
            await conn.query(query.UPDATE_POST, [
                title,
                content,
                updated_at,
                post_id,
            ]);
            res.status(200).json({
                message: "글 수정 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "update post error" });
    } finally {
        conn.release();
    }
};

// 좋아요 개수 가져오기
exports.getLikeCount = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_POST, [post_id]);
        if (rows.length === 0) {
            res.status(404).json({
                message: "글이 없습니다.",
            });
        } else {
            res.status(200).json({
                message: "글 좋아요 수 조회 성공",
                like_count: rows[0].like_count,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "get like count error" });
    } finally {
        conn.release();
    }
};

// 글 좋아요
exports.likePost = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_POST, [post_id]);
        const now = await getNow();
        if (rows.length === 0) {
            res.status(404).json({
                message: "글이 없습니다.",
            });
        } else {
            await conn.query(query.LIKE_POST, [res.user_id, post_id, now]);
            res.status(200).json({
                message: "글 좋아요 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "like post error" });
    } finally {
        conn.release();
    }
};

// 글 좋아요 취소
exports.unlikePost = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_POST, [post_id]);
        if (rows.length === 0) {
            res.status(404).json({
                message: "글이 없습니다.",
            });
        } else {
            await conn.query(query.UNLIKE_POST, [res.user_id, post_id]);
            res.status(200).json({
                message: "글 좋아요 취소 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "unlike post error" });
    } finally {
        conn.release();
    }
};

// 댓글 불러오기
exports.getComments = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_POST, [post_id]);
        if (rows.length === 0) {
            res.status(404).json({
                message: "글이 없습니다.",
            });
        } else {
            const [comments] = await conn.query(query.SELECT_COMMENTS, [
                post_id,
            ]);
            res.status(200).json({
                message: "댓글 불러오기 성공",
                comments: comments,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "get comments error" });
    } finally {
        conn.release();
    }
};

// 댓글 작성
exports.writeComment = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    const { content } = req.body;
    try {
        const now = await getNow();
        await conn.query(query.INSERT_COMMENT, [
            res.user_id,
            post_id,
            content,
            now,
        ]);
        res.status(200).json({
            message: "댓글 작성 성공",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "write comment error" });
    } finally {
        conn.release();
    }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    const { content } = req.body;
    try {
        const now = await getNow();
        if (res.user_id !== res.comment_user_id) {
            res.status(403).json({
                message: "댓글 작성자만 수정 가능합니다.",
            });
        } else {
            await conn.query(query.UPDATE_COMMENT, [content, now, comment_id]);
            res.status(200).json({
                message: "댓글 수정 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "update comment error" });
    } finally {
        conn.release();
    }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_COMMENT, [comment_id]);
        if (rows.length === 0) {
            res.status(404).json({
                message: "댓글이 없습니다.",
            });
        } else if (res.user_id !== res.comment_user_id) {
            res.status(403).json({
                message: "댓글 작성자만 삭제 가능합니다.",
            });
        } else {
            await conn.query(query.DELETE_COMMENT, [comment_id]);
            res.status(200).json({
                message: "댓글 삭제 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "delete comment error" });
    } finally {
        conn.release();
    }
};
