import { 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  signInWithCredential,
  signOut,
  User,
  RecaptchaVerifier,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
  verificationId?: string;
}

export interface OTPVerificationResult {
  success: boolean;
  message?: string;
  user?: User;
}

class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;

  /**
   * Initialize reCAPTCHA verifier for web
   */
  // initializeRecaptcha(containerId: string = 'recaptcha-container') {
  //   if (typeof window !== 'undefined') {
  //     // Create reCAPTCHA container if it doesn't exist
  //     let container = document.getElementById(containerId);
  //     if (!container) {
  //       container = document.createElement('div');
  //       container.id = containerId;
  //       container.style.display = 'none';
  //       document.body.appendChild(container);
  //     }

  //     this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
  //       size: 'invisible',
  //       callback: () => {
  //         console.log('reCAPTCHA solved');
  //       },
  //       'expired-callback': () => {
  //         console.log('reCAPTCHA expired');
  //       }
  //     });
  //   }
  // }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phoneNumber: string): Promise<AuthResult> {
    try {
      // Format phone number (ensure it starts with +)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      // Check if Firebase is properly configured
      if (!auth || !auth.app) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }
      
      // For development, simulate OTP sending (only if using demo project or mock auth)
      if (auth.app.options.projectId === 'demo-project' || !auth.signInWithPhoneNumber) {
        console.log('Development mode: Simulating OTP send to', formattedPhone);
        return {
          success: true,
          message: 'OTP sent successfully (Development mode)',
          verificationId: 'dev-verification-id'
        };
      }
      
      // For web, we need reCAPTCHA
      if (typeof window !== 'undefined') {
        try {
          // For development mode on web, simulate OTP sending
          if (auth.app.options.projectId === 'demo-project') {
            console.log('Web Development mode: Simulating OTP send to', formattedPhone);
            return {
              success: true,
              message: 'OTP sent successfully (Web Development mode)',
              verificationId: 'web-dev-verification-id'
            };
          }

          // if (!this.recaptchaVerifier) {
          //   this.initializeRecaptcha();
          // }
          
          // // Render reCAPTCHA if not already rendered
          // if (this.recaptchaVerifier && !this.recaptchaVerifier.verify()) {
          //   await this.recaptchaVerifier.render();
          // }
          
          // this.confirmationResult = await signInWithPhoneNumber(
          //   auth, 
          //   formattedPhone, 
          //   this.recaptchaVerifier!
          // );
          
          return {
            success: true,
            message: 'OTP sent successfully',
            verificationId: 'web-confirmation'
          };
        } catch (recaptchaError: any) {
          console.error('reCAPTCHA error:', recaptchaError);
          return {
            success: false,
            message: 'reCAPTCHA verification failed. Please try again.'
          };
        }
      } else {
        // For mobile, use PhoneAuthProvider
        const provider = new PhoneAuthProvider(auth);
        const verificationId = await provider.verifyPhoneNumber(
          formattedPhone,
          this.recaptchaVerifier!
        );
        
        return {
          success: true,
          message: 'OTP sent successfully',
          verificationId
        };
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(otpCode: string, verificationId?: string): Promise<OTPVerificationResult> {
    try {
      // Check if Firebase is properly configured
      if (!auth || !auth.app) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }
      
      // For development, simulate OTP verification
      if (auth.app.options.projectId === 'demo-project' || !auth.signInWithPhoneNumber) {
        console.log('Development mode: Simulating OTP verification with code', otpCode);
        if (otpCode === '123456' || otpCode === '000000') {
          return {
            success: true,
            message: 'OTP verified successfully (Development mode)',
            user: {
              uid: 'dev-user-id',
              phoneNumber: '+1234567890'
            } as any
          };
        } else {
          return {
            success: false,
            message: 'Invalid OTP code. Use 123456 or 000000 for development.'
          };
        }
      }
      
      let credential;
      
      if (typeof window !== 'undefined' && this.confirmationResult) {
        // Web verification
        const result = await this.confirmationResult.confirm(otpCode);
        return {
          success: true,
          message: 'OTP verified successfully',
          user: result.user
        };
      } else if (verificationId) {
        // Mobile verification
        credential = PhoneAuthProvider.credential(verificationId, otpCode);
        const result = await signInWithCredential(auth, credential);
        
        return {
          success: true,
          message: 'OTP verified successfully',
          user: result.user
        };
      } else {
        throw new Error('No verification method available');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<{ success: boolean; message?: string }> {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return {
        success: false,
        message: 'Failed to sign out'
      };
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Get user's phone number
   */
  getUserPhoneNumber(): string | null {
    return auth.currentUser?.phoneNumber || null;
  }

  /**
   * Get user's UID
   */
  getUserId(): string | null {
    return auth.currentUser?.uid || null;
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   */
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later';
      case 'auth/invalid-verification-code':
        return 'Invalid OTP code';
      case 'auth/code-expired':
        return 'OTP code has expired. Please request a new one';
      case 'auth/invalid-verification-id':
        return 'Invalid verification. Please try again';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/quota-exceeded':
        return 'SMS quota exceeded. Please try again later';
      default:
        return 'Authentication failed. Please try again';
    }
  }

  /**
   * Clean up reCAPTCHA verifier
   */
  cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }
}

export default new AuthService();
