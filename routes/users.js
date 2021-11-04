var express = require("express");
const { verifyToken } = require("./middleware");
const user = require("../controller/UserController");
var router = express.Router();

router.get("/admin", verifyToken, user.getAdminData); // 블로그 통계 가져오기

router.get("/:id/profile", user.getProfileById); // 프로필 가져오기

router.get("/me/profile", verifyToken, user.getProfile); // 유저 프로필 가져오기

router.post("/me/profile", verifyToken, user.updateProfile); // 프로필 수정 하기

router.post("/me/profile-image", verifyToken); // 프로필 이미지 수정 하기

router.post("/me/blog-image", verifyToken); // 블로그 대표 이미지 수정 하기

module.exports = router;
