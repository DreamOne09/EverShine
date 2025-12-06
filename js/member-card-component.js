import { iconMap, normalizePhotoPath } from './utils.js';

/**
 * Generates the HTML for a member card.
 * @param {object} member - The member data object.
 * @returns {string} - The HTML string for the member card.
 */
export function createMemberCard(member) {
    const photoUrl = normalizePhotoPath(member.photo) || 'images/members/default.jpg';
    const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' rx='12' fill='%23001933'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%234ca8df' font-family='Arial' font-size='50'%3E${encodeURIComponent(member.name.charAt(0))}%3C/text%3E%3C/svg%3E`;

    const memberId = `member-${member.name.replace(/\s+/g, '-').toLowerCase()}`;
    const shortDesc = member.shortIntro || member.shortDescription || (member.description ? member.description.substring(0, 30) + '...' : '專業服務提供商');
    const fullDesc = member.fullIntro || member.fullDescription || member.description || '專業服務提供商';

    return `
        <div class="member-card collapsed" data-member-id="${memberId}" data-category="${member.category || ''}">
            <div class="member-header">
                <div class="member-photo-container">
                    <img src="${photoUrl}" 
                         alt="${member.name}" 
                         class="member-photo" 
                         loading="lazy" 
                         width="100" 
                         height="100"
                         onerror="this.src='${placeholderSvg}'; this.onerror=null;">
                </div>
                <div class="member-basic-info">
                    <div class="member-name-industry">
                        <h3 class="member-name">${member.name}</h3>
                        <span class="member-title">${member.title || member.position || ''}</span>
                        <span class="member-industry">${member.industry || ''}</span>
                    </div>
                    <button class="member-toggle-btn" aria-label="展開/摺疊會員資訊" data-target="${memberId}">
                        <span class="toggle-icon">▼</span>
                    </button>
                </div>
            </div>
            <div class="member-short-description"><p>${shortDesc}</p></div>
            <div class="member-details" id="${memberId}-details">
                <div class="member-info">
                    <p class="member-description">${fullDesc}</p>
                    ${buildServicesHtml(member.services)}
                    ${buildHashtagsHtml(member.hashtags)}
                    ${buildSocialLinks(member.social || member.links)}
                    ${buildContactHtml(member.contact)}
                </div>
            </div>
        </div>
    `;
}

function buildServicesHtml(services) {
    if (!services?.length) return '';
    return `<div class="member-services"><h4>服務項目</h4><ul class="member-services-list">${services.map(s => `<li>${s.trim()}</li>`).join('')}</ul></div>`;
}

function buildHashtagsHtml(tags) {
    if (!tags?.length) return '';
    return `<div class="member-hashtags">${tags.map(t => `<span class="hashtag-chip">${t.trim()}</span>`).join('')}</div>`;
}

function buildSocialLinks(social) {
    if (!social) return '';

    // Handle array format (from members-renderer.js style)
    if (Array.isArray(social)) {
        return `<div class="member-social">${social.map(link => {
            const url = link.url;
            const type = link.type;
            return `<a class="member-social-link" href="${url}" target="_blank" rel="noopener noreferrer"><span class="social-icon">${iconMap[type] || '🔗'}</span><span class="social-label">${type}</span></a>`;
        }).join('')}</div>`;
    }

    // Handle object format (from main.js style)
    const icons = { website: '🌐', facebook: '📘', instagram: '📸', linkedin: '💼', youtube: '▶️', threads: '💬' };
    return `<div class="member-social">${Object.entries(social).map(([k, v]) => {
        if (!v) return '';
        const url = v.startsWith('http') ? v : `https://${v}`;
        return `<a class="member-social-link" href="${url}" target="_blank" rel="noopener noreferrer"><span class="social-icon">${icons[k] || '🔗'}</span><span class="social-label">${k}</span></a>`;
    }).join('')}</div>`;
}

function buildContactHtml(contact) {
    if (!contact) return '';
    let html = '';
    if (contact.email) html += `<p><strong>Email</strong><a href="mailto:${contact.email}">${contact.email}</a></p>`;
    if (contact.phone) html += `<p><strong>電話</strong><span>${contact.phone}</span></p>`;
    if (contact.line) html += `<p><strong>Line</strong><span>${contact.line}</span></p>`;
    return html ? `<div class="member-contact">${html}</div>` : '';
}
