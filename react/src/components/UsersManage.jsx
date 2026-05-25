import { useState,useEffect } from "react";
import {Box, FormControl, FormControlLabel ,Select, Grid, Typography,InputLabel, Button,Table,Paper,TableContainer,TableHead,TableBody,TableCell,TableRow, TextField, FormLabel, MenuItem} from "@mui/material";
import { GridItem } from "@chakra-ui/react";

function UsersManage(){

    const [users, setUsers] = useState([]);
    const [usersColumn, setUsersColumn] = useState([]);
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


        <FormControl>
            <Grid container>
                <Grid item>
                    <TextField  value={userInput.username} name="username" label="UserName" onChange={(e)=>{setUserInput(prev=>({...prev,username:e.target.value}))}}/>
                    <TextField  value={userInput.email} name="email" label="E-mail" onChange={(e)=>setUserInput}/>
                </Grid>
                <Grid item>
                    <TextField  value={userInput.password} name="password" label="Password" onChange={(e)=>setUserInput}/>

                    <FormControl>

                        <InputLabel>Select Role</InputLabel>
                        <Select value={userInput.role} name="role" label="select role" onChange={(e)=>setUserInput}>
                            <MenuItem value="admin"> Admin</MenuItem>
                            <MenuItem value="receptionist"> Receptionist</MenuItem>
                        </Select>
                    </FormControl>

                </Grid>
            </Grid>
        </FormControl>



        <Paper sx={{width:"600px" , margin:"auto"}}>

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