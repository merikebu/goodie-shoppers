// components/Navbar.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from './ui/Button';

// Import icons from lucide-react
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';

// NOTICE: There are NO imports for 'ProductActions' or 'prisma' here.

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Effect to close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Effect to disable body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const menuItems = (
    <>
      <Link href="/shop/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-700">
        <LayoutDashboard className="h-5 w-5" />
        Shop
      </Link>
      <Link href="/account/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-700">
        <ShoppingCart className="h-5 w-5" />
        Cart
      </Link>
      {session && (
        <Link href="/account/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-700">
          <User className="h-5 w-5" />
          Profile
        </Link>
      )}
    </>
  );

  return (
    <>
      <nav className="bg-gray-800 p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-3xl font-extrabold tracking-wider hover:text-indigo-400 transition-colors duration-200">
            Goodie
          </Link>
          <div className="hidden md:flex items-center space-x-5 text-lg font-medium">
            {menuItems}
          </div>
          <div className="hidden md:flex items-center">
            {session ? (
              <Button
                onClick={() => signOut()}
                className="ml-5 bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded-lg text-base transition duration-200 transform hover:scale-105"
              >
                <LogOut className="h-4 w-4 mr-2 inline-block" /> Sign out
              </Button>
            ) : (
              <Link href="/auth/login" passHref>
                <Button className="ml-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-lg text-base transition duration-200 transform hover:scale-105">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <Menu className="h-8 w-8" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={toggleMobileMenu}
              aria-label="Close mobile menu"
              className="text-gray-400 hover:text-white"
            >
              <X className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 text-lg font-medium">
            <div className="flex flex-col space-y-3">
              {menuItems}
            </div>
          </nav>
          <div className="p-4 border-t border-gray-700">
            {session ? (
               <Button
                  onClick={() => {
                    toggleMobileMenu();
                    signOut();
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg text-base"
                >
                  <LogOut className="h-5 w-5 mr-2 inline-block" /> Sign out
                </Button>
            ) : (
              <Link href="/auth/login" passHref>
                <Button onClick={toggleMobileMenu} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-base">
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