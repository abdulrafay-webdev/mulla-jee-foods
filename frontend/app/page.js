"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { fetchAPI } from "@/lib/api";
import { Flame, ShoppingBag, Star, Clock, Truck, ShieldCheck, ArrowRight, Plus, Check, Zap, Search, UtensilsCrossed } from "lucide-react";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // All Menu Items Section Filter States
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [addedItemIndex, setAddedItemIndex] = useState(null);
  const [addedAllItemIndex, setAddedAllItemIndex] = useState(null);
  
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [cats, featured, items] = await Promise.all([
          fetchAPI("/menu/categories"),
          fetchAPI("/menu/items?featured_only=true"),
          fetchAPI("/menu/items")
        ]);
        setCategories(cats);
        setFeaturedItems(featured);
        setAllItems(items);
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleQuickAdd = (item, idx, isFeatured = false) => {
    addToCart(item, 1, "");
    if (isFeatured) {
      setAddedItemIndex(idx);
      setTimeout(() => setAddedItemIndex(null), 1500);
    } else {
      setAddedAllItemIndex(idx);
      setTimeout(() => setAddedAllItemIndex(null), 1500);
    }
  };

  // Filter all items by category and search query
  const filteredAllItems = allItems.filter((item) => {
    const matchesCat = selectedCategory ? String(item.category_id) === String(selectedCategory) : true;
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <Navbar />

      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-neutral-900 bg-gradient-to-b from-neutral-950 via-neutral-900/60 to-neutral-950">
        {/* Neon Red Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-rose-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Hero Text */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs tracking-wider uppercase shadow-inner">
                <Flame className="w-4 h-4 fill-red-500 animate-pulse text-red-500" />
                The Ultimate Neon Fast Food Experience
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none">
                Sizzle <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent">Every Bite.</span>
                <br />
                Crunch Every Order.
              </h1>

              <p className="text-lg text-neutral-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Handcrafted flame-grilled burgers, cheesy artisanal pizzas, and crispy golden sides delivered piping hot in 35 minutes or less.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-lg tracking-wide uppercase shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Order Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="#deals-section"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-base border border-neutral-800 hover:border-red-500/40 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 text-red-500 fill-red-500" /> Hot Deals & Combos
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-neutral-800/80 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-red-500 font-bold text-base">
                    <Clock className="w-4 h-4" /> 35 Mins
                  </div>
                  <p className="text-xs text-neutral-400">Superfast Delivery</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-red-500 font-bold text-base">
                    <Star className="w-4 h-4 fill-red-500" /> 4.9 / 5
                  </div>
                  <p className="text-xs text-neutral-400">10k+ Happy Foodies</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-red-500 font-bold text-base">
                    <Truck className="w-4 h-4" /> Live Tracking
                  </div>
                  <p className="text-xs text-neutral-400">Realtime Updates</p>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Graphic Card */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 p-4 shadow-2xl shadow-red-600/15">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                    alt="Smokey BBQ Monster Burger"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  
                  {/* Floating Price Tag */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-lg px-4 py-2 rounded-xl shadow-lg border border-red-500/40">
                    Rs. 790
                  </div>

                  {/* Badge Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <div className="inline-block px-3 py-1 rounded-md bg-red-600 text-white font-black text-xs uppercase tracking-widest">
                      Chef Special
                    </div>
                    <h3 className="text-2xl font-black text-white">Smokey BBQ Monster Burger</h3>
                    <p className="text-sm text-neutral-300 line-clamp-1">Double beef patty, melted cheddar, crispy bacon & secret BBQ sauce</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                Explore <span className="text-red-500">Categories</span>
              </h2>
              <p className="text-sm text-neutral-400 mt-1">Select a category to view menu items</p>
            </div>
            <Link href="/menu" className="text-sm font-bold text-red-500 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-36 rounded-2xl bg-neutral-900 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border transition-all duration-300 hover:-translate-y-1 p-3 text-center flex flex-col items-center gap-3 ${
                    String(selectedCategory) === String(cat.id) ? "border-red-500 shadow-lg shadow-red-600/20" : "border-neutral-800 hover:border-red-500/50"
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-800 relative">
                    <img
                      src={cat.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span className="font-bold text-sm text-neutral-200 group-hover:text-red-500 transition-colors">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED / HOT DEALS SECTION */}
      <section id="deals-section" className="py-16 bg-neutral-900/50 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                  Featured <span className="text-red-500">Hot Deals</span>
                </h2>
                <p className="text-sm text-neutral-400">Hand-picked fast food favorites at special prices</p>
              </div>
            </div>

            <Link href="/menu?featured=true" className="text-sm font-bold text-red-500 hover:underline flex items-center gap-1">
              View All Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, idx) => (
              <div
                key={item.id}
                className="group rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-red-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Image & Price Tag */}
                <div className="relative h-56 overflow-hidden bg-neutral-950">
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.discount_price && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      SAVE Rs. {item.price - item.discount_price}
                    </span>
                  )}
                  <span className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md text-red-400 font-extrabold text-sm px-3 py-1 rounded-full border border-red-500/30">
                    {item.category_name}
                  </span>
                </div>

                {/* Info & Add to Cart Button */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white group-hover:text-red-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-neutral-400 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
                    <div>
                      {item.discount_price ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-red-500">Rs. {item.discount_price}</span>
                          <span className="text-sm text-neutral-500 line-through">Rs. {item.price}</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-black text-red-500">Rs. {item.price}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleQuickAdd(item, idx, true)}
                      className="py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                      {addedItemIndex === idx ? (
                        <>
                          <Check className="w-4 h-4 text-white" /> Added!
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[3]" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL MENU ITEMS SECTION */}
      <section className="py-16 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                  All <span className="text-red-500">Menu Items</span>
                </h2>
                <p className="text-sm text-neutral-400">Explore our full menu, burgers, pizzas, sides & drinks</p>
              </div>
            </div>

            {/* Live Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 text-white text-xs rounded-xl py-2.5 pl-9 pr-3 focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    selectedCategory === "" ? "bg-red-600 text-white" : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      String(selectedCategory) === String(cat.id) ? "bg-red-600 text-white" : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-neutral-900 animate-pulse" />
              ))}
            </div>
          ) : filteredAllItems.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-3">
              <p className="text-lg font-bold text-neutral-300">No items match your search or filter.</p>
              <button
                onClick={() => { setSelectedCategory(""); setSearchQuery(""); }}
                className="px-5 py-2 bg-red-600 text-white font-bold text-xs uppercase rounded-xl"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAllItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="group rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-red-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-neutral-950">
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.discount_price && (
                      <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        SAVE Rs. {item.price - item.discount_price}
                      </span>
                    )}
                    <span className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md text-red-400 font-extrabold text-xs px-3 py-1 rounded-full border border-red-500/30">
                      {item.category_name}
                    </span>
                  </div>

                  {/* Info & Add to Cart Button */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white group-hover:text-red-500 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral-400 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
                      <div>
                        {item.discount_price ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-red-500">Rs. {item.discount_price}</span>
                            <span className="text-sm text-neutral-500 line-through">Rs. {item.price}</span>
                          </div>
                        ) : (
                          <span className="text-2xl font-black text-red-500">Rs. {item.price}</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleQuickAdd(item, idx, false)}
                        className="py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        {addedAllItemIndex === idx ? (
                          <>
                            <Check className="w-4 h-4 text-white" /> Added!
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 stroke-[3]" /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-wide">
              Why Fast Foodies <span className="text-red-500">Love Us</span>
            </h2>
            <p className="text-neutral-400">Fresh quality ingredients, blazing fast delivery, and unbeatable taste.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center space-y-4 hover:border-red-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
                <Flame className="w-7 h-7 fill-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Flame-Grilled Fresh</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                100% premium beef and crisp fresh chicken cooked to perfection on open flame grills right upon your order.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center space-y-4 hover:border-red-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">35-Minute Guarantee</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Hot and fresh delivery guaranteed within 35 minutes or get a discount voucher on your next meal.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center space-y-4 hover:border-red-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">100% Hygienic Packaging</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Sealed insulated boxes preserve heat, crispiness, and freshness from our kitchen straight to your table.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
