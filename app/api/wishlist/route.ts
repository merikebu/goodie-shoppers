// app/api/wishlist/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

// POST: Add an item to the user's wishlist
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
    }

    const userId = session.user.id;

    // Use upsert to either create the wishlist item or do nothing if it already exists
    const wishlistItem = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {}, // Don't update anything if it exists
      create: {
        userId,
        productId,
      },
    });

    console.log(`[API Wishlist]: Added product ${productId} to wishlist for user ${userId}`);
    return NextResponse.json(wishlistItem, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('[API WISHLIST POST] Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// DELETE: Remove an item from the user's wishlist
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    try {
        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
        }
        
        const userId = session.user.id;
        
        await prisma.wishlistItem.delete({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        
        console.log(`[API Wishlist]: Removed product ${productId} from wishlist for user ${userId}`);
        return NextResponse.json({ message: 'Item removed from wishlist.' }, { status: 200 });

    } catch (error) {
        // Prisma throws an error if the record to delete is not found, we can handle it gracefully.
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ message: 'Item not found in wishlist.' }, { status: 404 });
        }
        console.error('[API WISHLIST DELETE] Error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}