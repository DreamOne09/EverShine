/**
 * Site Configuration
 *
 * Clone 新分會時，只需修改此檔案即可完成品牌切換。
 * 所有品牌相關的硬編碼值都應從此處引用。
 */

export const siteConfig = {
    branchName: '長輝白金分會',
    branchNameEn: 'EverShine',
    branchFullName: 'BNI 長輝白金分會',
    branchFullNameEn: 'BNI EverShine Chapter',
    organization: 'BNI',

    siteUrl: 'https://evershine.tw',
    siteDomain: 'evershine.tw',

    meeting: {
        day: 'Wednesday',
        dayZh: '週三',
        onlineTime: '06:20',
        startTime: '06:30',
        formalStartTime: '07:00',
        endTime: '08:30',
        timezone: 'Asia/Taipei',
        format: 'online' as const,
        formatDescription: '100% 支援線上與會',
        scheduleLabel: '週三 06:20 上線 · 06:30 早鳥 · 07:00 例會',
    },

    location: {
        city: '台北市',
        region: '台北',
        country: 'TW',
        countryName: '台灣',
        latitude: 25.0330,
        longitude: 121.5654,
        geoRegion: 'TW-TPE',
    },

    social: {
        facebook: 'https://www.facebook.com/BNIEverShine',
        instagram: 'https://www.instagram.com/bnievershine',
        threads: 'https://www.threads.net/@chhubni',
    },

    logos: {
        square: '/images/assets/logo/白色正方形logo.png',
        horizontal: '/images/assets/logo/透明底白字長條logo.png',
        bni: '/images/assets/logo/bni-logo-new.png',
        og: '/images/assets/og-evershine-1200.png',
    },

    defaultPhoto: '/images/assets/logo/白色正方形logo.png',

    backgrounds: {
        earth: '/images/assets/background.png',
        meeting: '/images/assets/meeting-hero.jpg',
        meetingSpeaker: '/images/assets/meeting-hero-speaker.jpg',
        meetingPair: '/images/assets/meeting-hero-pair.jpg',
    },

    /** Claim 密碼應從環境變數讀取，fallback 僅供開發環境 */
    claimPassword: import.meta.env.VITE_CLAIM_PASSWORD || 'evershine',

    industries: [
        '居住空間與工程',
        '品牌整合與行銷',
        '健康照護與身心',
        '金融財富與資產',
        '數位科技與應用',
        '學習成長與探索',
        '生活服務與消費',
        '企業經營與法稅',
    ],
} as const;

export type SiteConfig = typeof siteConfig;
