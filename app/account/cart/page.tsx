// app/account/cart/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Loader2, Trash2 } from 'lucide-react'; // Icons
import type { CartItem, Product } from '@prisma/client';

// Define a type for cart items that include product details
type CartItemWithProduct = CartItem & { product: Product };

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    
    if (status === 'authenticated') {
      const fetchCartItems = async () => {
        try {
          const response = await fetch('/api/cart/items');
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
          }
        } catch (error) {
          console.error('Failed to fetch cart items:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCartItems();
    }
  }, [status, router]);

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-4 text-lg">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
          <Link href="/shop/products" passHref>
            <Button className="mt-6">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image src={item.product.imageUrl || ''} alt={item.product.name} fill className="object-cover rounded-md" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="font-bold">${item.product.price.toFixed(2)}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold border-b pb-4">Order Summary</h2>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full mt-6">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}