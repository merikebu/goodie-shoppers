// components/Navbar.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from './ui/Button';
import { useCart } from '@/hooks/useCart'; // <-- Import our new custom hook

// Import more icons from lucide-react
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Heart, // <-- Wishlist icon
  ShoppingBag, // <-- Cart/Checkout icon
  User,
  X,
} from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const { itemCount } = useCart(); // <-- Use the hook to get the cart item count
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- (toggleMobileMenu and useEffect hooks remain the same as before) ---
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);


  const menuItems = (
    <>
      <Link href="/shop/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-700">
        <LayoutDashboard className="h-5 w-5" />
        Shop
      </Link>
      {/* Show these links only if the user is logged in */}
      {status === 'authenticated' && (
        <>
          <Link href="/account/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-700">
            <Heart className="h-5 w-5" />
            Wishlist
          </Link>
          <Link href="/account/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-700">
            <User className="h-5 w-5" />
            Profile
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      <nav className="bg-gray-900/80 backdrop-blur-md p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* Brand/Logo */}
          <Link href="/" className="text-white text-3xl font-extrabold tracking-wider hover:text-indigo-400 transition-colors duration-200">
            Goodie
          </Link>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-5 text-lg font-medium">
            {menuItems}
          </div>

          {/* Desktop Auth & Cart Section */}
          <div className="hidden md:flex items-center">
            {/* Cart Icon with Badge */}
            {status === 'authenticated' && (
              <Link href="/account/cart" className="relative text-gray-300 hover:text-white mr-6 transition-colors">
                <ShoppingBag className="h-7 w-7" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons */}
            {status === 'loading' ? (
              <div className="h-8 w-24 bg-gray-700 rounded-lg animate-pulse ml-5"></div>
            ) : status === 'authenticated' ? (
              <Button onClick={() => signOut()} className="ml-5 bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded-lg">
                <LogOut className="h-4 w-4 mr-2 inline-block" /> Sign out
              </Button>
            ) : (
              <Link href="/auth/login" passHref>
                <Button className="ml-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-lg">
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            {/* We show cart icon on mobile too */}
            {status === 'authenticated' && (
               <Link href="/account/cart" className="relative text-gray-300 hover:text-white mr-4 transition-colors">
                <ShoppingBag className="h-7 w-7" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu" className="text-gray-300 hover:text-white">
              <Menu className="h-8 w-8" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-300`}
        onClick={toggleMobileMenu}
      />
      {/* Mobile Menu Panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button onClick={toggleMobileMenu} aria-label="Close mobile menu" className="text-gray-400 hover:text-white">
              <X className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 text-lg font-medium">
            <div className="flex flex-col space-y-3">
              {menuItems}
            </div>
          </nav>
          <div className="p-4 border-t border-gray-700">
            {status === 'loading' ? (
              <div className="h-10 w-full bg-gray-700 rounded-lg animate-pulse"></div>
            ) : status === 'authenticated' ? (
              <Button onClick={() => { toggleMobileMenu(); signOut(); }} className="w-full bg-red-600 hover:bg-red-700">
                <LogOut className="h-5 w-5 mr-2 inline-block" /> Sign out
              </Button>
            ) : (
              <Link href="/auth/login" passHref>
                <Button onClick={toggleMobileMenu} className="w-full bg-blue-600 hover:bg-blue-700">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}