// js/detail.js

$(document).ready(function() {
    // ==========================================
    // 1. 解析網址參數並動態渲染物品資訊
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    // 合併全站資料庫與本地上報資料
    let allItems = [];
    if (typeof mockItems !== 'undefined') {
        const localReportsStr = localStorage.getItem('kimiReports');
        allItems = localReportsStr ? mockItems.concat(JSON.parse(localReportsStr)) : mockItems;
    }

    if (itemId && allItems.length > 0) {
        const currentItem = allItems.find(item => item.id === itemId);

        if (currentItem) {
            $('h1').text(currentItem.name);
            $('p.text-gray-500').html(`<span class="text-musubi">📍 ${currentItem.location || currentItem.district}</span> | ${currentItem.date}`);
            $('.prose p:first').text(currentItem.description);
            $('.prose p.text-sm').html(`發布者：${currentItem.publisherName || '系統預設'}<br>類別：${currentItem.category}<br>行政區：${currentItem.district}`);

            const $statusBadge = $('.absolute.top-4.left-4');
            $statusBadge.text(`${currentItem.type} | ${currentItem.status}`);
            if (currentItem.status === '已結案' || currentItem.status === '已歸還') {
                $statusBadge.removeClass('bg-musubi').addClass('bg-green-600');
            }

            const $imageContainer = $('#detail-image-container');
            const imgSrc = currentItem.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image';
            $imageContainer.prepend(`<img src="${imgSrc}" alt="${currentItem.name}" class="w-full h-full absolute inset-0 object-cover">`);
        }
    }

    // ==========================================
    // 2. 🌟 新增：點讚與收藏互動邏輯
    // ==========================================
    const currentUserStr = localStorage.getItem('kimiUser');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

    // 從 localStorage 讀取「所有使用者的互動紀錄字典」
    let interactions = JSON.parse(localStorage.getItem('kimiInteractions')) || {};
    
    // 如果此使用者是第一次互動，初始化他的空陣列
    if (currentUser && !interactions[currentUser.email]) {
        interactions[currentUser.email] = { likes: [], bookmarks: [] };
    }

    const $likeBtn = $('#like-btn');
    const $bookmarkBtn = $('#bookmark-btn');
    const $likeIcon = $likeBtn.find('svg');
    const $bookmarkIcon = $bookmarkBtn.find('svg');

    // 📍 初始化畫面：檢查當前登入者是否「已點過讚」或「已收藏」
    if (currentUser && interactions[currentUser.email]) {
        const myInteractions = interactions[currentUser.email];

        if (myInteractions.likes.includes(itemId)) {
            $likeBtn.addClass('text-musubi border-musubi bg-red-50').removeClass('text-gray-500 border-gray-200');
            $likeIcon.attr('fill', 'currentColor');
            $likeBtn.find('.like-text').text('已讚');
        }

        if (myInteractions.bookmarks.includes(itemId)) {
            $bookmarkBtn.addClass('text-twilight border-twilight bg-blue-50').removeClass('text-gray-500 border-gray-200');
            $bookmarkIcon.attr('fill', 'currentColor');
            $bookmarkBtn.find('.bookmark-text').text('已收藏');
        }
    }

    // 📍 點擊事件：點讚
    $likeBtn.on('click', function() {
        if (!currentUser) {
            alert('請先登入才能點擊愛心喔！');
            window.location.href = 'login.html';
            return;
        }

        const myInteractions = interactions[currentUser.email];
        const index = myInteractions.likes.indexOf(itemId);

        if (index === -1) {
            // 加入點讚 (加上實心與紅色樣式)
            myInteractions.likes.push(itemId);
            $(this).addClass('text-musubi border-musubi bg-red-50').removeClass('text-gray-500 border-gray-200');
            $likeIcon.attr('fill', 'currentColor');
            $(this).find('.like-text').text('已讚');
        } else {
            // 取消點讚 (恢復空心與灰色樣式)
            myInteractions.likes.splice(index, 1);
            $(this).removeClass('text-musubi border-musubi bg-red-50').addClass('text-gray-500 border-gray-200');
            $likeIcon.attr('fill', 'none');
            $(this).find('.like-text').text('點讚');
        }
        localStorage.setItem('kimiInteractions', JSON.stringify(interactions));
    });

    // 📍 點擊事件：收藏
    $bookmarkBtn.on('click', function() {
        if (!currentUser) {
            alert('請先登入才能將物品加入收藏喔！');
            window.location.href = 'login.html';
            return;
        }

        const myInteractions = interactions[currentUser.email];
        const index = myInteractions.bookmarks.indexOf(itemId);

        if (index === -1) {
            // 加入收藏 (加上實心與藍色樣式)
            myInteractions.bookmarks.push(itemId);
            $(this).addClass('text-twilight border-twilight bg-blue-50').removeClass('text-gray-500 border-gray-200');
            $bookmarkIcon.attr('fill', 'currentColor');
            $(this).find('.bookmark-text').text('已收藏');
        } else {
            // 取消收藏 (恢復空心與灰色樣式)
            myInteractions.bookmarks.splice(index, 1);
            $(this).removeClass('text-twilight border-twilight bg-blue-50').addClass('text-gray-500 border-gray-200');
            $bookmarkIcon.attr('fill', 'none');
            $(this).find('.bookmark-text').text('收藏');
        }
        localStorage.setItem('kimiInteractions', JSON.stringify(interactions));
    });

    // ==========================================
    // 3. 動態產生留言節點邏輯 (維持你原本的)
    // ==========================================
    const $commentInput = $('#comment-input');
    const $sendBtn = $commentInput.next('button'); 
    const $commentList = $('#comment-list');

    $sendBtn.on('click', function() {
        const commentText = $commentInput.val().trim();
        if (commentText === '') return;

        const userName = currentUser ? currentUser.name : '現世訪客';

        const newCommentHTML = `
            <div class="bg-white p-3 rounded-xl shadow-sm text-sm text-gray-700" style="display:none;">
                <span class="font-bold text-twilight">${userName}：</span> ${commentText}
            </div>
        `;
        const $newCommentNode = $(newCommentHTML);
        $commentList.prepend($newCommentNode);
        $newCommentNode.slideDown(300);
        $commentInput.val('');
    });

    $commentInput.on('keypress', function(e) {
        if (e.which === 13) { $sendBtn.click(); }
    });
});