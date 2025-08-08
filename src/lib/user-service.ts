import { prisma } from './db';
import bcrypt from 'bcryptjs';

/**
 * Create a new user with unverified email
 */
export async function createUser(data: {
  email: string;
  password: string;
  companyName?: string;
  name?: string;
  role?: 'admin' | 'property_manager' | 'tenant';
}) {
  const { email, password, companyName, name, role = 'property_manager' } = data;
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user with unverified email and inactive status
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      companyName,
      name,
      role,
      isActive: false,
      emailVerified: null
    }
  });
  
  return user;
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

/**
 * Verify a user's email
 */
export async function verifyUserEmail(email: string) {
  return prisma.user.update({
    where: { email },
    data: {
      emailVerified: new Date(),
      isActive: true
    }
  });
}

/**
 * Check if a user's credentials are valid
 */
export async function validateCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  
  if (!user || !user.isActive) {
    return null;
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  return user;
}