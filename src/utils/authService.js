/**
 * Mock Authentication Service for OTP Handling
 * In a production environment, these methods would call a backend API.
 */

const OTP_EXPIRY_MS = 120000; // 2 minutes

class AuthService {
  constructor() {
    this.otps = new Map(); // Store OTPs in memory for the demo
  }

  /**
   * Generates a 6-digit OTP and sends it via the specified method.
   * @param {string} contact - Email or Phone Number
   * @param {'email' | 'phone'} method - The method used
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async sendOTP(contact, method) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + OTP_EXPIRY_MS;
    
    this.otps.set(contact, { otp, expiry });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (method === 'phone') {
      console.log(`[WhatsApp] Sending OTP ${otp} to ${contact}`);
      // In production: Use WhatsApp API
    } else {
      console.log(`[Email] Sending OTP ${otp} to ${contact}`);
      // In production: Use Email Service API
    }

    return { success: true, message: 'OTP sent successfully' };
  }

  /**
   * Verifies the OTP for a given contact.
   * @param {string} contact - Email or Phone Number
   * @param {string} code - The 6-digit code entered by user
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyOTP(contact, code) {
    const stored = this.otps.get(contact);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!stored) {
      return { success: false, message: 'OTP not found' };
    }

    if (Date.now() > stored.expiry) {
      this.otps.delete(contact);
      return { success: false, message: 'OTP expired' };
    }

    if (stored.otp === code) {
      this.otps.delete(contact);
      return { success: true, message: 'OTP verified' };
    }

    return { success: false, message: 'Invalid OTP' };
  }
}

export const authService = new AuthService();
