"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          onChange(data.url);
        } else {
          const error = await response.json();
          alert(error.message || "Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUpload(e.dataTransfer.files[0]);
      }
    },
    [handleUpload]
  );

  if (value) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-gray-300">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
        </div>
        <div className="mt-2 flex space-x-2">
          <button
            type="button"
            onClick={onRemove}
            className="rounded border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-600 hover:bg-red-100"
          >
            Remove
          </button>
          <label className="cursor-pointer rounded border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100">
            Replace
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="mb-2 h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-600">
              Drag and drop an image here, or{" "}
              <label className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">
                browse
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
