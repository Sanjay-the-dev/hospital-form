import { Navigate } from "react-router-dom";
import { useState,useEffect } from "react";


const ProtectedRoute = ({children, role})=>{

    const [loading,setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false)
    const [userRole, setUserRole] = useState('')

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
        return <h1> Loading...</h1>
    }

    if(!authenticated){
        return <Navigate to='/' replace></Navigate>
    }

    if (role !== userRole ){

        return <Navigate to = '/' replace></Navigate>
    }


return children;
}

export default ProtectedRoute;