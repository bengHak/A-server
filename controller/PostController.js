const query = require("../query");

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

// 글 작성

// 개별 글 불러오기

// 글 삭제

// 글 수정

// 글 좋아요

// 댓글 작성

// 댓글 수정

// 댓글 삭제
