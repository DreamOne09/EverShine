/**
 * EverShine Global Configuration
 * Centralizes all hardcoded values, paths, and constants.
 */

export const CONFIG = {
    API: {
        MEMBERS: 'data/members.json',
        REFERRALS: 'data/referrals.json',
        // Future API endpoints can be added here
    },
    PATHS: {
        DEFAULT_MEMBER_PHOTO: 'images/members/default.jpg',
        MEMBER_PHOTOS_BASE: 'images/members/',
        LOGO_TRANSPARENT: 'images/assets/logo/透明底白字長條logo.png',
        BNI_LOGO: 'images/assets/logo/bni-logo-red-transparent.png'
    },
    UI: {
        ANIMATION_DELAY_STEP: 0.1, // seconds
        SCROLL_THRESHOLD: 0.1,
        TOAST_DURATION: 3000
    },
    SELECTORS: {
        MEMBERS_GRID: 'membersGrid',
        REFERRALS_GRID: 'referralsGrid',
        FILTER_BUTTONS: 'filterButtons',
        PAGE_LOADER: 'pageLoader'
    }
};
