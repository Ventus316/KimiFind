// js/detail.js

$(document).ready(function() {
    // ==========================================
    // 1. 解析網址參數並動態渲染物品資訊
    // ==========================================
    
    // 取得網址列中的 id 參數 (例如: detail.html?id=item_002)
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    // 如果網址有帶 id，且假資料庫存在
    if (itemId && typeof mockItems !== 'undefined') {
        // 從陣列中尋找符合該 id 的物品
        const currentItem = mockItems.find(item => item.id === itemId);

        if (currentItem) {
            // 動態替換畫面上的文字與狀態
            $('h1').text(currentItem.name);
            $('.text-musubi:contains("📍")').text(`📍 ${currentItem.location}`);
            
            // 替換日期與描述
            const dateStr = currentItem.date;
            $('p.text-gray-500').html(`<span class="text-musubi">📍 ${currentItem.location}</span> | ${dateStr}`);
            $('.prose p:first').text(currentItem.description);
            $('.prose p.text-sm').html(`類別：${currentItem.category}<br>行政區：${currentItem.district}`);

            // 替換左上角狀態標籤
            const $statusBadge = $('.absolute.top-4.left-4');
            $statusBadge.text(currentItem.status);
            if (currentItem.status === '已尋獲' || currentItem.status === '已歸還') {
                $statusBadge.removeClass('bg-musubi').addClass('bg-green-500');
            }

            // 替換左側大圖片為真實圖檔
            const $imageContainer = $('#detail-image-container');
            // 使用 prepend 確保圖片被安插在「狀態標籤」的下方，才不會蓋住標籤
            $imageContainer.prepend(`
                <img src="${currentItem.imageUrl}" alt="${currentItem.name}" class="w-full h-full absolute inset-0 object-cover">
            `);
        }
    }

    // ==========================================
    // 2. 動態產生留言節點邏輯 (維持不變)
    // ==========================================
    const $commentInput = $('#comment-input');
    const $sendBtn = $commentInput.next('button'); 
    const $commentList = $('#comment-list');

    $sendBtn.on('click', function() {
        const commentText = $commentInput.val().trim();

        if (commentText === '') {
            $commentInput.addClass('border-red-500').removeClass('border-gray-200');
            setTimeout(() => { $commentInput.removeClass('border-red-500').addClass('border-gray-200'); }, 2000);
            return;
        }

        const newCommentHTML = `
            <div class="bg-white p-3 rounded-xl shadow-sm text-sm text-gray-700" style="display:none;">
                <span class="font-bold text-twilight">現世訪客：</span> ${commentText}
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