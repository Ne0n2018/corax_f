import {Navbar} from "@/components/ui/navbar";
import {Toaster} from "sonner";
import {AuthProvider} from "@/providers/auth.provider";
import {Suspense} from "react";
import {PasswordRecoveryDialog} from "@/components/shared/password-recovery/passwordRecovery.dialog";
import {Footer} from "@/components/shared/footer/footer";
import {AppLoader} from "@/components/shared/appLoader";
import {CookieConsentBanner} from "@/components/shared/cookie-consent/cookie-consent";

export default function MainLayout({
                                       children, modal,
                                   }: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <>
            <main className={'flex-1'}>
                <AppLoader>
                    <AuthProvider>
                        <Navbar className={'mb-0 pb-0'}/>
                        {children}
                        {modal}
                        <Suspense>
                            <PasswordRecoveryDialog/>
                        </Suspense>
                    </AuthProvider>
                    <Toaster position={'bottom-center'} richColors closeButton/>
                </AppLoader>
            </main>
            <Footer/>
            <CookieConsentBanner/>
        </>
    );
}
