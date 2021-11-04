var express = require("express");
var router = express.Router();
var post = require("../controller/PostController");
const { verifyToken } = require("./middleware");

router.get("/all/:page", post.getAllPosts); // 전체 글 불러오기 (최신순, pagination)

router.get("/my/:page", verifyToken, post.getMyPosts); // 내 글 불러오기 (최신순, pagination)

router.post("/new", verifyToken, post.newPost); // 글 작성

router.get("/:id", post.getPost); // 개별 글 불러오기

router.delete("/:id", verifyToken, post.deletePost); // 글 삭제

router.put("/:id", verifyToken, post.updatePost); // 글 수정

router.get("/:id/like", post.getLikeCount); // 글 좋아요 개수 가져오기

router.post("/:id/like", verifyToken, post.likePost); // 글 좋아요

router.delete("/:id/like", verifyToken, post.unlikePost); // 글 좋아요 취소

router.get("/:id/comments", post.getComments); // 댓글 불러오기

router.post("/:id/comment", verifyToken, post.writeComment); // 댓글 작성

router.put("/:id/comment/:commentId", verifyToken, post.updateComment); // 댓글 수정

router.delete("/:id/comment/:commentId", verifyToken, post.deleteComment); // 댓글 삭제

module.exports = router;
