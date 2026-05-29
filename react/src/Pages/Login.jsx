
import {Button, TextField,Grid, Typography,Checkbox,Alert , Snackbar} from '@mui/material'
import { useState, useContext } from 'react';
import {useNavigate } from 'react-router-dom';
import {authContext} from '../App'



function Login (){

    const[loginUsername, setLoginUsername] = useState('');
    const [LoginPassword, setLoginPassword] = useState('');
    const [showPassword, setShowPassword]  = useState('');
    const [notify, setNotify] = useState(false);

    const {setNotifyLogin} = useContext(authContext);
    const URL  = 'http://localhost:5000';

    const navigate = useNavigate();


    
const formSubmit = async ()=>{

    try {

       const  res =  await fetch(`${URL}/login`,{
                         method:"POST",
                         credentials:'include',
                           headers:{
                                "Content-Type" : "application/json"
                         },
                         body: JSON.stringify({login:loginUsername, password:LoginPassword})
                     })
        
        const result = await res.json();

         console.log(result);

        setNotifyLogin(true)
        if(result.invalidMessage){
            setNotify(true);
        }

        if(result.role == "admin"){
            navigate('/admin');
        }
        

        if(result.role == "receptionist"){
            navigate('/receptionist');
        }

        setLoginPassword('');
        setLoginUsername('');
    } 
    catch (error) {

        console.log(error)
        
    }




}

    return(
        <>

        <Snackbar open={notify} 
        autoHideDuration={3000}
         onClose={()=>setNotify(false)} 
         anchorOrigin={{vertical:"top", horizontal:"center"}}>

            <Alert variant='filled' severity='error' sx={{width:"250px", alignItems:"center",paddingLeft:"70px", fontSize:"20px"}}>Invalid Credentials</Alert>
         </Snackbar>


            <div className="login_container">

                <form >


                <Grid container  sx={{ flexDirection: "column"  , alignItems:"center" }} rowSpacing={2}>


                    <Grid item>
                        <Typography variant='h3'> Login</Typography>
                    </Grid>

                    <Grid item >
                        <TextField required label="Username or E-mail" value={loginUsername} sx={{width:"300px", margin:"10px 30px"}} onChange={(e)=>setLoginUsername(e.target.value)}  ></TextField>
                    </Grid>

                    <Grid item>
                        <TextField required label="Password" type={showPassword ? " " : "password"} value={LoginPassword} sx={{width:"300px", margin:"10px 30px"}} onChange={(e)=>setLoginPassword(e.target.value)}  ></TextField>
                    </Grid>

                    <Grid item sx={{marginRight:"150px"}}>
                        <Checkbox label="Show Password" checked={showPassword} onChange={(e)=>setShowPassword(e.target.checked)}/> Show Password
                    </Grid>

                    <Grid item>
                        <Button variant='contained' sx={{width:"300px", margin:"10px 30px"}} color='primary'  onClick={formSubmit} > Submit </Button>
                    </Grid>


                </Grid>
                </form>




            </div>
        </>
    )
}


export default Login;