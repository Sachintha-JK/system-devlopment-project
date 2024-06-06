import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
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
import BmanagerHome from './page/BranchManager/BmanagerHome';
import BranchStock from './page/BranchManager/BranchStock';
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



function App() {
  return (
    <div className="App">
  <BrowserRouter>
<Routes>
<Route path='/' element={<Home/>}></Route>
<Route path='/login' element={<Login/>}></Route>
<Route path='/who' element={<Who/>}></Route>
<Route path='/productchart' element={<ProductChart/>}></Route>
<Route path='/cpassword' element={<Cpassword/>}></Route>
<Route path='/suphome' element={<SupHome/>}></Route>
<Route path='/appointment' element={<Appointment/>}></Route>
<Route path='/pricelevel' element={<PriceLevel/>}></Route>
<Route path='/spayments' element={<Spayments/>}></Route>
<Route path='/cushome' element={<CusHome/>}></Route>
<Route path='/cpayments' element={<Cpayments/>}></Route>
<Route path='/orders' element={<Orders/>}></Route>
<Route path='/bmanagerhome' element={<BmanagerHome/>}></Route>
<Route path='/supply' element={<Supply/>}></Route>
<Route path='/adminhome' element={<AdminHome/>}></Route>
<Route path='/SupRegister' element={<SupRegister/>}></Route>
<Route path='/CusRegister' element={<CusRegister/>}></Route>
<Route path='/ManagerRegister' element={<ManagerRegister/>}></Route>
<Route path='/branchstock' element={<BranchStock/>}></Route>
<Route path='/aviewsupplier' element={<AviewSupplier/>}></Route>
<Route path='/spaymentview' element={<SpaymentView/>}></Route>
<Route path='/cpaymentview' element={<CpaymentView/>}></Route>
<Route path='/orderview' element={<OrderView/>}></Route>
<Route path='/stock' element={<Stock/>}></Route>
<Route path='/pending' element={<PendingOrder/>}></Route>
<Route path='/imagespice' element={<ImageSpice/>}></Route>


</Routes>


  </BrowserRouter>
    </div>
  );
}

export default App;
