"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Upload, Trash, ImageIcon, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { DragDropUploadProps } from "./types";

export function DragDropUpload({
  field,
  label,
  imageFile,
  onFileChange,
  onRemove,
  error,
  required = false,
}: DragDropUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const mockEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      onFileChange(mockEvent, field);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {imageFile ? (
        <div className="relative group">
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
            <Image
              src={URL.createObjectURL(imageFile)}
              alt={label}
              fill
              className="object-contain p-2"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative w-full h-48 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group",
            isDragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
            error
              ? "border-red-300 bg-red-50 dark:bg-red-900/20"
              : "bg-gray-50/50 dark:bg-gray-800/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                isDragOver
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              )}
            >
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Drop an image here or click to browse
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e, field)}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-red-500 text-sm mt-2 flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
