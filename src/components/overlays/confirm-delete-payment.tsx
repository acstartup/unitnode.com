"use client";

interface ConfirmDeletePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentType?: string;
  paymentBalance?: number;
}

export default function ConfirmDeletePayment({ isOpen, onClose, onConfirm, paymentType, paymentBalance }: ConfirmDeletePaymentProps) {
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
        className="relative w-[95%] max-w-[400px] rounded-lg border border-white/20 shadow-xl bg-white backdrop-blur-md animate-in fade-in duration-300 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-0 mb-3 border-gray-200 -my-1">
          <h2 className="text-md font-semibold text-gray-900">Delete payment</h2>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Description */}
          <p className="text-sm text-gray-600 mb-2 font-medium">
            Are you sure you want to delete this payment?
          </p>
          {paymentType && paymentBalance !== undefined && (
            <p className="text-sm text-gray-900 font-semibold mb-2">
              {paymentType} - ${paymentBalance.toFixed(2)}
            </p>
          )}

          <p className="text-xs text-gray-500 mb-4 font-medium">
            This will permanently delete the payment and all bill associations.
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
              Delete payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
