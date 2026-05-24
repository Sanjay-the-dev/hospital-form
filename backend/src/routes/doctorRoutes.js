import express from "express";
import db from '../config/db.js';

const router = express.Router();




router.post("/doctor", async(req,res)=>{

     try {


        const {search} = req.body;
        
        let condition = [];
        let values = [];

        if(search.name){
            condition.push(" name LIKE ? ");
            values.push(`%${search.name}%`);
        }
        if(search.age){
            condition.push(" age LIKE ? ");
            values.push(`%${search.age}%`);
        }
        if(search.address){
            condition.push(" address LIKE ? ");
            values.push(`%${search.address}%`);
        }
        if(search.number){
            condition.push(" number LIKE ? ");
            values.push(`%${search.number}%`);
        }
        if(search.gender){
            condition.push(" gender LIKE ? ");
            values.push(`${search.gender}`);
        }
        if(search.department){
            condition.push(" department LIKE ? ");
            values.push(`${search.department}`);
        }
        if(search.experience){
            condition.push(" experience LIKE ? ");
            values.push(`${search.experience}`);
        }

        const[exportTable] = await db.query(`select * from doctors ${condition.length ? " where " + condition.join(" AND ") : ''}`,values)



        let query = (`select * from doctors ${condition.length ? " where " + condition.join(" AND ") : ''} `);




        const [doctors] = await db.query(query,values);
        const [doctorsCol] = await db.query(`show columns from doctors`);


        res.json({doctors:doctors, doctorsColumn:doctorsCol})
        
     } catch (error) {

        console.log(error)
     }
})


router.post('/doctor/create', async (req,res)=>{

    try{

            const docFormData = req.body;

            console.log("docform", docFormData)

            const {name,age,address,number,gender,department,experience,email } = docFormData;


        await db.query("insert into doctors (name, age, address,number , gender, department, experience,email) values(?,?,?,?,?,?,?,?) ",
            [name, age,address,number,gender,department,experience,email]
        );

        res.send("doctor added");

       

    }
    catch(err){
        console.log(err);
    }
})



router.post("/doctor/import" , async (req,res)=>{

    try {
        const {importData} = req.body;

        for(const doctor of importData){

            await db.query("insert into doctors (name, age,number, address ,gender,department, experience,email) values(?,?,?,?,?,?,?,?)",
              [doctor.name,doctor.age,doctor.number,doctor.address,doctor.gender,doctor.department,doctor.experience ,doctor.email]  
            )
        }
        
        res.send("doctors imported")
    } 
    catch (error) {
        console.log(error)    
    }
})


router.delete('/doctor/:id',async(req,res)=>{

    try{
        const {id} = req.params;
        
        await db.query(`delete from doctors where id = ? `,[id]);

        res.send("doctor deleted")
    }
    catch(err){
        console.log(err)
    }
})


router.put('/doctor', async(req,res)=>{
     try{
        const {name, age, address,number , gender, department, experience,email, editId} = req.body;

        await db.query(`update doctors set name = ?, age = ? , address = ? , number = ?,  gender = ?, department = ?, experience = ?, email = ? where id = ? `,
            [name, age, address,number , gender, department, experience,email, editId]
        )

        res.send(" doctor updated ")
     }

     catch(err){
        console.log(err)
     }
})



export default router;

