import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";


function LogoutCheck({children}){

    const [authenticated, setAuthenticated]= useState(false);
    const [userRole,setUserRole] = useState(" ")
    const URL = 'http://localhost:5000';
    const navigate = useNavigate();

const authCheck = async()=>{

    try {
        const res = await fetch(`${URL}/auth`,{
            credentials:'include'
        })

        if(res.ok){

           setAuthenticated(true);

        }

        const result = await res.json();

        setUserRole(result.user.role)


    } 
    catch (error) {
        console.log(error)    
    }
}

useEffect(()=>{authCheck()},[]);

        if ( "admin" == userRole){
            return <Navigate to="/admin" replace></Navigate>
        }
        if ( "receptionist" == userRole){
            return <Navigate to="/receptionist" replace></Navigate>
        }

        if (!authenticated){
            return children;
        }
        


}

export default LogoutCheck;