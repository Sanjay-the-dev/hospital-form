import {Link, Route,Routes} from 'react-router-dom';


import Admin from './Pages/Admin';
import LoginPage from './Pages/Login';
import Receptionist from './Pages/receptionist';
import ProtectedRoute from './components/ProtectedRoute';

function App(){
 


  return(

    <>

    <Routes>

      <Route path='/' element={<LoginPage/>} />
      <Route path='/admin/*' element={<ProtectedRoute role="admin"><Admin/></ProtectedRoute>} />

      <Route path='/receptionist' element={<ProtectedRoute role="receptionist"><Receptionist/></ProtectedRoute>}/>


    </Routes>

    </>
  )


}

export default App;


