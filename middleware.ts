import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    const protectedPaths = ['/dashboard/buyer', '/dashboard/seller'];
    const path = req.nextUrl.pathname;

    if (protectedPaths.includes(path)) {
        if (!token) return new NextResponse('Unauthorized', { status: 401 });

        const user = verifyToken(token);
        if (!user) return new NextResponse('Invalid token', { status: 403 });

        if (path.startsWith('/dashboard/buyer') && user.role !== 'buyer') {
            return new NextResponse('Forbidden: Buyer only', { status: 403 });
        }

        if (path.startsWith('/dashboard/seller') && user.role !== 'seller') {
            return new NextResponse('Forbidden: Seller only', { status: 403 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
