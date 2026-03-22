/**
 * Input sanitization utilities.
 *
 * Strips dangerous HTML/script content from user input to prevent XSS.
 * Lightweight alternative to DOMPurify for cases where we only need plain text.
 */

const HTML_TAG_RE = /<\/?[^>]+(>|$)/g;
const SCRIPT_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_RE = /\s*on\w+\s*=\s*["'][^"']*["']/gi;
const STYLE_TAG_RE = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;

export function stripHtml(input: string): string {
    if (!input) return '';
    return input
        .replace(SCRIPT_RE, '')
        .replace(STYLE_TAG_RE, '')
        .replace(EVENT_HANDLER_RE, '')
        .replace(HTML_TAG_RE, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim();
}

export function sanitizeText(input: string, maxLength?: number): string {
    let cleaned = stripHtml(input);
    if (maxLength && cleaned.length > maxLength) {
        cleaned = cleaned.slice(0, maxLength);
    }
    return cleaned;
}

export function sanitizeUrl(input: string): string {
    if (!input) return '';
    const trimmed = input.trim();

    try {
        const url = new URL(trimmed);
        if (!['http:', 'https:'].includes(url.protocol)) {
            return '';
        }
        return trimmed;
    } catch {
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
        }
        return '';
    }
}

export function escapeHtml(input: string): string {
    if (!input) return '';
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
