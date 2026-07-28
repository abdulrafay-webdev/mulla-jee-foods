"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Shield, Lock, User, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await login(username, password);
      router.push("/admin");
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-8 shadow-2xl relative z-10">
        
        {/* Brand Header - Direct Logo Image (No Box) */}
        <div className="text-center space-y-3">
          <img
            src="/images/logo.png"
            alt="Restaurant Logo"
            className="h-20 w-auto object-contain mx-auto drop-shadow-[0_0_16px_rgba(239,68,68,0.4)]"
          />
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Admin Portal</h1>
          <p className="text-xs text-neutral-400">Secure restaurant management login</p>
        </div>

        {/* Demo Credentials Notice */}
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium space-y-1">
          <p className="font-bold">Default Demo Login:</p>
          <p>Username: <code className="text-white font-mono">admin</code> | Password: <code className="text-white font-mono">admin123</code></p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-3.5 pl-11 text-sm text-white focus:outline-none"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-3.5 pl-11 text-sm text-white focus:outline-none"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Panel →"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-neutral-400 hover:text-red-500 transition-colors">
            ← Return to Customer Website
          </Link>
        </div>

      </div>
    </div>
  );
}
