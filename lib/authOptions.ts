// lib/authOptions.ts
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import { comparePassword } from './password';

// ----- TypeScript Augmentations to add `role` to NextAuth types -----
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

  // -------------------------------------------------------------
  // UPDATED SESSION CONFIGURATION
  // -------------------------------------------------------------
  session: {
    strategy: 'jwt',
    // Set the maximum session age for an idle session to 30 minutes (in seconds)
    maxAge: 30 * 60, // 30 minutes

    // Optional but recommended: Check the session for validity more frequently
    // This will extend the session if the user is active.
    updateAge: 24 * 60 * 60, // 24 hours (can be shorter, like every 10 mins: 10 * 60)
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
     * The `signIn` callback is crucial for linking OAuth accounts.
     * It runs before the JWT is created.
     */
    async signIn({ user, account, profile }) {
      // Allow standard credentials sign-in to proceed.
      if (account?.provider === 'credentials') {
        return true;
      }
      
      // Handle OAuth sign-ins, specifically for linking to existing accounts.
      if (account?.provider === 'google') {
        if (!profile?.email) {
          throw new Error("Profile email not found in Google OAuth response.");
        }
        
        try {
          // Find if a user with this email already exists in our database.
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (dbUser) {
            // --- LOGIC FOR EXISTING USER (INCLUDING ADMINS) ---
            console.log(`[Sign In] OAuth user found in DB: ${profile.email}, Role: ${dbUser.role}`);
            
            // Link the new Google account to the existing user record
            // This prevents duplicate accounts and ensures roles are preserved.
            await prisma.account.upsert({
                where: {
                    provider_providerAccountId: {
                        provider: 'google',
                        providerAccountId: account.providerAccountId!,
                    },
                },
                update: { userId: dbUser.id },
                create: {
                    userId: dbUser.id,
                    type: account.type!,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId!,
                    access_token: account.access_token,
                    refresh_token: account.refresh_token,
                    expires_at: account.expires_at,
                    scope: account.scope,
                    token_type: account.token_type,
                    id_token: account.id_token,
                }
            });
            
            // IMPORTANT: Attach the existing role to the user object being processed by NextAuth.
            // This is crucial for the `jwt` and `redirect` callbacks to work correctly for admins.
            (user as NextAuthUser & { role?: string }).role = dbUser.role;

          } else {
            // --- LOGIC FOR NEW OAUTH USER ---
            // If the user does not exist, create them. They will get the default 'USER' role from the schema.
            dbUser = await prisma.user.create({
                data: {
                    name: profile.name,
                    email: profile.email,
                    image: profile.image || (profile as any).picture,
                    emailVerified: new Date(),
                    accounts: {
                        create: [{
                            type: account.type!,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId!,
                            access_token: account.access_token,
                            refresh_token: account.refresh_token,
                            expires_at: account.expires_at,
                            scope: account.scope,
                            token_type: account.token_type,
                            id_token: account.id_token,
                        }]
                    }
                },
                include: { accounts: true }
            });
            console.log(`[Sign In] New OAuth user created in DB: ${dbUser.email}, Role: ${dbUser.role}`);
          }
          return true; // Allow the sign-in

        } catch (error) {
          console.error("Error during OAuth sign-in processing:", error);
          return false; // Block sign-in on error
        }
      }

      return false; // Block sign-in for any unhandled providers
    },
    
    /**
     * The `jwt` callback creates the encrypted session token.
     */
    async jwt({ token, user }) {
      // On the initial sign-in, the `user` object is available.
      // We persist its `role` to the token.
      if (user) {
        token.role = (user as NextAuthUser & { role?: string }).role;
      }
      return token;
    },
    
    /**
     * The `session` callback exposes data from the token to the client-side.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  
  debug: true, // Keep debug on to see detailed logs
};