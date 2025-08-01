// lib/authOptions.ts
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials'; // <--- NEW IMPORT
import prisma from './prisma';
import { comparePassword } from './password'; // <--- NEW IMPORT for password utility

// Extend NextAuth's Profile type for Google-specific fields like 'picture' and 'email_verified'
interface GoogleProfileWithExtras {
  name?: string;
  email?: string;
  image?: string;
  picture?: string;
  email_verified?: boolean;
}

export const authOptions: NextAuthOptions = {
  // Define Authentication Providers
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    // -------------------------------------------------------------
    // NEW: Credentials Provider for Email/Password Login
    // -------------------------------------------------------------
    CredentialsProvider({
      name: 'Credentials', // Name to display on the login form (e.g., "Sign in with Email")
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        // 1. Find user by email in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // 2. If user not found OR user was created via OAuth (no password set)
        if (!user || !user.password) {
          throw new Error('Invalid credentials or user registered via social login.');
        }

        // 3. Compare provided password with hashed password from the database
        const isValidPassword = await comparePassword(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error('Invalid credentials. Password does not match.');
        }

        // If credentials are valid, return the user object
        // This 'user' object will be passed to the jwt and session callbacks.
        // It's essential to only return a user if authentication succeeded.
        console.log("-> authorize: Credentials validated for user:", user.email);
        return {
            id: user.id, // Must return at least a user ID
            name: user.name,
            email: user.email,
            image: user.image, // Pass existing image if available
        };
      },
    }),
    // -------------------------------------------------------------
  ],

  // Define custom pages
  pages: {
    signIn: '/auth/login', // Use our custom login page
  },

  // Session Management Configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  // Callbacks provide fine-grained control
  callbacks: {
    async signIn({ account, profile, user }) {
      // Manual logging to trace flow
      console.log("--- START signIn callback ---");
      console.log("Account (from Provider):", account);
      console.log("Profile (from Provider):", profile);
      console.log("User (from Authorize/Adapter):", user); // 'user' is populated by `authorize` for credentials

      // If credentials provider is used, user object is already populated by `authorize` callback.
      // We don't need to do anything with Prisma.user/Account tables here
      // because our `authorize` callback handled that specifically for credentials.
      if (account?.provider === 'credentials') {
        // NextAuth has successfully authorized via credentials.
        // The user object received here is what our `authorize` function returned.
        console.log("-> signIn: Credentials sign-in successful. User:", user.id);
        return true;
      }

      // -------------------------------------------------------------
      // Existing Google OAuth Logic (Remains unchanged for manual persistence)
      // -------------------------------------------------------------
      if (account?.provider === 'google' && profile?.email) {
        const googleProfile = profile as GoogleProfileWithExtras;
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: googleProfile.email },
          });

          if (!dbUser) {
            console.log("-> signIn (Google): Creating new user in DB:", googleProfile.email);
            dbUser = await prisma.user.create({
              data: {
                email: googleProfile.email,
                name: googleProfile.name,
                image: googleProfile.image || googleProfile.picture,
                emailVerified: googleProfile.email_verified ? new Date() : null,
              },
            });
          } else {
            console.log("-> signIn (Google): User found, updating existing user in DB:", dbUser.id);
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                name: googleProfile.name || dbUser.name,
                image: googleProfile.image || googleProfile.picture || dbUser.image,
                emailVerified: dbUser.emailVerified || (googleProfile.email_verified ? new Date() : dbUser.emailVerified),
              },
            });
          }

          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            console.log(`-> signIn (Google): Linking new ${account.provider} account for user: ${dbUser.id}`);
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          } else {
              console.log(`-> signIn (Google): Updating existing ${account.provider} account tokens for user: ${dbUser.id}`);
              await prisma.account.update({
                  where: { id: existingAccount.id },
                  data: {
                      refresh_token: account.refresh_token || existingAccount.refresh_token,
                      access_token: account.access_token || existingAccount.access_token,
                      expires_at: account.expires_at || existingAccount.expires_at,
                  }
              });
          }

          // Assign database user's ID to the 'user' object for consistency in subsequent callbacks
          user.id = dbUser.id;
          console.log("-> signIn (Google): Successfully processed user and account.");
          return true; // Allow Google sign-in
        } catch (error) {
          console.error("!!! FATAL signIn callback error (Prisma interaction for Google OAuth failed):", error);
          return false; // Deny Google sign-in due to internal error
        }
      }
      console.log("-> signIn: Conditions not met (unhandled provider or missing data). Denying access.");
      console.log("--- END signIn callback (Failure) ---");
      return false; // Deny sign-in for any other unhandled case
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // NextAuth uses 'sub' to store the user ID in the JWT
      }
      console.log("-> jwt: Token processed. Sub:", token.sub);
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      console.log("-> session: Session object updated with ID:", session.user?.id);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Useful for debugging in development
}