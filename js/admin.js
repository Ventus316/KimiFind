// js/admin.js

$(document).ready(function() {
    // ==========================================
    // 0. 🛡️ 路由守衛 (非常重要)
    // ==========================================
    const currentUserStr = localStorage.getItem('kimiUser');
    if (!currentUserStr) {
        alert('請先登入！');
        window.location.href = 'login.html';
        return;
    }
    const currentUser = JSON.parse(currentUserStr);
    if (currentUser.role !== 'admin') {
        alert('權限不足！只有管理員能進入此區域。');
        window.location.href = 'dashboard.html';
        return;
    }

    // ==========================================
    // 1. 系統假資料初始化 (模擬後端資料庫)
    // ==========================================
    
    // 建立假用戶名單
    if (!localStorage.getItem('kimiAllUsers')) {
        const defaultUsers = [
            { email: 'admin@kimi.com', name: '超級管理員', role: 'admin' },
            { email: 'user@kimi.com', name: '一般探索者', role: 'user' },
            { email: 'stranger@kimi.com', name: '路人甲', role: 'user' }
        ];
        localStorage.setItem('kimiAllUsers', JSON.stringify(defaultUsers));
    }

    // 建立預設分類
    if (!localStorage.getItem('kimiCategories')) {
        localStorage.setItem('kimiCategories', JSON.stringify(['飾品', '書籍', '電子產品', '文具']));
    }

    // ==========================================
    // 2. 切換 Tab 邏輯
    // ==========================================
    $('.admin-tab').on('click', function() {
        // UI 狀態切換
        $('.admin-tab').removeClass('text-musubi border-musubi active').addClass('text-gray-400 border-transparent');
        $(this).addClass('text-musubi border-musubi active').removeClass('text-gray-400 border-transparent');
        
        // 內容區塊切換
        $('.admin-section').hide();
        $(`#${$(this).data('target')}`).fadeIn(200);
    });

    // 初始化渲染三個區塊
    renderPosts();
    renderUsers();
    renderCategories();

    // ==========================================
    // 3. 貼文管理邏輯
    // ==========================================
    function renderPosts() {
        const $tbody = $('#admin-posts-tbody');
        $tbody.empty();

        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        // 管理員下架的黑名單 ID 紀錄
        let deletedPosts = JSON.parse(localStorage.getItem('kimiDeletedPosts')) || []; 
        
        let allItems = typeof mockItems !== 'undefined' ? mockItems.concat(userReports) : userReports;

        // 過濾掉被下架的貼文
        let visibleItems = allItems.filter(item => !deletedPosts.includes(item.id));

        visibleItems.forEach(item => {
            const statusColor = item.status === '尋找中' ? 'bg-red-100 text-musubi' : 'bg-green-100 text-green-700';
            const trHTML = `
                <tr class="border-b border-gray-50 hover:bg-gray-50">
                    <td class="p-4 text-gray-500 font-mono text-xs">${item.id}</td>
                    <td class="p-4 font-bold text-twilight">${item.name}</td>
                    <td class="p-4">${item.publisherEmail}</td>
                    <td class="p-4"><span class="${statusColor} px-2 py-1 rounded text-xs font-bold">${item.type} | ${item.status}</span></td>
                    <td class="p-4 text-right">
                        <button class="text-red-500 hover:text-white font-bold text-xs bg-red-50 hover:bg-red-500 transition px-3 py-1 rounded-lg takedown-btn" data-id="${item.id}">強制下架</button>
                    </td>
                </tr>
            `;
            $tbody.append(trHTML);
        });
    }

    // 點擊強制下架
    $('#admin-posts-tbody').on('click', '.takedown-btn', function() {
        if(confirm('確定要強制下架這篇貼文嗎？這項操作無法復原。')) {
            const itemId = $(this).data('id');
            let deletedPosts = JSON.parse(localStorage.getItem('kimiDeletedPosts')) || [];
            deletedPosts.push(itemId);
            localStorage.setItem('kimiDeletedPosts', JSON.stringify(deletedPosts));
            
            $(this).closest('tr').fadeOut(300, function() {
                renderPosts();
            });
        }
    });

    // ==========================================
    // 4. 用戶管理邏輯
    // ==========================================
    function renderUsers() {
        const $tbody = $('#admin-users-tbody');
        $tbody.empty();
        
        let allUsers = JSON.parse(localStorage.getItem('kimiAllUsers')) || [];

        allUsers.forEach(user => {
            const isMe = user.email === currentUser.email;
            const roleText = user.role === 'admin' ? '<span class="text-musubi font-bold">管理員</span>' : '<span class="text-gray-500">一般用戶</span>';
            const actionText = user.role === 'admin' ? '降為一般用戶' : '升級管理員';
            const btnColor = user.role === 'admin' ? 'text-gray-500 bg-gray-100 hover:bg-gray-200' : 'text-twilight bg-blue-50 hover:bg-blue-100';

            const trHTML = `
                <tr class="border-b border-gray-50 hover:bg-gray-50">
                    <td class="p-4 text-gray-500">${user.email} ${isMe ? '<span class="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">我自己</span>' : ''}</td>
                    <td class="p-4 font-bold text-gray-800">${user.name}</td>
                    <td class="p-4">${roleText}</td>
                    <td class="p-4 text-right">
                        <button class="${btnColor} font-bold text-xs transition px-3 py-1 rounded-lg change-role-btn" data-email="${user.email}" ${isMe ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>${actionText}</button>
                    </td>
                </tr>
            `;
            $tbody.append(trHTML);
        });
    }

    // 更改權限
    $('#admin-users-tbody').on('click', '.change-role-btn', function() {
        const targetEmail = $(this).data('email');
        let allUsers = JSON.parse(localStorage.getItem('kimiAllUsers'));
        const userIndex = allUsers.findIndex(u => u.email === targetEmail);
        
        if (userIndex !== -1) {
            allUsers[userIndex].role = allUsers[userIndex].role === 'admin' ? 'user' : 'admin';
            localStorage.setItem('kimiAllUsers', JSON.stringify(allUsers));
            renderUsers();
        }
    });

    // ==========================================
    // 5. 類別管理邏輯
    // ==========================================
    function renderCategories() {
        const $list = $('#admin-categories-list');
        $list.empty();

        let categories = JSON.parse(localStorage.getItem('kimiCategories')) || [];

        categories.forEach(cat => {
            const tagHTML = `
                <span class="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-2 shadow-sm">
                    ${cat}
                    <button class="text-gray-400 hover:text-red-500 font-bold delete-cat-btn" data-cat="${cat}">×</button>
                </span>
            `;
            $list.append(tagHTML);
        });
    }

    // 新增類別
    $('#add-category-btn').on('click', function() {
        const newCat = $('#new-category-input').val().trim();
        if (newCat === '') return;

        let categories = JSON.parse(localStorage.getItem('kimiCategories')) || [];
        if (categories.includes(newCat)) {
            alert('這個類別已經存在囉！');
            return;
        }

        categories.push(newCat);
        localStorage.setItem('kimiCategories', JSON.stringify(categories));
        $('#new-category-input').val('');
        renderCategories();
    });

    // 刪除類別
    $('#admin-categories-list').on('click', '.delete-cat-btn', function() {
        const catToDelete = $(this).data('cat');
        let categories = JSON.parse(localStorage.getItem('kimiCategories')) || [];
        categories = categories.filter(c => c !== catToDelete);
        localStorage.setItem('kimiCategories', JSON.stringify(categories));
        renderCategories();
    });

});