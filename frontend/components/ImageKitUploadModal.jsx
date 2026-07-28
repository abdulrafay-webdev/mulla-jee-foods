"use client";

import { useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Upload, ImageIcon, Check, Loader2 } from "lucide-react";

export default function ImageKitUploadModal({ onUploadComplete, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [directUrlInput, setDirectUrlInput] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      // 1. Get ImageKit authentication parameters from backend
      const authParams = await fetchAPI("/imagekit/auth");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", authParams.publicKey || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "");
      formData.append("signature", authParams.signature);
      formData.append("expire", authParams.expire);
      formData.append("token", authParams.token);

      // Upload directly to ImageKit upload API
      const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "ImageKit upload failed");
      }

      const data = await res.json();
      setPreviewUrl(data.url);
      onUploadComplete(data.url);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload image to ImageKit");
    } finally {
      setUploading(false);
    }
  };

  const handleApplyUrl = () => {
    if (directUrlInput.trim()) {
      onUploadComplete(directUrlInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" /> ImageKit Uploader
          </h3>
          <button onClick={onClose} className="text-neutral-400 font-bold">✕</button>
        </div>

        {error && (
          <p className="text-xs font-bold text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/30">
            {error}
          </p>
        )}

        {/* Upload File to ImageKit */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Option 1: Upload File directly to ImageKit CDN
          </label>
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 hover:border-amber-500/50 rounded-2xl cursor-pointer bg-neutral-950/60 transition-all text-center">
            {uploading ? (
              <div className="space-y-2">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <span className="text-xs text-neutral-400 font-bold">Uploading to ImageKit...</span>
              </div>
            ) : previewUrl ? (
              <div className="space-y-2">
                <img src={previewUrl} alt="Uploaded preview" className="w-24 h-24 object-cover rounded-xl mx-auto border border-neutral-700" />
                <span className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Upload Successful!
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-neutral-500 mx-auto" />
                <span className="text-xs font-bold text-neutral-300 block">Click to select image file</span>
                <span className="text-[10px] text-neutral-500 block">PNG, JPG, WEBP up to 5MB</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
        </div>

        <div className="relative text-center">
          <span className="px-3 bg-neutral-900 text-xs text-neutral-500 relative z-10 font-bold">OR</span>
          <div className="absolute inset-0 top-1/2 border-t border-neutral-800" />
        </div>

        {/* Option 2: Image URL input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Option 2: Paste Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={directUrlInput}
              onChange={(e) => setDirectUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none"
            />
            <button
              onClick={handleApplyUrl}
              className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl uppercase"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-neutral-950 text-neutral-400 text-xs font-bold rounded-xl">
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
