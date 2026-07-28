import Link from "next/link";
import { Phone, MapPin, Clock, Mail, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info - Direct Image (Mulla Jee Foods) */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Mulla Jee Foods Logo"
                className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]"
              />
              <span className="text-xl font-black tracking-wider text-white uppercase">
                Mulla Jee <span className="text-red-500">Foods</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Flame-grilled burgers, loaded artisanal pizzas, crisp golden fries, and instant fast food delivery straight to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-red-500 transition-colors">Explore Menu</Link></li>
              <li><Link href="/menu?featured=true" className="hover:text-red-500 transition-colors">Special Combos</Link></li>
              <li><Link href="/track" className="hover:text-red-500 transition-colors">Live Order Tracking</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Opening Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Monday - Sunday</span>
              </li>
              <li className="pl-6 font-semibold text-neutral-200">11:00 AM - 11:30 PM</li>
              <li className="pl-6 text-xs text-red-500/80">Late Night Express Delivery</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact & Orders</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Main Commercial Avenue, Food City</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-semibold text-white">+1 (800) 555-MULLA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>orders@mullajeefoods.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Mulla Jee Foods. All rights reserved.</p>
          <Link href="/admin/login" className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Shield className="w-3.5 h-3.5" /> Admin Panel Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
