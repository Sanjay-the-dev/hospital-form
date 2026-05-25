import { useState,useEffect, useContext } from 'react';
import { Link,useNavigate, } from 'react-router-dom';
import {Grid,TextField,InputLabel,FormControl,FormControlLabel, RadioGroup,Radio,Select,Menu,MenuItem, Button, areEqualValues, FormLabel} from '@mui/material';
import {Paper, Table,TableContainer,TableHead,TableBody,TableCell,TableRow} from '@mui/material';
import {  Box, AppBar,Typography,Toolbar,Accordion,AccordionSummary,AccordionDetails, Snackbar,Alert} from '@mui/material';
import  ExpandMoreIcon from '@mui/icons-material/ExpandMore' 
import{ ReactSpreadsheetImport}  from 'react-spreadsheet-import'
import jsPDF from 'jspdf' ;
import  autoTable  from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import { authContext } from '../App';
import DeleteIcon from '@mui/icons-material/Delete';



function Doctor( {sendDoctors ,doctorFormData }){


    const [URL, setURL] = useState('http://localhost:5000');

    const navigate = useNavigate();

    const {setNotifyLogout} = useContext(authContext);

    const [anchorEl, setAnchorEl] = useState(null);    // export button menu expand collapse
    const open = Boolean(anchorEl);

    const [importUI, setImportUi] =  useState(false) ;    //import ui popup 

    const [notifyDoctorCreate, setNotifyDoctorCreate] = useState(false);
    const [notifyDoctorDelete, setNotifyDoctorDelete] = useState(false);
    const [notifyDoctorEdit, setNotifyDoctorEdit] = useState(false);
  


    const[exportTable, setExportTable] = useState([]);

   const [docFormData, setDoctorFormData] = useState({
   name:'',
   age:'',
   address:'',
   number:'',
   gender:'',
   department:'',
   experience:'',
   email:''
    })


  const [search,setSearch] = useState({
    name: '',
    age: '',
    address: '',
    number: '',
   gender: '',
   department: '',
    experience: '',
    email:' '
  })


   const [editId, setEditId]= useState(null)


    const [doctors, setDoctors] = useState([]);
    const [doctorsColumn, setDoctorColumn] = useState([]);
    const [doctorPopup, setDoctorPopup ] = useState (false);

    



const fetchDoctors = async ()=>{

    try{
        const res = await fetch(`${URL}/doctor`,{
            method:"POST",
            headers:{
            "Content-Type":"application/json"
            },
            body: JSON.stringify({search})
        });

        const result = await res.json();

        setDoctors(result.doctors);
        setDoctorColumn(result.doctorsColumn.map((col)=>{
            return(
                col.Field.charAt(0).toUpperCase().replace("_"," ") 
                +
                col.Field.slice(1).replaceAll("_"," ")
            )
        }));
        setExportTable(result.exportTable)


        sendDoctors(result.doctors);




        
    }
    catch(err){
        console.log(err)
    }
}

useEffect(()=>{
    fetchDoctors() ;  

},[ doctorFormData]);



const createDoctor = async ()=>{

    try{
        await fetch(`${URL}/doctor/create`,{
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(docFormData)
    
        })



        setDoctorFormData({
        name: '' ,
        age:'',
        address:'',
        number:'',
        gender:'',
        department:'',
        experience:'',
        email:''
        })

     fetchDoctors();

     setNotifyDoctorCreate(true);

    }
    catch(err){
        console.log(err);

    }
}


const deleteDoctor = async (id)=>{

    try{
        await fetch(`${URL}/doctor/${id}`,{
            method:"DELETE"
        })

        fetchDoctors();
        setNotifyDoctorDelete(true)
    }
    catch(err){
        console.log(err)
    }

}

const updateDoctor = async()=> {

    try{

        await fetch(`${URL}/doctor`,{
            method:"PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...docFormData, editId})
        })


    setDoctorFormData({
        name: '' ,
        age:'',
        address:'',
        number:'',
        gender:'',
        department:'',
        experience:'',
        email:''
    })
    setEditId(null);

     fetchDoctors();

    }

    catch(err){

        console.log(err)
    }
}


const editHandle = (doc)=>{

    setDoctorFormData(doc)
     setEditId(doc.id)
     
    
}


const searchHandle = (e)=>{

  const {name,value} = e.target;
  setSearch({...search,[name]:value});
  

}

const searchPatient = ()=>{
  fetchDoctors();
}



    ////------------ Export ------------////  


const exportExcel = ()=>{

    if(!doctors.length){
        window.alert(" No data to export");

        return;
    }

    const workSheet = XLSX.utils.json_to_sheet(doctors);

    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet ( workBook, workSheet, "Doctors" );

    const excelBuffer = XLSX.write(workBook,{ bookType:"xlsx", type:"array"});

    const blob = new Blob([excelBuffer], { type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

    saveAs(blob, "Doctors.xlsx");

}

const exportPDF = () =>{

    if(!doctors.length){

        window.alert("No data found");

        return;
    }

    const doc = new jsPDF();

    doc.text("Doctors Report" , 14, 15);

    autoTable(doc,{
        startY:25,

        head: [doctorsColumn.map((col)=>col)],

        body: doctors.map((doctor)=>[
            doctor.id,
            doctor.name,
            doctor.age,
            doctor.address,
            doctor.gender,
            doctor.department,
            doctor.experience,
            doctor.email
        ])
    })


    doc.save( "Doctors_list.pdf")
}

const exportCSV = ()=>{

    if(!doctors.length){

        window.alert("No data found");

        return;
    }

    const headers = doctorsColumn.map(col=>col);

    const headerRow = headers.join(",");

    const dataRow = doctors.map((doctor)=>{

        return(
        [
            doctor.id,
            doctor.name,
            doctor.age,
            doctor.address,replaceAll(",", " "),
            doctor.gender,
            doctor.department,
            doctor.experience,
            doctor.number,
            doctor.email
        ].join(",")    )
    })

    const csvString = [headerRow, ...dataRow].join("\n");

    const blob = new Blob([csvString],{
        type: "text/csv;charset=utf-8;"
    })


    saveAs(blob,"Doctors.csv")
}


  const handleClick = (event)=>{
    setAnchorEl(event.currentTarget);
  };

  const handleClose = ()=>{
    setAnchorEl(null);
  };


  const importDataSubmit = async (data)=>{
    
    try {

        const importData = data.validData;

        console.log("valid data", importData)

        await fetch (`${URL}/doctor/import`, {
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({importData})
        })

        fetchDoctors();
    } 
    catch (error) {
        console.log(error)
        
    }

    
  }


const logout = async()=>{


    try{

      await fetch(`${URL}/logout`,{
            method:"POST",
            credentials:"include"
        });

        navigate('/');
        setNotifyLogout(true);
    }

    catch(err){

        console.log(err);
    }
}


  const fields = [
    {
        label:"Name",
        key:"name",
        alternateMatches:["name","Name"],
        fieldType:{type:"input"},
        validations:[{rule:"required", errorMessage:"invalid name format"}]
    },
    {
        label:"Age",
        key:"age",
        alternateMatches:["age","Age"],
        fieldType:{type:"input"},   
        validations:[{rule:"required", errorMessage:"invalid age format"}]
    },
    {
        label:"Address",
        key:"address",
        alternateMatches:["Address", "address"],
        fieldType:{type:"input"},
        validations:[{rule:"required", errorMessage:"invalid address format"}]
    },
    {
        label:"E-mail",
        key:"email",
        alternateMatches:["email", "E-mail"],
        fieldType:{type:"input"},
        validations:[{rule:"required", errorMessage:"invalid email format"}, {rule:"regex",value:"@", errorMessage:"invalid email format"}]
    },
    {
        label:"Number",
        key:"number",
        alternateMatches:["number","Number"],
        fieldType:{type:"input"},
        validations:[{rule:"required", errorMessage:"invalid number format"}]
    },
    {
        label:"Gender",
        key:"gender",
        alternateMatches:["gender"],
        fieldType:{type:"input"},
        validations:[{rule:"required", errorMessage:"invalid gender format"}]
    },
    {
        label:"Department",
        key:"department",
        alternateMatches:["dep","department"],
        fieldType:{type:"input"},
        validations:[{rule:"required", errorMessage:"invalid department format"}]
    },
    {
        label:"Experience",
        key:"experience",
        alternateMatches:["exp", "experience"],
        fieldType:{type:"input"},
        validations:[{rule:"required", errorMessage:"invalid experience format"}]
    }
  ]

  


    return(
    <>

    <Snackbar open={notifyDoctorCreate} 
    autoHideDuration={3000}
    onClose={()=>setNotifyDoctorCreate(false)}
    anchorOrigin={{vertical:"top", horizontal:"center"}}>
        <Alert variant='filled' severity='success' sx={{width:"300px", alignItems:"center",paddingLeft:"70px", fontSize:"16px"}}>Doctor Created Successfully</Alert>
    </Snackbar>

    <Snackbar open={notifyDoctorDelete} 
    autoHideDuration={3000}
    onClose={()=>setNotifyDoctorDelete(false)}
    anchorOrigin={{vertical:"top", horizontal:"center"}}>
        <Alert variant='filled' severity='error' sx={{width:"300px", alignItems:"center",paddingLeft:"70px", fontSize:"16px"}}>Doctor Deleted</Alert>
    </Snackbar>

    <ReactSpreadsheetImport 
    isOpen={importUI}
    onClose={()=>setImportUi(false)}
    onSubmit={importDataSubmit}
    fields={fields}
    />

     <Box   sx={{flexGrow: 1}}>
     <AppBar position='fixed' sx={{backgroundColor:"white"}}>

      <Toolbar>
      <Link to='/admin' > <Button variant="contained" color='info' sx={{marginRight:"20px"}} >Patients List</Button></Link>

      <Link to='/admin/doctor' ><Button variant="contained" color='info'> Doctors List</Button></Link>
      

    <div className="form_btn_group   ">

      <Button variant="contained" sx={{ position:"fixed", top:"15px", right:"325px"}}  color="warning" onClick={()=>{setDoctorPopup(true)}}> Add Doctors</Button>

      <Button variant="contained" sx={{ position:"fixed", top:"15px", right:"220px"}}  color="info" onClick={()=>{setImportUi(true)}}> Import</Button>

      <FormControl sx={{position:"fixed", top:"15px", right:'120px'}} >

        <Button variant='contained' color='primary' onClick={handleClick}>export</Button>

        <Menu anchorEl={anchorEl} open= {open} onClose={handleClose} >
            <MenuItem onClick={()=>{exportExcel(); handleClose()}}>As Excel</MenuItem>
            <MenuItem onClick={()=>{exportPDF(); handleClose()}}>As pdf</MenuItem>
            <MenuItem onClick={()=>{exportCSV(); handleClose()}}>As csv</MenuItem>
        </Menu>
      </FormControl>

        <Button variant='contained' sx={{ position:"fixed", top:"15px", right:"15px"}} color='error' onClick={logout}>logout</Button>

    </div>

      </Toolbar>

    </AppBar>
     </Box>



        <div className={doctorPopup ? "popup_form_show" : "popup_form_hide"}>
            
        <div className="popup_container">

            <h1>Doctors Entry Form</h1>

              <Button variant="contained" color="error" sx={{width:"20px", left:"500px", top:"-90px"}} onClick={()=>{setDoctorPopup(false)}}>X</Button>
            

            <FormControl>


            <Grid container spacing={3} >  

                <Grid item >
                <TextField value={docFormData.name} label="Name" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, name:e.target.value}))}}/>

                <br />

                <TextField value={docFormData.age} label="Age" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, age:e.target.value}))}}/>

                <br />

                <TextField value={docFormData.email} label="E-mail" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, email:e.target.value}))}}/>

                    <br />

                <TextField value={docFormData.address} label="Address" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, address:e.target.value}))}}/>




                </Grid>

                <Grid item>

                    <FormControl>
                <TextField value={docFormData.number} label="Number" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, number:e.target.value}))}}/>
                        <label>Gender</label> 
                        <RadioGroup row value={docFormData.gender} sx={{marginBottom:"8px"}}>
                            <FormControlLabel value='Male' label='Male' control={<Radio/>} onChange={(e)=>{setDoctorFormData(prev=>({...prev, gender:e.target.value}))}}/>
                            <FormControlLabel value='Female' label="Female" control={<Radio/>} onChange={(e)=>setDoctorFormData(prev=>({...prev, gender:e.target.value}))}/>
                            <FormControlLabel value='others' label="others" control={<Radio/>} onChange={(e)=>setDoctorFormData(prev=>({...prev, gender:e.target.value}))}/>
                        </RadioGroup>
                    </FormControl>
                    <br />



                    <FormControl>
                        <InputLabel >Department</InputLabel>

                        <Select value={docFormData.department} label='Department' sx={{width:"260px"}} onChange={(e)=>{ setDoctorFormData(prev=>({...prev, department:e.target.value}))}}>
                            <MenuItem value="Cardiology">Cardiology</MenuItem>
                            <MenuItem value="Dermatology">Dermatology</MenuItem>
                            <MenuItem value="Endocrinology">Endocrinology</MenuItem>
                            <MenuItem value="Neurology">Neurology</MenuItem>
                            <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                            <MenuItem value="Hematology">Hematology</MenuItem>
                            <MenuItem value="Pulmonology">Pulmonology</MenuItem>
                        </Select>
                    </FormControl>

                    <br />

                    <br />

                    <FormControl>
                        <InputLabel >Experience</InputLabel>

                        <Select value={docFormData.experience} label='Experience' sx={{width:"260px"}} onChange={(e)=>setDoctorFormData(prev=>({...prev, experience:e.target.value}))}>
                            <MenuItem value="0-1 Years">0-1 Years</MenuItem>
                            <MenuItem value="2-3 Years">2-3 Years</MenuItem>
                            <MenuItem value="3-5 Years">3-5 years</MenuItem>
                            <MenuItem value="5-10 Years">5-10 Years</MenuItem>
                            <MenuItem value="10-20 Years">10-20 Years</MenuItem>
                            <MenuItem value="20+ Years">20+ years</MenuItem>
                        </Select>
                    </FormControl>

                    <br />

                    
                </Grid>

            </Grid>


        { editId ? 
        <Button variant='contained' color='info' onClick={()=>{updateDoctor(); setDoctorPopup(false)}}>Update</Button>
            :
            <Button variant='contained' color='info' onClick={()=>{createDoctor(); setDoctorPopup(false)}}>Create</Button>
    }
                
            </FormControl>
        </div>

        </div>



        <div className="container-list">

        <Paper sx={{width:"auto", margin:'100px auto'}}>

            <h1>DOCTORS  LIST</h1>

          <Accordion sx={{border:"1px solid gray", marginBottom:"20px"}}>
            <AccordionSummary sx={{fontSize:"16px"}} expandIcon={<ExpandMoreIcon/>} > Search</AccordionSummary>
            <AccordionDetails>

      <Grid container spacing={2}>


        <Grid item> <TextField value={search.name} name="name" label="Name" sx={{width:"200px"}} onChange={searchHandle}/> </Grid> 
        <Grid item> <TextField value={search.age} name ="age" label="Age" sx={{width:"200px"}} onChange={searchHandle}/> </Grid> 
        <Grid item> <TextField value={search.address} name="address" label="Address" sx={{width:"200px"}} onChange={searchHandle}/> </Grid> 
        <Grid item> <TextField value={search.number} name="number" label="Number" sx={{width:"200px"}} onChange={searchHandle}/> </Grid> 

        <Grid item> 
          <FormControl>
            <InputLabel>Gender</InputLabel>
            <Select value={search.gender} label="gender" name="gender" onChange={searchHandle} sx={{marginBottom:"20px", width:"200px"}}>
              <MenuItem value="" >All</MenuItem>
              <MenuItem value="Male" >Male</MenuItem>
              <MenuItem value="Female" >Female</MenuItem>
              <MenuItem value="Other" >Others</MenuItem>
            </Select>
          </FormControl>
        </Grid> 



                    <FormControl>
                        <InputLabel >Department</InputLabel>

                        <Select value={search.department} label='Department' name='department' sx={{width:"200px"}} onChange={searchHandle}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Cardiology">Cardiology</MenuItem>
                            <MenuItem value="Dermatology">Dermatology</MenuItem>
                            <MenuItem value="Endocrinology">Endocrinology</MenuItem>
                            <MenuItem value="Neurology">Neurology</MenuItem>
                            <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                            <MenuItem value="Hematology">Hematology</MenuItem>
                            <MenuItem value="Pulmonology">Pulmonology</MenuItem>
                        </Select>
                    </FormControl>

                    <br />

                    <br />

                    <FormControl>
                        <InputLabel >Experience</InputLabel>

                        <Select value={search.experience} label='Experience' name="experience" sx={{width:"200px"}} onChange={searchHandle}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="0-1 Years">0-1 Years</MenuItem>
                            <MenuItem value="2-3 Years">2-3 Years</MenuItem>
                            <MenuItem value="3-5 Years">3-5 years</MenuItem>
                            <MenuItem value="5-10 Years">5-10 Years</MenuItem>
                            <MenuItem value="10-20 Years">10-20 Years</MenuItem>
                            <MenuItem value="20+ Years">20+ years</MenuItem>
                        </Select>
                    </FormControl>


        <Grid item> <Button variant="contained" color="primary" sx={{marginTop:"10px"}} onClick={searchPatient}>Search</Button> </Grid>
 

      </Grid>
            </AccordionDetails>
          </Accordion>


        <TableContainer component={Paper}>
        <Table >
          <TableHead sx={{border:'1px solid black'}}>
            <TableRow>

                {doctorsColumn.slice(1).map((col,index)=>{
                    return(
                        <TableCell key={index} sx={{borderBottom:"1px solid black", fontWeight:"bold"}}>{col}</TableCell>
                    )
                })}

            </TableRow>
          </TableHead>

          <TableBody sx={{border:'1px solid black'}}>
            {doctors.map((doc)=>{
              return(
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.age}</TableCell>
                <TableCell>{doc.address}</TableCell>
                <TableCell>{doc.number}</TableCell>
                <TableCell>{doc.gender}</TableCell>
                <TableCell>{doc.department}</TableCell>
                <TableCell>{doc.experience}</TableCell>
                <TableCell>{doc.email}</TableCell>

                 <TableCell><Button variant="contained" color="error" onClick={()=>{deleteDoctor(doc.id)}}><DeleteIcon/></Button></TableCell>
                <TableCell><Button variant="contained" color="info"onClick={()=>{editHandle(doc); setDoctorPopup(true)}}>Edit</Button></TableCell>
              </TableRow>

              )
            })}
          </TableBody>
        </Table>

        </TableContainer>


        </Paper>


        </div>


        </>
    )


}

export default Doctor;