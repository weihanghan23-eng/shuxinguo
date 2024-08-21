// js/pages/page2.js (全新重构版)

document.addEventListener('DOMContentLoaded', () => {
    const pageContainer = document.getElementById('page2-container');
    if (!pageContainer) return;

    const wrapper = pageContainer.querySelector('.page2-wrapper');
    const scenes = wrapper.querySelectorAll('.scene');
    const paginationContainer = wrapper.querySelector('.pagination');
    const scrollHint = wrapper.querySelector('#scroll-hint');
    
    let currentSceneIndex = 0;
    let isThrottled = false;
    let isPageActive = false; // 新增状态：跟踪页面是否在视口内
    let dots = [];

    // 创建分页导航
    function createPagination() {
        scenes.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                if(index !== currentSceneIndex && !isThrottled) {
                    isThrottled = true; 
                    goToScene(index);
                    setTimeout(() => { isThrottled = false; }, 1000);
                }
            });
            paginationContainer.appendChild(dot);
            dots.push(dot);
        });
    }
    
    // 场景3的元素查询
    const scene3Elements = {
        bubbles: wrapper.querySelectorAll('#scene3 .thought-bubble'),
        path: wrapper.querySelector('#solution-path'),
        fountain: wrapper.querySelector('#thumbs-up-fountain'),
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

        const fadeBubbleTimer = setTimeout(() => {
            scene3Elements.bubbles.forEach(b => b.classList.add('is-fading'));
        }, 2800);

        const drawPathTimer = setTimeout(() => {
            scene3Elements.path.classList.add('is-active');
        }, 3000);
        
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

    function goToScene(index) {
        if (index < 0 || index >= scenes.length) return;
        
        scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
        if (scrollHint) scrollHint.classList.toggle('hidden', index > 0);
        
        if (index === 2) { // 场景3的特殊动画
            animateScene3();
        } else {
            resetScene3();
        }

        currentSceneIndex = index;
    }

    // 核心交互处理逻辑
    function handleInteraction(direction) {
        if (isThrottled) return;

        const nextIndex = currentSceneIndex + direction;

        // 如果想在第一页向上滚或最后一页向下滚时，允许页面滚动
        if ((direction === -1 && currentSceneIndex === 0) || (direction === 1 && currentSceneIndex === scenes.length - 1)) {
            isPageActive = false; // 临时释放页面控制权，允许浏览器滚动
            return true; // 返回 true 表示允许默认行为
        }

        isThrottled = true;
        goToScene(nextIndex);
        setTimeout(() => { isThrottled = false; }, 1000); // 节流
        
        return false; // 返回 false 表示已处理，阻止默认行为
    }

    // --- 事件监听 ---
    const handleWheel = (e) => {
        if (!isPageActive) return; // 如果页面不在视口，不处理
        const allowScroll = handleInteraction(e.deltaY > 0 ? 1 : -1);
        if (!allowScroll) {
            e.preventDefault();
        }
    };

    const handleKeyDown = (e) => {
        if (!isPageActive) return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            if (!handleInteraction(1)) e.preventDefault();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            if (!handleInteraction(-1)) e.preventDefault();
        }
    };

    // --- 使用 IntersectionObserver 监听页面是否可见 ---
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                isPageActive = entry.isIntersecting;
                
                // === 核心修复逻辑 ===
                if (isPageActive) {
                    // 页面进入视野，开始监听滚轮和键盘事件
                    window.addEventListener('wheel', handleWheel, { passive: false });
                    window.addEventListener('keydown', handleKeyDown);
                } else {
                    // 页面离开视野，必须移除监听，避免干扰其他页面！
                    window.removeEventListener('wheel', handleWheel);
                    window.removeEventListener('keydown', handleKeyDown);
                }
            });
        },
        {
            // 当页面50%可见时触发
            threshold: 0.5 
        }
    );

    observer.observe(pageContainer); // 开始观察 page2 的容器
    
    // !!! 关键：删除文件末尾的全局事件绑定 !!!
    // window.addEventListener('wheel', handleWheel, { passive: false }); // <-- 删除这一行
    // window.addEventListener('keydown', handleKeyDown); // <-- 删除这一行
    
    // 初始化
    createPagination();
    goToScene(0);
});