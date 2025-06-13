import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

export default function OTDashboard() {
  const navigate = useNavigate();

  const [otSlots, setOtSlots] = useState([
    { id: 1, date: "2025-06-03", time: "09:00 AM - 11:00 AM", status: "Available", room: "OT-1" },
    { id: 2, date: "2025-06-03", time: "12:00 PM - 02:00 PM", status: "Occupied", room: "OT-2" },
    { id: 3, date: "2025-06-04", time: "10:00 AM - 12:00 PM", status: "Booked", room: "OT-3" },
    { id: 4, date: "2025-06-05", time: "02:00 PM - 04:00 PM", status: "Available", room: "OT-1" },
    { id: 5, date: "2025-06-06", time: "11:00 AM - 01:00 PM", status: "Booked", room: "OT-2" },
  ]);

  const [emergencyBookings, setEmergencyBookings] = useState([]);
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: "",
    reason: "",
    date: "",
    time: "",
    room: "OT-1" // Default room
  });

  const [doctorRequests, setDoctorRequests] = useState([
    {
      id: 1,
      patientName: "John Doe",
      operationType: "Appendectomy",
      date: "2025-06-07",
      time: "10:00 AM",
      room: "OT-3"
    },
    {
      id: 2,
      patientName: "Jane Smith",
      operationType: "Knee Replacement",
      date: "2025-06-08",
      time: "11:30 AM",
      room: "OT-2"
    },
  ]);

  const [activeTab, setActiveTab] = useState("requests");
  const availableRooms = ["OT-1", "OT-2", "OT-3", "OT-4", "OT-5"];

  const handleEmergencyChange = (e) => {
    setEmergencyForm({ ...emergencyForm, [e.target.name]: e.target.value });
  };

  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    const newBooking = {
      ...emergencyForm,
      id: Date.now(),
      status: "Occupied"
    };
    
    // Add to emergency bookings
    setEmergencyBookings([newBooking, ...emergencyBookings]);
    
    // Update OT slots
    setOtSlots(prevSlots => [
      ...prevSlots,
      {
        id: Date.now(),
        date: newBooking.date,
        time: newBooking.time,
        status: "Occupied",
        room: newBooking.room,
        emergency: true
      }
    ]);
    
    // Reset form
    setEmergencyForm({
      patientName: "",
      reason: "",
      date: "",
      time: "",
      room: "OT-1"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "Occupied":
        return "bg-red-100 text-red-700";
      case "Booked":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = (slotId, newStatus) => {
    const updated = otSlots.map((slot) =>
      slot.id === slotId ? { ...slot, status: newStatus } : slot
    );
    setOtSlots(updated);
  };

  const handleAssignRequest = (reqId, slotId) => {
    const request = doctorRequests.find(r => r.id === reqId);
    const slot = otSlots.find(s => s.id === slotId);
    
    if (request && slot) {
      // Update OT slot to "Booked"
      const updatedSlots = otSlots.map((s) =>
        s.id === slotId ? { 
          ...s, 
          status: "Booked",
          patientName: request.patientName,
          operationType: request.operationType
        } : s
      );
      setOtSlots(updatedSlots);

      // Remove the request from pending list
      setDoctorRequests((prev) => prev.filter((r) => r.id !== reqId));
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md p-4 flex flex-col">
        <div className="mb-8 p-4">
          <h1 className="text-2xl font-bold text-indigo-700">🏥 OT Staff Portal</h1>
          <p className="text-gray-600 text-sm">Welcome back, OT Staff</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink 
            to="#" 
            onClick={() => setActiveTab("requests")}
            className={({isActive}) => `flex items-center p-3 rounded-lg transition ${isActive || activeTab === "requests" ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50'}`}
          >
            <span className="mr-3">📥</span>
            OT Requests
            {doctorRequests.length > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {doctorRequests.length}
              </span>
            )}
          </NavLink>
          
          <NavLink 
            to="#" 
            onClick={() => setActiveTab("calendar")}
            className={({isActive}) => `flex items-center p-3 rounded-lg transition ${isActive || activeTab === "calendar" ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50'}`}
          >
            <span className="mr-3">📅</span>
            OT Calendar
          </NavLink>
          
          <NavLink 
            to="#" 
            onClick={() => setActiveTab("emergency")}
            className={({isActive}) => `flex items-center p-3 rounded-lg transition ${isActive || activeTab === "emergency" ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50'}`}
          >
            <span className="mr-3">🚨</span>
            Emergency Booking
          </NavLink>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto p-3 text-left rounded-lg hover:bg-red-50 transition flex items-center text-red-600"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* OT Requests Tab */}
        {activeTab === "requests" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">📥 Pending OT Requests</h2>
            {doctorRequests.length === 0 ? (
              <p className="text-gray-500">No new OT requests from doctors.</p>
            ) : (
              <div className="space-y-4">
                {doctorRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="font-semibold">Patient:</p>
                        <p>{req.patientName}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Operation:</p>
                        <p>{req.operationType}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Requested Date:</p>
                        <p>{req.date}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Requested Time:</p>
                        <p>{req.time}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Preferred Room:</p>
                        <p>{req.room}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="font-semibold">Assign to OT Slot:</label>
                      <select
                        onChange={(e) => {
                          const slotId = parseInt(e.target.value);
                          if (!isNaN(slotId)) {
                            handleAssignRequest(req.id, slotId);
                          }
                        }}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                        defaultValue=""
                      >
                        <option value="" disabled>Select available slot</option>
                        {otSlots
                          .filter((slot) => slot.status === "Available")
                          .map((slot) => (
                            <option key={slot.id} value={slot.id}>
                              {slot.date} | {slot.time} | {slot.room}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OT Calendar Tab */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">📅 OT Calendar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-lg border ${getStatusColor(slot.status)}`}
                >
                  <div className="mb-2">
                    <p className="font-semibold">Room:</p>
                    <p className="font-bold">{slot.room}</p>
                  </div>
                  <div className="mb-2">
                    <p className="font-semibold">Date:</p>
                    <p>{slot.date}</p>
                  </div>
                  <div className="mb-2">
                    <p className="font-semibold">Time:</p>
                    <p>{slot.time}</p>
                  </div>
                  <div className="mb-2">
                    <p className="font-semibold">Status:</p>
                    <p>{slot.status}</p>
                  </div>
                  {slot.patientName && (
                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <p className="font-semibold">Patient:</p>
                      <p>{slot.patientName}</p>
                      {slot.operationType && (
                        <>
                          <p className="font-semibold mt-1">Procedure:</p>
                          <p>{slot.operationType}</p>
                        </>
                      )}
                      {slot.emergency && (
                        <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                  )}
                  <select
                    value={slot.status}
                    onChange={(e) => handleStatusChange(slot.id, e.target.value)}
                    className={`mt-2 w-full p-1 border rounded-md ${getStatusColor(slot.status)}`}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Booking Tab */}
        {activeTab === "emergency" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">🚨 Emergency OT Booking</h2>
            <form onSubmit={handleEmergencySubmit} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Patient Name</label>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Patient Name"
                    value={emergencyForm.patientName}
                    onChange={handleEmergencyChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Surgery Reason</label>
                  <input
                    type="text"
                    name="reason"
                    placeholder="Surgery Reason"
                    value={emergencyForm.reason}
                    onChange={handleEmergencyChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={emergencyForm.date}
                    onChange={handleEmergencyChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={emergencyForm.time}
                    onChange={handleEmergencyChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">OT Room</label>
                  <select
                    name="room"
                    value={emergencyForm.room}
                    onChange={handleEmergencyChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    required
                  >
                    {availableRooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Reserve Emergency OT
              </button>
            </form>

            {emergencyBookings.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-indigo-700">📋 Emergency Reservations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-red-50 border border-red-200 p-4 rounded-lg"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">Patient:</p>
                          <p>{booking.patientName}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Reason:</p>
                          <p>{booking.reason}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Date:</p>
                          <p>{booking.date}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Time:</p>
                          <p>{booking.time}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Room:</p>
                          <p>{booking.room}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}