import { EmailVerificationPayload, generateVerificationCode } from './auth-utils';

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
 * Send verification email to user with 6-digit code
 */
export async function sendVerificationEmail(
  email: string, 
  name?: string,
  companyName?: string
): Promise<string> {
  const verificationCode = generateVerificationCode(email, companyName, name);
  const displayName = name || 'there';
  const company = companyName || 'your company';
  
  const subject = 'Verify Your Email Address';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000;">
      <div style="padding: 20px;">
        <h2 style="color: #000000;">Verify Your Email Address</h2>
        <p style="color: #000000;">Hello,</p>
        <p style="color: #000000;">Thank you for signing up with <span style="font-weight: bold; color: #000000;">UnitNode</span>. To complete your registration, please enter the verification code below:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #000000;">
          ${verificationCode}
        </div>
        
        <div style="border-left: 4px solid #f0f0f0; padding: 10px; background-color: #f8f9fa; margin: 20px 0; color: #000000;">
          <p style="margin: 0; font-weight: bold; color: #000000;">Important:</p>
          <p style="margin: 5px 0 0 0; color: #000000;">This code is valid for 5 minutes and can only be used once.</p>
          <p style="margin: 5px 0 0 0; color: #000000;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
        
        <p style="color: #000000;">Thank you,</p>
        <p style="color: #000000;">The <span style="font-weight: bold; color: #000000;">UnitNode</span> Team</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      
      <div style="font-size: 12px; padding: 0 20px 20px; color: #000000;">
        <p style="color: #000000;"><span style="font-weight: bold; color: #000000;">UnitNode</span> - Automating Property Management</p>
        <p style="color: #000000;">unitnode.com | support@unitnode.com</p>
      </div>
    </div>
  `;
  
  const emailSent = await sendEmail({
    to: email,
    subject,
    html
  });
  
  return emailSent ? verificationCode : '';
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