import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

import type { UserPayload } from '@/lib/auth';

const users: (UserPayload & { password: string })[] = [
    { username: 'buyer1', password: 'pass123', role: 'buyer' },
    { username: 'seller1', password: 'pass456', role: 'seller' },
];

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ username: user.username, role: user.role });

    const res = NextResponse.json({ token });
    res.cookies.set('token', token, {
        httpOnly: true,
        path: '/',
    });
    return res;
}
