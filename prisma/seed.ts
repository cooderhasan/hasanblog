import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create Author
    const hasan = await prisma.author.upsert({
        where: { id: 'hasan-durmus' },
        update: {},
        create: {
            id: 'hasan-durmus',
            name: 'Hasan Durmuş',
            bio: 'E-ticaret Uzmanı ve Dijital Pazarlama Danışmanı',
            avatar: '/images/author.jpg', // Placeholder
        },
    })

    // Create Categories
    const categories = [
        { name: 'E-ticaret', slug: 'e-ticaret' },
        { name: 'Pazaryerleri', slug: 'pazaryerleri' },
        { name: 'SEO', slug: 'seo' },
        { name: 'Sosyal Medya', slug: 'sosyal-medya' },
        { name: 'Pazarlama', slug: 'pazarlama' },
    ]

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        })
    }

    // Create Posts
    // We need to fetch category IDs first
    const catEticaret = await prisma.category.findUnique({ where: { slug: 'e-ticaret' } })
    const catPazaryeri = await prisma.category.findUnique({ where: { slug: 'pazaryerleri' } })
    const catSosyal = await prisma.category.findUnique({ where: { slug: 'sosyal-medya' } })

    if (catEticaret) {
        await prisma.post.create({
            data: {
                title: 'Dropshipping Nasıl Yapılır? Adım Adım Başlangıç Rehberi',
                slug: 'dropshipping-nasil-yapilir',
                excerpt: 'Stoksuz e-ticaret modeli dropshipping ile internetten satış yapmaya başlamak isteyenler için kapsamlı rehber.',
                content: '# Dropshipping Nasıl Yapılır?\n\nDropshipping, stok tutmadan ürün satışı yapmanızı sağlayan popüler bir e-ticaret modelidir...',
                image: '/images/blog/dropshipping.jpg', // Placeholder
                categoryId: catEticaret.id,
                authorId: hasan.id,
            }
        })

        await prisma.post.create({
            data: {
                title: "Shopify ile E-ticaret Sitesi Nasıl Kurulur?",
                slug: "shopify-ile-site-kurulumu",
                excerpt: "Dünyanın en popüler e-ticaret altyapısı Shopify ile dakikalar içinde kendi online mağazanızı açın.",
                content: "# Shopify Kurulum Rehberi\n\nTeknik bilgi gerektirmeden profesyonel bir e-ticaret sitesi kurmak istiyorsanız Shopify en iyi seçenektir...",
                image: "/images/blog/shopify-kurulum.jpg",
                categoryId: catEticaret.id,
                authorId: hasan.id,
            }
        })
    }

    if (catPazaryeri) {
        await prisma.post.create({
            data: {
                title: "Amazon FBA Rehberi: Dünyaya Satış Yapın",
                slug: "amazon-fba-rehberi",
                excerpt: "Amazon FBA (Fulfillment by Amazon) sistemi ile ürünlerinizi Amazon depolarına gönderip tüm dünyada satış yapın.",
                content: "# Amazon FBA Nedir?\n\nAmazon FBA, ürünlerinizi Amazon'un depolarına gönderdiğiniz bir hizmettir...",
                image: "/images/blog/amazon-fba.jpg",
                categoryId: catPazaryeri.id,
                authorId: hasan.id,
            }
        })
    }

    if (catSosyal) {
        await prisma.post.create({
            data: {
                title: "Instagram'da Satış Artırma Taktikleri 2024",
                slug: "instagram-ile-satis-artirma",
                excerpt: "Instagram mağazanızı optimize edin, Reels videoları ile keşfete düşün ve satışlarınızı artırın.",
                content: "# Instagram Satış Taktikleri\n\nInstagram artık sadece bir fotoğraf paylaşım uygulaması değil...",
                image: "/images/blog/instagram-satis.jpg",
                categoryId: catSosyal.id,
                authorId: hasan.id,
            }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
