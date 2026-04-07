import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityProvider from "@/components/AccessibilityProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <AccessibilityProvider>
            <Header />
            {/* O pt-24 (mobile) e pt-32 (desktop) criam a margem de respiro para compensar o Header 'fixed top-0' */}
            <main id="conteudo-principal" className="min-h-screen relative z-0 pt-24 md:pt-[110px]">
                {children}
            </main>
            <Footer />
        </AccessibilityProvider>
    );
}
