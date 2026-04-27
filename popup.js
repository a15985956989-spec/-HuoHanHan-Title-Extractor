document.getElementById('crawl').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const statusDiv = document.getElementById('status');
  const resultDiv = document.getElementById('result');
  
  // 仅保留爬取的状态提示
  statusDiv.textContent = '正在爬取标题...';
  
  // 核心爬取逻辑（无修改）
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      var spans = document.querySelectorAll('span[title]');
      var titles = [];
      for (var i = 0; i < spans.length; i++) {
        var t = spans[i].getAttribute('title');
        if (t) {
          titles.push(t);
        }
      }
      return titles;
    }
  });

  const titles = results[0].result;
  
  // 爬取完成的状态和结果展示（无修改）
  if (titles.length === 0) {
    resultDiv.innerHTML = '<div class="count">未找到商品标题</div>';
    statusDiv.textContent = '已完成';
    return;
  }
  
  let html = `<div class="count">找到 ${titles.length} 个标题：</div>`;
  titles.forEach((t, i) => {
    html += `<div class="item">${i + 1}. ${t}</div>`;
  });
  
  resultDiv.innerHTML = html;
  statusDiv.textContent = '爬取完成！';
});