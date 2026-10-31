import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
}

/** 01. 座標鎖定星盤（預約來訪、確認產業不撞業） */
export const EmblemBeaconLock: React.FC<IconProps> = ({ size = 40, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
    >
        <circle cx="24" cy="24" r="19" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="24" cy="24" r="12" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
        <path d="M24 2V9M24 39V46M2 24H9M39 24H46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 17L26.2 21.8L31 24L26.2 26.2L24 31L21.8 26.2L17 24L21.8 21.8L24 17Z" fill="#E8C547" stroke="#F3E2A3" strokeWidth="1" />
        <circle cx="36.5" cy="11.5" r="2" fill="currentColor" />
    </svg>
);

/** 02. 雙軌同步星環（週三 06:20 開 Zoom 上線、跨區連線） */
export const EmblemOrbitSync: React.FC<IconProps> = ({ size = 40, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
    >
        <ellipse
            cx="24"
            cy="24"
            rx="20"
            ry="9"
            transform="rotate(-24 24 24)"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.4"
        />
        <ellipse
            cx="24"
            cy="24"
            rx="20"
            ry="9"
            transform="rotate(24 24 24)"
            stroke="currentColor"
            strokeOpacity="0.8"
            strokeWidth="1.4"
        />
        <circle cx="24" cy="24" r="5.5" fill="#4CA8DF" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="2.2" fill="#F3E2A3" />
        <circle cx="10" cy="18" r="2.3" fill="currentColor" />
        <circle cx="38" cy="30" r="2.3" fill="#E8C547" />
    </svg>
);

/** 03. 引力雙星橋接（06:30 早鳥・07:00 例會・引薦對接） */
export const EmblemBinaryBridge: React.FC<IconProps> = ({ size = 40, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
    >
        <path
            d="M13 32C17 20 31 20 35 16"
            stroke="url(#bridgeGrad)"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M13 32C21 34 29 28 35 16"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            strokeDasharray="2.5 2.5"
        />
        <circle cx="13" cy="32" r="5.5" fill="#06203A" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="13" cy="32" r="2.2" fill="currentColor" />
        <circle cx="35" cy="16" r="6.5" fill="#06203A" stroke="#E8C547" strokeWidth="1.6" />
        <path d="M35 12L36.3 14.7L39 16L36.3 17.3L35 20L33.7 17.3L31 16L33.7 14.7L35 12Z" fill="#E8C547" />
        <defs>
            <linearGradient id="bridgeGrad" x1="13" y1="32" x2="35" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4CA8DF" />
                <stop offset="1" stopColor="#E8C547" />
            </linearGradient>
        </defs>
    </svg>
);

/** 04. 一業一代表・專屬軌道徽章 */
export const EmblemExclusiveOrbit: React.FC<IconProps> = ({ size = 36, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className} aria-hidden>
        <circle cx="22" cy="22" r="17" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" />
        <circle cx="22" cy="22" r="11" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.4" />
        <circle cx="22" cy="22" r="4" fill="#4CA8DF" />
        <circle cx="22" cy="5" r="3" fill="#E8C547" stroke="#06203A" strokeWidth="1.2" />
        <path d="M22 11V15" stroke="#E8C547" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

/** 05. 跨產業星群協作徽章 */
export const EmblemConstellationMesh: React.FC<IconProps> = ({ size = 36, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className} aria-hidden>
        <path
            d="M11 14L23 9L34 17L30 32L15 33L11 14Z"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.3"
        />
        <path d="M11 14L30 32M23 9L15 33M34 17L15 33" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.1" />
        <circle cx="23" cy="9" r="3" fill="#E8C547" />
        <circle cx="11" cy="14" r="2.5" fill="currentColor" />
        <circle cx="34" cy="17" r="2.5" fill="currentColor" />
        <circle cx="30" cy="32" r="2.5" fill="currentColor" />
        <circle cx="15" cy="33" r="2.5" fill="#E8C547" />
    </svg>
);

/** 06. 晨間航道羅盤（06:30 晨會節奏） */
export const EmblemDawnCompass: React.FC<IconProps> = ({ size = 36, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className} aria-hidden>
        <path d="M6 29H38" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11 34H33" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M12 29A10 10 0 0 1 32 29" stroke="#E8C547" strokeWidth="1.6" />
        <path d="M22 11V15M11 18L14 21M33 18L30 21" stroke="#E8C547" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 21L24 27H20L22 21Z" fill="currentColor" />
    </svg>
);

/** 07. 實名引薦星軌驗證徽章 */
export const EmblemVerifiedLedger: React.FC<IconProps> = ({ size = 36, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className} aria-hidden>
        <path
            d="M22 6L35 12V22C35 30.2 29.5 36.4 22 39C14.5 36.4 9 30.2 9 22V12L22 6Z"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            fill="#4CA8DF"
            fillOpacity="0.08"
        />
        <path
            d="M16.5 22.5L20.5 26.5L28.5 18.5"
            stroke="#E8C547"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
