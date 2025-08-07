import jwt from 'jsonwebtoken';
import { randomInt } from 'crypto';

// This should be stored in environment variables
const EMAIL_VERIFICATION_TOKEN_SECRET = process.env.EMAIL_VERIFICATION_TOKEN_SECRET || 'your-fallback-secret-key-for-email-verification';
const TOKEN_EXPIRY = '24h'; // Token expires after 24 hours
const VERIFICATION_CODE_EXPIRY = 60 * 1000; // 60 seconds in milliseconds

// In-memory store for verification codes (in production, use Redis or a database)
interface VerificationCode {
  code: string;
  email: string;
  expiresAt: number;
  companyName?: string;
  name?: string;
}

const verificationCodes = new Map<string, VerificationCode>();

export interface EmailVerificationPayload {
  email: string;
  name?: string;
  companyName?: string;
}

/**
 * Generate a JWT token for email verification
 */
export function generateEmailVerificationToken(payload: EmailVerificationPayload): string {
  return jwt.sign(payload, EMAIL_VERIFICATION_TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Verify an email verification token
 */
export function verifyEmailVerificationToken(token: string): EmailVerificationPayload | null {
  try {
    const decoded = jwt.verify(token, EMAIL_VERIFICATION_TOKEN_SECRET) as EmailVerificationPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Generate the verification URL to be sent in emails
 */
export function generateVerificationUrl(token: string): string {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  return `${baseUrl}/verify-email?token=${token}`;
}

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(email: string, companyName?: string, name?: string): string {
  // Clean up any existing codes for this email
  for (const [key, value] of verificationCodes.entries()) {
    if (value.email === email) {
      verificationCodes.delete(key);
    }
  }
  
  // Generate a random 6-digit code
  const code = randomInt(100000, 1000000).toString();
  
  // Store the code with expiration time
  verificationCodes.set(code, {
    code,
    email,
    companyName,
    name,
    expiresAt: Date.now() + VERIFICATION_CODE_EXPIRY
  });
  
  return code;
}

/**
 * Verify a 6-digit code
 */
export function verifyCode(code: string): { valid: boolean; email?: string; companyName?: string; name?: string } {
  const codeData = verificationCodes.get(code);
  
  if (!codeData) {
    return { valid: false };
  }
  
  // Check if code is expired
  if (Date.now() > codeData.expiresAt) {
    verificationCodes.delete(code);
    return { valid: false };
  }
  
  // Code is valid, delete it to prevent reuse
  verificationCodes.delete(code);
  
  return { 
    valid: true, 
    email: codeData.email,
    companyName: codeData.companyName,
    name: codeData.name
  };
}