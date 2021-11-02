var express = require("express");
var router = express.Router();
var auth = require("../controller/AuthController");
const { verifyToken } = require("./middleware");

router.post("/signup", auth.signUpAPI);
router.post("/signin", auth.signInAPI);
router.post("/verify", verifyToken, auth.verifyTokenAPI);

module.exports = router;
