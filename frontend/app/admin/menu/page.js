"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import ImageKitUploadModal from "@/components/ImageKitUploadModal";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Flame, Image as ImageIcon, Upload } from "lucide-react";

export default function AdminMenuPage() {
  const [activeTab, setActiveTab] = useState("items"); // "items" or "categories"
  
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Item Modal Form State
  const [showItemModal, setShowItemModal] = useState(false);
  const [showImageKitModal, setShowImageKitModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDiscountPrice, setItemDiscountPrice] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [itemIsFeatured, setItemIsFeatured] = useState(false);

  // Category Modal Form State
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catImageUrl, setCatImageUrl] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([
        fetchAPI("/menu/admin/categories"),
        fetchAPI("/menu/admin/items")
      ]);
      setCategories(cats);
      setItems(menuItems);
      if (cats.length > 0 && !itemCategoryId) {
        setItemCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ITEM ACTIONS
  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setItemName("");
    setItemDescription("");
    setItemPrice("");
    setItemDiscountPrice("");
    setItemImageUrl("");
    setItemIsFeatured(false);
    if (categories.length > 0) setItemCategoryId(categories[0].id);
    setShowItemModal(true);
  };

  const handleOpenEditItem = (item) => {
    setEditingItem(item);
    setItemCategoryId(item.category_id);
    setItemName(item.name);
    setItemDescription(item.description || "");
    setItemPrice(item.price);
    setItemDiscountPrice(item.discount_price || "");
    setItemImageUrl(item.image_url || "");
    setItemIsFeatured(item.is_featured);
    setShowItemModal(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const payload = {
      category_id: Number(itemCategoryId),
      name: itemName,
      description: itemDescription || null,
      price: parseFloat(itemPrice),
      discount_price: itemDiscountPrice ? parseFloat(itemDiscountPrice) : null,
      image_url: itemImageUrl || null,
      is_featured: itemIsFeatured
    };

    try {
      if (editingItem) {
        await fetchAPI(`/menu/items/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await fetchAPI("/menu/items", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      setShowItemModal(false);
      loadData();
    } catch (err) {
      alert("Error saving item: " + err.message);
    }
  };

  const handleToggleAvailability = async (itemId) => {
    try {
      await fetchAPI(`/menu/items/${itemId}/toggle-availability`, {
        method: "PATCH"
      });
      loadData();
    } catch (err) {
      alert("Failed to toggle availability");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await fetchAPI(`/menu/items/${itemId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  // CATEGORY ACTIONS
  const handleOpenCreateCat = () => {
    setEditingCat(null);
    setCatName("");
    setCatSlug("");
    setCatDescription("");
    setCatImageUrl("");
    setShowCatModal(true);
  };

  const handleSaveCat = async (e) => {
    e.preventDefault();
    const slug = catSlug || catName.toLowerCase().replace(/\s+/g, "-");
    const payload = {
      name: catName,
      slug: slug,
      description: catDescription || null,
      image_url: catImageUrl || null
    };

    try {
      if (editingCat) {
        await fetchAPI(`/menu/categories/${editingCat.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await fetchAPI("/menu/categories", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      setShowCatModal(false);
      loadData();
    } catch (err) {
      alert("Error saving category: " + err.message);
    }
  };

  const handleDeleteCat = async (catId) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetchAPI(`/menu/categories/${catId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Menu Management</h1>
          <p className="text-xs text-neutral-400">Add, edit, delete menu items, categories & stock status</p>
        </div>

        <div className="flex gap-2 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("items")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "items" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            Menu Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "categories" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>
      </div>

      {/* ITEMS TAB */}
      {activeTab === "items" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleOpenCreateItem}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Menu Item
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 overflow-hidden">
            {loading ? (
              <div className="text-center py-16 text-neutral-400">Loading Menu Items...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 text-neutral-500">No menu items found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-neutral-400 border-b border-neutral-800 uppercase tracking-wider">
                      <th className="pb-4">Image</th>
                      <th className="pb-4">Name & Description</th>
                      <th className="pb-4">Category</th>
                      <th className="pb-4">Price</th>
                      <th className="pb-4">Stock Status</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-semibold">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-850">
                        <td className="py-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                            <img
                              src={item.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        <td className="py-3">
                          <p className="font-bold text-white text-sm flex items-center gap-1.5">
                            {item.name}
                            {item.is_featured && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] uppercase font-black">
                                Featured
                              </span>
                            )}
                          </p>
                          <p className="text-neutral-400 text-[11px] line-clamp-1 max-w-xs">{item.description}</p>
                        </td>

                        <td className="py-3 text-neutral-300">{item.category_name}</td>

                        <td className="py-3">
                          {item.discount_price ? (
                            <div>
                              <span className="text-amber-400 font-bold">Rs. {item.discount_price}</span>
                              <span className="text-neutral-500 line-through text-[10px] block">Rs. {item.price}</span>
                            </div>
                          ) : (
                            <span className="text-white font-bold">Rs. {item.price}</span>
                          )}
                        </td>

                        {/* Stock status toggle */}
                        <td className="py-3">
                          <button
                            onClick={() => handleToggleAvailability(item.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase border transition-all ${
                              item.is_available
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                : "bg-red-500/10 border-red-500/40 text-red-400"
                            }`}
                          >
                            {item.is_available ? "In Stock (Available)" : "Out of Stock"}
                          </button>
                        </td>

                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditItem(item)}
                            className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleOpenCreateCat}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 shrink-0">
                    <img
                      src={cat.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80"}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{cat.name}</h3>
                    <p className="text-xs text-neutral-500">{cat.slug}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCat(cat.id)}
                  className="p-2 rounded-xl text-neutral-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ITEM CREATE/EDIT MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveItem} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-black text-white">{editingItem ? "Edit Menu Item" : "Create Menu Item"}</h3>
              <button type="button" onClick={() => setShowItemModal(false)} className="text-neutral-400 font-bold">✕</button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">Category *</label>
              <select
                value={itemCategoryId}
                onChange={(e) => setItemCategoryId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">Item Name *</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Zinger Supreme Burger"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">Description</label>
              <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Item ingredients & taste details..."
                rows={2}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Regular Price (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="650"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">Deal Price (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemDiscountPrice}
                  onChange={(e) => setItemDiscountPrice(e.target.value)}
                  placeholder="550"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-neutral-300">Image URL (ImageKit CDN)</label>
                <button
                  type="button"
                  onClick={() => setShowImageKitModal(true)}
                  className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> Upload to ImageKit
                </button>
              </div>
              <input
                type="url"
                value={itemImageUrl}
                onChange={(e) => setItemImageUrl(e.target.value)}
                placeholder="https://ik.imagekit.io/... or https://..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={itemIsFeatured}
                onChange={(e) => setItemIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0"
              />
              <label htmlFor="is_featured" className="text-xs font-bold text-amber-400">
                Mark as Hot Deal / Featured Item
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-950 text-neutral-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-black uppercase"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORY CREATE MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveCat} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-black text-white">Create Category</h3>
              <button type="button" onClick={() => setShowCatModal(false)} className="text-neutral-400 font-bold">✕</button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">Category Name *</label>
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Desserts & Shakes"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">Image URL</label>
              <input
                type="url"
                value={catImageUrl}
                onChange={(e) => setCatImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-950 text-neutral-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-black uppercase"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* IMAGEKIT UPLOAD MODAL */}
      {showImageKitModal && (
        <ImageKitUploadModal
          onUploadComplete={(url) => {
            setItemImageUrl(url);
            setShowImageKitModal(false);
          }}
          onClose={() => setShowImageKitModal(false)}
        />
      )}

    </div>
  );
}
