const express = require("express")
const user = require("../models/usermodel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const redisClient = require("../redis")
const { authenticator } = require("../middlewares/auth")
const userRouter = express.Router();

userRouter.get("/", async(req,res)=>{
    res.send("Hello");
})

userRouter.post("/register", async(req, res)=>{
    try{
        const {name,email,password} = req.body;
        
        const isUser = await user.findOne({email});
         if(isUser) return res.send("User already Present, Please Login");
         
         const hash = await bcrypt.hash(password,8);

         const newUser = new user({name,email, password: hash});

         await newUser.save();

         res.send("Registered Successfully")

    } catch(err) {
        // console.log(err)
        res.send(err.message);
    }

})

userRouter.post("/login", async(req, res)=>{
    try{
        const {email,password} = req.body;
        
        const isUser = await user.findOne({email});
         if(!isUser) return res.send("User does not exist, Please Register");
         
         const isPassCorrect = await bcrypt.compare(password,isUser.password);

         if(!isPassCorrect) return res.send("Invalid Password");

        const token = await jwt.sign({userId:isUser._id},process.env.jwtsecret, {expiresIn:"1hr"})

        res.send({message: "Login Success", token});

    } catch(err) {
          
        res.send(err.message);
    }

})

userRouter.get("/logout", authenticator, async (req, res)=>{
    try{
        const token = req.headers?.authorization?.split(" ")[1];

        if(!token) return res.status(403);

        await redisClient.set(token, token);
        res.send("logout successful");


    }catch(err) {
        res.send(err.message)
    }
})

module.exports = {userRouter}