import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import ResultsChart, { FALLBACK_ROWS } from './ResultsChart';
import { fetchHomepageStatsForChart } from '../../api/dashboard';
import { queryKeys } from '../../api/queryKeys';
import SectionLabel from '../common/SectionLabel';
import { EmblemVerifiedLedger, EmblemBinaryBridge, EmblemOrbitSync } from './StarshipEmblems';

const MetricCard: React.FC<{
    icon: React.ReactNode;
    code: string;
    value: number;
    fromNumber?: number;
    decimalPlaces?: number;
    suffix: string;
    label: string;
    subtext?: string;
}> = ({ icon, code, value, fromNumber = 0, decimalPlaces = 0, suffix, label, subtext }) => {
    return (
        <div className="glass-panel flex flex-col items-center justify-center rounded-2xl p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-[#06182c]/80 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_24px_rgba(76,168,223,0.16)]">
                {icon}
            </div>
            <span className="mb-2 font-mono text-[11px] tracking-[0.22em] text-platinum-light/85 uppercase">
                {code}
            </span>
            <div className="mb-2 font-mono text-4xl font-bold tabular-nums text-white lg:text-5xl">
                <CountingNumber
                    number={value}
                    fromNumber={fromNumber}
                    decimalPlaces={decimalPlaces}
                    thousandSeparator=","
                    inView
                />
                <span className="ml-1 font-sans text-2xl text-gray-300">{suffix}</span>
            </div>
            <div className="mt-1 text-lg font-bold tracking-wide text-gray-200">{label}</div>
            {subtext && <div className="mt-1.5 font-mono text-xs text-gray-400">{subtext}</div>}
        </div>
    );
};

const ALL_TIME_REFERRALS = 26459;
const ALL_TIME_VALUE_YI = 6.3;
const ALL_TIME_VALUE_LABEL = '實名登錄累計 NT$ 629,007,136';

const Results: React.FC = () => {
    const { data: rowsRaw } = useQuery({
        queryKey: queryKeys.homepageStats.chart,
        queryFn: () => fetchHomepageStatsForChart(12),
        staleTime: 5 * 60_000,
    });

    const rows = rowsRaw && rowsRaw.length > 0 ? rowsRaw : FALLBACK_ROWS;
    const latest = rows[rows.length - 1];
    const guestTotal = useMemo(() => rows.reduce((sum, row) => sum + (row.guest_count || 0), 0), [rows]);
    const updatedLabel = latest?.month ? latest.month.replace('-', '/') : '2026/08';

    return (
        <section className="relative py-24" id="telemetry" aria-labelledby="results-heading">
            <div className="container mx-auto px-4">
                <div className="mb-14 text-center">
                    <SectionLabel>Telemetry · 引薦觀測數據</SectionLabel>
                    <h2 id="results-heading" className="mb-4 text-3xl font-black text-white md:text-5xl">
                        每一張引薦單，都有 <span className="text-primary">實名軌跡</span> 可查
                    </h2>
                    <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-300">
                        不是口頭說說的人脈。從創會累計至 {updatedLabel}，分會每週例會核實登錄的引薦單數、成交金額與來賓紀錄如下：
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-3 max-w-6xl mx-auto mb-14">
                    <MetricCard
                        icon={<EmblemVerifiedLedger size={38} />}
                        code="VERIFIED REFERRALS"
                        value={ALL_TIME_REFERRALS}
                        fromNumber={20000}
                        suffix="張"
                        label="累計實名引薦單"
                        subtext="每筆皆由雙方會員於例會回報核實"
                    />
                    <MetricCard
                        icon={<EmblemBinaryBridge size={38} />}
                        code="CLOSED BUSINESS"
                        value={ALL_TIME_VALUE_YI}
                        fromNumber={4.0}
                        decimalPlaces={1}
                        suffix="億+"
                        label="累計成交金額（TWD）"
                        subtext={ALL_TIME_VALUE_LABEL}
                    />
                    <MetricCard
                        icon={<EmblemOrbitSync size={38} />}
                        code="VISITING FOUNDERS"
                        value={guestTotal}
                        fromNumber={0}
                        suffix="位"
                        label="近 12 個月登艙來賓"
                        subtext="各領域企業主親身參與週三晨會"
                    />
                </div>

                <div>
                    <ResultsChart />
                </div>
            </div>
        </section>
    );
};

export default Results;
