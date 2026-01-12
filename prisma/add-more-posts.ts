
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Get Author
    const hasan = await prisma.author.findFirst({
        where: { id: 'hasan-durmus' }
    })

    if (!hasan) {
        console.error('Author not found, please run seed.ts first')
        return
    }

    // Get Categories
    const catSeo = await prisma.category.findUnique({ where: { slug: 'seo' } })
    const catEticaret = await prisma.category.findUnique({ where: { slug: 'e-ticaret' } })
    const catPazarlama = await prisma.category.findUnique({ where: { slug: 'pazarlama' } })

    const newPosts = [
        {
            title: "SEO Uyumlu İçerik Nasıl Yazılır?",
            slug: "seo-uyumlu-icerik-yazarligi",
            excerpt: "Google'da üst sıralara çıkmak için içeriklerinizi nasıl optimize etmelisiniz? İşte SEO uyumlu blog yazarlığının püf noktaları.",
            content: "# SEO Uyumlu İçerik\n\nİçerik krallıktır, ancak sadece kaliteli olması yetmez, aynı zamanda bulunabilir olmalıdır...",
            image: "/images/blog/seo-icerik.jpg",
            categoryId: catSeo?.id
        },
        {
            title: "E-ihracat Faturası Nasıl Kesilir?",
            slug: "e-ihracat-faturasi-rehberi",
            excerpt: "Yurtdışına ürün satarken fatura kesim süreçleri ve dikkat edilmesi gereken vergi muafiyetleri hakkında detaylı bilgiler.",
            content: "# E-ihracat Faturası\n\nMicro ihracat kapsamında gönderilen ürünlerin faturalandırılması süreçleri...",
            image: "/images/blog/e-ihracat-fatura.jpg",
            categoryId: catEticaret?.id
        },
        {
            title: "Google Ads Reklam Verme Rehberi 2024",
            slug: "google-ads-reklam-verme",
            excerpt: "Google arama sonuçlarında reklam vererek potansiyel müşterilerinize nasıl ulaşırsınız? Adım adım reklam kurulumu.",
            content: "# Google Ads Rehberi\n\nDoğru anahtar kelimeleri seçerek bütçenizi en verimli şekilde kullanın...",
            image: "/images/blog/google-ads.jpg",
            categoryId: catPazarlama?.id
        },
        {
            title: "E-ticarette Müşteri Memnuniyeti",
            slug: "eticaret-musteri-memnuniyeti",
            excerpt: "Sadık müşteriler yaratmak ve marka bilinirliğini artırmak için müşteri hizmetleri süreçlerinizi nasıl yönetmelisiniz?",
            content: "# Müşteri Memnuniyeti\n\nE-ticarette başarının anahtarı, müşteriyi satın alma sonrasında da mutlu etmektir...",
            image: "/images/blog/musteri-memnuniyeti.jpg",
            categoryId: catEticaret?.id
        }
    ]

    for (const post of newPosts) {
        if (post.categoryId) {
            await prisma.post.upsert({
                where: { slug: post.slug },
                update: {},
                create: {
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    content: post.content,
                    image: post.image,
                    categoryId: post.categoryId,
                    authorId: hasan.id
                }
            })
            console.log(`Created post: ${post.title}`)
        }
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
