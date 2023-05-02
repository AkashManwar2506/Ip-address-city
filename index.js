const express = require("express");
const connection = require("./config/db");
const {userRouter} = require("./routes/user.route");
const {ipRouter} = require("./routes/ip.route")

const redisClient = require("./redis");
// const { authenticator } = require("./middlewares/auth");

const logger = require("./middlewares/logger");

require("dotenv").config()


const app = express();
app.use(express.json());

app.use("/user", userRouter)
// app.use(authenticator)
app.use("/ip", ipRouter)
// app.get("/", async(req,res)=>{
//     res.send("Hello");
// })


const PORT = process.env.PORT || 8012;
app.listen(PORT, async ()=>{
      try{
       await connection();
       console.log("connected to db")
       logger.log("info","Database connected")
      } catch(err) {
        console.log(err.message)
        logger.log("error","Database connection fail")
      }
console.log("server is running",PORT)
})


