// lib/authOptions.ts
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import { comparePassword } from './password';

// ----- TypeScript Augmentations to add `role` to NextAuth types -----
// This ensures TypeScript recognizes our custom properties on the session and user.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & import('next-auth').DefaultSession['user'];
  }
  interface User {
    role?: string;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}
// ----------------------------------------------------------------------

export const authOptions: NextAuthOptions = {
  // Define authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password required.');
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) throw new Error('Invalid credentials.');

        const isValid = await comparePassword(credentials.password, user.password);
        if (!isValid) throw new Error('Invalid credentials.');

        // On successful credential auth, return the user object from the DB with the role
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  pages: {
    signIn: '/auth/login',
  },

  // -------------------------------------------------------------
  // CORRECTED CALLBACKS SECTION
  // -------------------------------------------------------------
  callbacks: {
    /**
     * The `jwt` callback is the most crucial place to manage what gets
     * encrypted inside the session cookie (JWT).
     */
    async jwt({ token, user, account }) {
      // On initial sign-in, the `user` object from the provider is available.
      if (user) {
        // NextAuth automatically puts the user ID in `token.sub`. We don't need to set it.
        
        // Add the role from the user object to the token.
        // For 'credentials', `user.role` is already here from `authorize`.
        // For OAuth providers, we need to fetch it.
        token.role = (user as NextAuthUser & { role?: string }).role;
      }
      
      // SPECIAL CASE: For Google/OAuth on initial sign-in, the role might be missing.
      // We fetch it from the database here to ensure the token is complete.
      if (account?.provider === 'google' && !token.role) {
        console.log("[JWT Callback] OAuth sign-in detected, re-fetching role from DB to ensure token is complete.");
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        if (dbUser) {
          token.role = dbUser.role; // Add the role directly to the token
          console.log("[JWT Callback] Role for OAuth user set to:", dbUser.role);
        }
      }
      
      return token;
    },
    
    /**
     * The `session` callback controls what data is exposed to the client-side
     * from the token. We take the `id` and `role` from the token and add them here.
     */
    async session({ session, token }) {
      if (session.user) {
        // 1. Get the user ID from the token's `sub` claim. This is ESSENTIAL.
        session.user.id = token.sub!;
        
        // 2. Get the role from the token.
        (session.user as any).role = token.role;
      }
      
      console.log("[Session Callback] Final session object being sent to client:", session);
      return session;
    },
  },
  
  debug: true, // Keep debug on to see detailed logs
};