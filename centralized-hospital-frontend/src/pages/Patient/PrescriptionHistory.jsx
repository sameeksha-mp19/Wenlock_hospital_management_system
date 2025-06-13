import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function PrescriptionHistory() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Simulated API response
    const mockData = [
      {
        id: 1,
        doctor: "Dr. Rao",
        department: "Cardiology",
        date: "2025-06-01",
        diagnosis: "Hypertension",
        medicines: ["Amlodipine", "Telmisartan"],
      },
      {
        id: 2,
        doctor: "Dr. Kamath",
        department: "Orthopedics",
        date: "2025-05-25",
        diagnosis: "Knee Pain",
        medicines: ["Paracetamol", "Physiotherapy"],
      },
    ];

    setPrescriptions(mockData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md p-4 h-screen flex flex-col">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-indigo-700">Patient Portal</h1>
          <nav className="space-y-2 text-sm">
            <NavLink
              to="/patient/dashboard"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"}`
              }
            >
              🏠 Dashboard
            </NavLink>
            <NavLink
              to="/patient/book-token"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"}`
              }
            >
              🎫 Book Token
            </NavLink>
            <NavLink
              to="/patient/prescriptions"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"}`
              }
            >
              💊 Prescriptions
            </NavLink>
          </nav>
        </div>

        {/* Logout button at bottom */}
        <button
          onClick={handleLogout}
          className="mt-auto w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">📁 Prescription History</h2>

        <div className="bg-white shadow rounded p-4">
          {prescriptions.length === 0 ? (
            <p className="text-gray-600 p-4">No prescriptions found.</p>
          ) : (
            <ul className="space-y-4">
              {prescriptions.map((item) => (
                <li
                  key={item.id}
                  className="border p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div>
                    <div className="flex gap-4 text-sm text-gray-500 mb-1">
                      <span>{item.date}</span>
                      <span>{item.department}</span>
                    </div>
                    <div className="font-medium">
                      {item.doctor}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Diagnosis:</strong> {item.diagnosis}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Medicines:</strong> {item.medicines.join(", ")}
                    </div>
                  </div>
                  {/* <button
                    onClick={() => console.log("View details", item.id)}
                    className="mt-2 sm:mt-0 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    View Details
                  </button> */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}