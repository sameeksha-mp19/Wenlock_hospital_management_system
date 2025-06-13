import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function EmergencyProtocols() {
  const navigate = useNavigate();

  const [protocols, setProtocols] = useState([
    {
      id: 1,
      name: "Fire Drill",
      description: "Evacuate building and assemble at safe zone",
      active: false,
    },
    {
      id: 2,
      name: "Medical Emergency",
      description: "Alert medical team and provide first aid",
      active: true,
    },
  ]);

  const [form, setForm] = useState({ name: "", description: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;

    const newProtocol = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      active: false,
    };

    setProtocols([...protocols, newProtocol]);
    setForm({ name: "", description: "" });
  };

  const toggleActive = (id) => {
    setProtocols((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <div className="flex">
      {/* Sidebar with Logout */}
      <div className="w-64 bg-white shadow-md p-4 h-screen flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-indigo-700">Admin Panel</h1>
          <nav className="space-y-2 text-sm">
            <NavLink
              to="/admin/UserManagement"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"
                }`
              }
            >
              👥 User Management
            </NavLink>

            <NavLink
              to="/admin/HospitalStats"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"
                }`
              }
            >
              📊 Hospital Stats
            </NavLink>

            <NavLink
              to="/admin/AccessControl"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"
                }`
              }
            >
              🔐 Access Control
            </NavLink>

            <NavLink
              to="/admin/EmergencyProtocols"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"
                }`
              }
            >
              🚨 Emergency Protocols
            </NavLink>

            <NavLink
              to="/admin/GlobalNotifications"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"
                }`
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
        <h2 className="text-2xl font-bold mb-6">Emergency Protocols</h2>

        <form onSubmit={handleAdd} className="mb-6 space-y-4 max-w-md">
          <input
            type="text"
            placeholder="Protocol Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Protocol Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Add Protocol
          </button>
        </form>

        <div>
          <h3 className="text-xl font-semibold mb-4">Existing Protocols</h3>
          <ul className="space-y-3 max-w-md">
            {protocols.map((p) => (
              <li
                key={p.id}
                className="border p-4 rounded flex justify-between items-center bg-white shadow"
              >
                <div>
                  <h4 className="font-semibold">{p.name}</h4>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
                <button
                  onClick={() => toggleActive(p.id)}
                  className={`px-3 py-1 rounded text-white ${
                    p.active ? "bg-red-500" : "bg-blue-600"
                  }`}
                >
                  {p.active ? "Deactivate" : "Activate"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
