import {Header} from "@/components/shared/admin/header";
import {RouteGuard} from "@/components/shared/route-guard";

export default function AdminLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RouteGuard requireAuth role="ADMIN">
            <main className={'flex-1'}>
                <Header/>
                {children}
            </main>
        </RouteGuard>
    );
}
