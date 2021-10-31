var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
const pool = require("./config/dbPool");

// import routes
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/post");
var authRouter = require("./routes/auth");
var searchRouter = require("./routes/search");

// App configuration
var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(pool);

// Routes
app.use("/api/user", usersRouter);
app.use("/api/post", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/search", searchRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
