import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  // State for all data
  const [queue, setQueue] = useState([
    { id: 1, token: 11, name: "Alice Smith", reason: "Chest Pain", priority: "normal" },
    { id: 2, token: 12, name: "Bob Johnson", reason: "Follow-up", priority: "normal" },
  ]);

  const [emergencies, setEmergencies] = useState([
    { id: 101, token: 101, name: "Diana Prince", reason: "Severe Allergic Reaction", priority: "emergency" },
  ]);

  const [currentPatient, setCurrentPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [medicineInput, setMedicineInput] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [otSlots, setOtSlots] = useState([]);
  const [activeTab, setActiveTab] = useState("patients");
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  // Combined patient list sorted by priority (emergencies first)
  const combinedPatients = [...emergencies, ...queue];

  // Check for new emergencies periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (emergencies.length > 0 && !currentPatient?.priority === "emergency") {
        setShowEmergencyAlert(true);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [emergencies, currentPatient]);

  const callNextPatient = () => {
    // Handle emergencies first
    if (emergencies.length > 0) {
      const nextEmergency = emergencies[0];
      setCurrentPatient(nextEmergency);
      setEmergencies(emergencies.slice(1));
      setShowEmergencyAlert(false);
      resetPrescriptionForm();
      return;
    }

    // Then handle normal queue
    if (queue.length > 0) {
      const nextPatient = queue[0];
      setCurrentPatient(nextPatient);
      setQueue(queue.slice(1));
      resetPrescriptionForm();
    }
  };

  const resetPrescriptionForm = () => {
    setDiagnosis("");
    setMedicines([]);
  };

  const handleAddMedicine = () => {
    if (medicineInput.trim()) {
      setMedicines([...medicines, medicineInput.trim()]);
      setMedicineInput("");
    }
  };

  const handleSubmitPrescription = () => {
    console.log("Prescription submitted for:", currentPatient.name, { diagnosis, medicines });
    alert(`Prescription submitted for ${currentPatient.name}`);
    resetPrescriptionForm();
    setCurrentPatient(null);
  };

  const handleCompleteCurrent = () => {
    resetPrescriptionForm();
    setCurrentPatient(null);
  };

  const handleOTRequest = (e) => {
    e.preventDefault();
    // OT request logic
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* White Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md p-4 flex flex-col">
        <div className="mb-8 p-4">
          <h1 className="text-2xl font-bold text-indigo-700">👨‍⚕️ Doctor Portal</h1>
          <p className="text-gray-600 text-sm">Welcome back, Dr. Smith</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink 
            to="#" 
            onClick={() => setActiveTab("patients")}
            className={({isActive}) => `flex items-center p-3 rounded-lg transition ${isActive || activeTab === "patients" ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50'}`}
          >
            <span className="mr-3">👥</span>
            Patients
            {emergencies.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {emergencies.length}
              </span>
            )}
          </NavLink>
          
          <NavLink 
            to="#" 
            onClick={() => setActiveTab("current")}
            className={({isActive}) => `flex items-center p-3 rounded-lg transition ${isActive || activeTab === "current" ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50'}`}
            disabled={!currentPatient}
          >
            <span className="mr-3">📝</span>
            Current Case
          </NavLink>
          
          <NavLink 
            to="#" 
            onClick={() => setActiveTab("ot")}
            className={({isActive}) => `flex items-center p-3 rounded-lg transition ${isActive || activeTab === "ot" ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50'}`}
          >
            <span className="mr-3">🏥</span>
            OT Schedule
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
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {/* Emergency Alert Modal */}
        {showEmergencyAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md shadow-xl">
              <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
                <span className="mr-2">🚨</span> Emergency Alert!
              </h2>
              <p className="mb-4">There {emergencies.length === 1 ? 'is' : 'are'} {emergencies.length} emergency {emergencies.length === 1 ? 'case' : 'cases'} waiting.</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowEmergencyAlert(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Acknowledge
                </button>
                <button 
                  onClick={() => {
                    callNextPatient();
                    setShowEmergencyAlert(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Attend Now
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "patients" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-700">Patient Queue</h2>
              <button
                onClick={callNextPatient}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
                disabled={combinedPatients.length === 0}
              >
                Call Next Patient
              </button>
            </div>

            {/* Emergency Cases Section */}
            {emergencies.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-red-600 flex items-center">
                  <span className="mr-2">🚨</span> Emergency Cases ({emergencies.length})
                </h3>
                <ul className="space-y-3">
                  {emergencies.map(patient => (
                    <li key={patient.id} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{patient.name}</p>
                          <p className="text-sm">Token #{patient.token}</p>
                          <p className="text-sm italic">{patient.reason}</p>
                        </div>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          EMERGENCY
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Regular Queue Section */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">
                Regular Queue ({queue.length})
              </h3>
              {queue.length > 0 ? (
                <ul className="space-y-3">
                  {queue.map(patient => (
                    <li key={patient.id} className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500 hover:bg-indigo-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{patient.name}</p>
                          <p className="text-sm">Token #{patient.token}</p>
                          <p className="text-sm italic">{patient.reason}</p>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                          NORMAL
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No patients in regular queue</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "current" && currentPatient && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Patient Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-indigo-700">
                  {currentPatient.priority === "emergency" ? (
                    <span className="text-red-600 flex items-center">
                      <span className="mr-2">🚨</span> Emergency Case
                    </span>
                  ) : (
                    "Current Patient"
                  )}
                </h2>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  Token #{currentPatient.token}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-indigo-700">{currentPatient.name}</h3>
                  <p className="text-gray-600">{currentPatient.reason}</p>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">Diagnosis</label>
                  <textarea
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    rows="3"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700">Medicines</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                      value={medicineInput}
                      onChange={(e) => setMedicineInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddMedicine()}
                    />
                    <button 
                      onClick={handleAddMedicine}
                      className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  {medicines.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 bg-gray-50 p-2 rounded border border-gray-200">
                      {medicines.map((med, i) => (
                        <li key={i} className="text-gray-700">{med}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCompleteCurrent}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPrescription}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                >
                  Complete & Submit
                </button>
              </div>
            </div>

            {/* Patient History Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-700">
                {currentPatient.name}'s Medical History
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-indigo-700">Previous Visits</h3>
                  <p className="text-gray-500 italic">No previous visits found</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-indigo-700">Allergies</h3>
                  <p className="text-gray-500 italic">No known allergies</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-indigo-700">Chronic Conditions</h3>
                  <p className="text-gray-500 italic">None reported</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ot" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">OT Schedule</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Upcoming OT Slots</h3>
              {otSlots.length > 0 ? (
                <ul className="space-y-3">
                  {otSlots.map(slot => (
                    <li key={slot.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium"><strong>{slot.date}</strong> at {slot.time}</p>
                      <p>Status: <span className={slot.status === "Confirmed" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>{slot.status}</span></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No OT slots scheduled</p>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Request New OT Slot</h3>
              <form onSubmit={handleOTRequest} className="space-y-4 max-w-md">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2:00 PM - 4:00 PM"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700"
                >
                  Request OT Slot
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}