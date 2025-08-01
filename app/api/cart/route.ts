// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers'; // <-- Import headers to inspect the request

// POST: Add an item to the cart or update its quantity
export async function POST(req: Request) {
  console.log('\n--- [API CART | POST] INCOMING REQUEST ---');

  // Log the environment variables as seen by THIS specific server function
  console.log('[API CART] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('[API CART] NEXTAUTH_SECRET provided?:', !!process.env.NEXTAUTH_SECRET);

  // Let's inspect the incoming request headers to see if the cookie is being sent
  const requestHeaders = headers();
  console.log('[API CART] Request Headers:', requestHeaders);

  const session = await getServerSession(authOptions);

  // This will now tell us exactly why authentication is failing
  console.log('[API CART] Result of getServerSession:', session);

  if (!session?.user?.id) {
    console.error('❌ [API CART] Authentication failed. No session found.');
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  console.log(`✅ [API CART] User authenticated: ${session.user.id}`);

  try {
    const { productId, quantity } = await req.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ message: 'Product ID and quantity are required.' }, { status: 400 });
    }

    const userId = session.user.id;
    // ... rest of your logic remains the same
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, quantity },
      });
    }

    console.log(`[API CART]: Successfully processed cart for user ${userId}`);
    return NextResponse.json(cartItem, { status: 200 });
  } catch (error) {
    console.error('[API CART POST] Error in try-catch block:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}