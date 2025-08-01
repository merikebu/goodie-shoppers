// app/shop/product/[id]/ProductActions.tsx
'use client'; // This directive is ESSENTIAL for this component to work

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart } from 'lucide-react'; // Using icons for a better look

interface ProductActionsProps {
  productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // type can be 'success' or 'error'

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback({ message: '', type: '' }); // Clear feedback after 3 seconds
    }, 3000);
  };

  const handleAddToCart = async () => {
    // If user is not logged in, redirect them to the login page
    if (status !== 'authenticated') {
      router.push('/auth/login');
      return;
    }

    setIsAddingToCart(true);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }), // Adding one item at a time
      });

      if (response.ok) {
        showFeedback('Added to cart successfully!', 'success');
        // In a real app, you might trigger a global state update here
        // to show the new cart count in the navbar, for example.
      } else {
        const data = await response.json();
        showFeedback(data.message || 'Failed to add to cart.', 'error');
      }
    } catch (error) {
      showFeedback('An error occurred. Please try again.', 'error');
      console.error("Add to cart error:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    // We'll add the API route for this next, but for now, it's a placeholder
    console.log('Add to Wishlist clicked for product:', productId);
    showFeedback('Wishlist functionality is coming soon!', 'success');
  };

  return (
    <div className="mt-auto space-y-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-[var(--primary-color)] hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 flex items-center justify-center gap-2"
          disabled={isAddingToCart || status === 'loading'}
        >
          <ShoppingCart className="h-5 w-5" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
        <Button
          onClick={handleAddToWishlist}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg"
          disabled={isAddingToWishlist || status === 'loading'}
          aria-label="Add to wishlist"
        >
          <Heart className="h-6 w-6 text-gray-600" />
        </Button>
      </div>
      
      {/* Feedback Message */}
      {feedback.message && (
        <p className={`text-center font-medium mt-2 text-sm ${
          feedback.type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {feedback.message}
        </p>
      )}
    </div>
  );
}