// js/search.js

$(document).ready(function() {
    if (typeof mockItems === 'undefined') return;

    // 1. 合併資料並過濾黑名單
    const localReportsStr = localStorage.getItem('kimiReports');
    let allItems = localReportsStr ? mockItems.concat(JSON.parse(localReportsStr)) : mockItems;
    
    let deletedPosts = JSON.parse(localStorage.getItem('kimiDeletedPosts')) || [];
    allItems = allItems.filter(item => !deletedPosts.includes(item.id));

    // 2. 🌟 動態渲染地區與分類標籤
    const categories = JSON.parse(localStorage.getItem('kimiCategories')) || ['飾品', '書籍', '電子產品', '文具'];
    const districts = ['桃園區', '中壢區', '八德區', '龜山區', '蘆竹區'];
    const $catGroup = $('.filter-group[data-group="category"]');
    
    $catGroup.empty();
    $catGroup.append(`<span class="filter-pill px-4 py-1.5 bg-musubi text-white text-sm rounded-full cursor-pointer shadow-sm active" data-val="全部">全部地區/分類</span>`);
    districts.forEach(dist => {
        $catGroup.append(`<span class="filter-pill px-4 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm rounded-full cursor-pointer transition" data-val="${dist}">${dist}</span>`);
    });
    categories.forEach(cat => {
        $catGroup.append(`<span class="filter-pill px-4 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm rounded-full cursor-pointer transition" data-val="${cat}">${cat}</span>`);
    });

    const $searchInput = $('input[type="text"]');
    const $searchBtn = $('button:contains("搜尋")');
    const $resultsContainer = $('#search-results');

    let filters = { keyword: '', typeStatus: '全部', category: '全部' };

    renderSearchResults();

    $('.filter-group').on('click', '.filter-pill', function() {
        const $this = $(this);
        const group = $this.closest('.filter-group').data('group');
        const val = $this.data('val');

        $this.siblings().removeClass('bg-musubi text-white shadow-sm active').addClass('bg-gray-100 text-gray-600');
        $this.removeClass('bg-gray-100 text-gray-600').addClass('bg-musubi text-white shadow-sm active');

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