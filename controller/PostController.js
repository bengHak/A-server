const query = require("../query");
const { getNow, getTimestamp, getNowTimestamp } = require("../lib");

// 전체 글 불러오기 (최신순, pagination)
exports.getAllPosts = async (req, res) => {
    const conn = await res.pool.getConnection();
    const limit = 20;
    const { page } = req.params;
    const offset = (page - 1) * limit;
    try {
        const [rows] = await conn.query(
            query.SELECT_POSTS_ORDERBY_CREATED_AT_PAGINATION,
            [offset, limit]
        );

        if (rows.length === 0) {
            res.status(404).json({
                success: true,
                msg: "글이 없습니다.",
                data: [],
            });
        } else {
            let newRows = rows.map((e) => ({
                id: e.id,
                title: e.title,
                content: e.content,
                createdAt: getTimestamp(e.created_at),
                updatedAt: getTimestamp(e.updated_at),
                userId: e.user_id,
            }));
            res.status(200).json({
                success: true,
                msg: "전체 글 불러오기 성공",
                data: newRows,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "get post error" });
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
                success: true,
                msg: "글이 없습니다.",
            });
        } else {
            res.status(200).json({
                success: true,
                msg: "내 글 불러오기 성공",
                posts: rows,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "get post error" });
    } finally {
        conn.release();
    }
};

// 글 작성
exports.newPost = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { title, content } = req.body;
    try {
        const now = await getNow();
        await conn.query(query.INSERT_POST, [
            title,
            content,
            res.user_id,
            now,
            now,
        ]);
        res.status(200).json({
            success: true,
            msg: "글 작성 성공",
            data: "",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "new post error" });
    } finally {
        conn.release();
    }
};

// 개별 글 불러오기
exports.getPost = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_POST, [id]);
        if (rows.length === 0) {
            res.status(404).json({
                success: true,
                msg: "글이 없습니다.",
            });
        } else {
            let newRow = {
                id: rows[0].id,
                title: rows[0].title,
                content: rows[0].content,
                createdAt: getTimestamp(rows[0].created_at),
                updatedAt: getTimestamp(rows[0].updated_at),
                userId: rows[0].user_id,
            };

            res.status(200).json({
                success: true,
                msg: "개별 글 불러오기 성공",
                data: newRow,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "get post error" });
    } finally {
        conn.release();
    }
};

// 글 삭제
exports.deletePost = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_POST, [id]);
        if (rows.length === 0) {
            res.status(404).json({
                success: true,
                msg: "글이 없습니다.",
            });
        } else if (rows[0].user_id !== res.user_id) {
            res.status(403).json({
                success: false,
                msg: "글 작성자만 삭제 가능합니다.",
            });
        } else {
            await conn.query(query.DELETE_POST, [id]);
            res.status(200).json({
                success: true,
                msg: "글 삭제 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "delete post error" });
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
        const [rows] = await conn.query(query.SELECT_POST, [id]);
        if (rows.length === 0) {
            res.status(404).json({
                success: false,
                msg: "글이 없습니다.",
            });
        } else if (rows[0].user_id !== res.user_id) {
            res.status(403).json({
                success: true,
                msg: "글 작성자만 수정 가능합니다.",
            });
        } else {
            await conn.query(query.UPDATE_POST, [
                title,
                content,
                updated_at,
                id,
            ]);
            res.status(200).json({
                success: true,
                msg: "글 수정 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: true, msg: "update post error" });
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
                success: false,
                msg: "글이 없습니다.",
            });
        } else {
            res.status(200).json({
                success: true,
                msg: "글 좋아요 수 조회 성공",
                like_count: rows[0].like_count,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "get like count error" });
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
                success: false,
                msg: "글이 없습니다.",
            });
        } else {
            await conn.query(query.LIKE_POST, [res.user_id, post_id, now]);
            res.status(200).json({
                success: true,
                msg: "글 좋아요 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "like post error" });
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
                success: false,
                msg: "글이 없습니다.",
            });
        } else {
            await conn.query(query.UNLIKE_POST, [res.user_id, post_id]);
            res.status(200).json({
                success: true,
                msg: "글 좋아요 취소 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "unlike post error" });
    } finally {
        conn.release();
    }
};

// 댓글 불러오기
exports.getComments = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_POST, [id]);
        if (rows.length === 0) {
            res.status(404).json({
                success: false,
                msg: "글이 없습니다.",
            });
        } else {
            const [comments] = await conn.query(query.SELECT_COMMENT_AND_USER, [
                id,
            ]);
            let newComments = comments.map((comment) => ({
                commentId: comment.id,
                userId: comment.user_id,
                username: comment.username,
                postId: comment.post_id,
                content: comment.content,
                createdAt: getTimestamp(comment.created_at),
            }));
            res.status(200).json({
                success: true,
                msg: "댓글 불러오기 성공",
                data: newComments,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "get comments error" });
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
            id,
            content,
            now,
            now,
        ]);
        res.status(200).json({
            success: true,
            msg: "댓글 작성 성공",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "write comment error" });
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
                success: false,
                msg: "댓글 작성자만 수정 가능합니다.",
            });
        } else {
            await conn.query(query.UPDATE_COMMENT, [content, now, comment_id]);
            res.status(200).json({
                success: true,
                msg: "댓글 수정 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "update comment error" });
    } finally {
        conn.release();
    }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { commentId } = req.params;
    try {
        const [rows] = await conn.query(query.SELECT_COMMENT, [commentId]);
        console.log(rows);
        if (rows.length === 0) {
            res.status(404).json({
                success: false,
                msg: "댓글이 없습니다.",
            });
        } else if (res.user_id !== rows[0]["user_id"]) {
            res.status(403).json({
                success: false,
                msg: "댓글 작성자만 삭제 가능합니다.",
            });
        } else {
            await conn.query(query.DELETE_COMMENT, [commentId]);
            res.status(200).json({
                success: true,
                msg: "댓글 삭제 성공",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "delete comment error" });
    } finally {
        conn.release();
    }
};
