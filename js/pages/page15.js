// js/pages/page15.js

// 确保 ECharts 库已加载
if (typeof echarts === 'undefined') {
    // ECharts library is not loaded
} else {
    document.addEventListener('DOMContentLoaded', function () {
        // 1. 将所有操作限定在当前页面的容器内
        const pageContainer = document.querySelector('#page15-container');
        if (!pageContainer) return; // 如果页面容器不存在则退出

        const chartDom = pageContainer.querySelector('#main-chart');
        if (!chartDom) return; // 如果图表元素不存在则退出
        
        let myChart = echarts.init(chartDom);
        const btnA = pageContainer.querySelector('#btn-chart-a');
        const btnB = pageContainer.querySelector('#btn-chart-b');

        // --- 通用数据和函数 ---
        const xLabels = ['≤2 亿', '2-10 亿', '10-20 亿', '20-40 亿', '40 亿以上'];
        const annotationText = '补充规则 (纳入≥4 年补充规则):\n上述下调比例减半 (如 ↓5% 变为 ↓2.5%，“重新谈判”规则不变)';
        
        function labelFormatter(params) {
            const value = params.value[2];
            if (value === 0) return '不调整';
            if (value === 30) return '重新谈判';
            return '↓' + value + '%';
        }
        
        // --- 图表A: 不调整支付范围的药品 (比值A) ---
        const yLabelsA = ['200% < 比值 A', '170% < 比值 A ≤ 200%', '140% < 比值 A ≤ 170%', '110% < 比值 A ≤ 140%', '比值 A ≤ 110%'];
        const dataA = [
            [0, 0, 30], [1, 0, 30], [2, 0, 30], [3, 0, 30], [4, 0, 30],
            [0, 1, 15], [1, 1, 17], [2, 1, 19], [3, 1, 21], [4, 1, 25],
            [0, 2, 10], [1, 2, 12], [2, 2, 14], [3, 2, 16], [4, 2, 20],
            [0, 3, 5],  [1, 3, 7],  [2, 3, 9],  [3, 3, 11], [4, 3, 15],
            [0, 4, 0],  [1, 4, 0],  [2, 4, 0],  [3, 4, 0],  [4, 4, 0]
        ];
        
        // --- 图表B: 调整支付范围的药品 (比值B) ---
        const yLabelsB = ['100% < 比值 B', '70% < 比值 B ≤ 100%', '40% < 比值 B ≤ 70%', '10% < 比值 B ≤ 40%', '比值 B ≤ 10%'];
        const dataB = dataA.slice(); // 数据与A相同

        // --- 通用图表配置 ---
        const getBaseOption = (title, yAxisLabels, seriesData, color) => ({
            title: {
                text: title,
                left: 'center',
                textStyle: { fontSize: 16 }
            },
            grid: {
                height: '65%',
                top: '14%',
                containLabel: true
            },
            tooltip: {
                position: 'top',
                formatter: function(params) {
                    return `规则: <strong>${labelFormatter(params)}</strong>`;
                }
            },
            xAxis: {
                type: 'category',
                data: xLabels,
                splitArea: { show: true }
            },
            yAxis: {
                type: 'category',
                data: yAxisLabels,
                splitArea: { show: true }
            },
            visualMap: {
                min: 0,
                max: 30,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '10%',
                inRange: { color: color },
                pieces: [
                    { value: 0, label: '不调整', color: color[0] },
                    { min: 1, max: 29 },
                    { value: 30, label: '重新谈判', color: color[3] }
                ]
            },
            graphic: {
                elements: [{
                    type: 'text',
                    right: 20,
                    bottom: 5,
                    style: {
                        text: annotationText,
                        fill: '#666',
                        font: '12px sans-serif'
                    }
                }]
            },
            series: [{
                name: '调整规则',
                type: 'heatmap',
                data: seriesData,
                label: {
                    show: true,
                    formatter: labelFormatter,
                    color: '#333'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });

        const colorsA = ['#E8F5E9', '#A5D6A7', '#66BB6A', '#388E3C']; // Green
        const colorsB = ['#FFFDE7', '#FFF59D', '#FFEE58', '#FBC02D']; // Yellow

        const optionA = getBaseOption('比值 A 区间（基金实际支出 ÷ 基金支出预算）', yLabelsA, dataA, colorsA);
        const optionB = getBaseOption('比值 B 区间（本次调整增支 ÷ 原支付范围预算）', yLabelsB, dataB, colorsB);

        function renderChart(type) {
            chartDom.style.opacity = 0;
            setTimeout(() => {
                myChart.dispose();
                myChart = echarts.init(chartDom);
                
                if (type === 'A') {
                    myChart.setOption(optionA);
                    btnA.classList.add('active');
                    btnB.classList.remove('active');
                } else {
                    myChart.setOption(optionB);
                    btnB.classList.add('active');
                    btnA.classList.remove('active');
                }
                chartDom.style.opacity = 1;
            }, 300);
        }

        btnA.addEventListener('click', () => renderChart('A'));
        btnB.addEventListener('click', () => renderChart('B'));

        renderChart('A'); // 初始加载图表A

        // 确保图表在窗口大小变化时能够自适应
        // 注意：全局的 resize 事件监听器可能需要更复杂的管理，但在沙箱化组件内这样是可行的
        window.addEventListener('resize', () => myChart.resize());
    });
}