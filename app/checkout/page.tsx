// app/checkout/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';
import type { CartItem, Product } from '@prisma/client';

type CartItemWithProduct = CartItem & { product: Product };

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user's cart items when the component mounts and the session is authenticated.
  useEffect(() => {
    // If user is not logged in, redirect them.
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout');
    }
    
    // Once we confirm the user is authenticated, fetch their cart.
    if (status === 'authenticated') {
      const fetchCartItems = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/cart/items');
          if (response.ok) {
            const data: CartItemWithProduct[] = await response.json();
            if (data.length === 0) {
              // If the cart is empty, no need to checkout. Redirect to the cart page which shows an empty message.
              router.push('/account/cart');
            } else {
              setCartItems(data);
            }
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

  // Use useMemo to calculate the total only when cartItems changes, which is a small performance optimization.
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  // We'll show a loading spinner while fetching the cart data.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        <p className="ml-4 text-xl">Loading your order...</p>
      </div>
    );
  }

  // If loading is finished but the cart is empty, show a message before redirecting.
  if (cartItems.length === 0) {
     return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty.</h2>
            <p className="text-gray-500 mt-2">Redirecting you to the shop...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Column 1: Shipping & Payment Form */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-4">1. Shipping Information</h2>
          <form className="space-y-4">
            <Input type="text" placeholder="Full Name" required />
            <Input type="text" placeholder="Shipping Address" required />
            <Input type="text" placeholder="City" required />
            <div className="flex gap-4">
              <Input type="text" placeholder="State / Province" required />
              <Input type="text" placeholder="ZIP / Postal Code" required />
            </div>
            <Input type="tel" placeholder="Phone Number" required />
          </form>

          <h2 className="text-2xl font-semibold mb-6 mt-10 border-b pb-4">2. Payment Method</h2>
          <div className="space-y-4">
            {/* PayPal */}
            <div className="border p-4 rounded-lg flex items-center justify-between hover:border-indigo-500 transition-colors">
              <div className="flex items-center">
                <input id="paypal" name="paymentMethod" type="radio" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">Pay with PayPal</label>
              </div>
              <Image src="/images/paypal-logo.jpg" alt="PayPal" width={80} height={20} className="object-contain" />
            </div>

            {/* M-Pesa */}
            <div className="border p-4 rounded-lg flex items-center justify-between hover:border-green-500 transition-colors">
              <div className="flex items-center">
                <input id="mpesa" name="paymentMethod" type="radio" className="h-4 w-4 text-green-600 focus:ring-green-500" />
                <label htmlFor="mpesa" className="ml-3 block text-sm font-medium text-gray-700">Pay with M-Pesa</label>
              </div>
              <Image src="/images/mpesa-logo.png" alt="M-Pesa" width={80} height={25} className="object-contain" />
            </div>
          </div>
        </div>

        {/* Column 2: Order Summary (Now Dynamic) */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border h-fit">
            <h2 className="text-2xl font-semibold border-b pb-4">Your Order</h2>
            {/* Dynamically list items from the cart */}
            <div className="divide-y divide-gray-200 mt-4 text-gray-600">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3">
                        <span className="flex-1 truncate pr-2">{item.quantity}x {item.product.name}</span>
                        <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
             <div className="border-t mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2 mt-2">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            {/* A real "Place Order" button would call a backend API */}
            <Button className="w-full mt-6 text-lg">
                Place Order
            </Button>
            <Link href="/account/cart" className="text-center block mt-4 text-sm text-gray-500 hover:underline">
                Return to Cart
            </Link>
        </div>
      </div>
    </div>
  );
}