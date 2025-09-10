/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//functions
export const verifyToken = async (req: any, res: any, next: any) => {
    try {
        const token = await req.headers['authorization'].split(' ')[1];
        req.user = {};
        if(token){
            jwt.verify(token,`${process.env.JWT_SECRET}`, async (err: any, decoded: any) => {
                if(err) return res.json({
                    isLoggingIn: false,
                    message: "Failed to Authenticate",
                    err: err
                })
                req.user.id = decoded.id;
                req.user.firstName = decoded.firstName;
                req.user.lastName = decoded.lastName;
                req.user.username = decoded.username
                next(); 
            })
        }else{
            res.status(406).json({message:"Token Not Acceptable"})
        }
    } catch (error){
        console.log(error)
        res.status(406).json({message:"Token Not Acceptable"})
    }
}