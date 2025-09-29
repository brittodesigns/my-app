import { useEffect, useRef } from 'react';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../config/firebase';

export const useWebAuth = () => {
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize reCAPTCHA for web
    if (typeof window !== 'undefined') {
      const initializeRecaptcha = () => {
        try {
          // Create reCAPTCHA container if it doesn't exist
          let container = document.getElementById('recaptcha-container');
          if (!container) {
            container = document.createElement('div');
            container.id = 'recaptcha-container';
            container.style.display = 'none';
            document.body.appendChild(container);
          }

          // Initialize reCAPTCHA verifier
          recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
            }
          });

          console.log('reCAPTCHA initialized for web');
        } catch (error) {
          console.error('Error initializing reCAPTCHA:', error);
        }
      };

      // Initialize after a short delay to ensure DOM is ready
      const timer = setTimeout(initializeRecaptcha, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const cleanup = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      } catch (error) {
        console.error('Error cleaning up reCAPTCHA:', error);
      }
    }
  };

  return {
    recaptchaVerifier: recaptchaVerifierRef.current,
    cleanup
  };
};
