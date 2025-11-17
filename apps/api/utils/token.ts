import crypto from 'crypto';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';


export interface AccessTokenPayload extends JwtPayload {
    userId: string;
    email?: string;
    [key: string]: unknown;
}

export const createRandomToken = (bytes = 32): string => {
    return crypto.randomBytes(bytes).toString('hex');
};

export const hashToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

export const signAccessToken = (payload: AccessTokenPayload): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
    const options: SignOptions = { expiresIn: expiresIn as unknown as SignOptions['expiresIn'] };

    return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const decoded = jwt.verify(token, secret);
    return decoded as AccessTokenPayload;
};

export const decodeAccessToken = (token: string): AccessTokenPayload | null => {
    try {
        const decoded = jwt.decode(token);
        return decoded as AccessTokenPayload;
    } catch {
        return null;
    }
};