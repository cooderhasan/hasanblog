import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

export default NextAuth(authConfig).auth((req) => {
    const host = req.headers.get('host');
    const { nextUrl } = req;

    // 301 Redirect for Hostname consistency
    if (host === 'hasandurmus.com') {
        const url = nextUrl.clone();
        url.hostname = 'www.hasandurmus.com';
        url.protocol = 'https';
        return NextResponse.redirect(url, 301);
    }
});

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
