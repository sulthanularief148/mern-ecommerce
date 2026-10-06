// Inert until VITE_GA4_ID / VITE_META_PIXEL_ID are set as build args — no
// tracking script loads, no third-party request fires, until the store
// owner actually has an account and drops the ID in. No code change needed
// to turn it on later, just a rebuild with the env var set.
const GA4_ID = import.meta.env.VITE_GA4_ID;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

let initialized = false;

export function initAnalytics() {
    if (initialized) return;
    initialized = true;

    if (GA4_ID) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() { window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", GA4_ID);
    }

    if (META_PIXEL_ID) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";
        script.onload = () => {
            window.fbq("init", META_PIXEL_ID);
            window.fbq("track", "PageView");
        };
        document.head.appendChild(script);

        window.fbq = window.fbq || function fbq() { (window.fbq.q = window.fbq.q || []).push(arguments); };
    }
}

export function trackPageView(path) {
    if (GA4_ID && window.gtag) window.gtag("event", "page_view", { page_path: path });
    if (META_PIXEL_ID && window.fbq) window.fbq("track", "PageView");
}

export function trackEvent(name, params) {
    if (GA4_ID && window.gtag) window.gtag("event", name, params);
    if (META_PIXEL_ID && window.fbq) window.fbq("trackCustom", name, params);
}
