var express = require("express");
var router = express.Router();
var post = require("../controller/PostController");
const { verifyToken } = require("./middleware");

router.get("/all/:page", post.getAllPosts); // 전체 글 불러오기 (최신순, pagination)

router.get("/my/:page", verifyToken); // 내 글 불러오기 (최신순, pagination)

router.post("/write", verifyToken); // 글 작성

router.get("/:id"); // 개별 글 불러오기

router.delete("/:id", verifyToken); // 글 삭제

router.put("/:id", verifyToken); // 글 수정

router.post("/:id/like", verifyToken); // 글 좋아요

router.post("/:id/comment", verifyToken); // 댓글 작성

router.put("/:id/comment/:commentId", verifyToken); // 댓글 수정

router.delete("/:id/comment/:commentId", verifyToken); // 댓글 삭제

module.exports = router;
