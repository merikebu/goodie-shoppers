// app/auth/forgot-password/api/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/services/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // IMPORTANT: Always return a success message to prevent user enumeration attacks.
    // This way, an attacker can't guess which emails are registered.
    if (!user) {
      console.log(`[API]: Password reset requested for non-existent user: ${email}`);
      return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });
    }

    // Generate a secure, random token
    const passwordResetToken = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Update the user record with the token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetTokenExpiry: tokenExpiry,
      },
    });

    // Send the password reset email
    await sendPasswordResetEmail(email, passwordResetToken);
    
    console.log(`[API]: Password reset email sent to: ${email}`);
    return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('[API] Forgot Password Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}