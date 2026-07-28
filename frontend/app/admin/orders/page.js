"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Search, Filter, Printer, FileText, CheckCircle2, Clock, Truck, Eye, X, Phone, MapPin } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [printableOrder, setPrintableOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let endpoint = "/orders?";
      if (statusFilter) endpoint += `status_filter=${statusFilter}&`;
      if (typeFilter) endpoint += `order_type=${typeFilter}&`;

      const data = await fetchAPI(endpoint);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, typeFilter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updated = await fetchAPI(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      alert("Failed to update order status: " + err.message);
    }
  };

  const handlePrintReceipt = (order) => {
    setPrintableOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const statusOptions = ["Pending", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];

  return (
    <div className="space-y-8">
      
      {/* Print Styles for Receipts */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-print-area, #receipt-print-area * {
            visibility: visible;
          }
          #receipt-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            color: #000;
            background: #fff;
          }
        }
      `}</style>

      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Order Management</h1>
          <p className="text-xs text-neutral-400">View customer orders, status updates & order notes</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500"
          >
            <option value="">All Types (Delivery / Pickup)</option>
            <option value="delivery">Delivery</option>
            <option value="pickup">Pickup</option>
          </select>

          <button
            onClick={fetchOrders}
            className="px-4 py-2.5 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs uppercase"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400">Loading Orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            No orders found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-neutral-400 border-b border-neutral-800 uppercase tracking-wider">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Customer Details</th>
                  <th className="pb-4">Order Note</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Total</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-semibold">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-850">
                    
                    <td className="py-4 text-amber-400 font-bold text-sm">#{order.id}</td>

                    <td className="py-4">
                      <p className="font-bold text-white text-sm">{order.customer_name}</p>
                      <p className="text-neutral-400 text-[11px]">{order.customer_phone}</p>
                    </td>

                    {/* Customer Order Note Highlight */}
                    <td className="py-4 max-w-[220px]">
                      {order.order_note ? (
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                          <span className="block text-[9px] uppercase tracking-wider text-amber-500">Instruction:</span>
                          "{order.order_note}"
                        </div>
                      ) : (
                        <span className="text-neutral-600 italic">None</span>
                      )}
                    </td>

                    <td className="py-4 text-neutral-300 uppercase text-[10px] font-bold">
                      <span className={`px-2 py-1 rounded ${order.order_type === 'delivery' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {order.order_type}
                      </span>
                    </td>

                    <td className="py-4 text-white font-bold text-sm">Rs. {order.total_price}</td>

                    {/* Status Dropdown */}
                    <td className="py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                          order.status === "Delivered" ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" :
                          order.status === "Pending" ? "bg-amber-500/10 border-amber-500/40 text-amber-400 animate-pulse" :
                          order.status === "Preparing" ? "bg-blue-500/10 border-blue-500/40 text-blue-400" :
                          order.status === "Cancelled" ? "bg-red-500/10 border-red-500/40 text-red-400" :
                          "bg-neutral-800 border-neutral-700 text-neutral-300"
                        }`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st} className="bg-neutral-900 text-white">{st}</option>
                        ))}
                      </select>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handlePrintReceipt(order)}
                        className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
                        title="Print Thermal Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase">Order Details</span>
                <h3 className="text-xl font-black text-white">Order #{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* CUSTOMER ORDER NOTE (PROMINENTLY HIGHLIGHTED) */}
            {selectedOrder.order_note && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <FileText className="w-4 h-4" /> Customer Order Note / Instructions
                </div>
                <p className="text-sm font-semibold text-white pl-6">"{selectedOrder.order_note}"</p>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block uppercase font-bold">Customer Name</span>
                <span className="font-bold text-white text-sm">{selectedOrder.customer_name}</span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase font-bold">Phone Number</span>
                <span className="font-bold text-white text-sm">{selectedOrder.customer_phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500 block uppercase font-bold">Address</span>
                <span className="font-bold text-white">{selectedOrder.delivery_address}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <h4 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">Ordered Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((i) => (
                  <div key={i.id} className="flex justify-between text-xs py-1 border-b border-neutral-800/40">
                    <div>
                      <p className="font-bold text-white">{i.quantity}x {i.item_name}</p>
                      {i.customizations && (
                        <p className="text-amber-400/80 text-[10px]">({i.customizations})</p>
                      )}
                    </div>
                    <span className="font-black text-amber-400">Rs. {i.total_price}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-3 border-t border-neutral-800 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span>Rs. {selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Charge</span>
                  <span>Rs. {selectedOrder.delivery_fee}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tax</span>
                  <span>Rs. {selectedOrder.tax}</span>
                </div>
                <div className="flex justify-between text-base font-black text-amber-400 pt-2 border-t border-neutral-800">
                  <span>Grand Total</span>
                  <span>Rs. {selectedOrder.total_price}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => handlePrintReceipt(selectedOrder)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RECEIPT PRINT TEMPLATE (PRINT ONLY) */}
      {printableOrder && (
        <div id="receipt-print-area" className="hidden print:block font-mono text-black">
          <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold uppercase">Sizzle & Crunch Fast Food</h1>
            <p className="text-sm">456 Gourmet Avenue, Food City</p>
            <p className="text-sm">Tel: +1 (800) 555-CRUNCH</p>
            <p className="text-xs mt-2 font-bold">RECEIPT / KITCHEN TICKET</p>
          </div>

          <div className="mb-4 text-xs space-y-1">
            <p><strong>Order ID:</strong> #{printableOrder.id}</p>
            <p><strong>Date:</strong> {new Date(printableOrder.created_at).toLocaleString()}</p>
            <p><strong>Customer:</strong> {printableOrder.customer_name} ({printableOrder.customer_phone})</p>
            <p><strong>Address:</strong> {printableOrder.delivery_address}</p>
            <p><strong>Type:</strong> {printableOrder.order_type.toUpperCase()} | <strong>Payment:</strong> {printableOrder.payment_method.toUpperCase()}</p>
          </div>

          {/* Special Order Note Highlight on Kitchen Receipt */}
          {printableOrder.order_note && (
            <div className="my-3 p-2 border-2 border-black font-bold text-sm">
              <p>*** SPECIAL INSTRUCTIONS / NOTE ***</p>
              <p className="text-base">"{printableOrder.order_note}"</p>
            </div>
          )}

          <table className="w-full text-xs text-left border-t border-b py-2 mb-4">
            <thead>
              <tr className="border-b">
                <th>QTY</th>
                <th>ITEM</th>
                <th className="text-right">PRICE</th>
              </tr>
            </thead>
            <tbody>
              {printableOrder.items.map((i) => (
                <tr key={i.id} className="border-b">
                  <td className="py-1">{i.quantity}x</td>
                  <td className="py-1">
                    {i.item_name}
                    {i.customizations && <span className="block text-[10px]">({i.customizations})</span>}
                  </td>
                  <td className="py-1 text-right">Rs. {i.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-xs space-y-1 text-right mb-6">
            <p>Subtotal: Rs. {printableOrder.subtotal}</p>
            <p>Delivery Fee: Rs. {printableOrder.delivery_fee}</p>
            <p>Tax: Rs. {printableOrder.tax}</p>
            <p className="text-sm font-bold pt-1 border-t">GRAND TOTAL: Rs. {printableOrder.total_price}</p>
          </div>

          <div className="text-center text-xs border-t pt-4">
            <p>Thank you for choosing Sizzle & Crunch!</p>
            <p>Enjoy your meal!</p>
          </div>
        </div>
      )}

    </div>
  );
}
