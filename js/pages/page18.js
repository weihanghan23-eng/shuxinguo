// page18.js - 优化版本，增强稳健性和图表交互

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 等待一小段时间确保DOM完全加载
    setTimeout(initializePage18, 100);
});

function initializePage18() {
    // 查找page18容器
    const page18Container = document.getElementById('page18-container');
    if (!page18Container) {
        return;
    }
    
    // 初始化侧边栏交互
    initializeSidebar();
    
    // 初始化图表交互
    initializeChart();
    
    // 确保页面可见性
    ensurePageVisibility();
    
    // 添加数据验证和错误处理
    validatePageData();
}

function initializeSidebar() {
    const sidebarItems = document.querySelectorAll('#page18-container .sidebar-item');
    
    if (sidebarItems.length === 0) {
        return;
    }
    
    sidebarItems.forEach((item, index) => {
        // 添加更稳健的事件处理
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                // 移除所有active类
                sidebarItems.forEach(i => i.classList.remove('active'));
                // 添加active类到当前点击项
                this.classList.add('active');
                
                // 添加视觉反馈
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // 触发自定义事件
                const customEvent = new CustomEvent('sidebarItemChanged', {
                    detail: { index: index, text: this.textContent.trim() }
                });
                document.dispatchEvent(customEvent);
                
            } catch (error) {
                // 侧边栏点击处理错误
            }
        });
        
        // 添加键盘支持
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    

}

function initializeChart() {
    const chartWrapper = document.querySelector('#page18-container #chart-22-wrapper');
    const chartBars = document.querySelectorAll('#page18-container #chart-22-wrapper .bar');
    
    if (!chartWrapper) {
        return;
    }
    
    if (chartBars.length === 0) {
        return;
    }
    
    chartBars.forEach((bar, index) => {
        try {
            // 鼠标悬停效果 - 使用CSS变量或固定颜色
            bar.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#E07A5F'; // 直接使用颜色值而不是CSS变量
                this.style.transition = 'background-color 0.3s ease';
                
                // 添加提示效果
                const tooltip = this.querySelector('.bar-value');
                if (tooltip) {
                    tooltip.style.fontWeight = 'bold';
                    tooltip.style.color = '#E07A5F';
                }
                

            });
            
            bar.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#3D405B'; // 恢复原色
                
                // 恢复提示样式
                const tooltip = this.querySelector('.bar-value');
                if (tooltip) {
                    tooltip.style.fontWeight = '';
                    tooltip.style.color = '';
                }
            });
            
            // 点击效果
            bar.addEventListener('click', function(e) {
                e.stopPropagation();
                
                try {
                    const value = this.querySelector('.bar-value');
                    const groupLabel = this.closest('.bar-group')?.querySelector('.group-label');
                    
                    if (value && groupLabel) {
        
                        
                        // 添加点击动画
                        this.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 200);
                        
                        // 触发自定义事件
                        const customEvent = new CustomEvent('chartBarClicked', {
                            detail: { 
                                index: index, 
                                value: value.textContent.trim(),
                                label: groupLabel.textContent.trim()
                            }
                        });
                        document.dispatchEvent(customEvent);
                    }
                            } catch (error) {
                // 柱状图点击处理错误
            }
            });
            
            // 添加键盘支持
            bar.setAttribute('tabindex', '0');
            bar.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
        } catch (error) {
            // 初始化柱状图错误
        }
    });
    
    // 添加图表整体交互
    chartWrapper.addEventListener('wheel', function(e) {
        // 防止在图表区域滚动页面
        e.preventDefault();
    }, { passive: false });
    

}

function ensurePageVisibility() {
    const page18Container = document.getElementById('page18-container');
    if (page18Container) {
        // 确保容器可见
        page18Container.style.display = 'block';
        page18Container.style.visibility = 'visible';
        page18Container.style.opacity = '1';
        
        // 确保wrapper可见
        const wrapper = page18Container.querySelector('.page18-wrapper');
        if (wrapper) {
            wrapper.style.display = 'block';
            wrapper.style.visibility = 'visible';
            wrapper.style.opacity = '1';
        }
        
        // 确保图表容器可见
        const chartWrapper = page18Container.querySelector('#chart-22-wrapper');
        if (chartWrapper) {
            chartWrapper.style.display = 'flex';
            chartWrapper.style.visibility = 'visible';
        }
        
    
    }
}

function validatePageData() {
    try {
        const page18Container = document.getElementById('page18-container');
        if (!page18Container) {
            throw new Error('Page18 container missing');
        }
        
        const sidebarItems = page18Container.querySelectorAll('.sidebar-item');
        const chartBars = page18Container.querySelectorAll('.bar');
        const panels = page18Container.querySelectorAll('.panel');
        const chartWrapper = page18Container.querySelector('#chart-22-wrapper');
        

        
        // 检查图表数据完整性
        chartBars.forEach((bar, index) => {
            const value = bar.querySelector('.bar-value');
            const group = bar.closest('.bar-group');
            const label = group?.querySelector('.group-label');
            
            if (!value || !label) {
                // 图表柱状图缺少值或标签
            } else {
                // 确保图表元素可见
                bar.style.display = 'block';
                value.style.display = 'block';
                label.style.display = 'block';
            }
        });
        
        // 验证背景图片路径
        const computedStyle = window.getComputedStyle(page18Container);
        const backgroundImage = computedStyle.backgroundImage;
        if (backgroundImage && backgroundImage !== 'none') {
            // 背景图片已加载
        } else {
            // 背景图片未正确加载
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

// 添加页面切换时的重新初始化
document.addEventListener('pageChanged', function() {
    setTimeout(initializePage18, 100);
});

// 添加自定义事件监听器
document.addEventListener('sidebarItemChanged', function(e) {
    // 侧边栏项目改变事件
});

document.addEventListener('chartBarClicked', function(e) {
    // 图表柱状图点击事件
});

// 添加窗口大小改变时的重新调整
window.addEventListener('resize', function() {
    // 延迟执行以避免频繁调用
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(function() {
        const page18Container = document.getElementById('page18-container');
        if (page18Container && page18Container.style.display !== 'none') {
            // 重新初始化以确保布局正确
            ensurePageVisibility();
        }
    }, 250);
});

// 添加页面性能监控
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('page18-script-loaded');
}