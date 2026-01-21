import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ResultsChart: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartRef = useRef<any>(null);
    const [activeTab, setActiveTab] = useState<'referrals' | 'amounts' | 'guests'>('referrals');

    const performanceData = {
        labels: ['5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        referrals: [631, 456, 590, 515, 485, 613, 441, 578],
        amounts: [15606645, 2144319, 9160680, 11098799, 2695123, 11050631, 6894708, 28846258],
        guests: [15, 21, 17, 9, 10, 16, 29, 24]
    };

    const createGradient = (ctx: CanvasRenderingContext2D, color: string) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color.replace('1)', '0.4)'));
        gradient.addColorStop(1, color.replace('1)', '0.05)'));
        return gradient;
    };

    const getChartData = () => {
        const canvas = chartRef.current?.canvas;
        const ctx = canvas?.getContext('2d');
        let gradient;

        if (ctx) {
            switch (activeTab) {
                case 'referrals':
                    gradient = createGradient(ctx, 'rgba(76, 168, 223, 1)');
                    break;
                case 'amounts':
                    gradient = createGradient(ctx, 'rgba(135, 206, 250, 1)');
                    break;
                case 'guests':
                    gradient = createGradient(ctx, 'rgba(100, 149, 237, 1)');
                    break;
            }
        }

        switch (activeTab) {
            case 'referrals':
                return {
                    labels: performanceData.labels,
                    datasets: [{
                        label: '引薦單數',
                        data: performanceData.referrals,
                        borderColor: '#4CA8DF',
                        backgroundColor: gradient || 'rgba(76, 168, 223, 0.4)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#4CA8DF',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }]
                };
            case 'amounts':
                return {
                    labels: performanceData.labels,
                    datasets: [{
                        label: '引薦金額 (萬)',
                        data: performanceData.amounts.map(v => Math.round(v / 10000)),
                        borderColor: '#87CEFA',
                        backgroundColor: gradient || 'rgba(135, 206, 250, 0.4)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#87CEFA',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }]
                };
            case 'guests':
                return {
                    labels: performanceData.labels,
                    datasets: [{
                        label: '來賓人數',
                        data: performanceData.guests,
                        borderColor: '#6495ED',
                        backgroundColor: gradient || 'rgba(100, 149, 237, 0.4)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#6495ED',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }]
                };
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(5, 5, 5, 0.9)',
                titleColor: '#4CA8DF',
                bodyColor: '#f4f9ff',
                borderColor: '#4CA8DF',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(76, 168, 223, 0.1)',
                },
                ticks: {
                    color: '#f4f9ff',
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(76, 168, 223, 0.1)',
                },
                ticks: {
                    color: '#4CA8DF',
                }
            }
        },
        animation: {
            duration: 1000,
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-bg-dark/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('referrals')}
                    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${activeTab === 'referrals'
                        ? 'bg-primary text-bg-dark shadow-[0_0_20px_rgba(76,168,223,0.4)]'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    引薦單數
                </button>
                <button
                    onClick={() => setActiveTab('amounts')}
                    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${activeTab === 'amounts'
                        ? 'bg-primary text-bg-dark shadow-[0_0_20px_rgba(76,168,223,0.4)]'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    引薦金額
                </button>
                <button
                    onClick={() => setActiveTab('guests')}
                    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${activeTab === 'guests'
                        ? 'bg-primary text-bg-dark shadow-[0_0_20px_rgba(76,168,223,0.4)]'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    來賓人數
                </button>
            </div>

            <div className="h-[400px] w-full">
                <Line ref={chartRef} data={getChartData()} options={options} />
            </div>
        </div>
    );
};

export default ResultsChart;
