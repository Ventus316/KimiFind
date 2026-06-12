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

    $('#role-badge').text(currentUser.role === 'admin' ? '超級管理員' : '一般用戶');
    if(currentUser.role === 'admin') $('#role-badge').addClass('bg-musubi text-white').removeClass('text-gray-600 bg-white');

    const $listContainer = $('#dashboard-list');
    const $tabBtns = $('.tab-btn');
    let currentTab = '遺失';

    renderDashboard();

    // 1. 切換標籤事件
    $tabBtns.on('click', function() {
        const $this = $(this);
        currentTab = $this.data('type');
        $tabBtns.removeClass('text-musubi border-b-2 border-musubi active').addClass('text-gray-400');
        $this.removeClass('text-gray-400').addClass('text-musubi border-b-2 border-musubi active');
        renderDashboard();
    });

    // 2. 核心渲染邏輯
    function renderDashboard() {
        $listContainer.empty();
        
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        let deletedPosts = JSON.parse(localStorage.getItem('kimiDeletedPosts')) || [];
        
        // 🌟 神級合併邏輯：支援編輯預設假資料
        let allItems = [];
        if (typeof mockItems !== 'undefined') {
            // 排除掉在 userReports 裡已經被修改過的 mockItem，以 userReports 的版本為主
            let filteredMock = mockItems.filter(m => !userReports.some(ur => ur.id === m.id));
            allItems = filteredMock.concat(userReports);
        } else {
            allItems = userReports;
        }

        // 徹底過濾掉被下架或刪除的貼文
        allItems = allItems.filter(item => !deletedPosts.includes(item.id));

        let myItems = [];
        let isBookmarkTab = (currentTab === '收藏');

        if (isBookmarkTab) {
            let interactions = JSON.parse(localStorage.getItem('kimiInteractions')) || {};
            let myInteractions = interactions[currentUser.email] || { bookmarks: [] };
            myItems = allItems.filter(item => myInteractions.bookmarks.includes(item.id));
        } else {
            // 📍 錯誤修正：從 allItems 抓資料，這樣假資料才會出現！
            myItems = allItems.filter(item => item.publisherEmail === currentUser.email && item.type === currentTab);
        }

        if (myItems.length === 0) {
            const emptyIcon = isBookmarkTab ? '⭐' : '🍃';
            const emptyMsg = isBookmarkTab ? '目前還沒有收藏任何物品喔，快去搜尋頁面逛逛吧！' : `目前沒有任何${currentTab}紀錄喔。`;
            $listContainer.html(`<div class="p-12 text-center text-gray-500"><div class="text-4xl mb-4">${emptyIcon}</div>${emptyMsg}</div>`);
            return;
        }

        myItems.reverse().forEach(item => {
            let statusBadge = isBookmarkTab 
                ? `<span class="${item.status === '尋找中' ? 'bg-red-100 text-musubi' : 'bg-green-100 text-green-700'} text-xs font-bold px-2 py-0.5 rounded cursor-default">${item.status}</span>`
                : `<span class="${item.status === '尋找中' ? 'bg-red-100 text-musubi' : 'bg-green-100 text-green-700'} text-xs font-bold px-2 py-0.5 rounded cursor-pointer toggle-status" data-id="${item.id}" title="點擊切換狀態">${item.status} ↺</span>`;

            let actionButtons = isBookmarkTab 
                ? `<a href="detail.html?id=${item.id}" class="text-gray-400 hover:text-twilight p-2 bg-white rounded-full hover:bg-gray-200 shadow-sm">👁️</a>
                   <button class="text-gray-400 hover:text-musubi p-2 bg-white rounded-full hover:bg-red-50 shadow-sm remove-bookmark-btn" data-id="${item.id}">💔</button>`
                : `<a href="detail.html?id=${item.id}" class="text-gray-400 hover:text-twilight p-2 bg-white rounded-full hover:bg-gray-200 shadow-sm">👁️</a>
                   <button class="text-gray-400 hover:text-twilight p-2 bg-white rounded-full hover:bg-gray-200 shadow-sm edit-btn" data-id="${item.id}">✏️</button>
                   <button class="text-gray-400 hover:text-musubi p-2 bg-white rounded-full hover:bg-red-50 shadow-sm delete-btn" data-id="${item.id}">🗑️</button>`;

            const cardHTML = `
                <div class="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-50 hover:bg-gray-50 transition gap-4">
                    <div class="flex items-center gap-6">
                        <div class="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                            <img src="${item.imageUrl || 'https://via.placeholder.com/150?text=No+Img'}" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">${statusBadge}<span class="text-xs text-gray-500">${item.date}</span></div>
                            <h3 class="text-lg font-bold text-gray-800">${item.name}</h3>
                            <p class="text-sm text-gray-500">${item.district} • ${item.category} | ${item.type}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">${actionButtons}</div>
                </div>`;
            $listContainer.append(cardHTML);
        });
    }

    // 3. 事件代理：切換狀態
    $listContainer.on('click', '.toggle-status', function() {
        const itemId = $(this).data('id');
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        const itemIndex = userReports.findIndex(i => i.id === itemId);
        
        if (itemIndex !== -1) {
            userReports[itemIndex].status = userReports[itemIndex].status === '尋找中' ? '已結案' : '尋找中';
        } else {
            // 若為假資料，複製一份存入 userReports 覆蓋它
            const mockItem = mockItems.find(i => i.id === itemId);
            if (mockItem) {
                let clonedItem = Object.assign({}, mockItem);
                clonedItem.status = clonedItem.status === '尋找中' ? '已結案' : '尋找中';
                userReports.push(clonedItem);
            }
        }
        localStorage.setItem('kimiReports', JSON.stringify(userReports));
        renderDashboard(); 
    });

    // 4. 事件代理：打開編輯 Modal
    $listContainer.on('click', '.edit-btn', function() {
        const itemId = $(this).data('id');
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        let item = userReports.find(i => i.id === itemId) || mockItems.find(i => i.id === itemId);
        
        if (item) {
            $('#edit-id').val(item.id);
            $('#edit-name').val(item.name);
            $('#edit-desc').val(item.description);
            $('#edit-modal').removeClass('hidden').addClass('flex');
            setTimeout(() => {
                $('#edit-modal').removeClass('opacity-0');
                $('#edit-modal-content').removeClass('scale-95').addClass('scale-100');
            }, 10);
        }
    });

    function closeModal() {
        $('#edit-modal').addClass('opacity-0');
        $('#edit-modal-content').removeClass('scale-100').addClass('scale-95');
        setTimeout(() => { $('#edit-modal').addClass('hidden').removeClass('flex'); }, 300);
    }
    $('#cancel-edit-btn').on('click', closeModal);

    // 儲存修改
    $('#save-edit-btn').on('click', function() {
        const itemId = $('#edit-id').val();
        const newName = $('#edit-name').val().trim();
        const newDesc = $('#edit-desc').val().trim();
        
        if (newName === '' || newDesc === '') { alert('名稱與描述不能為空！'); return; }

        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        const itemIndex = userReports.findIndex(i => i.id === itemId);
        
        if (itemIndex !== -1) {
            userReports[itemIndex].name = newName;
            userReports[itemIndex].description = newDesc;
        } else {
            const mockItem = mockItems.find(i => i.id === itemId);
            if (mockItem) {
                let clonedItem = Object.assign({}, mockItem);
                clonedItem.name = newName;
                clonedItem.description = newDesc;
                userReports.push(clonedItem);
            }
        }
        localStorage.setItem('kimiReports', JSON.stringify(userReports));
        closeModal();
        renderDashboard();
    });

    // 5. 事件代理：刪除紀錄
    $listContainer.on('click', '.delete-btn', function() {
        const itemId = $(this).data('id');
        if (confirm('確定要刪除這筆紀錄嗎？這段緣分將化為星塵消散喔。')) {
            let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
            userReports = userReports.filter(i => i.id !== itemId); 
            localStorage.setItem('kimiReports', JSON.stringify(userReports));

            // 將其加入黑名單，這樣假資料也會徹底消失
            let deletedPosts = JSON.parse(localStorage.getItem('kimiDeletedPosts')) || [];
            if (!deletedPosts.includes(itemId)) {
                deletedPosts.push(itemId);
                localStorage.setItem('kimiDeletedPosts', JSON.stringify(deletedPosts));
            }
            
            $(this).closest('.flex.flex-col').fadeOut(300, function() { renderDashboard(); });
        }
    });

    // 6. 事件代理：取消收藏
    $listContainer.on('click', '.remove-bookmark-btn', function() {
        const itemId = $(this).data('id');
        let interactions = JSON.parse(localStorage.getItem('kimiInteractions')) || {};
        if (interactions[currentUser.email]) {
            const index = interactions[currentUser.email].bookmarks.indexOf(itemId);
            if (index !== -1) {
                interactions[currentUser.email].bookmarks.splice(index, 1);
                localStorage.setItem('kimiInteractions', JSON.stringify(interactions));
                $(this).closest('.flex.flex-col').fadeOut(300, function() { renderDashboard(); });
            }
        }
    });
});