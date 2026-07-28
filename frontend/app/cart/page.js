"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, Store, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    orderType,
    setOrderType,
    subtotal,
    deliveryFee,
    taxAmount,
    totalPrice,
    restaurantSettings
  } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
            <div>
              <Link href="/menu" className="inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:underline mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Menu
              </Link>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Your Food Cart</h1>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-neutral-400 hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-red-500/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-neutral-800 max-w-xl mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-neutral-800/80 text-neutral-500 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Your cart is currently empty</h2>
                <p className="text-sm text-neutral-400">Explore our delicious fast food menu and satisfy your cravings!</p>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black uppercase text-sm shadow-lg shadow-red-600/30 hover:scale-105 transition-all"
              >
                Browse Menu Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-950 shrink-0">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-white text-base">{item.name}</h3>
                        {item.customizations && (
                          <span className="inline-block px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                            Note: {item.customizations}
                          </span>
                        )}
                        <p className="text-red-500 font-black text-sm">
                          Rs. {item.price} <span className="text-neutral-500 font-normal text-xs">each</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-black text-white text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <p className="font-black text-white text-lg">Rs. {item.price * item.quantity}</p>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Order Summary & Delivery Selector */}
              <div className="space-y-6">
                
                {/* Delivery / Pickup Option */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h2 className="font-extrabold text-white text-sm uppercase tracking-wider">Order Fulfillment</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setOrderType("delivery")}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        orderType === "delivery"
                          ? "bg-red-500/10 border-red-500 text-red-500 shadow-lg"
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <Truck className="w-6 h-6" />
                      <span className="font-bold text-xs uppercase">Home Delivery</span>
                    </button>

                    <button
                      onClick={() => setOrderType("pickup")}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        orderType === "pickup"
                          ? "bg-red-500/10 border-red-500 text-red-500 shadow-lg"
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <Store className="w-6 h-6" />
                      <span className="font-bold text-xs uppercase">Store Pickup</span>
                    </button>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
                  <h2 className="font-extrabold text-white text-base uppercase tracking-wider pb-3 border-b border-neutral-800">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-neutral-300">
                      <span>Items Subtotal</span>
                      <span className="font-bold">Rs. {subtotal}</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-300">
                      <span>Delivery Charge</span>
                      <span className="font-bold">
                        {orderType === "delivery" ? `Rs. ${deliveryFee}` : "FREE (Pickup)"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-300">
                      <span>Govt Tax ({restaurantSettings.tax_rate}%)</span>
                      <span className="font-bold">Rs. {taxAmount}</span>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-lg">
                      <span className="font-black text-white">Grand Total</span>
                      <span className="font-black text-2xl text-red-500">Rs. {totalPrice}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
