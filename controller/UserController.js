const query = require("../query");
const { getNow } = require("../lib");

/* 
    관리자 뷰 데이터 조회
    - 최근 7일 글
    - 최근 댓글 20개
    - 최근 글 20개
    - 글 20개 좋아요 순
*/
exports.getAdminData = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { user_id } = res;
    const limit = 20;
    let data = {
        recent_7day_posts: [],
        recent_comments_20: [],
        recent_posts_20: [],
        post_liked_by_user: [],
    };

    try {
        // 최근 7일간 작성된 글
        const recent_7day_posts = await conn.query(
            query.admin.recent_7day_posts,
            [user_id, getNow(), getNow()]
        );
        data.recent_7day_posts = recent_7day_posts[0];

        // 최근 댓글 20개
        const recent_comments_20 = await conn.query(
            query.admin.recent_comments_20,
            [user_id, getNow(), getNow()]
        );
        data.recent_comments_20 = recent_comments_20[0];

        // 최근 글 20개
        const recent_posts_20 = await conn.query(query.admin.recent_posts_20, [
            user_id,
            getNow(),
            getNow(),
        ]);
        data.recent_posts_20 = recent_posts_20[0];

        // 글 20개 좋아요 순
        const post_liked_by_user = await conn.query(
            query.admin.post_liked_by_user,
            [user_id, getNow(), getNow()]
        );
        data.post_liked_by_user = post_liked_by_user[0];

        res.json({
            success: true,
            data,
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "서버 오류",
        });
    } finally {
        conn.release();
    }
};

exports.getProfileById = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { id } = req.params;

    try {
        const profile = await conn.query(query.SELECT_USER_WITHOUT_PASSWORD, [
            id,
        ]);
        let newProfile = {
            id: Number(id),
            username: profile[0][0].username,
            email: profile[0][0].email,
            blogTitle: profile[0][0].blog_title,
            // profileImagePath: profile[0][0].profile_image_path,
            // blogImagePath: profile[0][0].blog_image_path,
        };
        res.json({
            success: true,
            msg: "프로필 조회 성공",
            data: newProfile,
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "서버 오류",
        });
    } finally {
        conn.release();
    }
};

// 프로필 가져오기
exports.getProfile = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { user_id } = res;

    try {
        const profile = await conn.query(query.SELECT_USER_WITHOUT_PASSWORD, [
            user_id,
        ]);
        res.json({
            success: true,
            msg: "프로필 조회 성공",
            data: profile[0][0],
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "서버 오류",
            data: "",
        });
    } finally {
        conn.release();
    }
};

/*
    프로필 수정
    - 이름 설정
    - 블로그 이름 설정
*/
exports.updateProfile = async (req, res) => {
    const conn = await res.pool.getConnection();
    const { user_id } = res;
    const { name, blog_name } = req.body;

    try {
        await conn.query(query.UPDATE_USER_USERNAME_BLOG_TITLE, [
            name,
            blog_name,
            user_id,
        ]);
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "서버 오류",
        });
    } finally {
        conn.release();
    }
};
