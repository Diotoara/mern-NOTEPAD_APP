import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const protect = async(req,res,next) => {
    // let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            let token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select("-password")

            return next()
        } catch (error) {
            console.log("Token Verification ", error.message)
            res.status(401).json({message:"Not Authorized, token failed"})
            
        }
    }
    res.status(401).json({message:"Not Authorized, token failed"})
}