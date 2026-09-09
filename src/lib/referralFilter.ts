import { siteConfig } from '../config/site.config';
import type { Referral } from '../types';

export const REFERRAL_ALL_CATEGORY = '全部';

/** 與會員名錄一致的九大生態圈，供引薦案例篩選 */
export const REFERRAL_CATEGORIES = [REFERRAL_ALL_CATEGORY, ...siteConfig.industries] as const;

export type ReferralCategory = (typeof REFERRAL_CATEGORIES)[number];

const ECOSYSTEM_KEYWORDS: Record<string, string[]> = {
    居住與空間工程: [
        '裝修', '空調', '燈具', '包租', '除濕', '弱電', '團體服', '工程', '豪宅', '共享空間',
        '會議廳', '工地', '圍籬', '高爾夫', '不動產', '房源', '水電', '電壓', '地板',
    ],
    企業營運與法稅: ['律師', '會計', '地政', '標案', '創意策劃', '策展', '家事', '展覽', '展場'],
    金融財富與資產: [
        '銀行', '融資', '保險', '產物', '黃金', '理財', '信託', '程式交易', '投資', '房貸', '卡債', 'VIP',
    ],
    品牌整合與行銷: ['品牌', '包裝', '自媒體', '行銷', 'SEO', '插畫', '設計', '花藝', '動畫', '配音'],
    '數位AI與創新科技': ['網站', 'AI', '程式', '數位', '資訊', 'APP', '雲端', '弱電資訊'],
    身心健康與醫療: [
        '營養', '物理治療', '指甲', '鞋墊', '中醫', '心靈', '芳療', '健康', '健甲', '路跑', '凍甲', '足部',
    ],
    飲食文化與食品: ['餐飲', '寵物食品', '食物', '雞蛋糕', '澎湖', '加盟', '無麩質', '保健品', '安麗'],
    教育學習與休閒: [
        '升學', '魔術方塊', '健身', 'ZUMBA', '教育', '教學', '私立小學', '桌遊', '家教', '課程',
    ],
    永續發展與製造: ['永續', '可分解', '製造', '食品大廠', '生技', '電子商品', '沐霓青'],
};

function referralSearchText(referral: Referral): string {
    return [
        referral.title,
        referral.description,
        referral.metrics.amount,
        referral.metrics.type,
        referral.referrer.name,
        referral.referrer.industry,
        referral.referrer.story,
        referral.referee.name,
        referral.referee.industry,
        referral.referee.story,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

/** 依標題、產業與內容推斷主要生態圈（供分類 pill 與統計） */
export function getReferralEcosystem(referral: Referral): string {
    const text = [
        referral.title,
        referral.description,
        referral.metrics.type,
        referral.referrer.industry,
        referral.referee.industry,
    ].join(' ');

    let best = siteConfig.industries[siteConfig.industries.length - 1];
    let bestScore = 0;

    for (const eco of siteConfig.industries) {
        const keywords = ECOSYSTEM_KEYWORDS[eco] ?? [];
        let score = 0;
        for (const kw of keywords) {
            if (text.includes(kw)) score += kw.length;
        }
        if (score > bestScore) {
            bestScore = score;
            best = eco;
        }
    }

    return best;
}

export function countReferralsByCategory(referrals: Referral[]): Map<string, number> {
    const counts = new Map<string, number>();
    counts.set(REFERRAL_ALL_CATEGORY, referrals.length);
    for (const eco of siteConfig.industries) counts.set(eco, 0);
    for (const ref of referrals) {
        const eco = getReferralEcosystem(ref);
        counts.set(eco, (counts.get(eco) ?? 0) + 1);
    }
    return counts;
}

export function filterReferrals(
    referrals: Referral[],
    options: { query: string; category: string }
): Referral[] {
    const q = options.query.trim().toLowerCase();

    return referrals.filter((referral) => {
        const matchesCategory =
            options.category === REFERRAL_ALL_CATEGORY ||
            getReferralEcosystem(referral) === options.category;

        if (!matchesCategory) return false;
        if (!q) return true;

        return referralSearchText(referral).includes(q);
    });
}
