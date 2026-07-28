"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { fetchAPI } from "@/lib/api";
import { ShieldCheck, Truck, Store, Banknote, ArrowLeft, CheckCircle2, FileText, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    orderType,
    setOrderType,
    orderNote,
    setOrderNote,
    subtotal,
    deliveryFee: defaultDeliveryFee,
    taxAmount,
    totalPrice: defaultTotalPrice,
    restaurantSettings
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  
  // Delivery Area Selection States
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedAreaObj, setSelectedAreaObj] = useState(null);
  const [detailedAddress, setDetailedAddress] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadDeliveryAreas() {
      try {
        const areas = await fetchAPI("/delivery-areas");
        setDeliveryAreas(areas);
        if (areas.length > 0) {
          setSelectedAreaId(String(areas[0].id));
          setSelectedAreaObj(areas[0]);
        }
      } catch (err) {
        console.error("Failed to load delivery areas", err);
      }
    }
    loadDeliveryAreas();
  }, []);

  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setSelectedAreaId(areaId);
    const found = deliveryAreas.find((a) => String(a.id) === String(areaId));
    setSelectedAreaObj(found || null);
  };

  // Calculate area-specific delivery fee and grand total
  const currentDeliveryFee = orderType === "delivery"
    ? (selectedAreaObj ? selectedAreaObj.delivery_charge : defaultDeliveryFee)
    : 0;

  const currentTotalPrice = subtotal + currentDeliveryFee + taxAmount;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg("Your cart is empty. Please add items to order.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("Please fill in customer name and phone number.");
      return;
    }

    if (orderType === "delivery") {
      if (!selectedAreaObj) {
        setErrorMsg("Please select your delivery area.");
        return;
      }
      if (!detailedAddress.trim()) {
        setErrorMsg("Please enter your detailed street address.");
        return;
      }
    }

    setSubmitting(true);
    setErrorMsg("");

    const fullAddress = orderType === "delivery"
      ? `Area: ${selectedAreaObj.name} | Address: ${detailedAddress.trim()}`
      : "Store Pickup";

    try {
      const orderPayload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: fullAddress,
        customer_email: customerEmail || null,
        order_type: orderType,
        payment_method: "cash", // Cash on Delivery / Pickup
        order_note: orderNote || null, // Optional special instructions
        items: cart.map((i) => ({
          menu_item_id: i.id,
          quantity: i.quantity,
          customizations: i.customizations || null,
        })),
      };

      const createdOrder = await fetchAPI("/orders", {
        method: "POST",
        body: JSON.stringify(orderPayload),
      });

      clearCart();
      router.push(`/order-success/${createdOrder.id}`);
    } catch (err) {
      setErrorMsg(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:underline mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </Link>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Checkout Order</h1>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-neutral-800 space-y-4">
              <p className="text-xl font-bold text-neutral-300">Your cart is empty.</p>
              <Link href="/menu" className="inline-block px-6 py-3 bg-red-600 text-white font-bold rounded-xl text-sm uppercase">
                Return to Menu
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left & Middle Column: Customer Details & Area Selection */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                    {errorMsg}
                  </div>
                )}

                {/* 1. Customer Information */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
                  <h2 className="text-lg font-extrabold text-white uppercase tracking-wider pb-3 border-b border-neutral-800">
                    1. Customer Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-3.5 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+1 555-0199 or 0300-1234567"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-3.5 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. Fulfillment & Delivery Area Selector */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <h2 className="text-lg font-extrabold text-white uppercase tracking-wider">
                      2. Fulfillment & Delivery Location
                    </h2>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType("delivery")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          orderType === "delivery" ? "bg-red-600 text-white" : "bg-neutral-950 text-neutral-400"
                        }`}
                      >
                        Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType("pickup")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          orderType === "pickup" ? "bg-red-600 text-white" : "bg-neutral-950 text-neutral-400"
                        }`}
                      >
                        Pickup
                      </button>
                    </div>
                  </div>

                  {orderType === "delivery" ? (
                    <div className="space-y-5">
                      
                      {/* Area Dropdown Selector */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-red-500" /> Select Your Delivery Area *
                        </label>
                        {deliveryAreas.length === 0 ? (
                          <p className="text-xs text-neutral-500">Loading delivery zones...</p>
                        ) : (
                          <select
                            value={selectedAreaId}
                            onChange={handleAreaChange}
                            required
                            className="w-full bg-neutral-950 border border-red-500/40 focus:border-red-500 text-white rounded-xl p-3.5 text-sm font-semibold focus:outline-none"
                          >
                            {deliveryAreas.map((area) => (
                              <option key={area.id} value={area.id} className="bg-neutral-900 text-white">
                                {area.name} — Delivery Fee: Rs. {area.delivery_charge} (Est: ~{area.estimated_time_minutes} mins)
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* Detailed Address Field Below Area Selector */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                          Detailed Street Address *
                        </label>
                        <textarea
                          required
                          value={detailedAddress}
                          onChange={(e) => setDetailedAddress(e.target.value)}
                          placeholder="House / Apartment #, Building Name, Street # / Lane, Landmark..."
                          rows={3}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-3.5 text-sm text-white focus:outline-none"
                        />
                        <p className="text-[11px] text-neutral-500">Please provide specific house or flat details for accurate rider delivery.</p>
                      </div>

                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                      Store Pickup selected. Collect your hot order at <strong>456 Gourmet Avenue, Food City</strong> in 20 minutes!
                    </div>
                  )}
                </div>

                {/* 3. OPTIONAL ORDER NOTES / INSTRUCTIONS FIELD */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h2 className="text-lg font-extrabold text-white uppercase tracking-wider pb-3 border-b border-neutral-800 flex items-center justify-between">
                    <span>3. Special Instructions / Order Notes</span>
                    <span className="text-xs font-semibold text-neutral-500 lowercase">(optional)</span>
                  </h2>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-red-500 uppercase tracking-wider">
                      Customer Order Note (Optional)
                    </label>
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Write optional special food preparation or delivery notes here (e.g. 'no onions', 'extra spicy', 'ring bell twice', 'deliver after 8pm')..."
                      rows={3}
                      className="w-full bg-neutral-950 border border-red-500/30 focus:border-red-500 rounded-xl p-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none"
                    />
                    <p className="text-xs text-neutral-400">Optional instructions will be printed directly on the kitchen ticket for our chefs!</p>
                  </div>
                </div>

                {/* 4. Payment Method Notice */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h2 className="text-lg font-extrabold text-white uppercase tracking-wider pb-3 border-b border-neutral-800">
                    4. Payment Method
                  </h2>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-red-500/30 flex items-center gap-3">
                    <Banknote className="w-6 h-6 text-red-500 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-white">Cash on Delivery / Store Pickup</p>
                      <p className="text-xs text-neutral-400">Pay cash upon delivery or pickup</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary Box */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 sticky top-24">
                  <h2 className="font-extrabold text-white text-base uppercase tracking-wider pb-3 border-b border-neutral-800">
                    Summary ({cart.length} Items)
                  </h2>

                  <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/50">
                        <div>
                          <p className="font-bold text-white">{item.quantity}x {item.name}</p>
                          {item.customizations && (
                            <p className="text-red-400 text-[10px]">{item.customizations}</p>
                          )}
                        </div>
                        <span className="font-bold text-neutral-300">Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-neutral-800 text-sm">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span className="font-semibold text-white">Rs. {subtotal}</span>
                    </div>
                    
                    <div className="flex justify-between text-neutral-400">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-white">
                        {orderType === "delivery" ? `Rs. ${currentDeliveryFee}` : "FREE"}
                      </span>
                    </div>

                    <div className="flex justify-between text-neutral-400">
                      <span>Tax</span>
                      <span className="font-semibold text-white">Rs. {taxAmount}</span>
                    </div>

                    <div className="flex justify-between text-lg font-black text-red-500 pt-3 border-t border-neutral-800">
                      <span>Total</span>
                      <span>Rs. {currentTotalPrice}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {submitting ? "Placing Order..." : "Confirm & Place Order →"}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Instant Kitchen Dispatch</span>
                  </div>
                </div>
              </div>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
