// js/pages/page7.js

document.addEventListener('DOMContentLoaded', function() {
    // 1. 确定当前页面的根容器
    const pageContainer = document.querySelector('#page7-container');
    if (!pageContainer) {
        return;
    }

    // 2. 在根容器内查找图表元素
    const chartDom = pageContainer.querySelector('#main-chart');
    if (!chartDom) {
        // 如果图表容器不存在，则不执行任何操作
        return;
    }

    // 3. 初始化 ECharts 实例
    var myChart = echarts.init(chartDom);

    // 4. 图表数据（源自“表3”）
    const batches = ['第二批', '第三批', '第四批', '第五批', '第七批', '第八批', '第九批'];
    
    // 价格降幅数据 [均值, 标准差]
    const priceDropData = {
        mean: [0.55, 0.72, 0.68, 0.70, 0.65, 0.61, 0.70],
        stdDev: [0.22, 0.20, 0.19, 0.22, 0.24, 0.27, 0.21]
    };

    // 最高有效申报价/元 数据 [均值, 标准差]
    const bidPriceData = {
        mean: [80.70, 31.57, 140.86, 166.80, 75.88, 62.92, 96.64],
        stdDev: [410.61, 119.01, 572.14, 456.90, 167.39, 145.26, 256.01]
    };
    
    // 5. 辅助函数：处理数据以生成误差线所需格式
    function generateErrorData(data) {
        return data.mean.map((mean, index) => {
            const std = data.stdDev[index];
            const lowerBound = Math.max(0, mean - std); 
            const upperBound = mean + std;
            return [index, lowerBound, upperBound];
        });
    }
    
    const priceDropError = generateErrorData(priceDropData);
    const bidPriceError = generateErrorData(bidPriceData);

    // 6. ECharts 配置项
    const option = {
        color: ['#27ae60', '#f39c12'], 
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: { color: '#999' }
            },
            formatter: function (params) {
                let tooltipText = `${params[0].name}<br/>`;
                params.filter(p => p.seriesType === 'line').forEach(p => {
                    const seriesIndex = p.seriesIndex;
                    const dataIndex = p.dataIndex;
                    let mean, stdDev;
                    if(seriesIndex === 0) {
                        mean = priceDropData.mean[dataIndex];
                        stdDev = priceDropData.stdDev[dataIndex];
                         tooltipText += `${p.marker} ${p.seriesName}: ${(mean * 100).toFixed(1)}% (±${(stdDev * 100).toFixed(1)}%)<br/>`;
                    } else {
                        mean = bidPriceData.mean[dataIndex];
                        stdDev = bidPriceData.stdDev[dataIndex];
                        tooltipText += `${p.marker} ${p.seriesName}: ${mean.toFixed(2)}元 (±${stdDev.toFixed(2)})<br/>`;
                    }
                });
                return tooltipText;
            }
        },
        legend: {
            data: ['价格降幅', '最高有效申报价'],
            textStyle: { fontSize: 14 },
            top: 'bottom'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '12%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: batches,
            axisPointer: { type: 'shadow' }
        }],
        yAxis: [
            {
                type: 'value',
                name: '价格降幅',
                min: 0,
                max: 1,
                axisLabel: { formatter: '{value}' }
            },
            {
                type: 'value',
                name: '最高有效申报价 (元)',
                min: 0, 
                axisLabel: { formatter: '{value} 元' }
            }
        ],
        series: [
            {
                name: '价格降幅',
                type: 'line',
                yAxisIndex: 0,
                data: priceDropData.mean,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
            },
            {
                type: 'custom',
                name: '价格降幅误差',
                yAxisIndex: 0,
                renderItem: function (params, api) {
                    const xValue = api.value(0);
                    const highPoint = api.coord([xValue, api.value(2)]);
                    const lowPoint = api.coord([xValue, api.value(1)]);
                    const halfWidth = api.size([1, 0])[0] * 0.1;
                    return {
                        type: 'group',
                        children: [{ type: 'line', shape: { x1: highPoint[0] - halfWidth, y1: highPoint[1], x2: highPoint[0] + halfWidth, y2: highPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }, { type: 'line', shape: { x1: highPoint[0], y1: highPoint[1], x2: lowPoint[0], y2: lowPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }, { type: 'line', shape: { x1: lowPoint[0] - halfWidth, y1: lowPoint[1], x2: lowPoint[0] + halfWidth, y2: lowPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }]
                    };
                },
                data: priceDropError,
                z: 100,
                tooltip: { show: false }
            },
            {
                name: '最高有效申报价',
                type: 'line',
                yAxisIndex: 1,
                data: bidPriceData.mean,
                smooth: true,
                symbol: 'triangle',
                symbolSize: 10,
            },
            {
                type: 'custom',
                name: '最高有效申报价误差',
                yAxisIndex: 1,
                renderItem: function (params, api) {
                    const xValue = api.value(0);
                    const highPoint = api.coord([xValue, api.value(2)]);
                    const lowPoint = api.coord([xValue, api.value(1)]);
                    const halfWidth = api.size([1, 0])[0] * 0.1;
                    return {
                        type: 'group',
                        children: [{ type: 'line', shape: { x1: highPoint[0] - halfWidth, y1: highPoint[1], x2: highPoint[0] + halfWidth, y2: highPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }, { type: 'line', shape: { x1: highPoint[0], y1: highPoint[1], x2: lowPoint[0], y2: lowPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }, { type: 'line', shape: { x1: lowPoint[0] - halfWidth, y1: lowPoint[1], x2: lowPoint[0] + halfWidth, y2: lowPoint[1] }, style: { stroke: api.visual('color'), lineWidth: 2 } }]
                    };
                },
                data: bidPriceError,
                z: 100,
                tooltip: { show: false }
            }
        ],
        animationDuration: 2000
    };

    // 7. 应用配置项
    myChart.setOption(option);

    // 8. 监听窗口大小变化，使图表自适应 (此为全局监听，保持不变)
    window.addEventListener('resize', function () {
        myChart.resize();
    });
});