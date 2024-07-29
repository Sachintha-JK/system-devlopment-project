import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Login from './page/Login';
import Who from './page/Who';
import ProductChart from './page/ProductChart';
import Cpassword from './page/Cpassword';
import SupHome from './page/Supplier/SupHome';
import Appointment from './page/Supplier/Appointment';
import PriceLevel from './page/Supplier/PriceLevel';
import Spayments from './page/Supplier/Spayments';
import CusHome from './page/Customer/CusHome';
import Orders from './page/Customer/Orders';
import Cpayments from './page/Customer/Cpayments';
import PendingOC from './page/Customer/PendingOrder';
import BmanagerHome from './page/BranchManager/BmanagerHome';
import BranchStock from './page/BranchManager/BranchStock';
import AppointmentBM from './page/BranchManager/AppointmentBM';
import Supply from './page/BranchManager/Supply';
import AdminHome from './page/Admin/AdminHome';
import SupRegister from './page/BranchManager/SupRegister';
import CusRegister from './page/Admin/CusRegister';
import ManagerRegister from './page/Admin/ManagerRegister';
import AviewSupplier from './page/Admin/AviewSupplier';
import SpaymentView from './page/Admin/SpaymentView';
import CpaymentView from './page/Admin/CpaymentView';
import OrderView from './page/Admin/OrderView';
import Stock from './page/Admin/Stock';
import PendingOrder from './page/Admin/PendingOrder'; 
import ImageSpice from './page/Admin/ImageSpice';
import AppointmentA from './page/Admin/AppointmentA';
 
//********************************** */

function AdminAuth({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = user ? user.User_Type : null;

  useEffect(() => {
    console.log(user,userType)
    if (!user || userType !== 'Admin') {
      navigate('/'); 
    }
  }, [user, userType, navigate]);

  return user && userType == 'Admin' ? children : null; 
}

//******************************* */

function BranchManagerAuth({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = user ? user.User_Type : null;

  useEffect(() => {
    console.log(user,userType)
    if (!user || userType !== 'Branch Manager') {
      navigate('/'); 
    }
  }, [user, userType, navigate]);

  return user && (userType == 'Admin'|| userType == 'Branch Manager' )? children : null;
}
//********************************* */
function CustomerAuth({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = user ? user.User_Type : null;

  useEffect(() => {
    console.log(user,userType)
    if (!user || userType !== 'Customer') {
      navigate('/'); 
    }
  }, [user, userType, navigate]);

  return user && (userType == 'Customer' )? children : null;
}
//************************************* */
function SupplierAuth({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = user ? user.User_Type : null;

  useEffect(() => {
    console.log(user,userType)
    if (!user || userType !== 'Supplier') {
      navigate('/'); 
    }
  }, [user, userType, navigate]);

  return user && (userType == 'Supplier' )? children : null;
}

//*********************************** */


function App() {
  return (
    <div className="App">
  <BrowserRouter>
<Routes>

<Route path='/adminhome' element={<AdminAuth><AdminHome /></AdminAuth>}></Route>


<Route path='/' element={<Home/>}></Route>
<Route path='/login' element={<Login/>}></Route>
<Route path='/logout' element={<Login/>}></Route>


<Route path='/who' element={<Who/>}></Route>
<Route path='/productchart' element={<ProductChart/>}></Route>
<Route path='/cpassword' element={<Cpassword/>}></Route>

<Route path='/suphome' element={<SupplierAuth><SupHome/></SupplierAuth>}></Route>
<Route path='/appointment' element={<SupplierAuth><Appointment/></SupplierAuth>}></Route>
<Route path='/spayments' element={<SupplierAuth><Spayments/></SupplierAuth>}></Route>
<Route path='/pricelevel' element={<SupplierAuth><PriceLevel/></SupplierAuth>}></Route>


<Route path='/cushome' element={<CustomerAuth><CusHome/></CustomerAuth>}></Route>
<Route path='/cpayments' element={<CustomerAuth><Cpayments/></CustomerAuth>}></Route>
<Route path='/orders' element={<CustomerAuth><Orders/></CustomerAuth>}></Route>
<Route path='/pendingoc' element={<CustomerAuth><PendingOC/></CustomerAuth>}></Route>

<Route path='/bmanagerhome' element={<BranchManagerAuth><BmanagerHome/></BranchManagerAuth>}></Route>
<Route path='/supply' element={<BranchManagerAuth><Supply/></BranchManagerAuth>}></Route>
<Route path='/SupRegister' element={<BranchManagerAuth><SupRegister/></BranchManagerAuth>}></Route>
<Route path='/appointmentbm' element={<BranchManagerAuth><AppointmentBM/></BranchManagerAuth>}></Route>
<Route path='/branchstock' element={<BranchManagerAuth><BranchStock/></BranchManagerAuth>}></Route>


<Route path='/CusRegister' element={<AdminAuth><CusRegister/></AdminAuth>}></Route>
<Route path='/ManagerRegister' element={<AdminAuth><ManagerRegister/></AdminAuth>}></Route>
<Route path='/aviewsupplier' element={<AdminAuth><AviewSupplier/></AdminAuth>}></Route>
<Route path='/spaymentview' element={<AdminAuth><SpaymentView/></AdminAuth>}></Route>
<Route path='/cpaymentview' element={<AdminAuth><CpaymentView/></AdminAuth>}></Route>
<Route path='/orderview' element={<AdminAuth><OrderView/></AdminAuth>}></Route>
<Route path='/stock' element={<AdminAuth><Stock/></AdminAuth>}></Route>
<Route path='/pending' element={<AdminAuth><PendingOrder/></AdminAuth>}></Route>
<Route path='/adminhome' element={<AdminAuth><AdminHome/></AdminAuth>}></Route>
<Route path='/appointmenta' element={<AdminAuth><AppointmentA/></AdminAuth>}></Route>

</Routes>


  </BrowserRouter>
    </div>
  );
}

export default App;
