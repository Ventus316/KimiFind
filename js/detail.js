// js/detail.js

$(document).ready(function() {
    // 取得留言輸入框與發送按鈕
    const $commentInput = $('#comment-input');
    const $sendBtn = $commentInput.next('button'); // 抓取輸入框旁邊的 button
    const $commentList = $('#comment-list');

    // 點擊發送按鈕事件
    $sendBtn.on('click', function() {
        const commentText = $commentInput.val().trim();

        // 防呆機制：如果輸入為空，給予紅色邊框警告
        if (commentText === '') {
            $commentInput.addClass('border-red-500').removeClass('border-gray-200');
            // 2 秒後恢復原狀
            setTimeout(() => {
                $commentInput.removeClass('border-red-500').addClass('border-gray-200');
            }, 2000);
            return;
        }

        // 組合新留言的 HTML 節點 (預設先隱藏 style="display:none;" 以便做動畫)
        const newCommentHTML = `
            <div class="bg-white p-3 rounded-xl shadow-sm text-sm text-gray-700" style="display:none;">
                <span class="font-bold text-twilight">現世訪客：</span> ${commentText}
            </div>
        `;

        // 將字串轉為 jQuery 物件
        const $newCommentNode = $(newCommentHTML);

        // 【動態產生節點】將新留言安插到列表最上方 (prepend)
        $commentList.prepend($newCommentNode);

        // 視覺回饋：使用滑動動畫顯示新留言
        $newCommentNode.slideDown(300);

        // 清空輸入框
        $commentInput.val('');
    });

    // 讓使用者按 Enter 鍵也能送出留言
    $commentInput.on('keypress', function(e) {
        if (e.which === 13) {
            $sendBtn.click();
        }
    });
});