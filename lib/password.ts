// lib/password.ts
import bcrypt from 'bcryptjs'; // Ensure 'bcryptjs' is installed: npm install bcryptjs

const SALT_ROUNDS = 10; // Standard number of salt rounds for bcrypt

/**
 * Hashes a plaintext password using bcrypt.
 * @param password The plaintext password to hash.
 * @returns A promise that resolves to the hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  // Validate password length or complexity here if needed
  if (!password || password.length === 0) {
    throw new Error('Password cannot be empty.');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password with a hashed password.
 * @param plaintextPassword The password provided by the user.
 * @param hashedPassword The hashed password stored in the database.
 * @returns A promise that resolves to true if passwords match, false otherwise.
 */
export async function comparePassword(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
  if (!plaintextPassword || !hashedPassword) {
    return false; // Cannot compare if one is missing
  }
  return bcrypt.compare(plaintextPassword, hashedPassword);
}