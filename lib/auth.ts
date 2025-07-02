import jwt from 'jsonwebtoken';

export const SECRET = 'your-secret-key'; // In ideal scenarios, use an environment variable for this.

export interface UserPayload {
    username: string;
    role: 'buyer' | 'seller';
}

export function signToken(user: UserPayload) {
    return jwt.sign(user, SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): UserPayload | null {
    try {
        return jwt.verify(token, SECRET) as UserPayload;
    } catch {
        return null;
    }
}
