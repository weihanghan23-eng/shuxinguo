/* js/pages/page4.js - 页面沙箱化脚本（简化版，直接显示最终成果） */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 确定当前页面的根容器
    const pageContainer = document.querySelector('#page4-container');
    if (!pageContainer) return;

    // 2. 将所有DOM查询和逻辑限定在根容器内
    const STAGES_DATA = [
        { year: 2018.5, title: '探索试点阶段', date: '2018-2019年', side: 'left', details: '突破传统招标只招不采的弊端，<br>以"量价挂钩"为核心，<br>集采范围从11座试点城市拓展到25省。' },
        { year: 2020.5, title: '制度建立阶段', date: '2020-2021年', side: 'right', details: '药品覆盖范围显著扩大：覆盖162个品种。<br>规则精细化：差比价机制、多家中标机制等。' },
        { year: 2021.5, title: '制度完善阶段', date: '2021年', side: 'left', details: '生物药纳入集采范围，中成药地方试点。<br>建立临床综合评价体系，尊重医疗需求。' },
        { year: 2022.5, title: '医保治理阶段', date: '2022年至今', side: 'right', details: '覆盖全品类：中成药、化学药、罕见病药。<br>通过DRG、DIP机制完善医保资金调配。' }
    ];

    // --- DOM 元素 ---
    let timelineCanvas, pathProgress, pageHeader, stages;

    const mapRange = (v, i_min, i_max, o_min, o_max) => (v - i_min) * (o_max - o_min) / (i_max - i_min) + o_min;

    // --- 核心函数：直接显示最终成果 ---
    function setupTimeline() {
        const pathBG = pageContainer.querySelector('#path-bg');
        const pathFuture = pageContainer.querySelector('#path-future');
        pathProgress = pageContainer.querySelector('#path-progress');
        
        const startYear = 2018; 
        const endYear = 2023;
        
        // 设置路径 - 根据画布尺寸动态计算
        const canvasWidth = timelineCanvas.offsetWidth;
        const canvasHeight = timelineCanvas.offsetHeight;
        
        // 计算路径起点和终点，保持相对位置比例
        const start = { 
            x: canvasWidth * 0.16, // 200/1260 ≈ 0.16
            y: canvasHeight * 1.03  // 650/630 ≈ 1.03
        };
        const end = { 
            x: canvasWidth * 0.95,  // 1200/1260 ≈ 0.95
            y: canvasHeight * 0.08  // 50/630 ≈ 0.08
        };
        
        const pathData = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        
        pathBG.setAttribute('d', pathData);
        pathProgress.setAttribute('d', pathData);
        pathLength = pathProgress.getTotalLength();
        
        // 直接显示完整进度条
        pathProgress.style.strokeDasharray = pathLength;
        pathProgress.style.strokeDashoffset = 0; // 显示完整进度
        
        // 设置未来路径
        const lastStageYear = STAGES_DATA[STAGES_DATA.length - 1].year;
        const lastPointP = mapRange(lastStageYear, startYear, endYear, 0.05, 0.95);
        const lastPoint = pathProgress.getPointAtLength(pathLength * lastPointP);
        const futurePathData = `M ${lastPoint.x} ${lastPoint.y} L ${end.x} ${end.y}`;
        pathFuture.setAttribute('d', futurePathData);

        // 创建年份标记
        let contentHTML = '';
        for (let year = startYear; year <= endYear; year++) {
            const p = mapRange(year, startYear, endYear, 0.05, 0.95);
            const point = pathProgress.getPointAtLength(pathLength * p);
            contentHTML += `<div class="year-marker" style="left:${point.x}px; top:${point.y}px;">${year}</div>`;
        }
        
        // 创建所有阶段，直接显示为激活状态
        STAGES_DATA.forEach(data => {
            const p = mapRange(data.year, startYear, endYear, 0.05, 0.95);
            const point = pathProgress.getPointAtLength(pathLength * p);
            contentHTML += `<div class="timeline-stage is-active" data-side="${data.side}" style="left:${point.x}px; top:${point.y}px;"><div class="node"></div><div class="stage-content"><h2>${data.title}</h2><span class="date">${data.date}</span><p class="details">${data.details}</p></div></div>`;
        });
        
        contentHTML += `<div id="to-be-continued" style="left:${end.x}px; top:${end.y}px;">未完待续...</div>`;
        timelineCanvas.insertAdjacentHTML('beforeend', contentHTML);
        
        // 直接显示所有年份标记
        setTimeout(() => {
            const yearMarkers = pageContainer.querySelectorAll('.year-marker');
            yearMarkers.forEach(marker => marker.classList.add('is-visible'));
        }, 100);
    }

    // --- 初始化 ---
    timelineCanvas = pageContainer.querySelector('#timelineCanvas');
    pageHeader = pageContainer.querySelector('#pageHeader');

    setupTimeline();
    stages = pageContainer.querySelectorAll('.timeline-stage');

    // 直接显示页面标题
    pageHeader.classList.add('is-visible');
    
    // 设置页面为概览模式，显示完整时间轴
    timelineCanvas.classList.add('is-overview');
    timelineCanvas.style.transform = 'translate(-50%, -50%) scale(1)';
});