import { Link , Route,Routes} from "react-router-dom";

import Doctorpage from '../components/Doctor';
import PatientsPage from '../components/patients';



function Admin (){


    return(

        <>
            <Routes>
                <Route  path="/" element={<PatientsPage/>}/>
                <Route path="/doctor"  element={<Doctorpage/>}/>
            </Routes>
            

        </>
    )
}

export default Admin;