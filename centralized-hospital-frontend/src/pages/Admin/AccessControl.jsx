import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Added useNavigate

const initialRoles = [
  { id: 1, name: "Admin", permissions: { manageUsers: true, viewStats: true, editProtocols: true } },
  { id: 2, name: "Doctor", permissions: { manageUsers: false, viewStats: true, editProtocols: false } },
  { id: 3, name: "Pharmacy", permissions: { manageUsers: false, viewStats: false, editProtocols: false } },
  { id: 4, name: "OT Staff", permissions: { manageUsers: false, viewStats: false, editProtocols: false } },
];

const initialAuditLogs = [
  { id: 1, action: "User Dr. A created by Admin", timestamp: "2025-06-01 10:24" },
  { id: 2, action: "Emergency Protocol activated", timestamp: "2025-06-02 14:12" },
  { id: 3, action: "Pharmacy permissions updated by Admin", timestamp: "2025-06-03 09:45" },
];

export default function AccessControl() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState(initialRoles);

  const togglePermission = (roleId, permKey) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [permKey]: !role.permissions[permKey],
              },
            }
          : role
      )
    );
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
        <h2 className="text-2xl font-bold mb-6">Access Control</h2>

        {/* Role Permissions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Role-Based Permissions</h3>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Role</th>
                <th className="border border-gray-300 p-2 text-center">Manage Users</th>
                <th className="border border-gray-300 p-2 text-center">View Stats</th>
                <th className="border border-gray-300 p-2 text-center">Edit Protocols</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{role.name}</td>
                  {Object.keys(role.permissions).map((permKey) => (
                    <td key={permKey} className="border border-gray-300 p-2 text-center">
                      <input
                        type="checkbox"
                        checked={role.permissions[permKey]}
                        onChange={() => togglePermission(role.id, permKey)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Logs */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Audit Logs</h3>
          <ul className="max-h-48 overflow-y-auto border border-gray-300 rounded p-2 bg-white">
            {initialAuditLogs.map((log) => (
              <li key={log.id} className="border-b border-gray-200 py-1 text-sm">
                <span className="font-medium">{log.timestamp}: </span>
                {log.action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
