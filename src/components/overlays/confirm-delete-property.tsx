"use client";

import { useState } from "react";

interface ConfirmDeletePropertyProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyAddress?: string;
}

export default function ConfirmDeleteProperty({ isOpen, onClose, onConfirm, propertyAddress }: ConfirmDeletePropertyProps) {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  // Extract the first part of the address (street address before the first comma)
  const requiredText = propertyAddress?.split(',')[0].trim() || "";
  const isDeleteEnabled = inputValue.trim() === requiredText;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setInputValue("");
    }
  };

  const handleClose = () => {
    onClose();
    setInputValue("");
  };

  const handleConfirm = () => {
    if (isDeleteEnabled) {
      onConfirm();
      setInputValue("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-[95%] max-w-[400px] rounded-lg border border-white/20 shadow-xl bg-white backdrop-blur-md animate-in fade-in duration-300 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-0 mb-3 border-gray-200 -my-1">
          <h2 className="text-md font-semibold text-gray-900">Delete property</h2>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          {/* Description */}
          <p className="text-sm text-gray-600 mb-2 font-medium">
            Are you sure you want to delete
          </p>
          {propertyAddress && (
            <p className="text-sm text-gray-900 font-semibold mb-2">
              {propertyAddress}?
            </p>
          )}

          <p className="text-xs text-gray-500 mb-3 font-medium">
            This will permanently delete the property and all associated lease, tenant, and utility information.
          </p>

          {/* Input field */}
          <div className="mb-4">
            <label className="block text-xs text-gray-700 font-medium mb-2">
              Type <span className="font-semibold">{requiredText}</span> to confirm
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={requiredText}
              autoFocus
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={handleClose}
              className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm font-small rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isDeleteEnabled}
              className={`px-4 py-1 text-white text-sm font-medium rounded-md transition-colors ${
                isDeleteEnabled
                  ? 'bg-red-600 hover:bg-red-650 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Delete Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
