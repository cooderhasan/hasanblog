
import fs from 'fs';
import path from 'path';
import https from 'https';
import { parseStringPromise } from 'xml2js';
import { PrismaClient } from '@prisma/client';

// ---- Robust Env Loader ----
function loadEnv() {
    const cwd = process.cwd();
    // Try to find .env in current dir and parent dirs (just in case)
    const envPaths = [
        path.join(cwd, '.env.development.local'),
        path.join(cwd, '.env.development'),
        path.join(cwd, '.env.local'),
        path.join(cwd, '.env')
    ];

    console.log('🔍 Environment variables loading...');

    for (const filePath of envPaths) {
        if (fs.existsSync(filePath)) {
            try {
                console.log(`📂 Reading ${path.basename(filePath)}...`);
                // Read as buffer
                let buffer = fs.readFileSync(filePath);
                let content = buffer.toString('utf-8');

                // Check for null bytes (symptom of UTF-16LE read as UTF-8)
                if (content.includes('\u0000')) {
                    console.log('   ⚠️ Detected Null Bytes (UTF-16?); stripping them...');
                    content = content.replace(/\u0000/g, '');
                }

                // Strip BOM if present
                if (content.charCodeAt(0) === 0xFEFF) {
                    content = content.slice(1);
                }

                const lines = content.split(/\r?\n/);
                let loadedCount = 0;

                for (const line of lines) {
                    let trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith('#')) continue;

                    const eqIdx = trimmed.indexOf('=');
                    if (eqIdx > 0) {
                        let key = trimmed.slice(0, eqIdx).trim();
                        // Loose cleaning
                        key = key.replace(/^[^a-zA-Z_]+/, '');

                        let val = trimmed.slice(eqIdx + 1).trim();

                        // Remove wrapping quotes
                        if ((val.startsWith('"') && val.endsWith('"')) ||
                            (val.startsWith("'") && val.endsWith("'"))) {
                            val = val.slice(1, -1);
                        }

                        console.log(`   🔑 Found key: "${key}"`);

                        // Force set known keys with loose matching
                        if (key.includes('DATABASE_URL')) {
                            process.env.DATABASE_URL = val;
                            console.log('   ✅ DATABASE_URL forced set!');
                        }

                        // Only set if valid key and not already set
                        if (key && !process.env[key]) {
                            process.env[key] = val;
                            loadedCount++;
                        }
                    }
                }
                console.log(`✅ Loaded ${loadedCount} new variables from ${path.basename(filePath)}`);
            } catch (err) {
                console.error(`❌ Failed to read ${path.basename(filePath)}:`, err);
            }
        }
    }
}

// ---- Main Script ----

// Helper: Download Image
async function downloadImage(url: string, destDir: string): Promise<string | null> {
    try {
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        const filename = path.basename(url).split(/[?#]/)[0];
        const uniqueName = `${Date.now()}-${filename}`;
        const destPath = path.join(destDir, uniqueName);
        const relativePath = `/uploads/wp-imports/${uniqueName}`;

        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(destPath);
            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    fs.unlink(destPath, () => { });
                    resolve(null);
                    return;
                }
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(relativePath);
                });
                file.on('error', (err) => {
                    fs.unlink(destPath, () => { });
                    resolve(null);
                });
            }).on('error', (err) => {
                fs.unlink(destPath, () => { });
                resolve(null);
            });
        });
    } catch (error) {
        return null; // Silent fail to continue script
    }
}

async function main() {
    loadEnv();

    if (!process.env.DATABASE_URL) {
        console.error('❌ FATAL: DATABASE_URL is missing!');
        process.exit(1);
    }

    // Explicitly pass url to Prisma
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    });

    console.log('🚀 Script Başlatılıyor...');

    const xmlFilename = 'e-ticaretuzman-hasandurmu.WordPress.2026-01-31.xml';
    const xmlPath = path.join(process.cwd(), xmlFilename);
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'wp-imports');

    if (!fs.existsSync(xmlPath)) {
        console.error(`❌ Hata: ${xmlFilename} dosyası bulunamadı.`);
        console.log(`📂 Çalışma dizini: ${process.cwd()}`);
        return;
    }

    console.log('🔄 XML dosyası okunuyor...');
    const xmlContent = fs.readFileSync(xmlPath, 'utf-8');

    console.log('🔄 XML ayrıştırılıyor...');
    const result = await parseStringPromise(xmlContent);

    if (!result.rss || !result.rss.channel || !result.rss.channel[0]) {
        console.error('❌ Geçersiz XML formatı.');
        return;
    }

    const channel = result.rss.channel[0];
    const items = channel.item || [];

    console.log(`📊 Toplam ${items.length} öğe bulundu.`);

    // Görselleri Haritala
    const attachmentMap = new Map<string, string>();
    console.log('🖼️ Görseller taranıyor...');
    for (const item of items) {
        const postType = item['wp:post_type']?.[0];
        if (postType === 'attachment') {
            const id = item['wp:post_id']?.[0];
            const url = item['wp:attachment_url']?.[0];
            if (id && url) {
                attachmentMap.set(id, url);
            }
        }
    }
    console.log(`🖼️ ${attachmentMap.size} adet görsel bulundu.`);

    // Yazar Kontrolü
    let author = await prisma.author.findFirst();
    if (!author) {
        author = await prisma.author.create({
            data: {
                name: 'Admin',
                bio: 'Site Yöneticisi',
                avatar: '/images/default-avatar.png'
            }
        });
        console.log('✅ Varsayılan yazar oluşturuldu/seçildi.');
    }

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    let imageDownloadCount = 0;

    console.log('🚀 Yazı aktarımı başlıyor...');

    for (const item of items) {
        try {
            const postType = item['wp:post_type']?.[0];
            if (postType !== 'post') continue;

            const title = item.title?.[0];
            if (!title) continue;

            // const status = item['wp:status']?.[0];
            // if (status !== 'publish') {}

            let slug = item['wp:post_name']?.[0];
            if (!slug) {
                slug = title.toLowerCase()
                    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                    .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            }

            const content = item['content:encoded']?.[0] || '';
            let excerpt = item['excerpt:encoded']?.[0] || '';
            if (!excerpt && content) {
                const plainText = content.replace(/<[^>]+>/g, '');
                excerpt = plainText.substring(0, 160) + '...';
            }

            const pubDate = item.pubDate?.[0] ? new Date(item.pubDate[0]) : new Date();

            // Kapak Görseli
            let featuredImageUrl = null;
            let localImagePath = null;

            if (item['wp:postmeta']) {
                for (const meta of item['wp:postmeta']) {
                    if (meta['wp:meta_key']?.[0] === '_thumbnail_id') {
                        const thumbnailId = meta['wp:meta_value']?.[0];
                        if (thumbnailId && attachmentMap.has(thumbnailId)) {
                            featuredImageUrl = attachmentMap.get(thumbnailId);
                        }
                        break;
                    }
                }
            }

            if (featuredImageUrl) {
                process.stdout.write(`📥 ${path.basename(featuredImageUrl)}... `);
                localImagePath = await downloadImage(featuredImageUrl, uploadsDir);
                if (localImagePath) {
                    process.stdout.write('✅\n');
                    imageDownloadCount++;
                } else {
                    process.stdout.write('❌\n');
                }
            }

            // Kategori
            const categories = item.category || [];
            let categoryName = 'Genel';

            for (const cat of categories) {
                if (cat['$'] && cat['$'].domain === 'category') {
                    if (cat['_'] !== 'Uncategorized' && cat['_'] !== 'Genel') {
                        categoryName = cat['_'];
                        break;
                    }
                }
            }

            const catSlug = categoryName.toLowerCase()
                .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

            let category = await prisma.category.findFirst({
                where: { OR: [{ slug: catSlug }, { name: categoryName }] }
            });

            if (!category) {
                category = await prisma.category.create({
                    data: { name: categoryName, slug: catSlug }
                });
            }

            const existingPost = await prisma.post.findUnique({ where: { slug } });
            if (existingPost) {
                console.log(`⚠️ Mevcut: ${slug}`);
                skipCount++;
                continue;
            }

            await prisma.post.create({
                data: {
                    title,
                    slug,
                    content,
                    excerpt,
                    date: pubDate,
                    published: true, // Force publish for imported content
                    categoryId: category.id,
                    authorId: author.id,
                    image: localImagePath,
                }
            });

            successCount++;

        } catch (err) {
            console.error(`❌ Hata (${item.title?.[0]}):`, err);
            errorCount++;
        }
    }

    console.log('\n----------------------------------------');
    console.log(`🎉 İşlem Sonucu:`);
    console.log(`✅ Eklenen Yazı: ${successCount}`);
    console.log(`🖼️ İndirilen Resim: ${imageDownloadCount}`);
    console.log(`⏭️ Atlanan: ${skipCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log('----------------------------------------');

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    process.exit(1);
});
