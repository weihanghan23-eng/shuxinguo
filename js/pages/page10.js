// js/pages/page10.js
document.addEventListener('DOMContentLoaded', () => {
    // 关键：将所有操作限定在当前页面的容器内
    const pageContainer = document.querySelector('#page10-container');
    if (!pageContainer) {
        return; // 如果找不到容器，则不执行任何操作
    }

    const chart1Data = [ { year: 2000, total: 1488, tcm: 913 }, { year: 2009, total: 2127, tcm: 987 }, { year: 2017, total: 2535, tcm: 1238 }, { year: 2019, total: 2643, tcm: 1321 }, { year: 2020, total: 2800, tcm: 1374 }, { year: 2021, total: 2860, tcm: 1374 }, { year: 2022, total: 2967, tcm: 1381 }, { year: 2023, total: 3088, tcm: 1390 }, { year: 2024, total: 3159, tcm: 1394 } ];
    const chart2Data = [ { label: '抗肿瘤药和免疫机能调节药物', value: 29 }, { label: '神经系统药物', value: 15 }, { label: '消化系统与代谢药物', value: 15 }, { label: '系统用抗感染药物', value: 7 }, { label: '心血管系统药物', value: 7 }, { label: '呼吸系统药物', value: 5 }, { label: '血液和造血系统药物', value: 5 } ];

    const chart1Container = pageContainer.querySelector('#chart1 .bar-chart-vertical');
    if (!chart1Container) {
        return;
    }
    
    const maxTotal = Math.max(...chart1Data.map(d => d.total));
    chart1Data.forEach(d => {
        const heightPercent = (d.total / maxTotal) * 100;
        const tcmHeightPercent = (d.tcm / d.total) * 100;
        chart1Container.innerHTML += `<div class="bar-group"><div class="bar" style="height: 0%;" data-height="${heightPercent}%"><div class="bar-tcm" style="height: ${tcmHeightPercent}%;"></div><div class="bar-value" data-value="${d.total}">0</div></div><div class="bar-label">${d.year}</div></div>`;
    });

    const chart2Container = pageContainer.querySelector('#chart2 .bar-chart-horizontal');
    if (!chart2Container) {
        return;
    }
    
    const maxValue = Math.max(...chart2Data.map(d => d.value));
    chart2Data.forEach(d => {
        const widthPercent = (d.value / maxValue) * 100;
        chart2Container.innerHTML += `<div class="bar-row"><div class="bar-row-label">${d.label}</div><div class="bar-horizontal-wrapper"><div class="bar-horizontal" style="width: 0%;" data-width="${widthPercent}%"><span class="bar-horizontal-value" data-value="${d.value}">0</span></div></div></div>`;
    });

    // 数字滚动动画函数
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // 动画序列编排
    const runAnimations = () => {
        // 使用 pageContainer 进行查询
        const stPatient = pageContainer.querySelector('#st-patient');
        const stIndustry = pageContainer.querySelector('#st-industry');
        const stSociety = pageContainer.querySelector('#st-society');
        const chart1 = pageContainer.querySelector('#chart1');
        const chart2 = pageContainer.querySelector('#chart2');
        const summary = pageContainer.querySelector('#summary');
        const conclusion = pageContainer.querySelector('#conclusion');

        if (!stPatient || !stIndustry || !stSociety || !chart1 || !chart2 || !summary || !conclusion) {
            return;
        }

        const sequence = [
            // 1. 场景建立: 左侧关键词
            () => { 
                stPatient.classList.add('is-visible'); 
            },
            () => { stIndustry.classList.add('is-visible'); },
            () => { stSociety.classList.add('is-visible'); },
            
            // 2. 焦点1: 医保目录数量图表
            () => {
                chart1.classList.add('is-visible');
                Array.from(chart1.querySelectorAll('.bar')).forEach((el, i) => {
                    setTimeout(() => {
                        el.style.height = el.dataset.height;
                        const valueEl = el.querySelector('.bar-value');
                        if (valueEl) {
                            animateValue(valueEl, 0, parseInt(valueEl.dataset.value), 1200);
                        }
                    }, i * 80);
                });
            },

            // 3. 焦点2: 新增药品分类图表
            () => {
                chart1.classList.add('is-dimmed');
                chart2.classList.add('is-visible');
                Array.from(chart2.querySelectorAll('.bar-row')).forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('is-visible');
                        const bar = el.querySelector('.bar-horizontal');
                        if (bar) {
                            bar.style.width = bar.dataset.width;
                            const valueEl = el.querySelector('.bar-horizontal-value');
                            if (valueEl) {
                                animateValue(valueEl, 0, parseInt(valueEl.dataset.value), 1200);
                            }
                        }
                    }, i * 120);
                });
            },

            // 4. 焦点3: 说明文案
            () => {
                chart2.classList.add('is-dimmed');
                summary.classList.add('is-visible');
            },

            // 5. 最终结论
            () => {
                summary.classList.add('is-dimmed');
                conclusion.classList.add('is-visible');
            }
        ];

        const delays = [100, 200, 300, 500, 1900, 2200, 2400];
        sequence.forEach((action, index) => {
            setTimeout(action, delays[index]);
        });
    };

    // 延迟一点时间再开始动画，确保DOM完全准备好
    setTimeout(() => {
        runAnimations();
    }, 100);
});