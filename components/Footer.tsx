// components/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-6 sm:p-8 md:p-10 mt-auto shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">

        {/* Brand/Logo */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
            Goodie
          </Link>
          <p className="text-gray-400 text-sm mt-2">Your favorite online shop.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3">
          <Link href="/shop/products" className="text-gray-300 hover:text-white transition-colors duration-200 text-base">
            Shop
          </Link>
          <Link href="/account/profile" className="text-gray-300 hover:text-white transition-colors duration-200 text-base">
            Profile
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-base">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-base">
            Contact
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-500 text-sm">
        <p>© {currentYear} Goodie. All rights reserved.</p>
        <p className="mt-2">
          Designed with ❤️ using Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}