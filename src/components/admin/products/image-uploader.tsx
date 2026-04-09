"use client";

import { useRef, useState, useCallback } from "react";
import {
  upload,
  ImageKitAbortError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
} from "@imagekit/next";
import { Image as ImageKitImage } from "@imagekit/next";
import { Loader2, ImagePlus, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string; // current image URL (empty = slot is empty)
  onChange: (url: string) => void; // called with the new URL after upload
  onRemove: () => void; // called when user clicks remove
  disabled?: boolean;
  index: number;
}

async function getAuthParams() {
  const res = await fetch("/api/upload-auth");
  if (!res.ok) throw new Error("Failed to get upload auth");
  const data = await res.json();
  return {
    token: data.token,
    expire: data.expire,
    signature: data.signature,
    publicKey: data.publicKey ?? "",
  };
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  disabled,
  index,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be smaller than 10MB.");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      abortControllerRef.current = new AbortController();

      try {
        const authParams = await getAuthParams();
        const uploadResponse = await upload({
          file,
          fileName: `product-${Date.now()}-${file.name}`,
          folder: "/papadwala/products",
          ...authParams,
          onProgress: (e) => {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          },
          abortSignal: abortControllerRef.current.signal,
        });

        onChange(uploadResponse.url ?? "");
        toast.success("Image uploaded successfully");
      } catch (err) {
        if (err instanceof ImageKitAbortError) {
          // user cancelled — silent
        } else if (err instanceof ImageKitUploadNetworkError) {
          toast.error("Network error. Please try again.");
        } else if (err instanceof ImageKitServerError) {
          toast.error("Server error. Please try again.");
        } else {
          toast.error("Upload failed. Please try again.");
        }
        console.error("Upload error:", err);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [onChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const cancelUpload = () => {
    abortControllerRef.current?.abort();
  };

  // ── Filled state ──────────────────────────────────────────────────────────
  if (value) {
    return (
      <div className="relative group w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-50 ring-1 ring-slate-200">
        <ImageKitImage
          urlEndpoint={`https://ik.imagekit.io/babacreatesassets`}
          src={value}
          alt={`Product image ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          transformation={[{ quality: 85 }]}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-200 flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-red-50 hover:text-red-600 text-slate-700 rounded-full h-9 w-9 flex items-center justify-center shadow-lg border border-white/50 backdrop-blur-sm"
            title="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Upload / Loading state ─────────────────────────────────────────────────
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={cn(
        "relative w-full aspect-4/3 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3",
        isUploading
          ? "border-indigo-300 bg-indigo-50/50 cursor-default"
          : isDragOver
            ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
            : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
      />

      {isUploading ? (
        <>
          <div className="relative">
            <Loader2 className="h-8 w-8 text-brand-dark animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-brand-dark">Uploading…</p>
            <p className="text-xs text-brand-dark font-medium">
              {uploadProgress}%
            </p>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-100 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cancelUpload();
            }}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 rounded-full h-6 w-6 flex items-center justify-center bg-white shadow-sm"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <div className="h-11 w-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            {isDragOver ? (
              <Upload className="h-5 w-5 text-brand-dark" />
            ) : (
              <ImagePlus className="h-5 w-5 text-brand-dark" />
            )}
          </div>
          <div className="text-center space-y-0.5 px-2">
            <p className="text-xs font-semibold text-slate-600">
              {isDragOver ? "Drop to upload" : "Click or drag image"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              PNG, JPG, WEBP · Max 10MB
            </p>
          </div>
          {index > 0 && (
            <p className="text-[10px] text-slate-400">Image {index + 1}</p>
          )}
        </>
      )}
    </div>
  );
}
