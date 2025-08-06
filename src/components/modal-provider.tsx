"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { SignupModal } from "@/components/signup-modal";

interface ModalContextType {
  openSignupModal: () => void;
  closeSignupModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openSignupModal: () => {},
  closeSignupModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  return (
    <ModalContext.Provider value={{ openSignupModal, closeSignupModal }}>
      {children}
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal}
      />
    </ModalContext.Provider>
  );
}