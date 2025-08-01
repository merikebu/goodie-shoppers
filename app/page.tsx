// app/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

// Import icons for the features section
import { PackageCheck, ShieldCheck, Sparkles } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] sm:h-[80vh] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            // --- UPDATED TO YOUR NEW IMAGE PATH ---
            src="/images/haha.jpg"
            alt="A captivating hero background for the Goodie shop"
            fill
            className="object-cover"
            priority // Prioritize loading this image as it's above the fold
          />
          {/* You can adjust the overlay opacity here if needed, e.g., bg-opacity-30 */}
          <div className="absolute inset-0 bg-ligtht bg-opacity-50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-md">
            Discover Your Next Favorite Thing.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-sm">
            Begin a journey with our curated collection of products designed to enhance your life.
          </p>
          <div className="mt-8">
            <Link href="/shop/products" passHref>
              <Button className="bg-[var(--primary-color)] hover:bg-indigo-500 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 text-lg sm:text-xl rounded-full transition duration-300 transform hover:scale-105 shadow-xl">
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Why Shop With Us?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            We are committed to providing you with the best products and a seamless shopping experience from start to finish.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-4 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-[var(--primary-color)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Every item in our collection is carefully selected and tested to ensure it meets our high standards of quality and durability.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-4 rounded-full mb-4">
                <PackageCheck className="h-8 w-8 text-[var(--primary-color)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">
                We know you're excited to receive your order. That's why we offer fast and reliable shipping on all our products.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-4 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-[var(--primary-color)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Checkout</h3>
              <p className="text-gray-600">
                Shop with confidence. Our secure payment gateway ensures your personal and financial information is always protected.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}