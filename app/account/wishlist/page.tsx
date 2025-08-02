// app/account/wishlist/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard'; // We can reuse the ProductCard!
import ProductGrid from '@/components/ProductGrid';
import type { WishlistItem, Product } from '@prisma/client';

type WishlistItemWithProduct = WishlistItem & { product: Product };

export default function WishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    if (status === 'authenticated') {
      const fetchWishlistItems = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/wishlist/items');
          if (response.ok) {
            const data = await response.json();
            setWishlistItems(data);
          }
        } catch (error) {
          console.error('Failed to fetch wishlist items:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchWishlistItems();
    }
  }, [status, router]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-4 text-lg">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">Your wishlist is empty</h2>
            <p className="text-gray-500 mt-2">Add your favorite items to your wishlist to keep track of them.</p>
        </div>
      ) : (
        <ProductGrid>
            {/* We map over the wishlist items and pass the nested product to our reusable ProductCard */}
            {wishlistItems.map(item => (
                <ProductCard key={item.id} product={item.product} />
            ))}
        </ProductGrid>
      )}
    </div>
  );
}