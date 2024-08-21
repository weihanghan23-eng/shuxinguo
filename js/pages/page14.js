document.addEventListener('DOMContentLoaded', function () {
    const pageContainer = document.querySelector('#page14-container');
    if (!pageContainer) {
        return; 
    }

    // 将所有DOM查询限定在 pageContainer 内部
    const chartDom = pageContainer.querySelector('#main-chart');
    // 如果页面不存在，则直接退出，避免在全局作用域中抛出错误
    if (!chartDom) {
        return;
    }
    
    let myChart = echarts.init(chartDom);
    const btnA = pageContainer.querySelector('#btn-chart-a');
    const btnB = pageContainer.querySelector('#btn-chart-b');

    const optionA = {
        title: [
            {
                text: '全国范围集采前院内药品市场各批次销售额分布',
                left: 'center',
                top: '2%', 
                textStyle: { fontSize: 18, fontWeight: 'bold', color: '#3D405B' }
            },
            {
                text: '院内医疗\n机构合计',
                left: '50%',
                top: '57%', 
                textAlign: 'center',
                textStyle: {
                    fontSize: 20, 
                    color: '#666', 
                    fontWeight: 'normal' 
                }
            }
        ],
        tooltip: { show: false },
        legend: { orient: 'vertical', left: 'left', top: 'center', textStyle: { fontSize: 14 } },
        series: [
            {
                name: '销售额分布',
                type: 'pie',
                radius: ['50%', '75%'],
                center: ['50%', '60%'], 
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                    fontSize: 13,
                    minMargin: 5,
                    edgeDistance: 10,
                    lineHeight: 15
                },
                labelLine: { show: true, length: 15, length2: 10 },
                data: [
                    { value: 6.10, name: '第1批' }, { value: 2.80, name: '第2批' },
                    { value: 3.80, name: '第3批' }, { value: 3.20, name: '第4批' },
                    { value: 6.90, name: '第5批' }, { value: 2.00, name: '第6批' },
                    { value: 5.50, name: '第7批' }, { value: 4.50, name: '第8批' },
                    { value: 2.00, name: '第9批' }, { value: 63.10, name: '非集采' }
                ]
            }
        ],
        color: ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#96C37D', '#F4A460', '#C0C0C0', '#D3D3D3']
    };

    const optionB = {
        title: {
            text: '1~8批集采品种院内渠道销售额变化（亿元）',
            left: 'center',
            textStyle: {
                fontSize: 16
            }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'category',
            data: ['2019年', '第1批', '第2批', '第3批', '第4批', '第5批', '第6批', '第7批', '2023年-第8批'],
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            name: '销售额 (亿元)'
        },
        series: [{
            name: '销售额',
            type: 'bar',
            data: [4623.4, 4165, 3913.8, 3641.8, 3433.5, 3106.6, 2992.2, 2617.8, 2547.6],
            barWidth: '60%',
            itemStyle: {
                color: 'var(--primary-color-1)'
            }
        }],
        graphic: {
            elements: [
                {
                    type: 'group',
                    right: '5%',
                    top: '12%',
                    children: [
                        {
                            type: 'ellipse',
                            shape: { cx: 0, cy: 0, rx: 105, ry: 25 },
                            style: { fill: '#81B29A' }
                        },
                        {
                            type: 'text',
                            style: {
                                text: '累计-2076（-44.9%）',
                                fill: '#fff',
                                font: 'bold 14px sans-serif'
                            },
                            left: 'center',
                            top: 'middle'
                        }
                    ]
                }
            ]
        }
    };

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

    renderChart('A');

    // 全局 resize 事件监听器是安全的，因为它内部会检查 myChart 实例是否存在
    window.addEventListener('resize', function () {
        if (myChart) {
            myChart.resize();
        }
    });
});