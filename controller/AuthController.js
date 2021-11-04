const query = require("../query");
const { bcryptPW, comparePW, issueToken, getNow } = require("../lib");

// 회원가입
exports.signUpAPI = async (req, res) => {
    const conn = await res.pool.getConnection();
    try {
        const { email, password, username, blog_title } = req.body;
        let email_check = await conn.query(query.SELECT_USER_BY_EMAIL, [email]);

        if (email_check[0].length === 0) {
            let b_password = await bcryptPW(password);
            let createdAt = await getNow();
            await conn.beginTransaction();
            let result = await conn.query(query.INSERT_USER, [
                email,
                b_password,
                username,
                blog_title,
                "", // profile image path
                "", // blog image path
                createdAt,
                createdAt,
            ]);
            const user_id = result[0].insertId;
            console.log(user_id);
            let token = await issueToken(user_id);
            if (!b_password || !token) throw e;
            await conn.commit();
            console.log(`${email} signup success`);
            res.status(200).json({
                success: true,
                msg: "signup success",
                data: token,
            });
        } else {
            res.status(400).json({ success: false, msg: "duplicated email" });
        }
    } catch (e) {
        await conn.rollback();
        console.log(`signup e : ${e}`);
        res.status(500).json({ success: false, msg: "signup error" });
    } finally {
        await conn.release();
    }
};

// 로그인
exports.signInAPI = async (req, res) => {
    try {
        const email = req.body.email;
        const givenPassword = req.body.password;

        let result = await res.pool.query(query.SELECT_USER_BY_EMAIL, [email]);
        let { id, password } = result[0][0];

        let email_check = result[0].length > 0;
        if (!email_check) {
            res.status(400).json({ success: false, msg: "signin failed" });
        } else {
            let c_password = await comparePW(givenPassword, password);
            if (!c_password) {
                res.status(400).json({ success: false, msg: "signin failed" });
            } else {
                let token = await issueToken(id);
                if (!token) throw e;
                console.log(`${email} signin success`); // 지우기
                res.status(200).json({
                    success: true,
                    msg: "signin success",
                    data: { id, token },
                });
            }
        }
    } catch (e) {
        console.log(`signin e : ${e}`);
        res.status(400).json({ success: false, msg: "signin error" });
    }
};

exports.verifyTokenAPI = async (req, res) => {
    try {
        if (res.user_id !== undefined) {
            res.status(200).json({ success: true, msg: "verify success" });
        } else {
            res.status(400).json({ success: false, msg: "verify failed" });
        }
    } catch (e) {
        console.log(`verify e : ${e}`);
        res.status(400).json({ success: false, msg: "verify error" });
    }
};
