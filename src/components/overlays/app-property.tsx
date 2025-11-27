'use client';

import { useState } from 'react';

interface AddPropertyOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddPropertyOverlay({ isOpen, onClose }: AddPropertyOverlayProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Overlay Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white border shadow-lg rounded-lg w-full max-w-2xl h-96 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Empty */}
                </div>
            </div>
        </>
    )
}