'use client';

import { useEffect } from 'react';
import { useModal } from './modal-provider';

export function AutoLoginOpener() {
  const { openLoginModal, openSignupModal } = useModal();

  useEffect(() => {
    // Check if we should auto-open the login modal
    const url = new URL(window.location.href);
    const queryFlag = url.searchParams.get('unitnode_open_login_modal') === 'true';
    const shouldOpenLoginModal = queryFlag || localStorage.getItem('unitnode_open_login_modal') === 'true';
    const openSignupParam = url.searchParams.get('unitnode_open_signup_modal');
    const signupEmailParam = url.searchParams.get('email') || '';
    
    if (shouldOpenLoginModal) {
      // Remove the flag
      localStorage.removeItem('unitnode_open_login_modal');
      if (queryFlag) {
        // Clean the URL param without reloading
        url.searchParams.delete('unitnode_open_login_modal');
        window.history.replaceState({}, '', url.toString());
      }
      
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

    // Handle opening signup modal for Google completion
    if (openSignupParam === 'google_complete') {
      try {
        // Set mode and email in localStorage for the modal to pick up
        localStorage.setItem('unitnode_signup_mode', 'google_complete');
        if (signupEmailParam) localStorage.setItem('unitnode_signup_email', signupEmailParam);
      } catch {}

      // Clean query params and open signup modal
      url.searchParams.delete('unitnode_open_signup_modal');
      url.searchParams.delete('email');
      window.history.replaceState({}, '', url.toString());

      setTimeout(() => {
        openSignupModal();
      }, 100);
    }
  }, [openLoginModal, openSignupModal]);

  // This component doesn't render anything
  return null;
}
