import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PatientDashboard from "./pages/Patient/Dashboard";
import BookToken from "./pages/Patient/BookToken";
import PrescriptionHistory from "./pages/Patient/PrescriptionHistory";
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import OTDashboard from "./pages/ot/Dashboard";
import LandingPage from "./pages/Auth/LandingPage";
import PharmacyDashboard from "./pages/Pharmacy/PharmacyDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AccessControl from "./pages/Admin/AccessControl";
import EmergencyProtocols from "./pages/Admin/EmergencyProtocols";
import GlobalNotifications from "./pages/Admin/GlobalNotifications";
import HospitalStats from "./pages/Admin/HospitalStats";
import UserManagement from "./pages/Admin/UserManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/patient/dashboard" element={<PatientDashboard />} />
         <Route path="/patient/book-token" element={<BookToken />} />
         <Route path="/patient/prescriptions" element={<PrescriptionHistory />} />
         <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
         <Route path="/ot/dashboard" element={<OTDashboard />} />
         <Route path="/" element={<LandingPage />} />
         <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/admin/AccessControl" element={<AccessControl/>}/>
         <Route path="/admin/EmergencyProtocols" element={<EmergencyProtocols/>}/>
         <Route path="/admin/GlobalNotifications" element={<GlobalNotifications/>}/>
         <Route path="/admin/HospitalStats" element={<HospitalStats/>}/>
         <Route path="/admin/UserManagement" element={<UserManagement/>}/>
      </Routes>
    </Router>
  );
}

export default App;
