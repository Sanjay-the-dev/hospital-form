import express from 'express';
import db from '../config/db.js'
import jwt from 'jsonwebtoken'
import VerifyToken from '../../middleware/VerifyToken.js';

const router = express.Router();


router.post(`/login`,async(req,res)=>{
    

    try{
        const {login,password} = req.body;
        
        
        const [users] = await db.query(`SELECT * FROM users WHERE ( username = ? OR email = ? ) AND password = ? `,[login,login, password]);
        

        if (users.length === 0 ){
            return(
                res.json({invalidMessage:"Invalid Credentials"})
            )
        }

        const user = users[0];
        
        console.log('user role', user.role);

        const token = jwt.sign(
            {
                id:user.id,
                role:user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn:'1d'
            }
        
        )

        res.cookie(
            "cookies",
            token,
            {
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge: 24*60*60*1000
            }
        )



        res.json({message:"Login Successsful",role:user.role})


    }

    catch(err){

        console.log(err)
    }
})


router.get('/auth', VerifyToken, (req,res)=>{
    res.json({user:req.user})
})

router.post('/logout', (req,res)=>{

    res.clearCookie("cookies");

    res.json({message:"Logout Successfull"});
})


export default router;