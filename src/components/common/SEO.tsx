import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/site.config';

interface BreadcrumbItem {
    name: string;
    path: string;
}

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    noindex?: boolean;
    breadcrumbs?: BreadcrumbItem[];
    ogImage?: string;
    structuredData?: object;
}

const SITE_URL = siteConfig.siteUrl;
const DEFAULT_OG_IMAGE = `${SITE_URL}${siteConfig.logos.square}`;
const BASE_TITLE = siteConfig.branchFullName;
const SITE_NAME = `${siteConfig.branchFullName} | 台灣商會`;

function setMetaTag(selector: string, attribute: string, value: string) {
    let el = document.querySelector(selector);
    if (el) {
        el.setAttribute(attribute, value);
    } else {
        el = document.createElement('meta');
        const [attrName, attrValue] = selector.match(/\[(.+?)="(.+?)"\]/)?.slice(1) || [];
        if (attrName && attrValue) {
            el.setAttribute(attrName, attrValue);
        }
        el.setAttribute(attribute, value);
        document.head.appendChild(el);
    }
}

function setLinkTag(rel: string, href: string) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (el) {
        el.setAttribute('href', href);
    } else {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        el.setAttribute('href', href);
        document.head.appendChild(el);
    }
}

function setOrRemoveMetaTag(selector: string, attribute: string, value: string | null) {
    const el = document.querySelector(selector);
    if (value) {
        if (el) {
            el.setAttribute(attribute, value);
        } else {
            const newEl = document.createElement('meta');
            const [attrName, attrValue] = selector.match(/\[(.+?)="(.+?)"\]/)?.slice(1) || [];
            if (attrName && attrValue) {
                newEl.setAttribute(attrName, attrValue);
            }
            newEl.setAttribute(attribute, value);
            document.head.appendChild(newEl);
        }
    } else {
        el?.remove();
    }
}

function injectBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
    const existingScript = document.querySelector('script[data-seo-breadcrumb]');
    existingScript?.remove();

    const items = [
        { name: '首頁', path: '/' },
        ...breadcrumbs
    ];

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.path}`
        }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-breadcrumb', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

function injectStructuredData(data: object) {
    const existingScript = document.querySelector('script[data-seo-page]');
    existingScript?.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-page', 'true');
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', ...data });
    document.head.appendChild(script);
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    noindex = false,
    breadcrumbs,
    ogImage,
    structuredData
}) => {
    const location = useLocation();
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} | 台灣商會首選・商務引薦平台`;
    const pageUrl = `${SITE_URL}${location.pathname}`;
    const imageUrl = ogImage ? `${SITE_URL}${ogImage}` : DEFAULT_OG_IMAGE;

    useEffect(() => {
        document.title = fullTitle;

        setLinkTag('canonical', pageUrl);

        if (description) {
            setMetaTag('meta[name="description"]', 'content', description);
            setMetaTag('meta[property="og:description"]', 'content', description);
            setMetaTag('meta[name="twitter:description"]', 'content', description);
        }

        if (keywords) {
            setMetaTag('meta[name="keywords"]', 'content', keywords);
        }

        setMetaTag('meta[property="og:title"]', 'content', fullTitle);
        setMetaTag('meta[property="og:url"]', 'content', pageUrl);
        setMetaTag('meta[property="og:image"]', 'content', imageUrl);
        setMetaTag('meta[property="og:site_name"]', 'content', SITE_NAME);

        setMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
        setMetaTag('meta[name="twitter:url"]', 'content', pageUrl);
        setMetaTag('meta[name="twitter:image"]', 'content', imageUrl);

        if (noindex) {
            setOrRemoveMetaTag('meta[name="robots"]', 'content', 'noindex, nofollow');
        } else {
            setOrRemoveMetaTag('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        }

        if (breadcrumbs && breadcrumbs.length > 0) {
            injectBreadcrumbSchema(breadcrumbs);
        }

        if (structuredData) {
            injectStructuredData(structuredData);
        }

        return () => {
            document.querySelector('script[data-seo-breadcrumb]')?.remove();
            document.querySelector('script[data-seo-page]')?.remove();
        };
    }, [fullTitle, description, keywords, pageUrl, imageUrl, noindex, breadcrumbs, structuredData]);

    return null;
};

export default SEO;
