import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hasandurmus.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('=== AUTH ATTEMPT ===');
                console.log('Received credentials:', credentials);

                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                console.log('Parsed email:', email);
                console.log('Parsed password:', password);
                console.log('Expected email:', ADMIN_EMAIL);
                console.log('Expected password:', ADMIN_PASSWORD);
                console.log('Email match:', email === ADMIN_EMAIL);
                console.log('Password match:', password === ADMIN_PASSWORD);

                // Simple hardcoded check (replace with DB lookup in production)
                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    console.log('=== AUTH SUCCESS ===');
                    return {
                        id: '1',
                        name: 'Hasan Durmuş',
                        email: ADMIN_EMAIL,
                    };
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET || 'your-super-secret-key-change-in-production',
});
