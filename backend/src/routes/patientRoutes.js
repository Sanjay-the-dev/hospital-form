import express from 'express';
import db from '../config/db.js'

const router = express.Router();




router.post('/patient',async(req,res)=>{

    try{

        const{search,page, rowPerPage} = req.body;


        const limit = rowPerPage;

        const offset = page * limit;


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
        if(search.blood){
            condition.push(" blood_group LIKE ? ");
            values.push(`${search.blood}`);
        }

        const[exportTable] = await db.query(`select * from patients ${condition.length ? " where " + condition.join(" AND ") : ''}`,values)

        values.push(limit,offset);


        let query = (`select * from patients ${condition.length ? " where " + condition.join(" AND ") : ''} LIMIT ? OFFSET ?`);



        const [patients] = await db.query(query,values);

        const [doctors] = await db.query("select * from doctors");

        const [counts] = await db.query(`select count(*) as total from patients ${condition.length ? "WHERE" + condition.join("AND"): ""}`, values.slice(0,condition.length));

        const totalcount = counts[0].total

        const [patientsColumn] = await db.query('show columns from patients');



        res.json({data:patients, total: totalcount, doctors : doctors, patientsColumn: patientsColumn, exportTable: exportTable})
    }
    catch(err){
        console.log(err)
    }
})

router.post("/patients", async (req,res)=>{

    try{
        const {name, age, address, number,gender,blood} = req.body;


        await db.query(`insert into patients (name, age,address,number,gender,blood_group) values(?,?,?,?,?,?)`,
            [name,age,address,number,gender,blood]
        )

        res.send("patient added");
    }

    catch(err){
        console.log(err)
    }

})


router.post('/patients/import', async (req,res)=>{

    try {

        const {importData} = req.body;


        for(const data of importData){

            await db.query(`insert into patients (name,age,address,gender,number,blood_group) values(?,?,?,?,?,?)`,
                [data.name,data.age,data.address,data.gender,data.number,data.blood]
            )
        }
        
        res.send("import is successful")
    } 
    catch (error) {
        console.log(error)    
    }
})


router.delete(`/patient/:id`, async(req,res)=>{

    try{
        const {id} = req.params;

        await db.query("delete from patients where  id = ?", [id]);

        res.send('patient deleted');
    }
    catch(err){
        console.log(err)
    }
})

router.put('/patient', async (req,res)=>{

    try{
        const {name,age,number,address,gender,blood,editId} = req.body;

        await db.query('update patients set name = ? , age = ? , number = ? ,address = ? , gender = ? , blood_group = ? where id = ?',
            [name,age,number,address,gender,blood,editId]
        )


        res.send("updateed")
    }
    catch(err){
        console.log(err)
    }
})


export default router;