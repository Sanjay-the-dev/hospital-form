
import {Box,Button, Typography} from "@mui/material"
import { useNavigate } from "react-router-dom";


function NotFound (){

    const navigate = useNavigate();


    return(

        <>

        <Box sx={{ position:"absolute", top:"20%", left:"30%", alignItems:"center" ,width:"600px" , height:"300px",}}>

        <Typography variant="h1"  sx={{textAlign:"start"}} >404</Typography>
        <Typography variant="h3" sx={{textAlign:"start"}} >OOPS! PAGE NOT FOUND</Typography>
        <Typography variant="h5" sx={{}} >The Page you are looking for is not found</Typography>
        <br />
        <Button variant="contained" sx={{marginLeft:"10px"}} color="info" onClick={()=>navigate(-1)} >Go Back</Button>
        </Box>
        </>
    )


}



export default NotFound;