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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 20px;">
        <h2>Verify Your Email Address</h2>
        <p>Hello,</p>
        <p>Thank you for signing up with <span style="font-weight: bold;">UnitNode</span>. To complete your registration, please enter the verification code below:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; font-size: 28px; font-weight: bold; letter-spacing: 5px;">
          ${verificationCode}
        </div>
        
        <div style="border-left: 4px solid #f0f0f0; padding: 10px; background-color: #f8f9fa; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">Important:</p>
          <p style="margin: 5px 0 0 0;">This code is valid for 60 seconds and can only be used once.</p>
          <p style="margin: 5px 0 0 0;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
        
        <p>Thank you,</p>
        <p>The <span style="font-weight: bold;">UnitNode</span> Team</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      
      <div style="color: #666; font-size: 12px; padding: 0 20px 20px;">
        <p><span style="font-weight: bold;">UnitNode</span> - Automating Property Management</p>
        <p><span style="color: #000;">unitnode.com | support@unitnode.com</span></p>
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