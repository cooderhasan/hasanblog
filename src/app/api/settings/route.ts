import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        let settings = await prisma.siteSettings.findUnique({
            where: { id: 'main' }
        });

        // Create default settings if not exists
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    id: 'main',
                    siteName: 'Hasan Durmuş Blog',
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const settings = await prisma.siteSettings.upsert({
            where: { id: 'main' },
            update: {
                siteName: data.siteName,
                siteDescription: data.siteDescription,
                logoUrl: data.logoUrl,
                faviconUrl: data.faviconUrl,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                metaKeywords: data.metaKeywords,
                googleAnalyticsId: data.googleAnalyticsId,
                googleTagManagerId: data.googleTagManagerId,
                facebookPixelId: data.facebookPixelId,
                customHeadCode: data.customHeadCode,
                customFooterCode: data.customFooterCode,
            },
            create: {
                id: 'main',
                siteName: data.siteName || 'Hasan Durmuş Blog',
                siteDescription: data.siteDescription,
                logoUrl: data.logoUrl,
                faviconUrl: data.faviconUrl,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                metaKeywords: data.metaKeywords,
                googleAnalyticsId: data.googleAnalyticsId,
                googleTagManagerId: data.googleTagManagerId,
                facebookPixelId: data.facebookPixelId,
                customHeadCode: data.customHeadCode,
                customFooterCode: data.customFooterCode,
            }
        });

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error('Update settings error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
