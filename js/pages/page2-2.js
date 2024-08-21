/* js/pages/page2-2.js - 页面2-2脚本（场景2: 集采的作用） */

document.addEventListener('DOMContentLoaded', () => {
    const pageContainer = document.getElementById('page2-2-container');
    if (!pageContainer) return;

    // 页面加载完成后的简单初始化，移除动画效果
    const visualArea = pageContainer.querySelector('.visual-area');
    if (visualArea) {
        // 直接显示，无需动画
        visualArea.style.opacity = '1';
        visualArea.style.transform = 'none';
    }
}); 