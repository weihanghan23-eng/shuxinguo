document.addEventListener('DOMContentLoaded', () => {

    // 统一的滚动事件监听器
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // 找到所有的过渡效果区域
        const transitionSections = document.querySelectorAll('.page-section');

        transitionSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight; // 200vh
            const viewportHeight = window.innerHeight; // 100vh

            // 计算滚动条位置相对于当前section的进度
            // 当section顶部到达屏幕顶部时，progress为0
            // 当滚动了100vh后，progress为1
            const scrollProgress = (scrollY - sectionTop) / viewportHeight;

            const a1 = section.querySelector("[id$='-a1']");
            const a2 = section.querySelector("[id$='-a2']");

            if (!a1 || !a2) return; // 如果section内没有A面图片，则跳过

            // 我们可以在滚动进度的某个点触发动画，例如 progress > 0.1 (滚动了10%的屏幕高度)
            if (scrollProgress > 0.1 && scrollProgress < 1) { 
                // 动画触发
                a1.style.transform = 'translateY(-100%)';
                a1.style.opacity = '0';
                a2.style.transform = 'translateY(100%)';
                a2.style.opacity = '0';
            } else {
                // 恢复状态
                a1.style.transform = 'translateY(0)';
                a1.style.opacity = '1';
                a2.style.transform = 'translateY(0)';
                a2.style.opacity = '1';
            }
        });
    });
});