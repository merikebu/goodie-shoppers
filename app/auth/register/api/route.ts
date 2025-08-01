// app/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/password'; // Import our password utility

// Handle POST requests for user registration
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }
    if (password.length < 6) { // Minimum password length
        return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 }); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        name: name || email.split('@')[0], // Default name if not provided
        email,
        password: hashedPassword, // Store the hashed password
      },
    });

    // Don't send the password hash back
    const { password: _, ...userWithoutPassword } = newUser;

    console.log(`[API]: User registered: ${userWithoutPassword.email}`);
    return NextResponse.json({ message: 'User registered successfully!', user: userWithoutPassword }, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('[API] Register Error:', error);
    // Generic error message to avoid revealing too much detail
    return NextResponse.json({ message: 'An unexpected error occurred during registration.' }, { status: 500 });
  }
}