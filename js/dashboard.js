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

    // 更新左上角的身分標籤
    $('#role-badge').text(currentUser.role === 'admin' ? '超級管理員' : '一般用戶');
    if(currentUser.role === 'admin') $('#role-badge').addClass('bg-musubi text-white').removeClass('text-gray-600 bg-white');

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
        
        // 取得使用者自己上報的資料
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        
        // 取得全站資料（將預設假資料與上報資料合併），用來比對收藏清單
        let allItems = [];
        if (typeof mockItems !== 'undefined') {
            allItems = mockItems.concat(userReports);
        } else {
            allItems = userReports;
        }

        let myItems = [];
        let isBookmarkTab = (currentTab === '收藏');

        if (isBookmarkTab) {
            // 📍 撈取收藏清單的邏輯
            let interactions = JSON.parse(localStorage.getItem('kimiInteractions')) || {};
            let myInteractions = interactions[currentUser.email] || { bookmarks: [] };
            let bookmarkedIds = myInteractions.bookmarks;
            
            // 過濾出被收藏的物品
            myItems = allItems.filter(item => bookmarkedIds.includes(item.id));
        } else {
            // 📍 撈取發布紀錄的邏輯
            myItems = userReports.filter(item => item.publisherEmail === currentUser.email && item.type === currentTab);
        }

        // 判斷是否為空
        if (myItems.length === 0) {
            const emptyIcon = isBookmarkTab ? '⭐' : '🍃';
            const emptyMsg = isBookmarkTab ? '目前還沒有收藏任何物品喔，快去搜尋頁面逛逛吧！' : `目前沒有任何${currentTab}紀錄喔。`;
            
            $listContainer.html(`
                <div class="p-12 text-center text-gray-500">
                    <div class="text-4xl mb-4">${emptyIcon}</div>
                    ${emptyMsg}
                </div>
            `);
            return;
        }

        // 反轉陣列，渲染卡片
        myItems.reverse().forEach(item => {
            
            // 根據是否為收藏頁面，動態決定狀態標籤能不能點擊切換
            let statusBadge = '';
            if (isBookmarkTab) {
                statusBadge = item.status === '尋找中' 
                    ? `<span class="bg-red-100 text-musubi text-xs font-bold px-2 py-0.5 rounded cursor-default">尋找中</span>`
                    : `<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded cursor-default">已結案</span>`;
            } else {
                statusBadge = item.status === '尋找中' 
                    ? `<span class="bg-red-100 text-musubi text-xs font-bold px-2 py-0.5 rounded cursor-pointer toggle-status" data-id="${item.id}" title="點擊切換狀態">尋找中 ↺</span>`
                    : `<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded cursor-pointer toggle-status" data-id="${item.id}" title="點擊切換狀態">已結案 ↺</span>`;
            }

            // 根據是否為收藏頁面，動態產生右側的操作按鈕
            let actionButtons = '';
            if (isBookmarkTab) {
                actionButtons = `
                    <a href="detail.html?id=${item.id}" class="text-gray-400 hover:text-twilight p-2 transition bg-white rounded-full hover:bg-gray-200 shadow-sm" title="查看詳情">
                        👁️
                    </a>
                    <button class="text-gray-400 hover:text-musubi p-2 transition bg-white rounded-full hover:bg-red-50 shadow-sm remove-bookmark-btn" data-id="${item.id}" title="取消收藏">
                        💔
                    </button>
                `;
            } else {
                actionButtons = `
                    <button class="text-gray-400 hover:text-twilight p-2 transition bg-white rounded-full hover:bg-gray-200 shadow-sm edit-btn" data-id="${item.id}" title="修改名稱">
                        ✏️
                    </button>
                    <button class="text-gray-400 hover:text-musubi p-2 transition bg-white rounded-full hover:bg-red-50 shadow-sm delete-btn" data-id="${item.id}" title="刪除紀錄">
                        🗑️
                    </button>
                `;
            }

            const cardHTML = `
                <div class="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-50 hover:bg-gray-50 transition gap-4">
                    <div class="flex items-center gap-6">
                        <div class="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                            <img src="${item.imageUrl || 'https://via.placeholder.com/150?text=No+Img'}" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                ${statusBadge}
                                <span class="text-xs text-gray-500">${item.date}</span>
                            </div>
                            <h3 class="text-lg font-bold text-gray-800">${item.name}</h3>
                            <p class="text-sm text-gray-500">${item.district} • ${item.category} | ${item.type}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 shrink-0">
                        ${actionButtons}
                    </div>
                </div>
            `;
            $listContainer.append(cardHTML);
        });
    }

    // 3. 事件代理：切換狀態 (發布紀錄專用)
    $listContainer.on('click', '.toggle-status', function() {
        const itemId = $(this).data('id');
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        
        const itemIndex = userReports.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            userReports[itemIndex].status = userReports[itemIndex].status === '尋找中' ? '已結案' : '尋找中';
            localStorage.setItem('kimiReports', JSON.stringify(userReports));
            renderDashboard(); 
        }
    });

    // 4. 事件代理：編輯名稱 (發布紀錄專用)
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

    // 5. 事件代理：刪除紀錄 (發布紀錄專用)
    $listContainer.on('click', '.delete-btn', function() {
        const itemId = $(this).data('id');
        
        if (confirm('確定要刪除這筆紀錄嗎？這段緣分將化為星塵消散喔。')) {
            let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
            userReports = userReports.filter(i => i.id !== itemId); 
            localStorage.setItem('kimiReports', JSON.stringify(userReports));
            
            $(this).closest('.flex.flex-col').fadeOut(300, function() {
                renderDashboard();
            });
        }
    });

    // 🌟 6. 新增事件代理：取消收藏 (收藏專用)
    $listContainer.on('click', '.remove-bookmark-btn', function() {
        const itemId = $(this).data('id');
        let interactions = JSON.parse(localStorage.getItem('kimiInteractions')) || {};
        
        if (interactions[currentUser.email]) {
            const index = interactions[currentUser.email].bookmarks.indexOf(itemId);
            if (index !== -1) {
                // 從陣列中移除該 ID
                interactions[currentUser.email].bookmarks.splice(index, 1);
                localStorage.setItem('kimiInteractions', JSON.stringify(interactions));
                
                // 動畫移除該卡片並重新渲染
                $(this).closest('.flex.flex-col').fadeOut(300, function() {
                    renderDashboard(); 
                });
            }
        }
    });
});