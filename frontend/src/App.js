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
import Availability from './page/Customer/Availability';
import Cpayments from './page/Customer/Cpayments';
import BmanagerHome from './page/BranchManager/BmanagerHome';
import AppointmentReview from './page/BranchManager/AppointmentReview';
import Delivery from './page/BranchManager/Delivery';
import Supply from './page/BranchManager/Supply';
import SpaymentReview from './page/BranchManager/SpaymentReview';


function App() {
  return (
    <div className="App">
  <BrowserRouter>
<Routes>
<Route path='/' element={<Home/>}></Route>
<Route path='/login' element={<Login/>}></Route>
<Route path='/signup' element={<Signup/>}></Route>
<Route path='/suphome' element={<SupHome/>}></Route>
<Route path='/appointment' element={<Appointment/>}></Route>
<Route path='/pricelevel' element={<PriceLevel/>}></Route>
<Route path='/spayments' element={<Spayments/>}></Route>
<Route path='/cushome' element={<CusHome/>}></Route>
<Route path='/cpayments' element={<Cpayments/>}></Route>
<Route path='/orders' element={<Orders/>}></Route>
<Route path='/availability' element={<Availability/>}></Route>
<Route path='/bmanagerhome' element={<BmanagerHome/>}></Route>
<Route path='/appointmentreview' element={<AppointmentReview/>}></Route>
<Route path='/delivery' element={<Delivery/>}></Route>
<Route path='/spaymentreview' element={<SpaymentReview/>}></Route>
<Route path='/supply' element={<Supply/>}></Route>

</Routes>


  </BrowserRouter>
    </div>
  );
}

export default App;
