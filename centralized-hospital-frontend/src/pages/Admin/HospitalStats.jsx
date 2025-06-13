import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function HospitalStats() {
  const navigate = useNavigate();

  // Placeholder static data, replace with dynamic data fetching as needed
  const stats = {
    doctorsOnDuty: 24,
    patientsAdmitted: 128,
    pharmacyOrders: 75,
    otSchedules: 8,
    emergenciesToday: 3,
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation with Logout */}
      <div className="w-64 bg-white shadow-md p-4 h-screen flex flex-col justify-between">
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

        <button
          onClick={() => navigate("/login")}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">Hospital Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold">Doctors On Duty</h3>
            <p className="text-3xl font-bold">{stats.doctorsOnDuty}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold">Patients Admitted</h3>
            <p className="text-3xl font-bold">{stats.patientsAdmitted}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold">Pharmacy Orders</h3>
            <p className="text-3xl font-bold">{stats.pharmacyOrders}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold">OT Schedules</h3>
            <p className="text-3xl font-bold">{stats.otSchedules}</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold">Emergencies Today</h3>
            <p className="text-3xl font-bold text-red-600">{stats.emergenciesToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
