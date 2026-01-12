import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Seed default pages if they don't exist
async function seedDefaultPages() {
    const defaultPages = [
        { slug: 'hizmetler', title: 'Hizmetler' },
        { slug: 'hakkimda', title: 'Hakkımda' },
        { slug: 'iletisim', title: 'İletişim' },
        { slug: 'e-ticaret', title: 'E-Ticaret' },
        { slug: 'pazaryerleri', title: 'Pazaryerleri' },
        { slug: 'gizlilik-politikasi', title: 'Gizlilik Politikası' },
        { slug: 'site-haritasi', title: 'Site Haritası' },
    ];

    for (const page of defaultPages) {
        const exists = await prisma.page.findUnique({ where: { slug: page.slug } });
        if (!exists) {
            await prisma.page.create({
                data: {
                    slug: page.slug,
                    title: page.title,
                    content: `<h1>${page.title}</h1><p>Bu sayfa içeriği admin panelinden düzenlenebilir.</p>`,
                }
            });
        }
    }
}

export default async function PagesPage() {
    // Seed default pages
    await seedDefaultPages();

    const pages = await prisma.page.findMany({
        orderBy: { title: 'asc' },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sayfalar</h1>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Sayfa Adı</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">URL</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Durum</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Son Güncelleme</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pages.map((page) => (
                            <tr key={page.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                                <td className="px-6 py-4 text-gray-500">/{page.slug}</td>
                                <td className="px-6 py-4">
                                    {page.isActive ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            Pasif
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(page.updatedAt).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/pages/${page.slug}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Düzenle
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📝 Sayfa Yönetimi Hakkında</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Bu sayfalar sitenizin statik içeriklerini yönetmenizi sağlar</li>
                    <li>• Her sayfa SEO uyumlu meta açıklamalar içerebilir</li>
                    <li>• Zengin metin editörü ile içeriğinizi kolayca düzenleyin</li>
                </ul>
            </div>
        </div>
    );
}
