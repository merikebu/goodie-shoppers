// hooks/useCart.ts
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { CartItem } from '@prisma/client';

export function useCart() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch if the user is authenticated
    if (status === 'authenticated') {
      const fetchCartItems = async () => {
        setIsLoading(true);
        try {
          // Note: We created this API route in a previous step
          const response = await fetch('/api/cart/items');
          if (response.ok) {
            const data: CartItem[] = await response.json();
            setCartItems(data);
            // Calculate total quantity of all items in the cart
            const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
            setItemCount(totalQuantity);
          } else {
            setItemCount(0); // Reset on error
          }
        } catch (error) {
          console.error('Failed to fetch cart items:', error);
          setItemCount(0); // Reset on error
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCartItems();
    } else if (status === 'unauthenticated') {
      // If user logs out, clear the cart data
      setCartItems([]);
      setItemCount(0);
      setIsLoading(false);
    }
  }, [status]); // Rerun this effect whenever the session status changes

  return { cartItems, itemCount, isLoading };
}