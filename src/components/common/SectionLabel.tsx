import React from 'react';

interface SectionLabelProps {
    children: React.ReactNode;
}

/** 區塊金色小標，建立頁面節奏但不取代長輝藍 */
const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => {
    return (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-platinum-light/90 sm:text-xs">
            {children}
        </p>
    );
};

export default SectionLabel;
