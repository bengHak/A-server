const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const saltRounds = 10;
const { secretKey } = require("./config/key");

exports.bcryptPW = async (pw) => {
    let result = "";
    try {
        result = bcrypt.hashSync(pw, saltRounds);
    } catch (e) {
        result = false;
    }
    return result;
};

exports.comparePW = async (pw, dbpw) => {
    let result = "";
    try {
        result = bcrypt.compareSync(pw, dbpw);
    } catch (e) {
        result = false;
        console.log(e);
    }
    return result;
};

exports.issueToken = async (user_id) => {
    let result = "";
    try {
        result = jwt.sign({ id: user_id }, secretKey, { expiresIn: "30d" });
    } catch (e) {
        result = false;
    }
    return result;
};

exports.getToday = async () => {
    let result = "";
    try {
        result = moment().format("YYYY-MM-DD");
    } catch (e) {
        result = false;
    }
    return result;
};

exports.getNow = async () => {
    let result = "";
    try {
        result = moment().format("YYYY-MM-DD HH:mm:ss");
    } catch (e) {
        result = false;
    }
    return result;
};

exports.getNowTimestamp = async () => {
    let result = "";
    try {
        result = moment().unix();
    } catch (e) {
        result = false;
    }
    return result;
};
