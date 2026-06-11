// js/dashboard.js

$(document).ready(function() {
    // 定位列表容器
    const $listContainer = $('.bg-white.rounded-2xl.shadow-sm.border');

    // 使用「事件代理 (Event Delegation)」綁定刪除按鈕
    // 這樣即使未來資料是動態載入的，按鈕也依然有效
    $listContainer.on('click', 'button', function() {
        
        // 瀏覽器內建的確認對話框
        const isConfirmed = confirm('確定要刪除這筆紀錄嗎？這段緣分將化為星塵消散喔。');

        if (isConfirmed) {
            // 找到被點擊按鈕的「最外層卡片容器」 (根據靜態版面的結構)
            const $cardNode = $(this).closest('.flex.items-center.justify-between.p-6');

            // 【動態刪除節點】先執行淡出動畫，動畫結束後徹底移除 DOM 節點
            $cardNode.fadeOut(400, function() {
                $(this).remove();

                // 貼心設計：如果全部刪光了，顯示提示文字
                if ($listContainer.children('.p-6').length === 0) {
                    const emptyMessage = `
                        <div class="p-8 text-center text-gray-500">
                            <div class="text-3xl mb-2">🍃</div>
                            目前沒有任何發布紀錄了。
                        </div>
                    `;
                    $listContainer.html(emptyMessage);
                }
            });
        }
    });
});