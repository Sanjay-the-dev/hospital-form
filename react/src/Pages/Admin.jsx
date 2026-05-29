import { Link , Route,Routes} from "react-router-dom";

import Doctorpage from '../components/Doctor';
import PatientsPage from '../components/patients';
import UsersManage from "../components/UsersManage";
import NotFound from "./NotFound";



function Admin (){


    return(

        <>
            <Routes>
                <Route  path="/" element={<PatientsPage/>}/>
                <Route path="/doctor"  element={<Doctorpage/>}/>
                <Route path="/usersmanage" element={<UsersManage/>}/>
                <Route  path="*" element={<NotFound/>}/>
{/*                 <Route path="/doctor/*" element={<NotFound/>}/>
                <Route path="/usersmanage/*" element={<NotFound/>}/> */}

            </Routes>
            

        </>
    )
}

export default Admin;