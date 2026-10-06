import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SearchBar from "../SearchBar";
import { useJsonLd } from "../../lib/useJsonLd";
import { initAnalytics, trackPageView } from "../../lib/analytics";

const ORGANIZATION_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Webfarm's Wear",
    url: typeof window !== "undefined" ? window.location.origin : undefined,
};

// These get a full-bleed, chrome-free canvas — no header/searchbar/footer
// and no outer gutter — so the split-screen auth layout can span the whole
// viewport instead of sitting inside the site's usual content column.
const IMMERSIVE_ROUTES = ["/login", "/forgot-password", "/reset-password"];

const Layout = ({ children }) => {
    useJsonLd(ORGANIZATION_JSON_LD);
    const location = useLocation();

    useEffect(() => { initAnalytics(); }, []);
    useEffect(() => { trackPageView(location.pathname); }, [location.pathname]);

    if (IMMERSIVE_ROUTES.includes(location.pathname)) {
        return <main>{children}</main>;
    }

    return (
        <div className="px-4 sm:px-[5vw] lg:px-[7vw]">
            <header>

                <Header />
                <SearchBar />
            </header>

            <main>{children}</main>

            <footer className="flex flex-col sm:grid grid-cols-[2.5fr_1fr_1fr_1fr] gap-10 my-10 mt-40 text-sm">
                <Footer />
            </footer>
        </div>
    );
};

export default Layout;
