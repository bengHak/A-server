var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    res.json("auth router");
});

module.exports = router;
