"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { DollarSign, Calendar, Truck, Store, Filter } from "lucide-react";

export default function AdminFinancePage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [report, setReport] = useState({
    total_orders: 0,
    total_sales: 0,
    delivery_count: 0,
    delivery_sales: 0,
    pickup_count: 0,
    pickup_sales: 0
  });

  const [loading, setLoading] = useState(true);

  const fetchFinanceReport = async () => {
    setLoading(true);
    try {
      let endpoint = "/reports/finance?";
      if (startDate) endpoint += `start_date=${startDate}&`;
      if (endDate) endpoint += `end_date=${endDate}&`;

      const data = await fetchAPI(endpoint);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceReport();
  }, [startDate, endDate]);

  const handleSetToday = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    setStartDate(todayStr);
    setEndDate(todayStr);
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Finance & Sales Reports</h1>
          <p className="text-xs text-neutral-400">Revenue breakdowns, delivery vs pickup metrics</p>
        </div>

        {/* Date Filter Box */}
        <div className="flex flex-wrap items-center gap-3 bg-neutral-900 border border-neutral-800 p-2 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 pl-2">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xl p-2 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xl p-2 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSetToday}
            className="px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs rounded-xl hover:bg-red-600 hover:text-white transition-all"
          >
            Today
          </button>

          {(startDate || endDate) && (
            <button
              onClick={handleResetFilter}
              className="px-3 py-2 bg-neutral-800 text-neutral-400 font-bold text-xs rounded-xl hover:text-white"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400">Calculating financial metrics...</div>
      ) : (
        <>
          {/* TOP OVERVIEW STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Sales Revenue</span>
              <p className="text-4xl font-black text-emerald-400">Rs. {report.total_sales}</p>
              <p className="text-xs text-neutral-500">Gross revenue for selected date period</p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Orders Count</span>
              <p className="text-4xl font-black text-red-500">{report.total_orders}</p>
              <p className="text-xs text-neutral-500">Completed & active orders total</p>
            </div>
          </div>

          {/* BREAKDOWN: Delivery vs Pickup */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-wider pb-3 border-b border-neutral-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-500" /> Fulfillment Sales Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-bold text-white text-sm">Home Delivery Sales</p>
                  <p className="text-xs text-neutral-500">{report.delivery_count} Orders</p>
                </div>
                <span className="text-xl font-black text-red-500">Rs. {report.delivery_sales}</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-bold text-white text-sm">Store Pickup Sales</p>
                  <p className="text-xs text-neutral-500">{report.pickup_count} Orders</p>
                </div>
                <span className="text-xl font-black text-purple-400">Rs. {report.pickup_sales}</span>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
