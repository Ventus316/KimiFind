// js/dashboard.js

$(document).ready(function() {
    // 🛡️ 路由守衛
    const currentUserStr = localStorage.getItem('kimiUser');
    if (!currentUserStr) {
        alert('請先登入才能進入個人後台！');
        window.location.href = 'login.html';
        return;
    }
    const currentUser = JSON.parse(currentUserStr);

    const $listContainer = $('#dashboard-list');
    const $tabBtns = $('.tab-btn');
    let currentTab = '遺失'; // 預設顯示遺失物

    // 初始化渲染
    renderDashboard();

    // 1. 切換標籤事件
    $tabBtns.on('click', function() {
        const $this = $(this);
        currentTab = $this.data('type');

        // 切換樣式
        $tabBtns.removeClass('text-musubi border-b-2 border-musubi active').addClass('text-gray-400');
        $this.removeClass('text-gray-400').addClass('text-musubi border-b-2 border-musubi active');

        renderDashboard();
    });

    // 2. 核心渲染邏輯
    function renderDashboard() {
        $listContainer.empty();
        
        // 取得所有上報資料
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];

        if (currentTab === '收藏') {
            $listContainer.html(`
                <div class="p-12 text-center text-gray-500">
                    <div class="text-4xl mb-4">⭐</div>
                    收藏功能即將推出，敬請期待！
                </div>
            `);
            return;
        }

        // 篩選：只抓「目前登入者」且符合「當前 Tab (遺失/拾獲)」的資料
        const myItems = userReports.filter(item => 
            item.publisherEmail === currentUser.email && item.type === currentTab
        );

        if (myItems.length === 0) {
            $listContainer.html(`
                <div class="p-12 text-center text-gray-500">
                    <div class="text-4xl mb-4">🍃</div>
                    目前沒有任何${currentTab}紀錄喔。
                </div>
            `);
            return;
        }

        // 反轉陣列，讓最新發布的在最上面
        myItems.reverse().forEach(item => {
            let statusBadge = item.status === '尋找中' 
                ? `<span class="bg-red-100 text-musubi text-xs font-bold px-2 py-0.5 rounded cursor-pointer toggle-status" data-id="${item.id}" title="點擊切換狀態">尋找中 ↺</span>`
                : `<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded cursor-pointer toggle-status" data-id="${item.id}" title="點擊切換狀態">已結案 ↺</span>`;

            const cardHTML = `
                <div class="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-50 hover:bg-gray-50 transition gap-4">
                    <div class="flex items-center gap-6">
                        <div class="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                            <img src="https://via.placeholder.com/150?text=No+Img" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                ${statusBadge}
                                <span class="text-xs text-gray-500">${item.date}</span>
                            </div>
                            <h3 class="text-lg font-bold text-gray-800">${item.name}</h3>
                            <p class="text-sm text-gray-500">${item.district} • ${item.category}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 shrink-0">
                        <button class="text-gray-400 hover:text-twilight p-2 transition bg-white rounded-full hover:bg-gray-200 shadow-sm edit-btn" data-id="${item.id}" title="修改名稱">
                            ✏️
                        </button>
                        <button class="text-gray-400 hover:text-musubi p-2 transition bg-white rounded-full hover:bg-red-50 shadow-sm delete-btn" data-id="${item.id}" title="刪除紀錄">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
            $listContainer.append(cardHTML);
        });
    }

    // 3. 事件代理：切換狀態 (尋找中 ↔ 已結案)
    $listContainer.on('click', '.toggle-status', function() {
        const itemId = $(this).data('id');
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        
        const itemIndex = userReports.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            // 切換狀態
            userReports[itemIndex].status = userReports[itemIndex].status === '尋找中' ? '已結案' : '尋找中';
            localStorage.setItem('kimiReports', JSON.stringify(userReports));
            renderDashboard(); // 重新渲染畫面
        }
    });

    // 4. 事件代理：編輯名稱
    $listContainer.on('click', '.edit-btn', function() {
        const itemId = $(this).data('id');
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        
        const itemIndex = userReports.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            const newName = prompt('請輸入新的物品名稱：', userReports[itemIndex].name);
            if (newName && newName.trim() !== '') {
                userReports[itemIndex].name = newName.trim();
                localStorage.setItem('kimiReports', JSON.stringify(userReports));
                renderDashboard();
            }
        }
    });

    // 5. 事件代理：刪除紀錄
    $listContainer.on('click', '.delete-btn', function() {
        const itemId = $(this).data('id');
        
        if (confirm('確定要刪除這筆紀錄嗎？這段緣分將化為星塵消散喔。')) {
            let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
            userReports = userReports.filter(i => i.id !== itemId); // 過濾掉被刪除的項目
            localStorage.setItem('kimiReports', JSON.stringify(userReports));
            
            // 動畫刪除並重新渲染
            $(this).closest('.flex.flex-col').fadeOut(300, function() {
                renderDashboard();
            });
        }
    });
});