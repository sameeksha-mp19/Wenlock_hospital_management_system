import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([
    { id: 1, name: "Dr. A", email: "a@hospital.com", role: "Doctor" },
    { id: 2, name: "John Doe", email: "john@example.com", role: "Patient" },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Doctor",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    };
    setUsers([...users, newUser]);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "Doctor",
    });
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
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
        <h2 className="text-2xl font-bold mb-4">User Management</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6 max-w-md">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option>Doctor</option>
            <option>Patient</option>
            <option>Pharmacy</option>
            <option>OT Staff</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Add User
          </button>
        </form>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">User List</h3>
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-2 rounded"
              >
                <div>
                  <div className="font-medium">
                    {user.name} ({user.role})
                  </div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="mt-2 sm:mt-0 px-3 py-1 bg-red-500 text-white text-sm rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
