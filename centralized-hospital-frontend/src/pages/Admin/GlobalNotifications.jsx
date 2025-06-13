import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function GlobalNotifications() {
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    message: "",
    target: "All Dashboards",
  });

  const [sentNotifications, setSentNotifications] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!notification.message.trim()) return;

    const newNotification = {
      id: Date.now(),
      message: notification.message,
      target: notification.target,
      timestamp: new Date().toLocaleString(),
    };

    setSentNotifications([newNotification, ...sentNotifications]);
    setNotification({ message: "", target: "All Dashboards" });
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
        <h2 className="text-2xl font-bold mb-6">Global Notification Panel</h2>

        <form onSubmit={handleSend} className="mb-6 space-y-4 max-w-2xl">
          <textarea
            placeholder="Enter notification message"
            value={notification.message}
            onChange={(e) =>
              setNotification({ ...notification, message: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows={3}
            required
          />

          <select
            value={notification.target}
            onChange={(e) =>
              setNotification({ ...notification, target: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option>All Dashboards</option>
            <option>Doctors Dashboard</option>
            <option>Patients Dashboard</option>
            <option>Pharmacy Dashboard</option>
            <option>OT Staff Dashboard</option>
            <option>Admin Dashboard</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Send Notification
          </button>
        </form>

        <div className="max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Sent Notifications</h3>
          {sentNotifications.length === 0 ? (
            <p className="text-gray-600">No notifications sent yet.</p>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {sentNotifications.map((n) => (
                <li
                  key={n.id}
                  className="border p-3 rounded bg-white shadow flex flex-col"
                >
                  <span className="font-semibold">{n.message}</span>
                  <span className="text-sm text-gray-500">
                    Target: {n.target} | Sent at: {n.timestamp}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
