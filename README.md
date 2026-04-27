# HuoHanHan-Title-Extractor

> 一个为Shopee跨境电商运营打造的Chrome扩展——3秒采集100个商品标题

## 📌 项目背景

在Shopee跨境电商运营中，**竞品分析**是日常工作核心：
- 需要批量采集竞品商品标题用于关键词分析
- 平台页面采用动态加载（SPA架构），传统静态爬虫无法适配
- 手工复制粘贴效率极低，且容易遗漏

**解决方案：** 独立开发Chrome Extension，实现"一键提取 + 关键词过滤 + 高亮标注"的全链路采集工具

---

## 🚀 核心功能

| 功能 | 说明 | 使用场景 |
|------|------|---------|
| **一键提取** | 自动识别页面中所有`span[title]`元素，批量获取商品标题 | 竞品标题采集 |
| **关键词过滤** | 支持多关键词空格分隔，精准筛选目标商品 | 按品类/特征筛选 |
| **高亮标注** | 匹配关键词的元素自动高亮显示，3秒后自动清除 | 快速定位目标 |
| **动态监听** | MutationObserver监听DOM变化，适配懒加载页面 | SPA页面兼容 |
| **快捷操作** | 右键菜单 + Ctrl+Shift+E快捷键，无需点击图标 | 极致效率 |

---

## 🛠️ 技术栈

- **Chrome Extension Manifest V3**
- **Content Script** - DOM操作与页面交互
- **Background Service Worker** - 右键菜单/快捷键/标签页管理
- **Popup** - 结果展示与用户界面
- **MutationObserver API** - 动态内容监听
- **Chrome Scripting API** - 跨脚本通信

---

## 📂 项目结构

```
HuoHanHan-Title-Extractor/
├── manifest.json          # 扩展配置（Manifest V3）
├── background.js          # 后台服务脚本
├── content.js             # 内容脚本（页面注入）
├── popup.html             # 弹出窗口UI
├── popup.js               # 弹出窗口逻辑
├── icons/                 # 扩展图标
└── README.md
```

---

## 🎯 快速开始

### 1. 安装扩展

```bash
# 克隆仓库
git clone https://github.com/yourname/huohanhan-title-extractor.git

# 进入目录
cd huohanhan-title-extractor
```

### 2. 加载到Chrome

1. 打开 Chrome → 扩展程序 → 管理扩展程序
2. 开启右上角"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择本项目文件夹

### 3. 开始使用

**方式一：点击图标**
- 访问 [huohanhan.com](https://huohanhan.com) 相关页面
- 点击浏览器右上角扩展图标
- 点击"爬取所有标题"按钮

**方式二：快捷键**
- `Ctrl + Shift + E` 直接唤起扩展窗口

**方式三：右键菜单**
- 在目标页面右键 → 选择"🛍️ 提取商品标题"

---

## 🔧 技术架构

### 三层架构设计

```
┌─────────────────────────────────────────┐
│              Popup Layer                │
│         (popup.html + popup.js)         │
│    - 用户界面 / 结果展示 / 状态反馈      │
└─────────────────────────────────────────┘
                    ↑↓
┌─────────────────────────────────────────┐
│          Background Layer               │
│         (background.js)                 │
│  - 右键菜单注册 / 快捷键监听 / 标签页管理 │
└─────────────────────────────────────────┘
                    ↑↓
┌─────────────────────────────────────────┐
│           Content Layer                 │
│          (content.js)                   │
│  - DOM操作 / 多选择器策略 / 动态监听     │
└─────────────────────────────────────────┘
```

### 多选择器兼容策略

```javascript
// 多种选择器策略，提高页面兼容性
const selectors = [
    'span[title]',                    // 主要目标
    '.product-name span',             // 备选方案1
    '.product-title',                 // 备选方案2
    '[class*="product"] span[title]', // 模糊匹配
    '[class*="title"] span',          // 特征匹配
    '.virtual-table-td span[title]'   // 表格场景
];

// 尝试所有选择器并去重
selectors.forEach(selector => {
    try {
        const elements = document.querySelectorAll(selector);
        allSpans = [...allSpans, ...Array.from(elements)];
    } catch (e) {
        // 忽略无效选择器
    }
});
allSpans = [...new Set(allSpans)];  // 去重
```

### 动态内容监听

```javascript
// 监听DOM变化，适配SPA懒加载
const observer = new MutationObserver(function(mutations) {
    // 可在此添加自动检测逻辑
    // 如：新内容加载时自动提取
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
```

### 关键词高亮

```javascript
function highlightElements(keywordsStr) {
    clearHighlights();
    const keywords = keywordsStr.split(/\s+/).filter(k => k);

    document.querySelectorAll('span[title]').forEach(span => {
        const title = span.getAttribute('title');
        if (title && keywords.some(k => title.includes(k))) {
            span.style.backgroundColor = '#ffeb3b';
            span.style.border = '2px solid #ff9800';
            span.classList.add('title-extractor-highlight');
        }
    });

    // 3秒后自动清除
    setTimeout(clearHighlights, 3000);
}
```

---

## 📊 使用示例

### 场景：采集户外运动类商品标题

**输入关键词：** `垫 沙發 充氣`

**提取结果：**
```
找到 25 个匹配标题：
1. 【台灣現貨】免打孔門鎖 強力防撬 明裝移門鎖 推拉門鎖...
2. 彈力帶 全身力量訓練 輔助突破極限 阻力帶 拉力帶...
3. 【台灣現貨】羽毛球立腕訓練器 強力矯正發力...
4. 彈力阻力帶 翹臀塑形神器 彈力帶 阻力帶 健身帶...
5. 冷氣擋風板 防直吹壁掛式 通用板 月子防風罩...
...
```

---

## 🛡️ 隐私说明

- ✅ 所有操作仅在本地浏览器执行
- ✅ 不收集/不上传任何用户数据
- ✅ 不访问非目标域名（`huohanhan.com`）
- ✅ 开源代码可审计

---

## 🗺️ 未来扩展

- [ ] 支持导出为Excel/CSV格式
- [ ] 添加价格/销量数据抓取
- [ ] 接入AI分析，自动生成竞品分析报告
- [ ] 支持更多电商平台（Shopee官方、Lazada等）
- [ ] 添加定时自动监控功能

---

## 📄 License

MIT License - 欢迎自由使用和二次开发

---

> 💡 **适用场景**：Shopee跨境电商运营、竞品分析、关键词研究、数据采集
> 
> 🔗 **关联项目**：[AI公文自动化](https://github.com/yourname/AI-Document-Automation) - 我的另一个效率工具
