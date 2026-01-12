'use client';

import { useState, useEffect } from 'react';
import { TocItem } from '@/lib/addHeadingIds';

interface TableOfContentsProps {
    toc: TocItem[];
}

export default function TableOfContents({ toc: items }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        // Intersection Observer for active heading tracking
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-10% 0px -80% 0px' } // Adjusted rootMargin for better activation
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Manually set active for better feedback
            setActiveId(id);
        }
    };

    if (items.length < 2) return null;

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex items-center justify-between w-full text-left"
            >
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    İçindekiler
                </h2>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {!isCollapsed && (
                <nav className="mt-4">
                    <ul className="space-y-2">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
                            >
                                <a
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToHeading(item.id);
                                    }}
                                    className={`block w-full py-1 px-2 rounded transition-colors text-sm
                                        ${activeId === item.id
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                        ${item.level === 3 ? 'text-gray-500' : ''}
                                    `}
                                >
                                    {item.level === 3 && '↳ '}
                                    {item.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
}
