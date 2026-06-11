// js/search.js

$(document).ready(function() {
    if (typeof mockItems === 'undefined') {
        console.error('找不到假資料庫 (mockItems)！');
        return;
    }

    // 將 localStorage 中的使用者新增資料合併進 mockItems
    const localReportsStr = localStorage.getItem('kimiReports');
    const allItems = localReportsStr ? mockItems.concat(JSON.parse(localReportsStr)) : mockItems;

    const $searchInput = $('input[type="text"]');
    const $searchBtn = $('button:contains("搜尋")');
    const $resultsContainer = $('#search-results');

    // 狀態變數：紀錄多維度的搜尋條件
    let filters = {
        keyword: '',
        typeStatus: '全部',
        category: '全部'
    };

    renderSearchResults();

    // 1. 搜尋框事件
    $searchBtn.on('click', function() {
        filters.keyword = $searchInput.val().trim();
        renderSearchResults();
    });
    $searchInput.on('keypress', function(e) {
        if (e.which === 13) {
            filters.keyword = $(this).val().trim();
            renderSearchResults();
        }
    });

    // 2. 點擊篩選標籤事件 (支援多群組獨立切換)
    $('.filter-pill').on('click', function() {
        const $this = $(this);
        const group = $this.closest('.filter-group').data('group');
        const val = $this.data('val');

        // 更新該群組的 UI 樣式
        $this.siblings().removeClass('bg-musubi text-white shadow-sm active').addClass('bg-gray-100 text-gray-600');
        $this.removeClass('bg-gray-100 text-gray-600').addClass('bg-musubi text-white shadow-sm active');

        // 更新篩選條件
        if (group === 'type-status') filters.typeStatus = val;
        if (group === 'category') filters.category = val;

        renderSearchResults();
    });

    // 3. 核心渲染與過濾邏輯
    function renderSearchResults() {
        $resultsContainer.fadeOut(200, function() {
            const $container = $(this);
            $container.empty();

            // 執行多條件交叉比對
            const filteredItems = allItems.filter(function(item) {
                // 檢查關鍵字
                const matchKeyword = filters.keyword === '' || 
                                     item.name.includes(filters.keyword) || 
                                     item.description.includes(filters.keyword);
                
                // 檢查類型或狀態
                const matchTypeStatus = filters.typeStatus === '全部' || 
                                        item.type === filters.typeStatus || 
                                        item.status === filters.typeStatus;

                // 檢查地區或分類
                const matchCategory = filters.category === '全部' || 
                                      item.district === filters.category || 
                                      item.category === filters.category;

                return matchKeyword && matchTypeStatus && matchCategory;
            });

            if (filteredItems.length === 0) {
                $container.append(`
                    <div class="col-span-1 md:col-span-3 lg:col-span-4 text-center py-16">
                        <div class="text-4xl mb-4">🌌</div>
                        <h3 class="text-xl font-bold text-twilight mb-2">這裡沒有星星的軌跡</h3>
                        <p class="text-gray-500">找不到符合條件的遺失物，換個關鍵字或標籤試試看吧！</p>
                    </div>
                `);
            } else {
                // 將資料反轉，讓最新的（如 localStorage 剛新增的）排在最前面
                filteredItems.reverse().forEach(function(item) {
                    
                    // 動態決定標籤顏色：尋找中用紅色系，已結案用綠色系
                    let statusColorClass = item.status === '尋找中' 
                            ? 'bg-musubi text-white' 
                            : 'bg-green-600 text-white';

                    // 結合「遺失/拾獲」與「狀態」顯示在卡片右上角
                    const badgeText = `${item.type} | ${item.status}`;

                    const cardHTML = `
                        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col">
                            <div class="h-48 bg-gray-200 relative overflow-hidden">
                                <img src="${item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${item.name}" class="w-full h-full object-cover">
                                
                                <div class="absolute top-3 right-3 ${statusColorClass} backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    ${badgeText}
                                </div>
                            </div>
                            <div class="p-5 flex-1 flex flex-col">
                                <div class="text-xs text-musubi font-bold mb-1">${item.category} • ${item.district}</div>
                                <h3 class="text-lg font-bold text-gray-800 mb-2">${item.name}</h3>
                                <p class="text-sm text-gray-500 mb-4 line-clamp-2">${item.description}</p>
                                <div class="mt-auto pt-4 border-t border-gray-50">
                                    <a href="detail.html?id=${item.id}" class="block text-center w-full py-2 bg-gray-50 text-twilight font-bold rounded-lg hover:bg-gray-100 transition">
                                        查看詳情
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
                    $container.append(cardHTML);
                });
            }
            $container.fadeIn(300);
        });
    }
});