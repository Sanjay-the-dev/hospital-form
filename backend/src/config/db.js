import mysql from 'mysql2/promise'


const db = await mysql.createPool({

    host:"localhost",
    user:"root",
    database:"hospital",
    password:"RG2323rg"
})


export default db;