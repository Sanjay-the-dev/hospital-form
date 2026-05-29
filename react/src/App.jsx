import {Link, Route,Routes} from 'react-router-dom';
import {Alert, Snackbar} from '@mui/material'

import Admin from './Pages/Admin';
import LoginPage from './Pages/Login';
import Receptionist from './Pages/receptionist';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './Pages/NotFound';
import LogoutCheck from './components/LogoutCheck';
import { useState, useContext, createContext } from 'react';


export const authContext = createContext();

function App(){
  

  const [notifyLogin, setNotifyLogin] = useState(false);
  const [notifyLogout, setNotifyLogout] = useState(false);
 


  return(

    <>

    <Snackbar open={notifyLogin} 
    autoHideDuration={3000}
    onClose={()=>setNotifyLogin(false)}
    anchorOrigin={{vertical:"top", horizontal:"center"}}>

    <Alert variant='filled' severity='success' sx={{width:"250px", justifyContent:"center", alignContent:"center", fontSize:"16px"}}>Login Successful</Alert>
    </Snackbar>

    <Snackbar open={notifyLogout} 
    autoHideDuration={3000}
    onClose={()=>setNotifyLogout(false)}
    anchorOrigin={{vertical:"top", horizontal:"center"}}>

    <Alert variant='filled' severity='error' sx={{width:"250px", justifyContent:"center", alignContent:"center", fontSize:"16px"}}>Logout Successful</Alert>
    </Snackbar>

    <authContext.Provider value={{setNotifyLogin, setNotifyLogout}} > 

    <Routes>

      <Route path='/' element={<LogoutCheck > <LoginPage/></LogoutCheck>} />
      <Route path='*' element={<NotFound/>} />
      <Route path='/receptionist/*' element={<NotFound/>} />

      <Route path='/admin/*' element={<ProtectedRoute role="admin"><Admin/></ProtectedRoute>} />

      <Route path='/receptionist' element={<ProtectedRoute role="receptionist"><Receptionist/></ProtectedRoute>}/>


    </Routes>

    </authContext.Provider>
    </>
  )


}

export default App;



