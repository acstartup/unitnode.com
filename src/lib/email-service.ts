import { EmailVerificationPayload, generateVerificationUrl } from './auth-utils';

// Infobip API key and base URL should be stored in environment variables
const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY || '';
const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL || 'https://api.infobip.com';
const FROM_EMAIL = process.env.INFOBIP_FROM_EMAIL || 'noreply@unitnode.com';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Infobip API
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  try {
    // Ensure the base URL has a protocol
    const baseUrl = INFOBIP_BASE_URL.startsWith('http') 
      ? INFOBIP_BASE_URL 
      : `https://${INFOBIP_BASE_URL}`;
    
    // Create FormData object for multipart/form-data request
    const formData = new FormData();
    formData.append('from', FROM_EMAIL);
    formData.append('to', to);
    formData.append('subject', subject);
    
    if (text) {
      formData.append('text', text);
    } else if (html) {
      formData.append('text', stripHtml(html));
    }
    
    if (html) {
      formData.append('html', html);
    }
      
    const response = await fetch(`${baseUrl}/email/3/send`, {
      method: 'POST',
      headers: {
        'Authorization': `App ${INFOBIP_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send email via Infobip:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(
  email: string, 
  token: string, 
  name?: string,
  companyName?: string
): Promise<boolean> {
  const verificationUrl = generateVerificationUrl(token);
  const displayName = name || 'there';
  const company = companyName || 'your company';
  
  const subject = 'Verify your email address for UnitNode';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; padding: 20px; text-align: center;">
        <img src="https://unitnode.com/unitnode-full.svg" alt="UnitNode" style="max-width: 200px;">
      </div>
      <div style="padding: 20px; border: 1px solid #eee; border-top: none;">
        <h2>Verify your email address</h2>
        <p>Hi ${displayName},</p>
        <p>Thank you for registering ${company} with UnitNode. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with UnitNode, you can safely ignore this email.</p>
        <p>Best regards,<br>The UnitNode Team</p>
      </div>
      <div style="padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html
  });
}

/**
 * Simple function to strip HTML for plain text emails
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}