import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email-service';
import { createUser, findUserByEmail } from '@/lib/user-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, companyName, password } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    
    if (existingUser) {
      // If user exists but email is not verified, allow resending verification
      if (!existingUser.emailVerified) {
        // Send verification email with link
        const verificationToken = await sendVerificationEmail(
          email,
          name || existingUser.name,
          companyName || existingUser.companyName,
          password
        );

        if (!verificationToken) {
          return NextResponse.json(
            { success: false, message: 'Failed to send verification email' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Verification email sent successfully'
        });
      } else {
        // If email is already verified, don't allow signup
        return NextResponse.json(
          { success: false, message: 'Email already registered' },
          { status: 400 }
        );
      }
    }

    // Create new user with unverified email
    try {
      await createUser({
        email,
        password,
        name,
        companyName
      });
    } catch (dbError) {
      console.error('Error creating user:', dbError);
      return NextResponse.json(
        { success: false, message: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Send verification email with link
    const verificationToken = await sendVerificationEmail(
      email,
      name,
      companyName,
      password
    );

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, message: 'Failed to send verification email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully. Please check your inbox to complete registration.'
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}