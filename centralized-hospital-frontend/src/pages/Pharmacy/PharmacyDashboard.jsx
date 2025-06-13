import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function PharmacyDashboard() {
  const navigate = useNavigate();

  // Initial inventory state
  const [inventory, setInventory] = useState([
    { id: 1, name: "Paracetamol", quantity: 40, expiry: "2025-01-30" },
    { id: 2, name: "Amoxicillin", quantity: 20, expiry: "2024-11-15" },
    { id: 3, name: "Cetrizine", quantity: 15, expiry: "2024-08-01" },
    { id: 4, name: "Ibuprofen", quantity: 25, expiry: "2026-05-01" },
    { id: 5, name: "Dolo 650", quantity: 13, expiry: "2025-09-30" },
  ]);

  // Prescriptions state
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, patient: "John Doe", drug: "Paracetamol", status: "Pending", quantity: 2 },
    { id: 2, patient: "Jane Smith", drug: "Cetrizine", status: "Pending", quantity: 1 },
    { id: 3, patient: "Robert Johnson", drug: "Amoxicillin", status: "Pending", quantity: 3 },
  ]);

  // Reorder form state
  const [reorder, setReorder] = useState({
    drugId: "",
    quantity: 10,
    notes: "",
  });

  // Filter low stock drugs
  const lowStockDrugs = inventory.filter((item) => item.quantity <= 15);

  // Auto-set first low stock drug for reorder
  useEffect(() => {
    if (lowStockDrugs.length > 0) {
      const firstDrug = lowStockDrugs[0];
      setReorder({
        drugId: String(firstDrug.id),
        quantity: 10,
        notes: `Auto-reorder for low stock (${firstDrug.quantity})`,
      });
    }
  }, [inventory]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  // Handle restock
  const handleRestock = (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 10 } : item
      )
    );
  };

  // Handle reorder form changes
  const handleReorderChange = (e) => {
    const { name, value } = e.target;
    setReorder((prev) => ({ ...prev, [name]: value }));
  };

  // Submit reorder request
  const handleReorderSubmit = (e) => {
    e.preventDefault();
    const drug = inventory.find((item) => item.id === parseInt(reorder.drugId));
    alert(`Reorder request for ${drug?.name} submitted.`);
    console.log("Reorder request:", reorder);
    setReorder({ drugId: "", quantity: 10, notes: "" });
  };

  // Mark prescription as dispensed and update inventory
  const handleMarkDispensed = (prescriptionId) => {
    setPrescriptions((prevPrescriptions) => {
      const updatedPrescriptions = prevPrescriptions.map((p) =>
        p.id === prescriptionId ? { ...p, status: "Dispensed" } : p
      );
      
      // Find the prescription being dispensed
      const dispensedPrescription = prevPrescriptions.find(p => p.id === prescriptionId);
      
      if (dispensedPrescription && dispensedPrescription.status === "Pending") {
        // Update inventory
        setInventory((prevInventory) =>
          prevInventory.map((item) =>
            item.name === dispensedPrescription.drug
              ? { ...item, quantity: Math.max(0, item.quantity - dispensedPrescription.quantity) }
              : item
          )
        );
      }
      
      return updatedPrescriptions;
    });
  };

  // Calculate pending prescriptions count for each drug
  const getPendingPrescriptionsCount = (drugName) => {
    return prescriptions.filter(
      (p) => p.drug === drugName && p.status === "Pending"
    ).length;
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md p-4 h-screen flex flex-col">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-indigo-700">Pharmacy Portal</h1>
          <nav className="space-y-2 text-sm">
            <NavLink
              to="/pharmacy/dashboard"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100"}`
              }
            >
              🏠 Dashboard
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
        <h2 className="text-2xl font-bold mb-6">Pharmacy Dashboard</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Inventory Tracker */}
          <div className="col-span-2 bg-white rounded-lg shadow p-4 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Inventory Tracker</h3>
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="py-2 pr-4">Drug</th>
                  <th className="py-2 pr-4">Current Stock</th>
                  <th className="py-2 pr-4">Pending Prescriptions</th>
                  <th className="py-2 pr-4">Expiry</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((drug) => {
                  const isLow = drug.quantity <= 15;
                  const pendingCount = getPendingPrescriptionsCount(drug.name);
                  const projectedStock = drug.quantity - pendingCount;
                  
                  return (
                    <tr
                      key={drug.id}
                      className={`border-b ${
                        isLow || projectedStock < 0 ? "bg-red-50 text-red-700" : ""
                      }`}
                    >
                      <td className="py-2 pr-4">
                        {drug.name}
                        {isLow && (
                          <span className="ml-2 text-xs bg-red-100 px-2 py-0.5 rounded-full">
                            ⚠ Low Stock
                          </span>
                        )}
                        {projectedStock < 0 && (
                          <span className="ml-2 text-xs bg-red-100 px-2 py-0.5 rounded-full">
                            ⚠ Insufficient Stock
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-4">{drug.quantity}</td>
                      <td className="py-2 pr-4">
                        {pendingCount > 0 ? (
                          <span className="text-orange-600">{pendingCount}</span>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td className="py-2 pr-4">{drug.expiry}</td>
                      <td className="py-2">
                        <button
                          onClick={() => handleRestock(drug.id)}
                          className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
                        >
                          Restock (+10)
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Reorder Requests */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Reorder Requests</h3>
            {lowStockDrugs.length === 0 ? (
              <p className="text-gray-500">No low-stock drugs to reorder.</p>
            ) : (
              <form onSubmit={handleReorderSubmit} className="space-y-3 text-sm">
                <select
                  name="drugId"
                  value={reorder.drugId}
                  onChange={handleReorderChange}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Drug</option>
                  {lowStockDrugs.map((drug) => (
                    <option key={drug.id} value={drug.id}>
                      {drug.name} (Qty: {drug.quantity})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="quantity"
                  value={reorder.quantity}
                  onChange={handleReorderChange}
                  className="w-full p-2 border rounded"
                  placeholder="Quantity to reorder"
                  required
                  min="1"
                />
                <textarea
                  name="notes"
                  value={reorder.notes}
                  onChange={handleReorderChange}
                  rows={3}
                  className="w-full p-2 border rounded"
                  placeholder="Optional notes..."
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                >
                  Submit Reorder
                </button>
              </form>
            )}
          </div>

          {/* Prescription Queue */}
          <div className="col-span-3 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Prescription Queue</h3>
            {prescriptions.length === 0 ? (
              <p className="text-gray-500">No prescriptions at the moment.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left border-b">
                  <tr>
                    <th className="py-2 pr-4">Patient</th>
                    <th className="py-2 pr-4">Medicine</th>
                    <th className="py-2 pr-4">Quantity</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => {
                    const drugInInventory = inventory.find(
                      (item) => item.name === prescription.drug
                    );
                    const canDispense = drugInInventory && 
                      drugInInventory.quantity >= prescription.quantity;
                    
                    return (
                      <tr key={prescription.id} className="border-b">
                        <td className="py-2 pr-4">{prescription.patient}</td>
                        <td className="py-2 pr-4">{prescription.drug}</td>
                        <td className="py-2 pr-4">{prescription.quantity}</td>
                        <td className="py-2 pr-4">
                          {prescription.status}
                          {prescription.status === "Pending" && !canDispense && (
                            <span className="ml-2 text-xs bg-red-100 px-2 py-0.5 rounded-full">
                              Insufficient Stock
                            </span>
                          )}
                        </td>
                        <td className="py-2">
                          {prescription.status === "Pending" ? (
                            <button
                              onClick={() => handleMarkDispensed(prescription.id)}
                              disabled={!canDispense}
                              className={`px-3 py-1 text-sm ${
                                canDispense
                                  ? "bg-indigo-500 hover:bg-indigo-600"
                                  : "bg-gray-300 cursor-not-allowed"
                              } text-white rounded`}
                            >
                              {canDispense ? "Mark as Dispensed" : "Cannot Dispense"}
                            </button>
                          ) : (
                            <span className="text-green-600">✓ Dispensed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}