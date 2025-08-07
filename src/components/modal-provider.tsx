"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { SignupModal } from "@/components/signup-modal";
import { LoginModal } from "@/components/login-modal";

interface ModalContextType {
  openSignupModal: () => void;
  closeSignupModal: () => void;
  openLoginModal: (prefillEmail?: string, prefillPassword?: string) => void;
  closeLoginModal: () => void;
  savedCredentials: {
    email: string;
    password: string;
  };
  setSavedCredentials: (email: string, password: string) => void;
}

const ModalContext = createContext<ModalContextType>({
  openSignupModal: () => {},
  closeSignupModal: () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
  savedCredentials: {
    email: '',
    password: ''
  },
  setSavedCredentials: () => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [savedCredentials, setSavedCredentialsState] = useState({
    email: '',
    password: ''
  });
  const [prefillLogin, setPrefillLogin] = useState(false);

  const openSignupModal = () => {
    setIsLoginModalOpen(false); // Close login if open
    setIsSignupModalOpen(true);
  };
  
  const closeSignupModal = () => setIsSignupModalOpen(false);
  
  const openLoginModal = (prefillEmail?: string, prefillPassword?: string) => {
    setIsSignupModalOpen(false); // Close signup if open
    
    // If credentials are provided, save them for pre-filling
    if (prefillEmail && prefillPassword) {
      setSavedCredentialsState({
        email: prefillEmail,
        password: prefillPassword
      });
      setPrefillLogin(true);
    }
    
    setIsLoginModalOpen(true);
  };
  
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    // Reset prefill flag when closing
    setPrefillLogin(false);
  };
  
  const setSavedCredentials = (email: string, password: string) => {
    setSavedCredentialsState({ email, password });
  };

  return (
    <ModalContext.Provider value={{ 
      openSignupModal, 
      closeSignupModal,
      openLoginModal,
      closeLoginModal,
      savedCredentials,
      setSavedCredentials
    }}>
      {children}
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        prefill={prefillLogin}
        prefillEmail={savedCredentials.email}
        prefillPassword={savedCredentials.password}
      />
    </ModalContext.Provider>
  );
}