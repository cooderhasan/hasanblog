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
                sameSite: 'lax' as const,
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
                    // Allow access to login page
                    if (isLoggedIn) {
                        // If already logged in, redirect to admin dashboard
                        return Response.redirect(new URL('/admin', nextUrl));
                    }
                    return true;
                }
                // Require login for other admin pages
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true; // Allow access to non-admin pages
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
