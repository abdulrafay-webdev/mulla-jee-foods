"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { fetchAPI } from "@/lib/api";
import { Search, Flame, Plus, Check, ShoppingBag, Zap } from "lucide-react";

export default function MenuPage({ searchParams }) {
  const params = searchParams ? (typeof searchParams.then === 'function' ? use(searchParams) : searchParams) : {};
  const initialCategory = params.category || "";
  const initialFeatured = params.featured === "true";

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(initialFeatured);
  const [loading, setLoading] = useState(true);

  const [addedItemId, setAddedItemId] = useState(null);

  const { addToCart, cart, totalPrice } = useCart();

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await fetchAPI("/menu/categories");
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadMenuItems() {
      setLoading(true);
      try {
        let endpoint = "/menu/items?";
        if (selectedCategory) endpoint += `category_id=${selectedCategory}&`;
        if (searchQuery) endpoint += `search=${encodeURIComponent(searchQuery)}&`;
        if (featuredOnly) endpoint += `featured_only=true&`;

        const menuItems = await fetchAPI(endpoint);
        setItems(menuItems);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMenuItems();
  }, [selectedCategory, searchQuery, featuredOnly]);

  const handleQuickAdd = (item) => {
    addToCart(item, 1, "");
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Navbar />

      {/* HEADER & SEARCH BAR */}
      <section className="bg-gradient-to-b from-neutral-900 via-neutral-900/80 to-neutral-950 py-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-widest">
            <Flame className="w-4 h-4 fill-red-500 text-red-500" /> Mulla Jee Foods Menu
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Explore Our <span className="bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">Delicious Menu</span>
          </h1>

          {/* Search Input Box */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search burgers, pizzas, deals, fries..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500/80 text-white rounded-2xl py-4 pl-12 pr-4 shadow-xl text-sm placeholder-neutral-500 focus:outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="sticky top-[80px] z-40 bg-neutral-950/95 backdrop-blur-md py-4 border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => { setSelectedCategory(""); setFeaturedOnly(false); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === "" && !featuredOnly
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
              }`}
            >
              All Items
            </button>

            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                featuredOnly
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
                  : "bg-neutral-900 text-red-400 hover:bg-neutral-800 border border-neutral-800"
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> Hot Deals
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setFeaturedOnly(false); }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                  String(selectedCategory) === String(cat.id)
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MENU ITEMS GRID */}
      <section className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-neutral-900 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-neutral-800 space-y-4">
              <p className="text-xl font-bold text-neutral-300">No menu items found</p>
              <p className="text-sm text-neutral-500">Try searching for something else or reset your filters.</p>
              <button
                onClick={() => { setSelectedCategory(""); setSearchQuery(""); setFeaturedOnly(false); }}
                className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm uppercase"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-red-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                >
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
                        onClick={() => handleQuickAdd(item)}
                        className="py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        {addedItemId === item.id ? (
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

      {/* FLOATING CART BAR FOR MOBILE */}
      {cart.length > 0 && (
        <div className="sticky bottom-4 z-40 px-4 max-w-lg mx-auto w-full md:hidden">
          <Link
            href="/cart"
            className="flex items-center justify-between bg-gradient-to-r from-red-600 to-rose-600 text-white font-black px-6 py-4 rounded-2xl shadow-2xl shadow-red-600/40"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              <span>{cart.reduce((s, i) => s + i.quantity, 0)} Items</span>
            </div>
            <span className="text-sm uppercase">Checkout (Rs. {totalPrice}) →</span>
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
