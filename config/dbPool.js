const mysql = require("mysql2");
const creatQueries = require("./createDB");

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

    Object.values(creatQueries).map((q) => {
        pool.query(q, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });

    res.pool = pool.promise();
    next();
};
