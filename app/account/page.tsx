// app/about/page.tsx
// This can be a Server Component or Client Component, depending on its needs.
// For a simple static page like this, Server Component is ideal.
// import 'use client'; // No 'use client' needed if truly static

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <section className="container mx-auto p-6 md:p-8 lg:p-10 min-h-[calc(100vh-var(--navbar-height)-var(--footer-height))] flex-grow flex items-center justify-center">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 text-center max-w-2xl space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--primary-color)] mb-4 leading-tight">
          About Goodie
        </h1>
        <p className="text-lg sm:text-xl text-[var(--foreground)] leading-relaxed">
          Welcome to Goodie, your one-stop shop for amazing products! We are dedicated
          to bringing you the best in quality and design, making your online
          shopping experience seamless and delightful.
        </p>
        <p className="text-md sm:text-lg text-gray-700 leading-relaxed">
          Our mission is to provide an easy-to-use platform where you can discover
          new favorites, manage your account effortlessly, and enjoy secure
          transactions. Thank you for choosing Goodie!
        </p>
        <Link href="/shop/products" className="inline-block mt-8 text-[var(--primary-color)] hover:underline font-semibold text-lg">
          Explore Our Products
        </Link>
      </div>
    </section>
  );
}