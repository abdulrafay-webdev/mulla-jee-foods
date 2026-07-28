"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAPI } from "@/lib/api";
import { CheckCircle2, Clock, MapPin, Truck, ArrowRight, Phone, FileText } from "lucide-react";

export default function OrderSuccessPage({ params }) {
  const unwrappedParams = typeof params.then === 'function' ? use(params) : params;
  const orderId = unwrappedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await fetchAPI(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) loadOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="flex-1 py-16 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6">
          
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-400 font-bold">Loading Order Confirmation...</p>
            </div>
          ) : !order ? (
            <div className="text-center py-20 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-4">
              <h1 className="text-2xl font-bold text-white">Order Not Found</h1>
              <Link href="/menu" className="inline-block px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm">
                Return to Menu
              </Link>
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
              {/* Header Icon */}
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Order Confirmed!</h1>
                <p className="text-neutral-400 text-sm">
                  Thank you <span className="text-red-500 font-bold">{order.customer_name}</span>! Your order has been dispatched to our kitchen.
                </p>
              </div>

              {/* Order ID & Estimated Time Pill */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest block font-bold">Order ID</span>
                  <span className="text-lg font-black text-red-500">#{order.id}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest block font-bold">Estimated Time</span>
                  <span className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" /> ~{order.estimated_time_minutes} mins
                  </span>
                </div>
              </div>

              {/* Order Notes Highlight (if provided) */}
              {order.order_note && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                    <FileText className="w-4 h-4" /> Special Instructions / Order Note
                  </div>
                  <p className="text-sm font-semibold text-white pl-6">"{order.order_note}"</p>
                </div>
              )}

              {/* Order Summary Items */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Order Items</h2>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm py-1.5 border-b border-neutral-800/40">
                      <div>
                        <span className="font-bold text-white">{item.quantity}x {item.item_name}</span>
                        {item.customizations && (
                          <span className="block text-xs text-neutral-400 font-medium">({item.customizations})</span>
                        )}
                      </div>
                      <span className="font-black text-red-500">Rs. {item.total_price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-lg font-black pt-2 text-white">
                  <span>Grand Total Paid</span>
                  <span className="text-2xl text-red-500">Rs. {order.total_price}</span>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-6 border-t border-neutral-800">
                <Link
                  href={`/track?orderId=${order.id}`}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  Track Live Order Status <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
