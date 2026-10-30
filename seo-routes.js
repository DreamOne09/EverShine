const SITE_URL = 'https://evershine.tw';

const seoRoutes = {
    '/': {
        title: '長輝白金分會 EverShine｜BNI 每週三線上例會・把專業變成引薦',
        description:
            'BNI 長輝白金分會（EverShine）每週三早上 06:30–08:30 全程在 Zoom 線上開會。將近 60 位不同專業的企業主，一業一代表，把每週認識的夥伴變成真正的生意合作。想參觀請聯繫幹部預約來訪。',
        keywords:
            '長輝白金分會, EverShine, BNI長輝, 線上BNI, 每週三例會, 商務引薦, 線上商會, BNI台灣, 白金分會, Givers Gain, 付出者收穫, 台北商會, 線上例會',
        canonical: `${SITE_URL}/`,
    },
    '/bni': {
        title: '認識 BNI｜全球商務引薦組織與長輝例會制度 | 長輝白金分會',
        description:
            'BNI 成立於 1985 年，遍及 76+ 國家、擁有 34 萬+ 會員。長輝白金分會全程在 Zoom 線上開會，每週三早上 06:30–08:30 用 90 分鐘固定議程幫彼此對接生意。',
        keywords:
            '什麼是BNI, BNI商會, 線上BNI, 商務引薦系統, 付出者收穫, Givers Gain, 台灣BNI, BNI台灣, 長輝白金分會, 線上商務例會',
        canonical: `${SITE_URL}/bni`,
    },
    '/members': {
        title: '長輝會員｜八大產業專業代表名錄 | 長輝白金分會',
        description:
            '認識 BNI 長輝白金分會的在籍會員。涵蓋居住工程、品牌行銷、金融法稅、數位科技等八大產業，每個專業在分會裡只收一位代表。',
        keywords: '長輝會員, BNI會員, 企業家名錄, 線上商會會員, 商務媒合, 行業專家, 長輝白金分會',
        canonical: `${SITE_URL}/members`,
    },
    '/referrals': {
        title: '引薦案例｜長輝夥伴真實合作紀錄',
        description:
            '看看長輝白金分會夥伴之間怎麼牽線、怎麼把案子做成。這裡整理了每週例會回報的真實合作案例與雙方心得。',
        keywords: '引薦案例, BNI成功案例, 商務合作, 引薦成功故事, 長輝白金分會, 線上引薦',
        canonical: `${SITE_URL}/referrals`,
    },
    '/privacy': {
        title: '隱私權政策與服務條款 | 長輝白金分會',
        description: 'BNI 長輝白金分會隱私權政策與服務條款。了解我們如何保護您的個人資訊和使用條件。',
        keywords: '隱私權政策, 服務條款, BNI長輝, 個資保護',
        canonical: `${SITE_URL}/privacy`,
    },
};

export default seoRoutes;
