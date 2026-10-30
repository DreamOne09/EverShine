import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { FileText, TrendingUp, Users } from 'lucide-react';
import ResultsChart, { FALLBACK_ROWS } from './ResultsChart';
import { fetchHomepageStatsForChart } from '../../api/dashboard';
import { queryKeys } from '../../api/queryKeys';
import SectionLabel from '../common/SectionLabel';

const MetricCard: React.FC<{
    icon: React.ReactNode;
    value: number;
    fromNumber?: number;
    decimalPlaces?: number;
    suffix: string;
    label: string;
    subtext?: string;
}> = ({ icon, value, fromNumber = 0, decimalPlaces = 0, suffix, label, subtext }) => {
    return (
        <div className="glass-panel flex flex-col items-center justify-center rounded-2xl p-8">
            <div className="mb-6 rounded-full border border-white/10 bg-white/[0.04] p-4 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                {icon}
            </div>
            <div className="mb-2 font-mono text-4xl font-bold tabular-nums text-white lg:text-5xl">
                <CountingNumber
                    number={value}
                    fromNumber={fromNumber}
                    decimalPlaces={decimalPlaces}
                    thousandSeparator=","
                    inView
                />
                <span className="ml-1 font-sans text-2xl text-gray-400">{suffix}</span>
            </div>
            <div className="mt-2 text-lg font-medium tracking-wide text-gray-300">{label}</div>
            {subtext && <div className="mt-2 text-sm text-gray-500">{subtext}</div>}
        </div>
    );
};

const ALL_TIME_REFERRALS = 26459;
const ALL_TIME_VALUE_YI = 6.3;
const ALL_TIME_VALUE_LABEL = 'NT$ 629,007,136';

const Results: React.FC = () => {
    const { data: rowsRaw } = useQuery({
        queryKey: queryKeys.homepageStats.chart,
        queryFn: () => fetchHomepageStatsForChart(12),
        staleTime: 5 * 60_000,
    });

    const rows = rowsRaw && rowsRaw.length > 0 ? rowsRaw : FALLBACK_ROWS;
    const latest = rows[rows.length - 1];
    const guestTotal = useMemo(() => rows.reduce((sum, row) => sum + (row.guest_count || 0), 0), [rows]);
    const updatedLabel = latest?.month ? latest.month.replace('-', '/') : '2026/01';

    return (
        <section className="relative py-24">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <SectionLabel>Results</SectionLabel>
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">長輝累積下來的引薦數字</h2>
                    <div className="mx-auto mb-4 h-1 w-20 rounded-full bg-primary"></div>
                    <p className="text-base text-gray-300">自創會起累計 · 統計至 {updatedLabel}</p>
                </div>

                <div className="mb-20">
                    <ResultsChart />
                </div>

                <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-3">
                    <MetricCard
                        icon={<FileText size={40} />}
                        value={ALL_TIME_REFERRALS}
                        fromNumber={20000}
                        suffix="張"
                        label="累計引薦單數"
                    />
                    <MetricCard
                        icon={<TrendingUp size={40} />}
                        value={ALL_TIME_VALUE_YI}
                        fromNumber={4.0}
                        decimalPlaces={1}
                        suffix="億+"
                        label="累計成交金額（TWD）"
                        subtext={ALL_TIME_VALUE_LABEL}
                    />
                    <MetricCard
                        icon={<Users size={40} />}
                        value={guestTotal}
                        fromNumber={0}
                        suffix="位"
                        label="近一年來訪來賓"
                        subtext="歡迎預約週三早上的線上例會"
                    />
                </div>
            </div>
        </section>
    );
};

export default Results;
