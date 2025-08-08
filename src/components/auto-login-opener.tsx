'use client';

import { useEffect } from 'react';
import { useModal } from './modal-provider';

export function AutoLoginOpener() {
  const { openLoginModal } = useModal();

  useEffect(() => {
    // Check if we should auto-open the login modal
    const shouldOpenLoginModal = localStorage.getItem('unitnode_open_login_modal') === 'true';
    
    if (shouldOpenLoginModal) {
      // Remove the flag
      localStorage.removeItem('unitnode_open_login_modal');
      
      // Get saved credentials if available
      try {
        const savedLoginData = localStorage.getItem('unitnode_login_prefill');
        if (savedLoginData) {
          const loginData = JSON.parse(savedLoginData);
          
          // Check if the data is still valid (not expired)
          const now = Date.now();
          const timestamp = loginData.timestamp || 0;
          const FIVE_MINUTES = 5 * 60 * 1000;
          
          if (now - timestamp < FIVE_MINUTES) {
            // Open login modal with prefilled data
            setTimeout(() => {
              openLoginModal(loginData.email, loginData.password);
            }, 100); // Small delay to ensure the page is fully loaded
          } else {
            // Data expired, but still open the login modal without prefill
            setTimeout(() => {
              openLoginModal();
            }, 100);
          }
        } else {
          // No saved data, just open the modal
          setTimeout(() => {
            openLoginModal();
          }, 100);
        }
      } catch (error) {
        console.error('Error parsing saved login data:', error);
        // Just open the login modal without prefill
        setTimeout(() => {
          openLoginModal();
        }, 100);
      }
    }
  }, [openLoginModal]);

  // This component doesn't render anything
  return null;
}
