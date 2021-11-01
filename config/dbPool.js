const mysql = require("mysql2");

module.exports = async (req, res, next) => {
    const pool = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "password",
        database: "sdc",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    res.pool = pool.promise();
    next();
};
