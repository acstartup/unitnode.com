"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { SignupModal } from "@/components/signup-modal";
import { LoginModal } from "@/components/login-modal";

interface ModalContextType {
  openSignupModal: () => void;
  closeSignupModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openSignupModal: () => {},
  closeSignupModal: () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openSignupModal = () => {
    setIsLoginModalOpen(false); // Close login if open
    setIsSignupModalOpen(true);
  };
  
  const closeSignupModal = () => setIsSignupModalOpen(false);
  
  const openLoginModal = () => {
    setIsSignupModalOpen(false); // Close signup if open
    setIsLoginModalOpen(true);
  };
  
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <ModalContext.Provider value={{ 
      openSignupModal, 
      closeSignupModal,
      openLoginModal,
      closeLoginModal
    }}>
      {children}
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </ModalContext.Provider>
  );
}