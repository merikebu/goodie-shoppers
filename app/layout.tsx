// app/layout.tsx
'use client' // This must be at the very top

import './../styles/globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import Navbar from '../components/Navbar' // Adjusted import path if needed
import Footer from '../components/Footer' // Adjusted import path if needed

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <NextAuthSessionProvider>
          <Navbar /> {/* This is your global Navbar */}
          <main className="flex-grow"> {/* `flex-grow` pushes the footer to the bottom */}
            {children}
          </main>
          <Footer /> {/* Here is your global Footer! */}
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}