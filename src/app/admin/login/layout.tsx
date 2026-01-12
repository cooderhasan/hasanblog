export const metadata = {
    title: 'Admin Girişi',
    robots: { index: false, follow: false },
};

export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
