import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mulla Jee Foods | Flame-Grilled Burgers, Pizzas & Express Fast Food",
  description: "Order delicious fast food online from Mulla Jee Foods. Fresh burgers, crispy chicken, artisanal pizzas, and superfast 35-minute delivery.",
  keywords: ["Mulla Jee Foods", "Fast Food", "Burgers", "Pizza", "Food Delivery", "Karachi Fast Food"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-neutral-950 text-neutral-100 antialiased selection:bg-red-500 selection:text-white`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
