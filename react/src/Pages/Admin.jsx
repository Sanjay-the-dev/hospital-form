import { Link , Route,Routes} from "react-router-dom";

import Doctorpage from '../components/Doctor';
import PatientsPage from '../components/patients';
import UsersManage from "../components/UsersManage";



function Admin (){


    return(

        <>
            <Routes>
                <Route  path="/" element={<PatientsPage/>}/>
                <Route path="/doctor"  element={<Doctorpage/>}/>
                <Route path="/usersmanage" element={<UsersManage/>}/>
            </Routes>
            

        </>
    )
}

export default Admin;