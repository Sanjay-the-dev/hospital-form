import { useState,useEffect } from "react";
import {Box, FormControl, FormControlLabel,AppBar,Container ,Select, Grid, Typography,InputLabel, Button,Table,Paper,TableContainer,TableHead,TableBody,TableCell,TableRow, TextField, FormLabel, MenuItem} from "@mui/material";
import { GridItem, space } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function UsersManage(){

    const [users, setUsers] = useState([]);
    const [usersColumn, setUsersColumn] = useState([]);
    const [formPopup, setFormPopup] = useState(false);
    const navigate = useNavigate();

    const URL = 'http://localhost:5000';

    const [userInput, setUserInput] = useState({
        username: '',
        email:'',
        password:'',
        role:''
    })

const fetchUsers = async()=>{

    try {
        const res = await fetch(`${URL}/users`)

        const result = await res.json();

        console.log(result);

        setUsers(result.user);

        setUsersColumn(result.usersColumn.splice(1).map((col)=>col.Field));

        console.log(usersColumn);
    
        
    } 
    catch (error) {
        console.log(error)    
    }
}

useEffect(()=>{fetchUsers()},[]);





    return(
        <>
        <AppBar position="fixed" sx={{background:"white",padding:'15px'}}>
            <Container>
                <Button variant="contained" color="warning" sx={{marginRight:"20px"}} onClick={()=>navigate(-1)}>Go Back</Button>
{/*                 <Button variant="contained" color="primary" onClick={()=>setFormPopup(true)}> Create User</Button>
 */}            </Container>
        </AppBar>



    <div   className={ formPopup ? "popup_form_show" : "popup_form_hide"}>

        <Box className= 'popup_container'>

        <FormControl>
                <h2>Create User</h2>

                <Button variant="contained" color="error" sx={{position:"absolute" , right:"20px", top:"10px"}} onClick={()=>setFormPopup(false)}>X</Button>
            <Grid container  sx={{padding:'10px 30px 20px 40px'}} row  columnSpacing={5} rowSpacing={5} >
                <Grid item>
                    <TextField  value={userInput.username} name="username" label="UserName"  sx={{width:"250px"}} onChange={(e)=>{setUserInput(prev=>({...prev,username:e.target.value}))}}/>
                </Grid>

                <Grid item> 
                    <TextField  value={userInput.email} name="email" label="E-mail"  sx={{width:"250px"}} onChange={(e)=>{setUserInput(prev=>({...prev,email:e.target.value}))}}/>
                </Grid>

                <Grid item>
                    <TextField  value={userInput.password} name="password" label="Password"  sx={{width:"250px"}} onChange={(e)=>{setUserInput(prev=>({...prev,password:e.target.value}))}}/>
                </Grid>
                    
                <Grid item>
                    <FormControl>

                        <InputLabel>Select Role</InputLabel>
                        <Select value={userInput.role} name="role" label="select role"  sx={{width:"250px"}} onChange={(e)=>{setUserInput(prev=>({...prev,role:e.target.value}))}}>
                            <MenuItem value="admin"> Admin</MenuItem>
                            <MenuItem value="receptionist"> Receptionist</MenuItem>
                        </Select>
                    </FormControl>

                </Grid>

                <Button variant="contained" color="info" sx={{marginX:'auto', width:"300px"}}>Create</Button>
            </Grid>

        
        </FormControl>
        </Box>
        </div>



        <Paper sx={{width:"600px" , margin:"auto", marginTop:"100px"}}>

            <h1>User Lists</h1>
                <hr />

                <TableContainer component={Paper}>
            <Table>
                    <TableHead>
                        <TableRow >
                            {usersColumn.map((col)=>{
                                return col !== "password" ? <TableCell  sx={{fontSize:"16px", fontWeight:"bold"}}>{col} </TableCell> :""
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((user)=>{
                            return <TableRow >
                                <TableCell > {user.username}</TableCell>
                                <TableCell > {user.email}</TableCell>
                                <TableCell > {user.role}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
            </Table>
                </TableContainer>
        </Paper>
        




        </>
    )




}

export default UsersManage;