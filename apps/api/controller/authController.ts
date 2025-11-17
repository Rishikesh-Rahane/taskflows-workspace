import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { createRandomToken, hashToken, signAccessToken } from "../utils/token";
import { ok } from "assert";
import { generateOtp, storeOtp, verifyOtp } from "../utils/otp";
import { sendInviteEmail, sendSignupOtpEmail } from "../utils/email";
import { AuthRequest } from "../middlewares/authMiddleware";
import { configDotenv } from "dotenv";
const prisma = new PrismaClient();

configDotenv();

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);


export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;

export enum Role {
    OWNER = 'OWNER',
    MANAGER = 'MANAGER',
    MEMBER = 'MEMBER',
}


// signUpOwner handles the registration of a new owner user
export const signUpOwner: AsyncHandler = async (req, res, next) => {
    try {
        const { name, email, password, otp } = req.body;

        if (otp && email) {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isOtpValid = await verifyOtp(user.id, otp);
            if (!isOtpValid) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true
                }
            });

            const token = signAccessToken({ userId: user.id, email: user.email });

            return res.status(200).json({
                ok: true,
                message: "OTP verified successfully",
                token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'OWNER',
                isVerified: false,
            },
        });

        const generatedOtp = generateOtp();
        await storeOtp(newUser.id, generatedOtp, 10);

        await sendSignupOtpEmail({ to: email, name, otp: generatedOtp });
        return res.status(201).json({
            ok: true,
            message: "Account created. OTP sent to your email.",
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        next(error);
        return error;
    }
}

// loginUser handles user authentication and token generation
export const loginUser: AsyncHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const accessToken = signAccessToken({ userId: user.id, email: user.email });

        return res.status(200).json({
            ok: true,
            message: 'Login successful',
            token: accessToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        next(error);
        return error;
    }
}

// getCurrentUser retrieves the authenticated user's information
export const getCurrentUser: AsyncHandler = async (req: AuthRequest, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user?.userId;
        ok(userId, 'User ID is missing in request');
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            ok: true,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        next(error);
        return error;
    }
}

// logoutUser handles user logout (token invalidation can be implemented if needed)
export const logoutUser: AsyncHandler = async (req: AuthRequest, res, next) => {
    try {
        // For JWT, logout is typically handled on the client side by deleting the token.
        // Token invalidation can be implemented via a blacklist if necessary.
        return res.status(200).json({ ok: true, message: 'Logout successful' });
    } catch (error) {
        next(error);
        return error;
    }
}


export const inviteUser: AsyncHandler = async (req, res, next
) => {
    try {
        const { email, name, role = 'MEMBER' } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const token = createRandomToken();
        const tokenHash = hashToken(token);
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // Create or update existing user
        await prisma.user.upsert({
            where: { email },
            update: {
                name,
                role: role as Role,
                invited: true,
                otp: tokenHash,
                otpExpiry: expires,
            },
            create: {
                email,
                name: name || '',
                role: role as Role,
                invited: true,
                otp: tokenHash,
                otpExpiry: expires,
            },
        });

        await sendInviteEmail({
            to: email,
            name: name || '',
            inviteToken: token,
        });

        res.json({ ok: true, message: 'Invite sent successfully' });
    } catch (err) {
        next(err);
        return err;
    }
};


export const acceptInvite: AsyncHandler = async (req, res, next
) => {
    try {
        const { token, password, name } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: 'Token and password are required' });
        }

        const tokenHash = hashToken(token);

        const user = await prisma.user.findFirst({
            where: {
                otp: tokenHash,
                otpExpiry: { gt: new Date() },
                invited: true,
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const hashed = await bcrypt.hash(password, saltRounds);

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                invited: false,
                otp: null,
                otpExpiry: null,
                name: name || user.name,
            },
        });

        const jwtToken = signAccessToken({
            userId: updated.id,
            email: updated.email,
            role: updated.role,
        });

        res.json({
            ok: true,
            token: jwtToken,
            user: {
                id: updated.id,
                email: updated.email,
                name: updated.name,
                role: updated.role,
            },
        });
    } catch (err) {
        next(err);
        return err;
    }
};
