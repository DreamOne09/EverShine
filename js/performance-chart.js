/**
 * 2025年近期表現折線圖（優化版）
 * 使用 Chart.js 建立互動式圖表，支援數據集切換
 */

// 數據（從 SVG 提取）
const performanceData = {
    labels: ['5月', '6月', '7月', '8月', '9月', '10月'],
    referrals: [631, 456, 590, 515, 485, 613],
    amounts: [15606645, 2144319, 9160680, 11098799, 2695123, 11050631],
    guests: [15, 21, 17, 9, 10, 16]
};

let performanceChart = null;  // 儲存圖表實例

// 初始化圖表
function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    // 建立漸層色
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(76, 168, 223, 0.4)');
    gradient.addColorStop(1, 'rgba(76, 168, 223, 0.05)');

    // 建立圖表
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: performanceData.labels,
            datasets: [{
                label: '引薦單數',
                data: performanceData.referrals,
                borderColor: '#4CA8DF',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#4CA8DF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4CA8DF'
            }]
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
                    display: false  // 隱藏預設 legend，使用自訂按鈕
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
                            label += context.parsed.y.toLocaleString();
                            if (context.dataset.label === '引薦金額 (萬)') {
                                label += ' 萬';
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
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });

    // 初始化按鈕
    initChartButtons();
}

// 初始化圖表切換按鈕
function initChartButtons() {
    const buttons = document.querySelectorAll('.chart-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            switchChartData(type);

            // 更新按鈕狀態
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// 切換圖表數據
function switchChartData(type) {
    if (!performanceChart) return;

    const gradient = performanceChart.canvas.getContext('2d').createLinearGradient(0, 0, 0, 400);

    let newDataset = {};

    switch (type) {
        case 'referrals':
            gradient.addColorStop(0, 'rgba(76, 168, 223, 0.4)');
            gradient.addColorStop(1, 'rgba(76, 168, 223, 0.05)');
            newDataset = {
                label: '引薦單數',
                data: performanceData.referrals,
                borderColor: '#4CA8DF',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#4CA8DF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4CA8DF'
            };
            break;

        case 'amounts':
            gradient.addColorStop(0, 'rgba(135, 206, 250, 0.4)');
            gradient.addColorStop(1, 'rgba(135, 206, 250, 0.05)');
            newDataset = {
                label: '引薦金額 (萬)',
                data: performanceData.amounts.map(v => Math.round(v / 10000)),
                borderColor: '#87CEFA',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#87CEFA',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#87CEFA'
            };
            break;

        case 'guests':
            gradient.addColorStop(0, 'rgba(100, 149, 237, 0.4)');
            gradient.addColorStop(1, 'rgba(100, 149, 237, 0.05)');
            newDataset = {
                label: '來賓人數',
                data: performanceData.guests,
                borderColor: '#6495ED',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#6495ED',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#6495ED'
            };
            break;
    }

    // 更新圖表
    performanceChart.data.datasets = [newDataset];
    performanceChart.update('active');
}

// 頁面載入後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceChart);
} else {
    initPerformanceChart();
}
