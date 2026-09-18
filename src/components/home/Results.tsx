import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCountUp } from '../../hooks/useCountUp';
import { FileText, TrendingUp, Users } from 'lucide-react';
import ResultsChart, { FALLBACK_ROWS } from './ResultsChart';
import { fetchHomepageStatsForChart } from '../../api/dashboard';
import { queryKeys } from '../../api/queryKeys';
import SectionLabel from '../common/SectionLabel';

const MetricCard: React.FC<{
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
    subtext?: string;
    isCurrency?: boolean;
}> = ({ icon, value, suffix, label, subtext, isCurrency }) => {
    const { count, elementRef } = useCountUp(value);

    return (
        <div
            ref={elementRef}
            className="glass-panel flex flex-col items-center justify-center rounded-2xl p-8"
        >
            <div className="mb-6 rounded-full bg-primary/10 p-4 text-primary">{icon}</div>
            <div className="mb-2 font-mono text-4xl font-bold tabular-nums text-white lg:text-5xl">
                {isCurrency ? (count / 100).toFixed(1) : count.toLocaleString()}
                <span className="ml-1 font-sans text-2xl text-gray-400">{suffix}</span>
            </div>
            <div className="mt-2 text-lg font-medium tracking-wide text-gray-300">{label}</div>
            {subtext && <div className="mt-2 text-sm text-gray-500">{subtext}</div>}
        </div>
    );
};

const ALL_TIME_REFERRALS = 26459;
const ALL_TIME_VALUE_YI = 629;
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
    const updatedLabel = latest?.month
        ? latest.month.replace('-', '/')
        : '2026/01';

    return (
        <section className="relative py-24">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <SectionLabel>Results</SectionLabel>
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">長輝白金分會引薦成果</h2>
                    <div className="mx-auto mb-4 h-1 w-20 rounded-full bg-primary"></div>
                    <p className="text-base text-gray-300">創會以來 · 資料更新 {updatedLabel}</p>
                </div>

                <div className="mb-20">
                    <ResultsChart />
                </div>

                <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-3">
                    <MetricCard icon={<FileText size={40} />} value={ALL_TIME_REFERRALS} suffix="張" label="總引薦單數" />
                    <MetricCard
                        icon={<TrendingUp size={40} />}
                        value={ALL_TIME_VALUE_YI}
                        suffix="億+"
                        label="總交易價值 (TWD)"
                        subtext={ALL_TIME_VALUE_LABEL}
                        isCurrency
                    />
                    <MetricCard
                        icon={<Users size={40} />}
                        value={guestTotal}
                        suffix="位"
                        label="近一年來賓"
                        subtext="誠摯邀請您前來體驗例會"
                    />
                </div>
            </div>
        </section>
    );
};

export default Results;
