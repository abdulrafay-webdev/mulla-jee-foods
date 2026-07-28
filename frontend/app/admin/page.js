"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import { ShoppingBag, DollarSign, Clock, Flame, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    today_orders_count: 0,
    today_sales_total: 0,
    pending_orders_count: 0,
    popular_items: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashData, ordersData] = await Promise.all([
          fetchAPI("/reports/dashboard"),
          fetchAPI("/orders?limit=6")
        ]);
        setStats(dashData);
        setRecentOrders(ordersData);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-neutral-400">Live fast food performance & metrics</p>
        </div>

        <Link
          href="/admin/orders"
          className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-red-500 transition-colors flex items-center gap-1.5 w-fit"
        >
          Manage All Orders <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Card 1: Today's Orders */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Today's Orders</span>
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-black text-white">{stats.today_orders_count}</p>
              <p className="text-xs text-neutral-500">Total orders received today</p>
            </div>

            {/* Card 2: Today's Total Sales */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Today's Total Sale</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-black text-emerald-400">Rs. {stats.today_sales_total}</p>
              <p className="text-xs text-neutral-500">Gross revenue for today</p>
            </div>

            {/* Card 3: Pending Orders */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pending Orders</span>
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <p className="text-4xl font-black text-red-400">{stats.pending_orders_count}</p>
              <p className="text-xs text-neutral-500">Awaiting kitchen confirmation</p>
            </div>

          </div>

          {/* TWO COLUMN GRID: Popular Items & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col (2 cols): Recent Orders */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <h2 className="text-base font-black text-white uppercase tracking-wider">Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs font-bold text-red-500 hover:underline">
                  View All →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-sm text-neutral-500 py-8 text-center">No orders received yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-neutral-500 border-b border-neutral-800 uppercase tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-semibold">
                      {recentOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-neutral-850">
                          <td className="py-3 text-red-500 font-bold">#{o.id}</td>
                          <td className="py-3 text-white">
                            {o.customer_name}
                            {o.order_note && (
                              <span className="block text-[10px] text-red-400/80 font-normal truncate max-w-[150px]">
                                Note: {o.order_note}
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-neutral-300 uppercase text-[10px]">{o.order_type}</td>
                          <td className="py-3 text-white">Rs. {o.total_price}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                              o.status === "Delivered" ? "bg-emerald-500/10 text-emerald-400" :
                              o.status === "Pending" ? "bg-red-500/10 text-red-400" :
                              o.status === "Preparing" ? "bg-blue-500/10 text-blue-400" : "bg-neutral-800 text-neutral-400"
                            }`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Col (1 col): Popular Top Sellers */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
                <Flame className="w-5 h-5 text-red-500 fill-red-500" />
                <h2 className="text-base font-black text-white uppercase tracking-wider">Top Sellers Chart</h2>
              </div>

              {stats.popular_items.length === 0 ? (
                <p className="text-sm text-neutral-500 py-8 text-center">No sales data yet.</p>
              ) : (
                <div className="space-y-4">
                  {stats.popular_items.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-neutral-200">{item.name}</span>
                        <span className="text-red-500">{item.quantity} sold</span>
                      </div>
                      <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-600 to-rose-600 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (item.quantity / (stats.popular_items[0]?.quantity || 1)) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </>
      )}

    </div>
  );
}
