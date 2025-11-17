import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const saltRounds = process.env.BCRYPT_SALT_ROUNDS ? Number(process.env.BCRYPT_SALT_ROUNDS) : 10;

export async function storeOtp(
    userId: string,
    otp: number,
    expiresInMinutes = 10
): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60_000);

    // Hash the OTP securely
    const hashedOtp = await bcrypt.hash(otp.toString(), saltRounds);

    // Store in the database
    await prisma.user.update({
        where: { id: userId },
        data: {
            otp: hashedOtp,
            otpExpiry: expiresAt,
        },
    });
}

export async function verifyOtp(userId: string, otp: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.otp || !user.otpExpiry) return false;

  const isExpired = new Date() > user.otpExpiry;
  if (isExpired) return false;

  const isValid = await bcrypt.compare(otp, user.otp);
  return isValid;
}


export function generateOtp(length = 6): number {
    const otp = Math.random()
        .toString()
        .slice(-length)
        .padStart(length, '0');
    return Number(otp);
}

