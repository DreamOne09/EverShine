import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
    const baseTitle = 'BNI EverShine 長輝白金分會';
    const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} | 全球最大商務引薦平台`;

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Update Meta Description
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            } else {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                metaDesc.setAttribute('content', description);
                document.head.appendChild(metaDesc);
            }

            // Also update Open Graph description
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', description);
        }

        // Update Keywords
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
            } else {
                metaKeywords = document.createElement('meta');
                metaKeywords.setAttribute('name', 'keywords');
                metaKeywords.setAttribute('content', keywords);
                document.head.appendChild(metaKeywords);
            }
        }

        // Update Open Graph Title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    }, [fullTitle, description, keywords]);

    return null; // This component doesn't render anything
};

export default SEO;
