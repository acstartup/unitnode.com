import jwt from 'jsonwebtoken';

// This should be stored in environment variables
const EMAIL_VERIFICATION_TOKEN_SECRET = process.env.EMAIL_VERIFICATION_TOKEN_SECRET || 'your-fallback-secret-key-for-email-verification';
const TOKEN_EXPIRY = '24h'; // Token expires after 24 hours

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