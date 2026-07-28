"use client";

import { useState, useEffect, use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAPI } from "@/lib/api";
import { Search, Clock, CheckCircle2, ChefHat, Bike, PackageCheck, AlertCircle, Phone, FileText } from "lucide-react";

export default function OrderTrackingPage({ searchParams }) {
  const params = searchParams ? (typeof searchParams.then === 'function' ? use(searchParams) : searchParams) : {};
  const queryOrderId = params.orderId || "";

  const [inputQuery, setInputQuery] = useState(queryOrderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrackOrder = async (e) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setSearched(true);

    try {
      const data = await fetchAPI(`/orders/${inputQuery.trim()}`);
      setOrder(data);
    } catch (err) {
      setOrder(null);
      setErrorMsg("Order not found. Please check your Order ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryOrderId) {
      handleTrackOrder();
    }
  }, [queryOrderId]);

  const steps = [
    { label: "Order Received", status: "Pending", icon: Clock },
    { label: "Kitchen Preparing", status: "Preparing", icon: ChefHat },
    { label: "Out for Delivery", status: "Out for Delivery", icon: Bike },
    { label: "Delivered", status: "Delivered", icon: PackageCheck },
  ];

  const getStepIndex = (currentStatus) => {
    switch (currentStatus) {
      case "Pending": return 0;
      case "Preparing": return 1;
      case "Ready": return 1;
      case "Out for Delivery": return 2;
      case "Delivered": return 3;
      case "Cancelled": return -1;
      default: return 0;
    }
  };

  const activeStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header & Search Bar */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Live <span className="text-red-500">Order Tracking</span>
            </h1>
            <p className="text-neutral-400 text-sm">Enter your Order ID to view real-time kitchen & delivery status.</p>

            <form onSubmit={handleTrackOrder} className="max-w-md mx-auto flex gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. 1, 2, 3...)"
                className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 text-white font-black rounded-xl text-sm uppercase tracking-wider hover:bg-red-500 transition-colors shadow-md"
              >
                Track
              </button>
            </form>
          </div>

          {/* Results Area */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-neutral-400 text-sm">Fetching order status...</p>
            </div>
          ) : errorMsg ? (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-red-400 font-bold text-base">{errorMsg}</p>
            </div>
          ) : order ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
              
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-800 text-center sm:text-left">
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Order #{order.id}</span>
                  <h2 className="text-2xl font-black text-white">Status: <span className="text-red-500">{order.status}</span></h2>
                </div>
                <div className="px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-2 text-sm text-emerald-400 font-bold">
                  <Clock className="w-4 h-4" /> Est. Time: ~{order.estimated_time_minutes} mins
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              {order.status === "Cancelled" ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-center">
                  This order was cancelled by the restaurant or customer.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isPassed = idx <= activeStep;
                    const isCurrent = idx === activeStep;

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                          isCurrent
                            ? "bg-red-500/10 border-red-500 text-red-400 shadow-lg shadow-red-500/10"
                            : isPassed
                            ? "bg-neutral-950 border-emerald-500/40 text-emerald-400"
                            : "bg-neutral-950/60 border-neutral-800 text-neutral-600"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto bg-neutral-900 border border-current">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="block font-bold text-xs uppercase tracking-wider">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Order Notes Highlight (if provided) */}
              {order.order_note && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                    <FileText className="w-4 h-4" /> Customer Order Note
                  </div>
                  <p className="text-sm font-semibold text-white pl-6">"{order.order_note}"</p>
                </div>
              )}

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-800 text-sm">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-neutral-400">Customer Details</h3>
                  <p className="font-semibold text-white">{order.customer_name}</p>
                  <p className="text-neutral-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-red-500" /> {order.customer_phone}</p>
                  <p className="text-neutral-400">{order.delivery_address}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-neutral-400">Order Summary</h3>
                  {order.items.map((i) => (
                    <div key={i.id} className="flex justify-between text-xs">
                      <span>{i.quantity}x {i.item_name}</span>
                      <span className="font-bold">Rs. {i.total_price}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-neutral-800 flex justify-between font-black text-red-500 text-base">
                    <span>Total Amount</span>
                    <span>Rs. {order.total_price}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : searched ? (
            <p className="text-center text-neutral-500">No order details available.</p>
          ) : null}

        </div>
      </main>

      <Footer />
    </div>
  );
}
