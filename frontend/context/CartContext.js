"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("delivery"); // delivery or pickup
  const [orderNote, setOrderNote] = useState("");
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: "Mulla Jee Foods",
    delivery_fee: 150.0,
    tax_rate: 5.0,
    currency_symbol: "Rs. "
  });

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("fastfood_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("fastfood_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const addToCart = (item, quantity = 1, selectedCustomizations = "") => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (ci) => ci.id === item.id && ci.customizations === selectedCustomizations
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const unitPrice = item.discount_price ? item.discount_price : item.price;
        return [
          ...prevCart,
          {
            id: item.id,
            name: item.name,
            price: unitPrice,
            image_url: item.image_url,
            quantity: quantity,
            customizations: selectedCustomizations,
          },
        ];
      }
    });
  };

  const updateQuantity = (index, delta) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setOrderNote("");
    localStorage.removeItem("fastfood_cart");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderType === "delivery" ? restaurantSettings.delivery_fee : 0;
  const taxAmount = Math.round(subtotal * (restaurantSettings.tax_rate / 100));
  const totalPrice = subtotal + deliveryFee + taxAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        orderType,
        setOrderType,
        orderNote,
        setOrderNote,
        subtotal,
        deliveryFee,
        taxAmount,
        totalPrice,
        restaurantSettings,
        setRestaurantSettings
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
