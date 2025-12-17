
import { supabase } from './supabase';

// Define the shape of our analytics configuration
interface AnalyticsConfig {
    gaId?: string;       // Google Analytics 4 Measurement ID (G-XXXXXXXXXX)
    pixelId?: string;    // Facebook Pixel ID (1234567890)
    clarityId?: string;  // Microsoft Clarity Project ID
}

// Load config from environment variables
const config: AnalyticsConfig = {
    gaId: import.meta.env.VITE_GA_ID || 'G-NX3BWTYJQ0', // Fallback to provided ID
    pixelId: import.meta.env.VITE_FB_PIXEL_ID,
    clarityId: import.meta.env.VITE_CLARITY_ID,
};

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        fbq: (...args: any[]) => void;
        clarity: (...args: any[]) => void;
    }
}

/**
 * Initialize all external tracking scripts (GA4, Pixel, Clarity)
 * This should be called once at the root of the app (e.g. in App.tsx or a Provider)
 */
export const initAnalytics = () => {
    // 1. Google Analytics 4
    if (config.gaId) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); }
        window.gtag('js', new Date());
        window.gtag('config', config.gaId);
        console.log(`✅ GA4 Initialized: ${config.gaId}`);
    }

    // 2. Facebook Pixel
    if (config.pixelId) {
        // Standard FB Pixel Code (Simplified for React)
        (function (f: any, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', config.pixelId);
        window.fbq('track', 'PageView');
        console.log(`✅ Facebook Pixel Initialized: ${config.pixelId}`);
    }

    // 3. Microsoft Clarity (Heatmaps)
    if (config.clarityId) {
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", config.clarityId);
        console.log(`✅ Microsoft Clarity Initialized: ${config.clarityId}`);
    }
};

/**
 * Track a specific event across all platforms + Internal Database
 * @param eventName Name of the event (e.g. 'click_line', 'view_member')
 * @param details Additional properties (e.g. { member_name: 'Alex' })
 */
export const trackEvent = async (eventName: string, details: any = {}) => {
    // 1. Send to GA4
    if (window.gtag) {
        window.gtag('event', eventName, details);
    }

    // 2. Send to Facebook Pixel (Custom Event)
    if (window.fbq) {
        window.fbq('trackCustom', eventName, details);
    }

    // 3. Send to Supabase (Internal High-Value Tracking)
    try {
        await supabase.from('analytics_events').insert({
            event_name: eventName,
            event_data: details,
            user_agent: navigator.userAgent,
            path: window.location.pathname
        });
    } catch (error) {
        // Silent fail for analytics
    }
};

/**
 * Track a page view (Managed by PageTracker usually)
 */
export const trackPageView = (path: string) => {
    if (window.gtag && config.gaId) {
        window.gtag('config', config.gaId, { page_path: path });
    }
    if (window.fbq) {
        window.fbq('track', 'PageView');
    }
};
