// js/pages/page16.js

// 等待DOM加载完成后执行，确保脚本作用域的独立性
document.addEventListener('DOMContentLoaded', function () {
    // 1. 定义此页面的主容器，所有后续操作都将在此容器内进行
    const pageContainer = document.querySelector('#page16-container');
    if (!pageContainer) {
        return;
    }

    // --- 右侧图表 (图17) ---
    const rightChartDom = pageContainer.querySelector('#right-chart');
    const rightMyChart = echarts.init(rightChartDom);
    const rightOption = {
        title: {
            text: '四个地方联盟集采竞争强度与降价幅度',
            left: 'center',
            top: '5%',
            textStyle: {
                fontSize: 18, 
                fontWeight: 'bold',
                color: '#3D405B'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: ['产品数', '平均降幅'],
            top: '15%',
            textStyle: {
                fontSize: 12
            }
        },
        grid: {
            top: '30%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['1家', '2家', '3家', '4家', '5家', '5+'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '产品数',
                min: 0,
                max: 120,
                interval: 20,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '平均降幅',
                min: -0.2,
                max: 0.5,
                interval: 0.1,
                axisLabel: {
                    formatter: function(value) {
                        return (value * 100).toFixed(0) + '%';
                    }
                }
            }
        ],
        series: [
            {
                name: '产品数',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value + ' 款';
                    }
                },
                data: [67, 43, 35, 19, 18, 112],
                itemStyle: { color: '#008080' } // Teal
            },
            {
                name: '平均降幅',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value) {
                        return (value * 100).toFixed(0) + ' %';
                    }
                },
                data: [0.16, 0.37, 0.38, 0.43, 0.44, 0.43],
                itemStyle: { color: '#FA8072' }, // Salmon
                symbol: 'circle',
                symbolSize: 8
            }
        ]
    };
    rightMyChart.setOption(rightOption);

    // --- 左侧图表切换逻辑 (图A 和 图B/图16) ---
    const btnA = pageContainer.querySelector('#btn-chart-a');
    const btnB = pageContainer.querySelector('#btn-chart-b');
    const chartAImg = pageContainer.querySelector('#chart-a-img');
    const chartBContainer = pageContainer.querySelector('#chart-b-container');

    let chartB = null;

    const optionB = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'category',
            name: '参与联盟数',
            nameLocation: 'middle',
            nameGap: 30,
            data: ['1-3', '4-6', '6-9', '10-12', '13+']
        },
        yAxis: {
            type: 'value',
            name: '省份数',
            nameLocation: 'middle',
            nameGap: 35
        },
        series: [{
            name: '省份数',
            type: 'bar',
            data: [5, 5, 10, 9, 2],
            barWidth: '60%',
            itemStyle: {
                color: '#6A5ACD' // SlateBlue
            }
        }]
    };

    function renderLeftChart(type) {
        if (type === 'A') {
            chartAImg.style.opacity = 1;
            chartBContainer.style.opacity = 0;
            btnA.classList.add('active');
            btnB.classList.remove('active');
        } else { // type 'B'
            chartAImg.style.opacity = 0;
            chartBContainer.style.opacity = 1;
            btnB.classList.add('active');
            btnA.classList.remove('active');
            
            if (!chartB) {
                chartB = echarts.init(chartBContainer);
                chartB.setOption(optionB);
            }
        }
    }

    btnA.addEventListener('click', () => renderLeftChart('A'));
    btnB.addEventListener('click', () => renderLeftChart('B'));

    // 初始渲染图表 A
    renderLeftChart('A');
    
    // --- 窗口大小调整 ---
    // 注意：ECharts 的 resize 需要在图表可见时调用才能正确计算尺寸。
    // 在更复杂的页面切换场景中，可能需要在页面变得可见时手动触发一次 resize。
    // 对于简单的滚动页面，此处的 resize 事件监听器通常已足够。
    window.addEventListener('resize', function () {
        rightMyChart.resize();
        if (chartB) {
            chartB.resize();
        }
    });
});