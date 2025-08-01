// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

// POST: Add an item to the cart or update its quantity
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await req.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ message: 'Product ID and quantity are required.' }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if the item is already in the cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    let cartItem;
    if (existingCartItem) {
      // If item exists, update its quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      console.log(`[API CART]: Updated quantity for product ${productId} for user ${userId}`);
    } else {
      // If item does not exist, create a new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
      console.log(`[API CART]: Added product ${productId} to cart for user ${userId}`);
    }

    return NextResponse.json(cartItem, { status: 200 });
  } catch (error) {
    console.error('[API CART POST] Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}