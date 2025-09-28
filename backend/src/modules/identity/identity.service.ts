import { PrismaClient, User, Role, Session } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class IdentityService {
  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    // Automatically create a new organization for the user
    const org = await prisma.organization.create({
      data: {
        name: `${firstName || 'User'}'s Organization`,
        ownerId: '', // Will update after user creation
      },
    });
    // Create the user and assign to the new organization
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        isActive: true,
        organizationId: org.id,
      },
    });
    // Update organization ownerId to the new user's id
    await prisma.organization.update({
      where: { id: org.id },
      data: { ownerId: user.id },
    });
    return user;
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  generateJWT(user: User): string {
    return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });
  }

  // Add more methods for SSO, MFA, sessions, etc.
}
