import Link from 'next/link';
import { Fragment } from 'react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    // Generate JSON-LD Schema
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: `https://hasandurmus.com${item.href}`, // Ensure absolute URL
        })),
    };

    return (
        <nav aria-label="Breadcrumb">
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <ol className="flex items-center space-x-2 text-sm text-gray-500 flex-wrap">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <Fragment key={item.href}>
                            <li>
                                {isLast ? (
                                    <span className="font-medium text-gray-900" aria-current="page">
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                            {!isLast && (
                                <li className="text-gray-400" aria-hidden="true">
                                    /
                                </li>
                            )}
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
