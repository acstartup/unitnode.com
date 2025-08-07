import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/auth-utils';
import { findUserByEmail, verifyUserEmail } from '@/lib/user-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Verification code is required' },
        { status: 400 }
      );
    }

    const verificationResult = verifyCode(code);
    
    if (!verificationResult.valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // If we have an email from the verification code, update the user record
    if (verificationResult.email) {
      try {
        // Find the user by email
        const user = await findUserByEmail(verificationResult.email);
        
        if (!user) {
          return NextResponse.json(
            { success: false, message: 'User not found' },
            { status: 404 }
          );
        }
        
        // Mark the user's email as verified and activate their account
        await verifyUserEmail(verificationResult.email);
      } catch (dbError) {
        console.error('Error updating user verification status:', dbError);
        return NextResponse.json(
          { success: false, message: 'Failed to verify user account' },
          { status: 500 }
        );
      }
    } else {
      console.warn('Verification code valid but no email found in the result');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      email: verificationResult.email,
      companyName: verificationResult.companyName,
      name: verificationResult.name
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}