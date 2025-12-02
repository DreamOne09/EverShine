/**
 * 2025年近期表現折線圖
 * 使用 Chart.js 建立互動式圖表
 */

// 數據（從 SVG 提取）
const performanceData = {
    labels: ['5月', '6月', '7月', '8月', '9月', '10月'],
    referrals: [631, 456, 590, 515, 485, 613],
    amounts: [15606645, 2144319, 9160680, 11098799, 2695123, 11050631],
    guests: [15, 21, 17, 9, 10, 16]
};

// 初始化圖表
function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    // 建立漸層色
    const gradient1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, 'rgba(76, 168, 223, 0.4)');
    gradient1.addColorStop(1, 'rgba(76, 168, 223, 0.05)');

    const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(135, 206, 250, 0.4)');
    gradient2.addColorStop(1, 'rgba(135, 206, 250, 0.05)');

    const gradient3 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, 'rgba(100, 149, 237, 0.4)');
    gradient3.addColorStop(1, 'rgba(100, 149, 237, 0.05)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: performanceData.labels,
            datasets: [
                {
                    label: '引薦單數',
                    data: performanceData.referrals,
                    borderColor: '#4CA8DF',
                    backgroundColor: gradient1,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#4CA8DF',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#4CA8DF',
                    yAxisID: 'y'
                },
                {
                    label: '引薦金額 (萬)',
                    data: performanceData.amounts.map(v => Math.round(v / 10000)),
                    borderColor: '#87CEFA',
                    backgroundColor: gradient2,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#87CEFA',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#87CEFA',
                    yAxisID: 'y1'
                },
                {
                    label: '來賓人數',
                    data: performanceData.guests,
                    borderColor: '#6495ED',
                    backgroundColor: gradient3,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#6495ED',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#6495ED',
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#f4f9ff',
                        font: {
                            family: "'Noto Sans TC', sans-serif",
                            size: 14,
                            weight: '500'
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(5, 5, 5, 0.9)',
                    titleColor: '#4CA8DF',
                    bodyColor: '#f4f9ff',
                    borderColor: '#4CA8DF',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.datasetIndex === 1) {
                                // 引薦金額
                                label += context.parsed.y.toLocaleString() + ' 萬';
                            } else {
                                label += context.parsed.y.toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(76, 168, 223, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#f4f9ff',
                        font: {
                            family: "'Noto Sans TC', sans-serif",
                            size: 13
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '引薦單數',
                        color: '#4CA8DF',
                        font: {
                            family: "'Noto Sans TC', sans-serif",
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'rgba(76, 168, 223, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#4CA8DF',
                        font: {
                            family: "'Noto Sans TC', sans-serif",
                            size: 12
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '引薦金額 (萬)',
                        color: '#87CEFA',
                        font: {
                            family: "'Noto Sans TC', sans-serif",
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#87CEFA',
                        font: {
                            family: "'Noto Sans TC', sans-serif",
                            size: 12
                        }
                    }
                },
                y2: {
                    type: 'linear',
                    display: false,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                        drawBorder: false
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart',
                onComplete: function () {
                    // 動畫完成後的回調
                }
            }
        }
    });
}

// 頁面載入後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceChart);
} else {
    initPerformanceChart();
}
