import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './page/Home';
import Login from './page/Login';
import Signup from './page/Signup';
import SupHome from './page/Supplier/SupHome';
import Appointment from './page/Supplier/Appointment';
import PriceLevel from './page/Supplier/PriceLevel';
import Spayments from './page/Supplier/Spayments';
import CusHome from './page/Customer/CusHome';
import Orders from './page/Customer/Orders';
import Cpayments from './page/Customer/Cpayments';
import BmanagerHome from './page/BranchManager/BmanagerHome';
import AppointmentReview from './page/BranchManager/AppointmentReview';
import Supply from './page/BranchManager/Supply';
import Cpassword from './page/ANavBar/Cpassword';
import AdminHome from './page/Admin/AdminHome';
import SupRegister from './page/BranchManager/SupRegister';
import CusRegister from './page/Admin/CusRegister';
import ManagerRegister from './page/Admin/ManagerRegister';


function App() {
  return (
    <div className="App">
  <BrowserRouter>
<Routes>
<Route path='/' element={<Home/>}></Route>
<Route path='/login' element={<Login/>}></Route>
<Route path='/cpassword' element={<Cpassword/>}></Route>
<Route path='/signup' element={<Signup/>}></Route>
<Route path='/suphome' element={<SupHome/>}></Route>
<Route path='/appointment' element={<Appointment/>}></Route>
<Route path='/pricelevel' element={<PriceLevel/>}></Route>
<Route path='/spayments' element={<Spayments/>}></Route>
<Route path='/cushome' element={<CusHome/>}></Route>
<Route path='/cpayments' element={<Cpayments/>}></Route>
<Route path='/orders' element={<Orders/>}></Route>
<Route path='/bmanagerhome' element={<BmanagerHome/>}></Route>
<Route path='/appointmentreview' element={<AppointmentReview/>}></Route>
<Route path='/supply' element={<Supply/>}></Route>
<Route path='/adminhome' element={<AdminHome/>}></Route>
<Route path='/SupRegister' element={<SupRegister/>}></Route>
<Route path='/CusRegister' element={<CusRegister/>}></Route>
<Route path='/ManagerRegister' element={<ManagerRegister/>}></Route>

</Routes>


  </BrowserRouter>
    </div>
  );
}

export default App;
