const jwt = require("jsonwebtoken");
const redisClient = require("../redis");
require("dotenv").config()


const authenticator = async (req, res, next) => {

    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token) return res.status(401).send("Please login again");

        const isTokenValid = await jwt.verify(token, process.env.jwtsecret);

        if (!isTokenValid) return res.send("Authentication failed, Please login again");

        const isTokenBlacklisted = await redisClient.get(token);

        if (isTokenBlacklisted) return res.send("Unauthorized");

        const userId = isTokenValid.userId;

        next()

    } catch (err) {
        res.send(err.message);
    }
};

module.exports = { authenticator };