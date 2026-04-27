background_js = '''// 货憨憨商品标题提取器 - 后台服务脚本

chrome.runtime.onInstalled.addListener(() => {
    console.log('[货憨憨提取器] 扩展已安装/更新');
    
    // 设置默认关键词
    chrome.storage.local.set({
        keywords: '垫 沙發 充氣'
    });
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openPopup') {
        // 打开弹出窗口
        chrome.action.openPopup();
    }
    return true;
});

// 监听标签页更新，注入内容脚本
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('huohanhan.com')) {
        // 页面加载完成，可以在这里执行初始化操作
        console.log('[货憨憨提取器] 检测到目标页面:', tab.url);
    }
});

// 添加上下文菜单（右键菜单）
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'extractTitles',
        title: '🛍️ 提取商品标题',
        contexts: ['page'],
        documentUrlPatterns: ['https://huohanhan.com/*', 'https://*.huohanhan.com/*']
    });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'extractTitles') {
        chrome.action.openPopup();
    }
});'''

with open('/mnt/kimi/output/background.js', 'w', encoding='utf-8') as f:
    f.write(background_js)
    
print("✓ background.js 已创建")
