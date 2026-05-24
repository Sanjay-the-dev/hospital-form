import { useState,useEffect } from "react";
import { Link, useFetchers, useNavigate } from "react-router-dom";
import {Button,Grid,InputLabel,TextField,FormControl,FormControlLabel,Menu,Radio,RadioGroup,Select,MenuItem} from '@mui/material';
import {Table,TableContainer,TableHead,TableBody,TableRow,TableCell,Paper,TablePagination} from '@mui/material';
import { Box, AppBar,Typography,Toolbar,Accordion,AccordionDetails,AccordionSummary} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {ReactSpreadsheetImport} from 'react-spreadsheet-import';
import DeleteIcon from '@mui/icons-material/Delete';


import jsPDF from 'jspdf' ;
import  autoTable  from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

import Doctor_add from "./Doctor";

function Patients(){


  const URL = 'http://localhost:5000';

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    
  
  const [importUi, setImportUi]= useState(false)

  const[patients,setPatients] = useState([]);
  const[patientsColumn, setPatientsColumn] = useState([])
  const [doctors , setDoctors] = useState([]);

  const[exportTable, setExportTable] = useState([]);

  const [doctorFormData, setDoctorFormData] = useState({
    name: '',
    age: '',
    address: '',
    number: '',
   gender: '',
   department: '',
    experience: '',
    email:''
});


  const [createDoctorFn, setCreateDoctorFn] = useState(null);
  const [doctorPopup, setDoctorPopup ] = useState (false);
  const [patientsPopup, setPatientsPopup] = useState(false);
  

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address , setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [gender, setGender] = useState('');
  const [blood, setBlood] = useState('');
  const [doctorName , setDoctorName] = useState('')
  const [editId,setEditId] = useState(null);

  const [page,setPage] = useState(0);
  const [rowPerPage,setRowPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);

  const [search,setSearch] = useState({
    name:'',
    age:'',
    address:'',
    number:'',
    gender:'',
    blood:''
  })




const userFetch = async()=>{

  try{
    const res = await fetch(`${URL}/patient`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({search,page, rowPerPage})
    });
    const result = await res.json();

     setPatients(result.data);
     setTotalPage(result.total);
     setExportTable(result.exportTable);

     setPatientsColumn(result.patientsColumn.map((col)=>{
      return(   
      col.Field.charAt(0).toUpperCase().replaceAll("_"," ") 
      +
       col.Field.slice(1).replaceAll("_"," ") 
      )
    }))

/*      setDoctors(result.doctors);
 */

  } 
  catch(err){
    console.log(err)
  }
}

useEffect(()=>{userFetch()},[page,rowPerPage]);




const createPatient = async()=>{
  
  try{
    await fetch(`${URL}/patients`,{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({name,age,address,number,gender,blood})
      
    });
    
    console.log("post methond 88888")
     setName("");
     setAge("");
     setAddress("");
     setNumber("");
     setGender("");
     setBlood(""); 


     userFetch();

  }
  catch(err){
    console.log(err)
  }

}



const deletePatient = async(id)=>{

  try{
    await fetch(`${URL}/patient/${id}`,{
      method:"DELETE"  
    })

    userFetch();
  }
  catch(err)
  {
    console.log(err)
  }
}


const updatePatient = async()=>{
  
    try{
     await fetch(`${URL}/patient`,{
      method:'PUT',
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({name,age,address,number,gender,blood,editId})
      
     });

     setName("");
     setAge("");
     setAddress("");
     setNumber("");
     setGender("");
     setBlood(""); 

     setEditId(null);

     userFetch();

  }
  catch(err){
    console.log(err)
  }

}


const editHandle = (patient)=>{

    setName(patient.name);
     setAge(patient.age);
     setAddress(patient.address);
     setNumber(patient.number);
     setGender(patient.gender);
     setBlood(patient.blood_group); 

     setEditId(patient.id)
}


const searchHandle = (e)=>{

  const {name,value} = e.target;
  setSearch({...search,[name]:value});
  

}

const searchPatient = ()=>{
  userFetch();
}






const createDoctor = async ()=>{

    try{
        await fetch(`${URL}/doctor`,{
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(doctorFormData)
    
        })


        setDoctorName(doctorFormData.name)

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

    }
    catch(err){
        console.log(err);

    }
}




    ////------------ Export ------------////  


const exportExcel = ()=>{

    if(!exportTable.length){
        window.alert(" No data to export");

        return;
    }

    const workSheet = XLSX.utils.json_to_sheet(exportTable);

    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet ( workBook, workSheet, "exportTable" );

    const excelBuffer = XLSX.write(workBook,{ bookType:"xlsx", type:"array"});

    const blob = new Blob([excelBuffer], { type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

    saveAs(blob, "exportTable.xlsx");

}

const exportPDF = () =>{

    if(!exportTable.length){

        window.alert("No data found");

        return;
    }

    const doc = new jsPDF();

    doc.text("Export Table Report" , 14, 15);

    autoTable(doc,{
        startY:25,

        head: [patientsColumn.map((col)=>col)],

        body: exportTable.map((doctor)=>[
            doctor.id,
            doctor.name,
            doctor.age,
            doctor.address,
            doctor.gender,
            doctor.number,
            doctor.blood_group
        ])
    })


    doc.save( "Patients_list.pdf")
}

const exportCSV = ()=>{

    if(!exportTable.length){

        window.alert("No data found");

        return;
    }

    const headers = patientsColumn.map(col=>col);

    const headerRow = headers.join(",");

    const dataRow = exportTable.map((doctor)=>{

        return(
        [
            doctor.id,
            doctor.name,
            doctor.age,
            doctor.address.replaceAll(",", " "),
            doctor.gender,
            doctor.number,
            doctor.blood_group
        ].join(",")    )
    })

    const csvString = [headerRow, ...dataRow].join("\n");

    const blob = new Blob([csvString],{
        type: "text/csv;charset=utf-8;"
    })


    saveAs(blob,"Patients.csv")
}


  const handleClick = (event)=>{
    setAnchorEl(event.currentTarget);
  };

  const handleClose = ()=>{
    setAnchorEl(null);
  };


const importDataSubmit = async (data)=>{
  
  const importData = data.validData
  console.log("validated data ", importData);
  try {
    await fetch(`${URL}/patients/import`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({importData})
    })

      userFetch(); 
  } 
  catch (error) {
    console.log(error)
  }
  setImportUi(false)
}


const logout = async()=>{


    try{

      await fetch(`${URL}/logout`,{
            method:"POST",
            credentials:"include"
        });

        navigate('/');
    }

    catch(err){

        console.log(err);
    }
}

const fields = [

  {
    label: "Name",
    key: "name",
    alternateMatches: ["name", "Name"],
    fieldType: { type: "input" },
    validations: [{ rule: "required",  errorMessage: "Invalid name format" }]
  },
  {
    label: "Age",
    key: "age",
    alternateMatches: ["age", "Age"],
    fieldType: { type: "input" },
    validations: [{ rule: "required", errorMessage: "Invalid age format" }]
  },
  {
    label: "Address",
    key: "address",
    alternateMatches: ["address", "Address"],
    fieldType: { type: "input" },
    validations: [{ rule: "required", errorMessage: "Invalid address format" }]
  },
  {
    label: "Number",
    key: "number",
    alternateMatches: ["number", "Number"],
    fieldType: { type: "input" },
    validations: [{ rule: "required", errorMessage: "Invalid number format" }]
  },
  {
    label: "Gender",
    key: "gender",
    alternateMatches: ["gender", "Gender"],
    fieldType: { type: "input" },
    validations: [{ rule: "required", errorMessage: "Invalid gender format" }]
  },
  {
    label: "Blood Group",
    key: "blood",
    alternateMatches: ["blood group", "bloodgroup", "Blood Group", "Blood group"],
    fieldType: { type: "input" },
    validations: [{ rule: "required", errorMessage: "Invalid blood group format" }]
  },
];





return(
  <  >

 
      <ReactSpreadsheetImport
        isOpen={importUi}
        onClose={()=>setImportUi(false)}
        onSubmit={importDataSubmit}
        fields={fields}
      />

 {/* nav bar  */}
    <Box   sx={{flexGrow: 1}}>
    <AppBar position='fixed' sx={{backgroundColor:"white"}}>

      <Toolbar>
      <Link to='/admin'> <Button variant="contained" color='info' sx={{marginRight:"20px"}} >Patients List</Button></Link>

      <Link to='/admin/doctor'><Button variant="contained" color='info'> Doctors List</Button></Link>
  
    <div className="form_btn_group   page_margin">

      <Button variant="contained" sx={{ position:"fixed", top:"15px", right:"325px"}}  color="warning" onClick={()=>{setPatientsPopup(true)}}> Add Patient</Button>

      <Button variant="contained" sx={{ position:"fixed", top:"15px", right:"220px"}}  color="primary" onClick={()=>{setImportUi(true)}}>Import</Button>

      <FormControl sx={{position:"fixed", top:"15px", right:'120px'}} >

        <Button variant='contained' color='primary' onClick={handleClick}>Export</Button>

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





 {/* patient form  */}

    <div   className={patientsPopup ? "popup_form_show" : "popup_form_hide"}>

  <div className="popup_container">
    
    <h1>Hospital Patients Entry Form</h1>

    <FormControl>
       
      <Button variant="contained" color="error" sx={{width:"20px", left:"540px", top:"-70px"}} onClick={()=>{setPatientsPopup(false)}}>X</Button>

      <Grid  container direction="row" spacing={5} rowSpacing={1}> 



        <Grid item>
         <TextField value={name} label='Enter Name' sx={{marginBottom:"20px", width:"270px"}} onChange={(e)=>{setName(e.target.value)}}/>
        </Grid>

        <Grid item>
          <TextField value={address} label="Address" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{ setAddress(e.target.value)}}/>
        </Grid>


        <Grid item>
          <TextField value={age} type="number" label = 'Enter Age' sx={{marginBottom:"20px", width:"270px"}} onChange={(e)=>{setAge(e.target.value)}}/>
        </Grid>



        <Grid item>
         <TextField value={number} type="number" label="Number" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{ setNumber(e.target.value)}}/> 
        </Grid>

        <Grid item>
          <FormControl >
            <label > Gender</label>
            <RadioGroup row value={gender} sx={{marginBottom:"20px"}} >
          <FormControlLabel value= "Male" label="Male" control={<Radio/>} onChange={(e)=>{setGender(e.target.value)}}/>
          <FormControlLabel value= "Female" label = "Female" control={<Radio/>} onChange={(e)=>{setGender(e.target.value)}}/>
          <FormControlLabel value= "Other" label="Other" control={<Radio/>} onChange={(e)=>{setGender(e.target.value)}}/>
            </RadioGroup>
          </FormControl>

        </Grid>

        <Grid item>
          <FormControl>
            <InputLabel>Blood Group</InputLabel>
            <Select value={blood} label="Blood Group" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setBlood(e.target.value)}}>
          <MenuItem value="A+">A+</MenuItem>
          <MenuItem value="B+">B+</MenuItem>
          <MenuItem value="O+">O+</MenuItem>
          <MenuItem value="AB+">AB+</MenuItem>
          <MenuItem value="A-">A-</MenuItem>
          <MenuItem value="B-">B-</MenuItem>
          <MenuItem value="O-">O-</MenuItem>
          <MenuItem value="AB-">AB-</MenuItem>
            </Select>
          </FormControl>
        </Grid>


        <Grid >

          {editId ?     
                  <Button variant="contained" color="warning"  onClick={()=>{updatePatient(); setPatientsPopup(false)}}  sx=  {{width:"250px"  , margin:'10px 0px 0px 10px'} }>Update</Button>
                  :
                  <Button variant="contained" color="info"  onClick={()=>{createPatient();  setPatientsPopup(false) }}  sx= {{width:"250px"  , margin:'10px 0px 0px 10px'} }>Create</Button>
                }

        </Grid>

        <Grid item> 
          <FormControl>

            <InputLabel> Doctors</InputLabel>
            <Select value={doctorName} label ="doctors" sx={{marginBottom:"20px",marginRight:"30px", width:"180px"}} onChange={(e)=>   {setDoctorName(e.target.value)}}>
              {doctors.map((doc)=>{
                return(
                  <MenuItem key={doc.id} value={doc.name}>{doc.name}</MenuItem>
                )
              })}
            </Select>
          </FormControl>
 
        <Button variant="contained" color="warning" sx={{marginTop:"10px"}} onClick={()=>{setDoctorPopup(true)}}>+</Button>
          </Grid>

      </Grid>
        


    
    </FormControl>

  </div>

      </div>


  {/* Patient LISt   */}


  <div className="container-list">


    <Paper sx={{width:"850px", margin:"auto",marginTop:"100px"}}>

        <h1>PATIENTS LIST</h1>


          <Accordion sx={{border:"1px solid gray", marginBottom:"20px"}}>
            <AccordionSummary sx={{fontSize:"16px"}} expandIcon={<ExpandMoreIcon/>} > Search</AccordionSummary>
            <AccordionDetails>

      <Grid container spacing={2}>


        <Grid item> <TextField value={search.name} name="name" label="Name" onChange={searchHandle}/> </Grid> 
        <Grid item> <TextField value={search.age} sx={{width:"200px"}} name ="age" label="Age" onChange={searchHandle}/> </Grid> 
        <Grid item> <TextField value={search.address} name="address" label="Address" onChange={searchHandle}/> </Grid> 
        <Grid item> <TextField value={search.number} name="number" label="Number" onChange={searchHandle}/> </Grid> 

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



        <Grid item> 
          <FormControl>
            <InputLabel>Blood Group</InputLabel>
            <Select value={search.blood} label="blood gorupt" name="blood" onChange={searchHandle} sx={{marginBottom:"20px", width:"200px"}}>
              <MenuItem value="" >All</MenuItem>
             <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
             <MenuItem value="AB+">AB+</MenuItem>
             <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
            </Select>
          </FormControl>
        </Grid> 

        <Grid item> <Button variant="contained" color="primary" sx={{marginTop:"10px"}} onClick={searchPatient}>Search</Button> </Grid>
 

      </Grid>
            </AccordionDetails> 
          </Accordion>

      <TableContainer component={Paper}>
        <Table  sx={{tableLayout:""}} >
          <TableHead sx={{border:'1px solid black'}}>

            <TableRow>
             { patientsColumn.slice(1).map((col,index)=>
                 
                    col == "Blood group" ?
                      <TableCell key={index} sx={{borderBottom:'1px solid black', fontWeight:"bold", width:"120px"}}>{col}</TableCell>
                    :
                      <TableCell key={index} sx={{borderBottom:'1px solid black', fontWeight:"bold"}}>{col}</TableCell>


                  )}

            </TableRow>
          </TableHead>

          <TableBody sx={{border:'1px solid black'}}>
            {patients.map((patient)=>{
              return(
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.address}</TableCell>
                <TableCell>{patient.number}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.blood_group}</TableCell>

                <TableCell><Button variant="contained" color="error" onClick={()=>{deletePatient(patient.id)}}><DeleteIcon/></Button></TableCell>
                <TableCell><Button variant="contained" color="info"onClick={()=>{editHandle(patient); setPatientsPopup(true)}}>Edit</Button></TableCell>
              </TableRow>

              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
       rowsPerPageOptions={[5,10,25]}
       component='div'
       count={totalPage}
       page={page}
       rowsPerPage={rowPerPage}
       onPageChange={(e,page)=>{setPage(page)}}
       onRowsPerPageChange={(e)=>{setRowPerPage(e.target.value),setPage(0)}}
       />

    </Paper>
    
  </div>




 {/* doctor props  */}

        <div className="popup_form_hide"> 

          <Doctor_add sendDoctors={setDoctors} doctorFormData={doctorFormData}/>
        </div>


 {/* doctor create form  */}
            <div  className= {doctorPopup ? "popup_form_show" : "popup_form_hide"}>


            <div className="popup_container">


              <Button variant="contained" color="error" className="popup_btn" onClick={()=>{setDoctorPopup(false)}}>X</Button>

    
                <h1>Doctors Entry Form</h1>
    
                <FormControl>
    
    
                <Grid container spacing={3} >  
    
                    <Grid item >
                          <TextField value={doctorFormData.name} label="Name" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, name:e.target.value}))}}/>
    
                    <br />
    
                    <TextField value={doctorFormData.age} label="Age" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, age:e.target.value}))}}/>
    
                    <br />
    
                    <TextField value={doctorFormData.email} type="email" label="E-mail" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, email:e.target.value}))}}/>
    
                        <br />
                    <TextField value={doctorFormData.address} label="Address" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, address:e.target.value}))}}/>
    
                  
    
                    </Grid>
    
                    <Grid item>

                    <TextField value={doctorFormData.number} label="Number" sx={{marginBottom:"20px", width:"250px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, number:e.target.value}))}}/>
    <br />                      
    
                        <FormControl>
                            <label>Gender</label> 
                            <RadioGroup row value={doctorFormData.gender} sx={{marginBottom:"8px"}}>
                                <FormControlLabel value='Male' label='Male' control={<Radio/>} onChange={(e)=>{setDoctorFormData(prev=>({...prev, gender:e.target.value}))}}/>
                                <FormControlLabel value='Female' label="Female" control={<Radio/>} onChange={(e)=>{setDoctorFormData(prev=>({...prev, gender:e.target.value}))}}/>
                                <FormControlLabel value='others' label="others" control={<Radio/>} onChange={(e)=>{setDoctorFormData(prev=>({...prev, gender:e.target.value}))}}/>
                            </RadioGroup>
                        </FormControl>
    
                        <br />
    
                        <FormControl>
                            <InputLabel >Department</InputLabel>
    
                            <Select value={doctorFormData.department} label='Department' sx={{width:"260px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, department:e.target.value}))}}>
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
    
                            <Select value={doctorFormData.experience} label='Experience' sx={{width:"260px"}} onChange={(e)=>{setDoctorFormData(prev=>({...prev, experience:e.target.value}))}}>
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

    

                <Button variant='contained' color='info' onClick={()=>{ createDoctor(); setDoctorPopup(false), userFetch(); }}>create</Button>
      
                </FormControl>
            </div>

          </div>





  </>
)


}

export default Patients;