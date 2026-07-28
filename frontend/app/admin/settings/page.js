"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Settings, Save, CheckCircle2, AlertCircle, Store } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    name: "",
    tagline: "",
    phone: "",
    email: "",
    address: "",
    opening_hours: "",
    delivery_fee: 150,
    tax_rate: 5.0,
    is_open: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchAPI("/settings");
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      const updated = await fetchAPI("/settings", {
        method: "PUT",
        body: JSON.stringify(settings)
      });
      setSettings(updated);
      setSuccessMsg("Restaurant settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to update settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Restaurant Settings</h1>
        <p className="text-xs text-neutral-400">Configure restaurant branding, contact details, delivery charges & tax rates</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-neutral-400">Loading settings...</div>
      ) : (
        <form onSubmit={handleSaveSettings} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl">
          
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> {successMsg}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider pb-2 border-b border-neutral-800">
              Restaurant Branding & Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Tagline / Slogan</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Phone Number</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">Physical Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Operational Settings */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider pb-2 border-b border-neutral-800">
              Operations & Charges
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Opening Hours</label>
                <input
                  type="text"
                  value={settings.opening_hours}
                  onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Delivery Charge (Rs.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.delivery_fee}
                  onChange={(e) => setSettings({ ...settings, delivery_fee: parseFloat(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.tax_rate}
                  onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_open_toggle"
                checked={settings.is_open}
                onChange={(e) => setSettings({ ...settings, is_open: e.target.checked })}
                className="w-5 h-5 rounded text-amber-500 focus:ring-0"
              />
              <label htmlFor="is_open_toggle" className="text-sm font-bold text-white">
                Restaurant Open for Online Orders
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
