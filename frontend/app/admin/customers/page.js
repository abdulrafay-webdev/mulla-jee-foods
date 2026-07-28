"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Users, Phone, MapPin, ShoppingBag, Eye, Calendar } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await fetchAPI("/customers");
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const handleViewCustomerOrders = async (customer) => {
    setSelectedCustomer(customer);
    setOrdersLoading(true);
    try {
      const orders = await fetchAPI(`/customers/${customer.id}/orders`);
      setCustomerOrders(orders);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Customer Management</h1>
        <p className="text-xs text-neutral-400">View registered customers and individual order histories</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-neutral-400">Loading customer data...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">No customer records found yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-neutral-400 border-b border-neutral-800 uppercase tracking-wider">
                  <th className="pb-4">Customer ID</th>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Phone Number</th>
                  <th className="pb-4">Delivery Address</th>
                  <th className="pb-4">Total Orders</th>
                  <th className="pb-4">Total Spent</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-semibold">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-850">
                    <td className="py-4 text-amber-400 font-bold">#{c.id}</td>
                    <td className="py-4 text-white font-bold text-sm">{c.name}</td>
                    <td className="py-4 text-neutral-300">{c.phone}</td>
                    <td className="py-4 text-neutral-400 max-w-xs truncate">{c.address}</td>
                    <td className="py-4 font-bold text-amber-400">{c.total_orders} Orders</td>
                    <td className="py-4 font-black text-emerald-400">Rs. {c.total_spent}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleViewCustomerOrders(c)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-amber-400 text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Order History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOMER ORDER HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase">Customer Order History</span>
                <h3 className="text-xl font-black text-white">{selectedCustomer.name}</h3>
                <p className="text-xs text-neutral-400">{selectedCustomer.phone} | {selectedCustomer.address}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-neutral-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {ordersLoading ? (
              <div className="text-center py-12 text-neutral-400">Loading Order History...</div>
            ) : customerOrders.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">No past orders found for this customer.</div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                {customerOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-400">Order #{order.id}</span>
                      <span className="text-neutral-500">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    {order.order_note && (
                      <p className="text-amber-400/90 italic">Note: "{order.order_note}"</p>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-800">
                      <span className="text-neutral-400">{order.items.length} Items</span>
                      <span className="font-black text-white text-sm">Rs. {order.total_price} ({order.status})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
