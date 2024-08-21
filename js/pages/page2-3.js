/* js/pages/page2-3.js - 页面2-3脚本（场景3: 解答疑问） */

document.addEventListener('DOMContentLoaded', () => {
    const pageContainer = document.getElementById('page2-3-container');
    if (!pageContainer) return;

    // 页面加载完成后的初始化
    const visualArea = pageContainer.querySelector('.visual-area');
    if (visualArea) {
        // 简单的淡入效果
        visualArea.style.opacity = '0';
        visualArea.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            visualArea.style.transition = 'all 0.8s ease-out';
            visualArea.style.opacity = '1';
            visualArea.style.transform = 'translateY(0)';
        }, 100);
    }

    // 场景3的特殊动画效果（保留原有的动画）
    const scene3Elements = {
        bubbles: pageContainer.querySelectorAll('.thought-bubble'),
        path: pageContainer.querySelector('#solution-path'),
        fountain: pageContainer.querySelector('#thumbs-up-fountain'),
        timers: []
    };

    function resetScene3() {
        scene3Elements.bubbles.forEach(b => b.classList.remove('is-fading'));
        scene3Elements.fountain.innerHTML = '';
        scene3Elements.timers.forEach(clearTimeout);
        scene3Elements.timers = [];
    }

    function animateScene3() {
        resetScene3();

        // 思考气泡淡出效果
        const fadeBubbleTimer = setTimeout(() => {
            scene3Elements.bubbles.forEach(b => b.classList.add('is-fading'));
        }, 2800);

        // 路径绘制效果
        const drawPathTimer = setTimeout(() => {
            if (scene3Elements.path) {
                scene3Elements.path.classList.add('is-active');
            }
        }, 3000);
        
        // 大拇指喷泉效果
        const fountainTimer = setTimeout(startThumbsUpFountain, 3800);
        
        scene3Elements.timers.push(fadeBubbleTimer, drawPathTimer, fountainTimer);
    }

    function startThumbsUpFountain() {
        const fountainContainer = scene3Elements.fountain;
        if (!fountainContainer) return;
        
        for (let i = 0; i < 40; i++) { // 创建40个大拇指
            const thumb = document.createElement('div');
            thumb.classList.add('thumb');
            thumb.innerHTML = '👍';

            const xEnd = (Math.random() - 0.5) * 400; // 横向散开范围
            const yEnd = -(Math.random() * 200 + 150); // 纵向喷射高度
            const scale = 1 + Math.random() * 1.5;
            const rotation = (Math.random() - 0.5) * 90; // 随机旋转
            
            thumb.style.setProperty('--transform-end', `translate(${xEnd}px, ${yEnd}px) rotate(${rotation}deg)`);
            thumb.style.animation = `fountain-rise ${1.5 + Math.random() * 2}s ${Math.random() * 0.5}s ease-out forwards`;
            
            fountainContainer.appendChild(thumb);
        }
    }

    // 页面进入视口时开始动画
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 延迟一点开始动画，让页面完全加载
                    setTimeout(() => {
                        animateScene3();
                    }, 500);
                } else {
                    resetScene3();
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    observer.observe(pageContainer);
}); 