"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string | null;
  onUpload: (url: string) => void;
  folder?: string;
  label?: string;
  name?: string;
  aspectRatio?: "square" | "video" | "banner";
}

interface RecentImage {
  id: string;
  secureUrl: string;
  cloudinaryId: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export function ImageUpload({
  currentImage,
  onUpload,
  folder = "general",
  label = "Upload Image",
  name = "imageUrl",
  aspectRatio = "square",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [recentImages, setRecentImages] = useState<RecentImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square w-48",
    video: "aspect-video w-full max-w-md",
    banner: "aspect-[3/1] w-full max-w-lg",
  };

  // Fetch recent images
  useEffect(() => {
    async function fetchRecentImages() {
      try {
        const params = new URLSearchParams({
          folder,
          limit: "6",
        });
        const url = `/api/admin/upload/recent?${params.toString()}`;
        console.log("Fetching recent images from:", url);
        const res = await fetch(url);
        console.log("Recent images response status:", res.status);
        
        if (!res.ok) {
          console.warn("Failed to fetch recent images:", res.status, res.statusText);
          return;
        }
        
        const data = await res.json();
        console.log("Recent images loaded:", data.length, "images");
        setRecentImages(data);
      } catch (error) {
        console.warn("Failed to fetch recent images:", error);
      }
    }

    fetchRecentImages();
  }, [folder]);

  async function deleteOldImage(url: string) {
    if (url && url.startsWith("/uploads/")) {
      try {
        await fetch("/api/admin/upload/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      } catch {
        // Silent fail on delete
      }
    }
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setUploading(true);

    // Delete old image if replacing
    if (preview) {
      await deleteOldImage(preview);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        setPreview(data.url);
        onUpload(data.url);
        
        // Refresh recent images
        try {
          const params = new URLSearchParams({
            folder,
            limit: "6",
          });
          const url = `/api/admin/upload/recent?${params.toString()}`;
          const res = await fetch(url);
          if (res.ok) {
            const updatedImages = await res.json();
            console.log("Recent images refreshed after upload:", updatedImages.length);
            setRecentImages(updatedImages);
          } else {
            console.warn("Failed to refresh recent images:", res.status);
          }
        } catch (error) {
          console.warn("Failed to refresh recent images:", error);
        }
      }
    } catch {
      alert("Upload failed");
    }

    setUploading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function handleRemove() {
    if (preview) {
      await deleteOldImage(preview);
    }
    setPreview(null);
    onUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input type="hidden" name={name} value={preview || ""} />

      {/* Recent Images */}
      {recentImages.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Recent Uploads
          </p>
          <div className="flex flex-wrap gap-2">
            {recentImages.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => {
                  setPreview(img.secureUrl);
                  onUpload(img.secureUrl);
                }}
                className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                  preview === img.secureUrl
                    ? "border-violet-500 shadow-lg shadow-violet-500/20"
                    : "border-neutral-200 hover:border-violet-300 dark:border-neutral-700 dark:hover:border-violet-600"
                }`}
              >
                <Image
                  src={img.secureUrl}
                  alt={`Recent upload ${img.id}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all ${aspectClasses[aspectRatio]} ${
          dragOver
            ? "border-violet-400 bg-violet-50 dark:bg-violet-950/20"
            : "border-neutral-300 hover:border-violet-300 dark:border-neutral-700 dark:hover:border-violet-700"
        }`}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Upload preview" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 shadow-lg">Replace</button>
              <button type="button" onClick={handleRemove} className="rounded-lg bg-red-500 p-1.5 text-white shadow-lg"><X className="h-3.5 w-3.5" /></button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-800"><ImageIcon className="h-6 w-6" /></div>
                <div className="text-center">
                  <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Click to upload</span>
                  <span className="text-xs"> or drag & drop</span>
                </div>
                <span className="text-[10px] text-neutral-400">JPG, PNG, WebP, GIF • Unlimited Size</span>
              </>
            )}
          </button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
    </div>
  );
}
