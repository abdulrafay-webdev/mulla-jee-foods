"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { MapPin, Plus, Edit, Trash2, Clock, DollarSign, CheckCircle2, XCircle } from "lucide-react";

export default function AdminDeliveryAreasPage() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  
  const [areaName, setAreaName] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("150");
  const [estimatedTime, setEstimatedTime] = useState("35");
  const [isActive, setIsActive] = useState(true);

  const loadAreas = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI("/delivery-areas/admin");
      setAreas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleOpenCreate = () => {
    setEditingArea(null);
    setAreaName("");
    setDeliveryCharge("150");
    setEstimatedTime("35");
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (area) => {
    setEditingArea(area);
    setAreaName(area.name);
    setDeliveryCharge(String(area.delivery_charge));
    setEstimatedTime(String(area.estimated_time_minutes));
    setIsActive(area.is_active);
    setShowModal(true);
  };

  const handleSaveArea = async (e) => {
    e.preventDefault();
    const payload = {
      name: areaName.trim(),
      delivery_charge: parseFloat(deliveryCharge),
      estimated_time_minutes: parseInt(estimatedTime),
      is_active: isActive
    };

    try {
      if (editingArea) {
        await fetchAPI(`/delivery-areas/${editingArea.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await fetchAPI("/delivery-areas", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      setShowModal(false);
      loadAreas();
    } catch (err) {
      alert("Error saving area: " + err.message);
    }
  };

  const handleToggleArea = async (areaId) => {
    try {
      await fetchAPI(`/delivery-areas/${areaId}/toggle`, { method: "PATCH" });
      loadAreas();
    } catch (err) {
      alert("Failed to toggle area status");
    }
  };

  const handleDeleteArea = async (areaId) => {
    if (!confirm("Are you sure you want to delete this delivery area?")) return;
    try {
      await fetchAPI(`/delivery-areas/${areaId}`, { method: "DELETE" });
      loadAreas();
    } catch (err) {
      alert("Failed to delete area");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Delivery Areas Management</h1>
          <p className="text-xs text-neutral-400">Configure supported delivery zones, charges & estimated times</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 hover:scale-105 transition-all flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Delivery Area
        </button>
      </div>

      {/* Areas Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-neutral-400">Loading delivery areas...</div>
        ) : areas.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">No delivery areas configured yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-neutral-400 border-b border-neutral-800 uppercase tracking-wider">
                  <th className="pb-4">Area Name</th>
                  <th className="pb-4">Delivery Fee</th>
                  <th className="pb-4">Est. Delivery Time</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-semibold">
                {areas.map((area) => (
                  <tr key={area.id} className="hover:bg-neutral-850">
                    <td className="py-4 text-white font-bold text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      {area.name}
                    </td>

                    <td className="py-4 text-red-500 font-bold text-sm">Rs. {area.delivery_charge}</td>

                    <td className="py-4 text-neutral-300">~{area.estimated_time_minutes} Mins</td>

                    <td className="py-4">
                      <button
                        onClick={() => handleToggleArea(area.id)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                          area.is_active
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                            : "bg-red-500/10 border-red-500/40 text-red-400"
                        }`}
                      >
                        {area.is_active ? "Active Zone" : "Disabled"}
                      </button>
                    </td>

                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(area)}
                        className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteArea(area.id)}
                        className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveArea} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-black text-white">{editingArea ? "Edit Delivery Area" : "Add Delivery Area"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-neutral-400 font-bold">✕</button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">Area / Suburb Name *</label>
              <input
                type="text"
                required
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="e.g. Gulshan-e-Iqbal, DHA Phase 5, Clifton"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">Delivery Fee (Rs.) *</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  placeholder="150"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">Est. Time (Mins) *</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="35"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_active_area"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-0"
              />
              <label htmlFor="is_active_area" className="text-xs font-bold text-white">
                Active Zone (Customers can order)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-950 text-neutral-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-black uppercase shadow-md"
              >
                Save Delivery Area
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
