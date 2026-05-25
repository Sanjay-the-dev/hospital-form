import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser  from 'cookie-parser'

import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import authRoutes from './routes/authRoutes.js';
import UsersManage from './routes/userManage.js';

import VerifyToken from '../middleware/VerifyToken.js'

const app = express();

const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cors({

    origin:"http://localhost:5173",

    credentials:true
}));

app.use(cookieParser());


//  Routes

app.use(authRoutes);

app.use(patientRoutes);

app.use(doctorRoutes);

app.use(UsersManage);

app.use(VerifyToken)



app.listen(PORT,()=>{
    console.log(`server is running on port: ${PORT}`)
})

