

> **“你好，请帮我整合一个新的页面 `pageXX.html`。请遵循我们最新的‘终极沙箱化’集成指南：**
>
> 1.  **完全不考虑 `main.css` 和 `main.js` 的存在**，假设它们不存在。
> 2.  **创建独立的 HTML, CSS, JS 文件**。
> 3.  **确保页面在自己的 CSS 文件中实现完整的、自给自足的布局**。无论是复杂的全屏Grid布局，还是简单的内容居中布局，都必须在页面自己的CSS沙箱内完成。
> 4.  **最终目标**：将拆分后的文件整合进 `index.html` 后，在浏览器中**通过手动滚动**，这个新页面必须和它原始的独立HTML文件显示得**一模一样**。
>
> **请直接提供拆分好的、可立即使用的 `index.html` 代码片段、`css/pages/pageXX.css` 和 `js/pages/pageXX.js` 文件内容。**”

---

#### **技术指南 V5.0：终极沙箱化集成工作流 (无 `main` 依赖)**

**核心理念：** 每个页面都是一个独立的、功能完整的“微型网站”。它不依赖任何全局样式来实现其自身布局。全局 `main` 文件未来只负责页面间的“切换动画”，不负责页面内的“结构布局”。

---

##### **第一步：HTML 结构模板 (在 `index.html` 中)**

所有页面，无论简单还是复杂，都必须使用此结构。

```html
<!-- ▼▼▼ PAGEX HTML CONTENT START (V5.0 标准) ▼▼▼ -->
<section id="pageX-container" class="page-section">
    <!-- 唯一的包装器，创建CSS/JS沙箱 -->
    <div class="pageX-wrapper">

        <!-- ↓↓↓ 将 pageX.html 的 <body> 内所有内容粘贴于此 ↓↓↓ -->

        ... 原始页面内容 ...

        <!-- ↑↑↑ 将 pageX.html 的 <body> 内所有内容粘贴于此 ↑↑↑ -->

    </div>
</section>
<!-- ▲▲▲ PAGEX HTML CONTENT END ▲▲▲ -->
```

---

##### **第二步：CSS 拆分与沙箱化 (关键步骤)**

创建 `css/pages/pageX.css` 文件。根据页面类型，二选一执行：

**情况A：对于复杂的、自带全屏布局的页面 (如 Page 8)**

这种页面已经自带布局，我们只需将其样式“关进”沙箱即可。

```css
/* css/pages/pageX.css - 用于复杂全屏页面 */

/* 1. 定义沙箱容器的基础属性 */
#pageX-container .pageX-wrapper {
    width: 100%;
    overflow: hidden;
    /* ... 定义页面背景色、字体等基础样式 ... */
}

/* 2. 将原始CSS中所有规则，全部加上沙箱前缀 */
#pageX-container .pageX-wrapper .original-class-name {
    /* ... 原始样式 ... */
}

/* 确保内部最顶层容器能撑满视口 */
#pageX-container .pageX-wrapper .page-container { /* 假设这是内部顶层容器 */
    height: 100vh;
    width: 100vw;
}

/* 3. 重要：@规则（如@keyframes、@media）必须放在沙箱外部，不能嵌套在选择器内 */
@keyframes fadeIn { 
    from { opacity: 0; transform: translateY(10px); } 
    to { opacity: 1; transform: translateY(0); } 
}

@keyframes slideInLeft { 
    from { opacity: 0; transform: translateX(-50px); } 
    to { opacity: 1; transform: translateX(0); } 
}
```

**情况B：对于简单的、需要居中布局的页面 (导致“塌缩”的页面)**

这是最重要的改变！我们必须在页面自己的CSS里，为它创建一个布局。

```css
/* css/pages/pageX.css - 用于简单居中页面 */

/* 1. 定义沙箱容器，并赋予其布局能力！*/
#pageX-container .pageX-wrapper {
    width: 100vw;
    height: 100vh; /* 必须撑满视口才能居中 */
    overflow: hidden;
    background-color: #FFFBF0; /* 或其他背景 */

    /* 在沙箱内部创建Flex居中布局 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px; /* 提供一些边距 */
    box-sizing: border-box;
}

/* 2. 定义内容版心 (可选，但推荐) */
#pageX-container .pageX-wrapper .content-wrapper {
    max-width: 1100px;
    width: 100%;
    text-align: center;
}


/* 3. 将原始CSS中所有样式，加上沙箱前缀 */
#pageX-container .pageX-wrapper h1 {
    /* ... 标题样式 ... */
}

#pageX-container .pageX-wrapper p {
    /* ... 段落样式 ... */
}
```
*对应的HTML结构可能是：*
```html
<div class="pageX-wrapper">
    <div class="content-wrapper">
        <h1>我是标题</h1>
        <p>我是内容...</p>
    </div>
</div>
```

---

##### **第三步：JavaScript 拆分 (保持不变)**

此方法依然是最佳实践，无需改动。所有JS逻辑都封装在 `DOMContentLoaded` 中，且所有DOM查询都从 `pageContainer` 开始。

---

##### **第四步：常见错误避免 (重要！)**

**❌ 错误做法：将@规则嵌套在选择器内**
```css
#pageX-container .pageX-wrapper {
    /* ... 其他样式 ... */
    
    @keyframes fadeIn { /* ❌ 错误！@规则不能嵌套 */
        from { opacity: 0; }
        to { opacity: 1; }
    }
}
```

**✅ 正确做法：@规则放在沙箱外部**
```css
#pageX-container .pageX-wrapper {
    /* ... 其他样式 ... */
}

/* @规则必须放在选择器外部 */
@keyframes fadeIn { 
    from { opacity: 0; transform: translateY(10px); } 
    to { opacity: 1; transform: translateY(0); } 
}
```

**其他常见错误：**
- ❌ 多余的闭合大括号 `}`
- ❌ 选择器未正确闭合
- ❌ 在沙箱内使用全局选择器（如 `body`、`html`）

**检查清单：**
1. 所有选择器都有对应的开闭大括号
2. 所有@规则都在选择器外部
3. 没有多余的大括号
4. 沙箱前缀正确添加到所有选择器

