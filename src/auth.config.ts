import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/admin/login',
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnLoginPage = nextUrl.pathname === '/admin/login';

            if (isOnAdmin) {
                if (isOnLoginPage) {
                    if (isLoggedIn) {
                        return Response.redirect(new URL('/admin', nextUrl));
                    }
                    return true;
                }

                if (!isLoggedIn) {
                    return false;
                }
                return true;
            }
            return true;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
