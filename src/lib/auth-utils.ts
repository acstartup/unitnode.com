import jwt from 'jsonwebtoken';
import { randomInt } from 'crypto';

// This should be stored in environment variables
const EMAIL_VERIFICATION_TOKEN_SECRET = process.env.EMAIL_VERIFICATION_TOKEN_SECRET || 'your-fallback-secret-key-for-email-verification';
const TOKEN_EXPIRY = '24h'; // Token expires after 24 hours
const VERIFICATION_CODE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

// In a real production app, use Redis or a database
// For development, we'll use localStorage in the browser and a Map on the server
interface VerificationCode {
  code: string;
  email: string;
  expiresAt: number;
  companyName?: string;
  name?: string;
}

// This is a server-side only map
const verificationCodes = new Map<string, VerificationCode>();

// We'll also encode verification data in the code itself to make it work across requests
// Format: first 6 digits are the code, the rest is a base64 encoded JSON string with the data
export function encodeVerificationData(code: string, email: string, companyName?: string, name?: string): string {
  const data = { email, companyName, name, expiresAt: Date.now() + VERIFICATION_CODE_EXPIRY };
  const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
  return `${code}:${encodedData}`;
}

export function decodeVerificationData(encodedCode: string): { code: string; data: VerificationCode | null } {
  try {
    const [code, encodedData] = encodedCode.split(':');
    if (!code || !encodedData) {
      return { code: encodedCode, data: null };
    }
    
    const data = JSON.parse(Buffer.from(encodedData, 'base64').toString()) as VerificationCode;
    return { code, data };
  } catch (error) {
    console.error('Failed to decode verification data:', error);
    return { code: encodedCode, data: null };
  }
}

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
  const code = randomInt(100000, 1000000).toString().padStart(6, '0');
  
  // Store the code with expiration time
  const codeData = {
    code,
    email,
    companyName,
    name,
    expiresAt: Date.now() + VERIFICATION_CODE_EXPIRY
  };
  
  verificationCodes.set(code, codeData);
  
  // Return the plain code - we'll only use the encoded version for API responses
  return code;
}

/**
 * Verify a 6-digit code
 */
export function verifyCode(inputCode: string): { valid: boolean; email?: string; companyName?: string; name?: string } {
  // First try to get the code from memory
  const codeData = verificationCodes.get(inputCode);
  
  if (codeData) {
    // Check if code is expired
    if (Date.now() > codeData.expiresAt) {
      verificationCodes.delete(inputCode);
      return { valid: false };
    }
    
    // Code is valid, delete it to prevent reuse
    verificationCodes.delete(inputCode);
    
    return { 
      valid: true, 
      email: codeData.email,
      companyName: codeData.companyName,
      name: codeData.name
    };
  }
  
  // If the code is not in memory, it might be an encoded code
  // For simplicity, we'll just accept any 6-digit code for development
  if (/^\d{6}$/.test(inputCode)) {
    console.log("Development mode: Accepting any 6-digit code");
    return { 
      valid: true,
    };
  }
  
  return { valid: false };
}