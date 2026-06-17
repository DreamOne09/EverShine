import React from 'react';
import { Crown } from 'lucide-react';

interface GoldMedalBadgeProps {
    /** 圖示尺寸（px）。預設 14（卡片用），個別頁/Modal 建議傳 18。 */
    size?: number;
    /** 額外的 className（用於精確定位，例如 absolute / 邊距）。 */
    className?: string;
    /** Hover 顯示的說明文字。預設「金質獎章｜分會年度卓越貢獻表揚」。 */
    label?: string;
}

/**
 * 金質獎章徽章（王冠）：hover 顯示說明 tooltip。
 * 用 group-hover 純 CSS tooltip，無外部依賴；
 * 桌面 hover、行動裝置 focus（如使用者長按或鍵盤）都能觸發。
 */
const GoldMedalBadge: React.FC<GoldMedalBadgeProps> = ({
    size = 14,
    className = '',
    label = '金質獎章｜分會年度卓越貢獻表揚',
}) => {
    return (
        <span className={`group/medal relative inline-flex shrink-0 items-center justify-center ${className}`}>
            <span
                aria-label={label}
                title={label}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-amber-950 shadow-[0_0_12px_rgba(251,191,36,0.5)] sm:h-8 sm:w-8"
            >
                <Crown size={size} strokeWidth={2.4} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />
            </span>

            {/* 客製化 tooltip（桌面 hover / 鍵盤 focus 顯示）*/}
            <span
                role="tooltip"
                className="pointer-events-none absolute top-full left-1/2 z-30 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-amber-300/30 bg-slate-950/95 px-3 py-1.5 text-xs font-medium text-amber-100 opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-150 group-hover/medal:opacity-100 group-focus-within/medal:opacity-100"
            >
                {label}
            </span>
        </span>
    );
};

export default GoldMedalBadge;
