import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from '../pages/Registration';
import Login from '../pages/Login';
import Header from './components/Header';
import Profile from '../pages/Profile';

import ProtectRoute from './components/ProtectRoute';
import Forbidden from '../pages/Forbidden';

import About from '../pages/About';
import Resources from '../pages/Resource';
import Doctors from "../pages/Doctors";
import DoctorEdit from "../pages/DoctorEdit";
import Footer from './components/Footer';
import Home from './components/Home';
import Meditation from './components/Meditation';
import MoodTracker from './components/MoodTracker';

import Journal from '../pages/Journal';
import AdminDashboard from './components/AdminDashboard';
import DoctorRegister from '../pages/DoctorRegister';
import DoctorDashboard from '../pages/DoctorDashboard';
import ListUser from './user/Listuser';



function App() {


  return (
    <>
      <BrowserRouter>
        <Header />
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor-register" element={<DoctorRegister />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/journal" element={<Journal />} />
          <Route
    path="/doctor-dashboard"
    element={
        <ProtectRoute requiredRole={["Doctor"]}>
            <DoctorDashboard />
        </ProtectRoute>
    }
/>
<Route
    path="/doctor-edit"
    element={
        <ProtectRoute requiredRole={["Doctor"]}>
            <DoctorEdit />
        </ProtectRoute>
    }
/>
          <Route path="/user/list-users" element={
            <ProtectRoute requiredRole={["Admin"]}>
              <ListUser />
            </ProtectRoute>
          }
          />
          <Route path="/admin/dashboard" element={
            <ProtectRoute requiredRole={["Admin"]}>
              <AdminDashboard />
            </ProtectRoute>
          }
          />
          <Route path="/user/edit-user/:id" element={
              <ProtectRoute requiredRole={["Admin"]}>
                <EditUser />
              </ProtectRoute>} />

          <Route path="/forbidden" element={<Forbidden />}/>
          <Route path="/" element={<Home />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/doctors" element={<Doctors />}/>
          <Route path="/mood-tracker" element={<MoodTracker />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  )
}

export default App