import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

// Format date to Turkish locale
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return '-';
    try {
        const d = typeof date === 'string' ? parseISO(date) : date;
        // Check for invalid date
        if (isNaN(d.getTime())) return '-';
        return format(d, 'd MMMM yyyy', { locale: tr });
    } catch (error) {
        return '-';
    }
}

// Truncate text
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}

// Generate slug from title
export function generateSlug(title: string): string {
    const turkishChars: { [key: string]: string } = {
        'ğ': 'g', 'Ğ': 'g',
        'ü': 'u', 'Ü': 'u',
        'ş': 's', 'Ş': 's',
        'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o',
        'ç': 'c', 'Ç': 'c',
    };

    let slug = title.toLowerCase();
    Object.keys(turkishChars).forEach(char => {
        slug = slug.replace(new RegExp(char, 'g'), turkishChars[char]);
    });

    slug = slug
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    return slug;
}
