// js/main.js

$(document).ready(function() {
    // 檢查 mockItems 是否已從 data.js 成功載入
    if (typeof mockItems !== 'undefined') {
        renderLatestItems();
    } else {
        console.error('找不到假資料庫 (mockItems)！請確認 data.js 是否正確引入。');
    }

    // 函式：首頁動態渲染最新 3 筆遺失物
    function renderLatestItems() {
        // 1. 定位要塞入卡片的容器
        const container = $('#latest-items-container');
        
        // 2. 清空容器內原本的預設內容
        container.empty(); 

        // 3. 從陣列中取出前 3 筆資料作為「最新遺失物」
        const latestItems = mockItems.slice(0, 3);

        // 4. 遍歷資料，動態生成 HTML 節點
        latestItems.forEach(function(item) {
            
            // 判斷狀態，給予不同的 Tailwind 標籤顏色
            let statusColorClass = item.status === '尋找中' 
                ? 'bg-white/90 text-twilight' 
                : 'bg-green-100 text-green-700';

            // 組合 Tailwind 卡片 HTML 字串
            const cardHTML = `
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
                    <div class="h-48 bg-gray-200 relative overflow-hidden">
                        <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-xs font-bold">
                            ${item.imageUrl}
                        </div>
                        <div class="absolute top-3 right-3 ${statusColorClass} backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            ${item.status}
                        </div>
                    </div>
                    <div class="p-5">
                        <div class="text-xs text-musubi font-bold mb-1">${item.category} • ${item.district}</div>
                        <h3 class="text-lg font-bold text-gray-800 mb-2">${item.name}</h3>
                        <p class="text-sm text-gray-500 mb-4 line-clamp-2">${item.description}</p>
                        <a href="detail.html?id=${item.id}" class="block text-center w-full py-2 bg-gray-50 text-twilight font-bold rounded-lg hover:bg-gray-100 transition">
                            查看詳情
                        </a>
                    </div>
                </div>
            `;
            
            // 5. 將組合好的節點動態附加到畫面上
            container.append(cardHTML);
        });
    }
});