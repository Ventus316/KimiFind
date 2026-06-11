// js/search.js

$(document).ready(function() {
    // 檢查資料庫是否載入
    if (typeof mockItems === 'undefined') {
        console.error('找不到假資料庫 (mockItems)！');
        return;
    }

    // 取得 DOM 節點 (利用先前寫好的 HTML 結構特徵)
    const $searchInput = $('input[type="text"]');
    const $searchBtn = $('button:contains("搜尋")');
    const $filterPills = $('span.cursor-pointer');
    const $resultsContainer = $('#search-results');

    // 狀態變數：紀錄目前的搜尋條件
    let currentKeyword = '';
    let currentFilter = '全部地區';

    // 初始化：網頁剛載入時，渲染全部資料
    renderSearchResults(currentKeyword, currentFilter);

    // ==========================================
    // 事件監聽區
    // ==========================================

    // 1. 點擊「搜尋」按鈕
    $searchBtn.on('click', function() {
        currentKeyword = $searchInput.val().trim();
        renderSearchResults(currentKeyword, currentFilter);
    });

    // 2. 在搜尋框按下「Enter」鍵也能觸發
    $searchInput.on('keypress', function(e) {
        if (e.which === 13) { // 13 是 Enter 鍵的 KeyCode
            currentKeyword = $(this).val().trim();
            renderSearchResults(currentKeyword, currentFilter);
        }
    });

    // 3. 點擊「篩選標籤 (Pills)」
    $filterPills.on('click', function() {
        const clickedText = $(this).text().trim();
        currentFilter = clickedText;

        // 視覺回饋：切換 Tailwind 樣式 (結繩紅 / 灰底)
        $filterPills.removeClass('bg-musubi text-white shadow-sm').addClass('bg-gray-100 text-gray-600 hover:bg-gray-200');
        $(this).removeClass('bg-gray-100 text-gray-600 hover:bg-gray-200').addClass('bg-musubi text-white shadow-sm');

        // 觸發重新渲染
        renderSearchResults(currentKeyword, currentFilter);
    });

    // ==========================================
    // 核心渲染邏輯 (動態內容替換)
    // ==========================================

    function renderSearchResults(keyword, filter) {
        // 先將容器內容以淡出動畫隱藏，營造流暢切換感
        $resultsContainer.fadeOut(200, function() {
            
            // 動畫結束後，清空舊節點
            $(this).empty();

            // 執行資料篩選
            const filteredItems = mockItems.filter(function(item) {
                // 條件 A：關鍵字比對 (比對名稱或描述，若關鍵字為空則全過)
                const matchKeyword = keyword === '' || 
                                     item.name.includes(keyword) || 
                                     item.description.includes(keyword);
                
                // 條件 B：標籤比對 (比對行政區或類別)
                const matchFilter = filter === '全部地區' || 
                                    item.district === filter || 
                                    item.category === filter;

                return matchKeyword && matchFilter;
            });

            // 判斷是否有符合條件的資料
            if (filteredItems.length === 0) {
                // 找不到資料的防呆畫面
                const emptyHTML = `
                    <div class="col-span-1 md:col-span-3 lg:col-span-4 text-center py-16">
                        <div class="text-4xl mb-4">🌌</div>
                        <h3 class="text-xl font-bold text-twilight mb-2">這裡沒有星星的軌跡</h3>
                        <p class="text-gray-500">找不到符合條件的遺失物，換個關鍵字或標籤試試看吧！</p>
                    </div>
                `;
                $(this).append(emptyHTML);
            } else {
                // 遍歷篩選後的資料，產生新節點
                filteredItems.forEach(function(item) {
                    let statusColorClass = item.status === '尋找中' 
                        ? 'bg-white/90 text-twilight' 
                        : 'bg-green-100 text-green-700';

                    const cardHTML = `
                        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
                            <div class="h-48 bg-gray-200 relative overflow-hidden">
                                <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover">
                                
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
                    $(this).append(cardHTML);
                });
            }

            // 新節點附加完畢後，執行淡入動畫
            $(this).fadeIn(300);
        });
    }
});