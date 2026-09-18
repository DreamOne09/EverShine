import React from 'react';

interface SectionLabelProps {
    children: React.ReactNode;
}

/** 區塊金色小標，建立頁面節奏但不取代長輝藍 */
const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => {
    return (
        <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-gradient-to-r from-transparent to-platinum/70" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-platinum-light/90 sm:text-xs">
                {children}
            </p>
            <span className="h-px w-7 bg-gradient-to-l from-transparent to-platinum/70" aria-hidden />
        </div>
    );
};

export default SectionLabel;
