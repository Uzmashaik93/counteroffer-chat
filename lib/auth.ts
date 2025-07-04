import { JWTPayload, SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode('your-secret-key'); // Use env var in production

export interface UserPayload extends JWTPayload {
    username: string;
    role: 'buyer' | 'seller';
    id: string;
}

export async function signToken(user: UserPayload) {
    return await new SignJWT(user)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(SECRET);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as UserPayload;
    } catch (error) {
        console.error(error);
        return null;
    }
}
