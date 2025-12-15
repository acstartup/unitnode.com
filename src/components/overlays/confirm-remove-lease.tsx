"use client";

import Image from "next/image";

interface ConfirmRemoveLeaseProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyAddress?: string;
}

export default function ConfirmRemoveLease({ isOpen, onClose, onConfirm, propertyAddress }: ConfirmRemoveLeaseProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-[95%] max-w-[420px] rounded-lg border border-white/20 shadow-xl bg-white backdrop-blur-md animate-in fade-in duration-300 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-2 mb-3 border-gray-200">
          <h2 className="text-md font-semibold text-gray-900">Remove lease</h2>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Description */}
          <p className="text-sm text-gray-600 mb-2 font-medium">
            Are you sure you want to remove the lease for
          </p>
          {propertyAddress && (
            <p className="text-sm text-gray-900 font-semibold mb-2">
              {propertyAddress}?
            </p>
          )}

          <p className="text-xs text-gray-500 mb-4 font-medium">
            This will permenantly delete all tenant and utility information.
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm font-small rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-650 transition-colors"
            >
              Remove Lease
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
