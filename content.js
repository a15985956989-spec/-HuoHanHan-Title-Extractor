content_js = '''// 货憨憨商品标题提取器 - 内容脚本
// 在页面加载完成后自动检测并高亮可提取的元素

(function() {
    'use strict';
    
    // 标记已初始化
    if (window.titleExtractorInitialized) return;
    window.titleExtractorInitialized = true;
    
    console.log('[货憨憨提取器] 内容脚本已加载');
    
    // 监听来自popup的消息
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'extract') {
            const result = extractTitles(request.keywords);
            sendResponse(result);
        } else if (request.action === 'highlight') {
            highlightElements(request.keywords);
            sendResponse({ success: true });
        } else if (request.action === 'clearHighlight') {
            clearHighlights();
            sendResponse({ success: true });
        }
        return true;
    });
    
    // 提取标题的核心函数
    function extractTitles(keywordsStr) {
        const keywords = keywordsStr ? keywordsStr.split(/\\s+/).filter(k => k) : [];
        
        // 多种选择器策略，提高兼容性
        const selectors = [
            'span[title]',
            '.product-name span',
            '.product-title',
            '[class*="product"] span[title]',
            '[class*="title"] span',
            '.virtual-table-td span[title]'
        ];
        
        let allSpans = [];
        
        // 尝试所有选择器
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                allSpans = [...allSpans, ...Array.from(elements)];
            } catch (e) {
                // 忽略无效选择器
            }
        });
        
        // 去重
        allSpans = [...new Set(allSpans)];
        
        const allTitles = [];
        const matchedTitles = [];
        
        allSpans.forEach(span => {
            // 优先使用title属性，其次使用textContent
            let title = span.getAttribute('title');
            if (!title || !title.trim()) {
                title = span.textContent;
            }
            
            if (title && title.trim()) {
                title = title.trim();
                allTitles.push(title);
                
                // 关键词过滤
                if (keywords.length === 0) {
                    matchedTitles.push(title);
                } else {
                    const hasKeyword = keywords.some(keyword => 
                        title.toLowerCase().includes(keyword.toLowerCase())
                    );
                    if (hasKeyword) {
                        matchedTitles.push(title);
                    }
                }
            }
        });
        
        // 去重并返回
        return {
            total: [...new Set(allTitles)].length,
            matched: [...new Set(matchedTitles)],
            all: [...new Set(allTitles)]
        };
    }
    
    // 高亮匹配的元素
    function highlightElements(keywordsStr) {
        clearHighlights();
        
        const keywords = keywordsStr ? keywordsStr.split(/\\s+/).filter(k => k) : [];
        if (keywords.length === 0) return;
        
        const spans = document.querySelectorAll('span[title]');
        
        spans.forEach(span => {
            const title = span.getAttribute('title');
            if (title) {
                const hasKeyword = keywords.some(keyword => 
                    title.includes(keyword)
                );
                
                if (hasKeyword) {
                    span.style.backgroundColor = '#ffeb3b';
                    span.style.border = '2px solid #ff9800';
                    span.style.borderRadius = '4px';
                    span.style.padding = '2px 4px';
                    span.style.transition = 'all 0.3s';
                    span.classList.add('title-extractor-highlight');
                }
            }
        });
        
        // 3秒后自动清除高亮
        setTimeout(clearHighlights, 3000);
    }
    
    // 清除高亮
    function clearHighlights() {
        const highlighted = document.querySelectorAll('.title-extractor-highlight');
        highlighted.forEach(el => {
            el.style.backgroundColor = '';
            el.style.border = '';
            el.style.borderRadius = '';
            el.style.padding = '';
            el.style.transition = '';
            el.classList.remove('title-extractor-highlight');
        });
    }
    
    // 添加快捷键支持 (Ctrl+Shift+E 提取)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            chrome.runtime.sendMessage({ action: 'openPopup' });
        }
    });
    
    // 自动检测页面变化（针对动态加载的内容）
    const observer = new MutationObserver(function(mutations) {
        // 可以在这里添加自动检测逻辑
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();'''

with open('/mnt/kimi/output/content.js', 'w', encoding='utf-8') as f:
    f.write(content_js)
    
print("✓ content.js 已创建")
