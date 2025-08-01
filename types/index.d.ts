// types/index.d.ts
import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';

// Extend the built-in NextAuth types
declare module 'next-auth' {
  /**
   * Extends the Session interface to include custom properties like 'id' and 'role'.
   * This makes them available on the session object returned by useSession().
   */
  interface Session {
    user: {
      id: string;
      role?: string; // Add the user's role to the session
    } & DefaultSession['user'];
  }
  
  /**
   * Extends the User interface to include 'role'. This type is used internally by NextAuth,
   * especially in callbacks after a user signs in or is retrieved from the database.
   */
  interface User extends DefaultUser {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the JWT token to include the 'role'.
   * This is how we persist the user's role across sessions using a JWT.
   */
  interface JWT {
    role?: string;
  }
}