"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  MapPin,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Shield,
  Menu as MenuIcon,
  X
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!token || !user)) {
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    }
  }, [token, user, loading, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-neutral-400 font-bold text-sm">Verifying Admin Permissions...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Menu Items", href: "/admin/menu", icon: UtensilsCrossed },
    { label: "Delivery Areas", href: "/admin/delivery-areas", icon: MapPin },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Finance & Sales", href: "/admin/finance", icon: DollarSign },
    { label: "Restaurant Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-900 border-r border-neutral-800 p-6 justify-between shrink-0">
        <div className="space-y-8">
          
          {/* Logo - Direct Image (Mulla Jee Foods) */}
          <Link href="/admin" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Mulla Jee Foods Logo"
              className="h-10 w-auto object-contain shrink-0 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]"
            />
            <div>
              <span className="font-black text-base text-white uppercase tracking-wider block">
                Mulla Jee <span className="text-red-500">Foods</span>
              </span>
              <span className="text-[10px] font-bold text-red-500/90 uppercase tracking-widest block">
                Management Panel
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/80"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-neutral-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex items-center justify-center text-sm">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-white truncate">{user.full_name || user.username}</p>
              <p className="text-xs text-neutral-500 truncate">Administrator</p>
            </div>
          </div>

          <button
            onClick={() => { logout(); router.push("/admin/login"); }}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-red-500/40 text-neutral-400 hover:text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 max-w-[70%]">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain shrink-0" />
            <span className="font-black text-white uppercase text-sm sm:text-base truncate">Mulla Jee Admin</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-950"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden bg-neutral-900 border-b border-neutral-800 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${
                    pathname === item.href ? "bg-red-600 text-white" : "text-neutral-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => { logout(); router.push("/admin/login"); }}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-red-500/10 text-red-400 font-bold text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-10 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
