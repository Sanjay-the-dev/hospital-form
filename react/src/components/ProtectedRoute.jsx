import { Navigate } from "react-router-dom";
import { useState,useEffect } from "react";
import {Typography,Alert,Snackbar} from '@mui/material'


const ProtectedRoute = ({children, role})=>{

    const [loading,setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false)
    const [userRole, setUserRole] = useState('')
    const [notifyDoctorCreate,setNotifyDoctorCreate] = useState(false);

    const URL = 'http://localhost:5000';


const checkAuth = async()=>{


    try{

    const res = await fetch(`${URL}/auth`,{
        credentials:"include"
    })


    if(!res.ok){
        setAuthenticated(false);
        return;
    }

    const result  = await res.json();

    setAuthenticated(true);
    setUserRole(result.user.role);

    }
    catch(err){ 

        console.log(err)
        setAuthenticated(false);

    }
    finally{
        setLoading(false);
    }
}

useEffect(()=>{ checkAuth() },[]);


    if(loading){
        return <Typography variant="h3" sx={{position:"absolute" , top:"40%",  width:"100%", textAlign:"center"}}> Loading...</Typography>
    }

    if(!authenticated){
        return <Navigate to='/*' replace></Navigate>
    }

    if (role !== userRole ){

        return <Navigate to = '/*' replace></Navigate>
    }



return (
    <>

    {children}
    </>
) ;
}

export default ProtectedRoute;