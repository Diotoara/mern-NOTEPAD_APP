import express from "express"
import User from "../models/user.js";
import { protect } from "../middlewares/authMdl.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//Register
router.post("/register", async(req,res)=>{
    const {username, email, password} = req.body;

    try {
        if(!username || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message:"User already Exists"})
        }

        const user = await User.create({username, email, password});
        const token = geneateToken(user._id);
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token

        })
    } catch (error) {
        res.status(500).json({message: "Server Error \n" + error})
    }
})

//Login
router.post('/login', async(req,res)=>{
    const{email, password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }

        const user = await User.findOne({email})
        if(!user || !(await user.matchPassword(password))){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const token = geneateToken(user._id);
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
        })
    } catch (error) {
        res.status(500).json({message: "Server Error \n" + error})
    }
})

//Me
router.get("/me", protect ,async(req,res)=>{
    res.status(200).json(req.user)
})

//JWT
const geneateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"30d"})
}

export default router