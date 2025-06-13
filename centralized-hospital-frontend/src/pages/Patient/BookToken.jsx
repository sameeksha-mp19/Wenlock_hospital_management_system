import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function BookToken() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [booked, setBooked] = useState(false);

  const doctorsByDepartment = {
    Cardiology: ["Dr. Mehta", "Dr. Rao"],
    Orthopedics: ["Dr. Kamath", "Dr. Bhat"],
    ENT: ["Dr. Naik", "Dr. Pinto"],
    Neurology: ["Dr. Shenoy", "Dr. Pai"],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (department && doctor) {
      // Simulate booking API
      setBooked(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <div>
      <div className="w-64 bg-white shadow-md p-4 space-y-4 h-screen">
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
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-8"
        >
          🚪 Logout
        </button>
      </div>
      

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">📝 Book Your Token</h2>

        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
          {booked ? (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
              ✅ Token successfully booked for <strong>{department}</strong> with <strong>{doctor}</strong>!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Department Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Department
                </label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setDoctor("");
                  }}
                  required
                >
                  <option value="">-- Choose Department --</option>
                  {Object.keys(doctorsByDepartment).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Selection */}
              {department && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Doctor
                  </label>
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctorsByDepartment[department].map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Book Token
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}