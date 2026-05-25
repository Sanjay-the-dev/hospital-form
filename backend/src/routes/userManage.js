import express from "express";
import db from '../config/db.js'

const router = express.Router();



router.get(`/users`, async(req , res)=>{

    try {


        const [users] = await db.query(`SELECT * FROM users`);
        const [usersColumn] = await db.query('SHOW COLUMNS FROM users')

        await res.json({user:users, usersColumn:usersColumn});

        console.log(users,usersColumn)


        
    } 

    catch (error) {
        console.log(error)    
    }
})


 export default router;

