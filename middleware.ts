import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    const protectedPaths = ['/chat/buyer', '/chat/seller'];
    const path = req.nextUrl.pathname;

    if (protectedPaths.includes(path)) {
        if (!token) return new NextResponse(`Unauthorized`, { status: 401 });

        const user = await verifyToken(token);
        if (!user) return new NextResponse('Invalid token', { status: 403 });

        if (path.startsWith('/chat/buyer') && user.role !== 'buyer') {
            return new NextResponse('Forbidden: Buyer only', { status: 403 });
        }

        if (path.startsWith('/chat/seller') && user.role !== 'seller') {
            return new NextResponse('Forbidden: Seller only', { status: 403 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/chat/:path*'],
}
