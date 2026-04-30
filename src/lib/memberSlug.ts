import type { Member } from '../types';

/**
 * 從會員物件產出 URL slug。
 *
 * 設計原則：
 *  1. 優先用 name（中文 URL，瀏覽器分享/閱讀都直觀）
 *  2. name 無法產出 slug 時 fallback 用 id
 *
 * 解析端 (resolveMemberFromSlug) 同時支援兩種：
 *  - 完全相符的 name
 *  - 純數字 → 視為 id
 */

export function buildMemberSlug(member: Pick<Member, 'id' | 'name'>): string {
    const name = (member.name || '').trim();
    if (name) return encodeURIComponent(name);
    return String(member.id);
}

export function resolveMemberFromSlug<T extends Pick<Member, 'id' | 'name'>>(
    slug: string,
    members: T[]
): T | null {
    if (!slug) return null;
    const decoded = (() => {
        try {
            return decodeURIComponent(slug).trim();
        } catch {
            return slug.trim();
        }
    })();
    if (!decoded) return null;

    // 完全相符的姓名（多筆同名時取第一筆，按 id 由小到大）
    const byName = members
        .filter((m) => (m.name || '').trim() === decoded)
        .sort((a, b) => Number(a.id) - Number(b.id));
    if (byName.length > 0) return byName[0];

    // 純數字 → id 解析
    if (/^\d+$/.test(decoded)) {
        const targetId = Number(decoded);
        const byId = members.find((m) => Number(m.id) === targetId);
        if (byId) return byId;
    }

    return null;
}
