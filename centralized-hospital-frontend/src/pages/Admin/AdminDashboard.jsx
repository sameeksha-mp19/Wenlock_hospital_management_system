import React from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";

import UserManagement from "./UserManagement";
import HospitalStats from "./HospitalStats";
import AccessControl from "./AccessControl";
import EmergencyProtocols from "./EmergencyProtocols";
import GlobalNotifications from "./GlobalNotifications";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Clear any stored tokens or session data here
    navigate("/login"); // Navigate to login page
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 space-y-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-indigo-700">Admin Panel</h1>
          <nav className="space-y-2 text-sm">
            <NavLink
              to="/admin/UserManagement"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"}`
              }
            >
              👥 User Management
            </NavLink>
            <NavLink
              to="/admin/HospitalStats"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"}`
              }
            >
              📊 Hospital Stats
            </NavLink>
            <NavLink
              to="/admin/AccessControl"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"}`
              }
            >
              🔐 Access Control
            </NavLink>
            <NavLink
              to="/admin/EmergencyProtocols"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"}`
              }
            >
              🚨 Emergency Protocols
            </NavLink>
            <NavLink
              to="/admin/GlobalNotifications"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"}`
              }
            >
              📢 Global Notifications
            </NavLink>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="stats" element={<HospitalStats />} />
          <Route path="access" element={<AccessControl />} />
          <Route path="emergency" element={<EmergencyProtocols />} />
          <Route path="notifications" element={<GlobalNotifications />} />
          <Route
            path="*"
            element={<div className="text-lg text-gray-600">Select an option from the sidebar.</div>}
          />
        </Routes>
      </div>
    </div>
  );
}
