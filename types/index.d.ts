// types/index.d.ts

// This imports necessary types from NextAuth
import 'next-auth';
import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// -------------------------------------------------------------------------
// NextAuth Type Extensions
// These extensions allow us to add custom properties (like 'id')
// to the session and JWT token objects provided by NextAuth.
// This is critical because your `lib/authOptions.ts` adds 'id'.
// -------------------------------------------------------------------------

declare module 'next-auth' {
  /**
   * Extends the default Session interface provided by NextAuth.
   * This ensures `session.user.id` is type-safe and recognized throughout your app.
   */
  interface Session {
    user: {
      id: string; // Add this line to make `session.user.id` available
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession['user']; // Keeps other default properties of the user object
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the default JWT interface.
   * This ensures that the 'id' property is recognized on the token,
   * as we add `token.sub` (which is often synonymous with user.id) in callbacks.
   */
  interface JWT {
    id?: string; // Add this line to make `token.id` (if used, or related to 'sub') available
    // NextAuth internally maps user.id to token.sub, but adding a specific `id` helps consistency
    // based on our manual callback setup.
  }
}

// -------------------------------------------------------------------------
// Application Specific Types
// These define the structure of data relevant to your 'Goodie' application,
// like products, orders, etc. This makes your data consistent and helps with autocompletion.
// -------------------------------------------------------------------------

/**
 * Interface for a Product item in your application.
 * Matches the structure defined in `prisma/schema.prisma` for the Product model.
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// You can add more interfaces here for other parts of your app:
// export interface Order { /* ... */ }
// export interface CartItem { /* ... */ }
// export interface UserProfileData { /* ... */ } // If different from Session['user']