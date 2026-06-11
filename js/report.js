// js/report.js

$(document).ready(function() {
    // 🛡️ 路由守衛：進入頁面先檢查是否已登入
    const currentUserStr = localStorage.getItem('kimiUser');
    if (!currentUserStr) {
        alert('請先登入才能使用上報功能喔！');
        window.location.href = 'login.html';
        return; // 終止後續執行
    }
    
    // 將字串轉回 JSON 物件，取得當前使用者資訊
    const currentUser = JSON.parse(currentUserStr);

    // 取得表單節點
    const $submitBtn = $('#submit-btn');
    // 這次多抓了新增的 input 進行驗證
    const $textInputs = $('input[type="text"], textarea'); 

    $submitBtn.on('click', function() {
        let isValid = true;

        // 1. 簡易必填驗證 (不含圖片，圖片允許為空)
        $textInputs.each(function() {
            const val = $(this).val().trim();
            if (val === '') {
                $(this).removeClass('border-gray-200 focus:border-musubi').addClass('border-red-500 bg-red-50');
                isValid = false;
            } else {
                $(this).removeClass('border-red-500 bg-red-50').addClass('border-gray-200 focus:border-musubi');
            }
        });

        if (!isValid) {
            const originalText = $submitBtn.text();
            $submitBtn.text('請填寫所有文字資訊').addClass('bg-red-800');
            setTimeout(() => { $submitBtn.text(originalText).removeClass('bg-red-800'); }, 2000);
            return; 
        }

        // 🌟 2. 核心邏輯：將表單數據與「當前登入者」串聯
        // 抓取現有的自訂上報清單，如果沒有就建立一個空陣列
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];

        // 建立一筆新的物品資料
        const newItem = {
            id: 'item_' + Date.now(),
            type: $('#item-type').val(), // 📍 取得是「遺失」還是「拾獲」
            name: $('#item-name').val().trim(),
            category: $('#item-category').val(),
            district: $('#item-district').val(),
            contact: $('#item-contact').val().trim(),
            description: $('#item-desc').val().trim(),
            status: '尋找中', // 剛發布預設一定是尋找中
            date: new Date().toISOString().split('T')[0],
            publisherEmail: currentUser.email,
            publisherName: currentUser.name
        };

        // 把新資料推入陣列，並存回 localStorage 模擬寫入資料庫
        userReports.push(newItem);
        localStorage.setItem('kimiReports', JSON.stringify(userReports));

        // 3. 視覺回饋與跳轉
        $submitBtn.text('✨ 訊號已送達星空 (處理中...)')
                  .removeClass('bg-musubi hover:bg-red-600')
                  .addClass('bg-green-500 cursor-not-allowed')
                  .prop('disabled', true);

        setTimeout(() => {
            $submitBtn.text('登記成功！即將返回首頁...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1500);
    });

    // 貼心設計：輸入文字時即時消除紅色警告邊框
    $textInputs.on('input', function() {
        if ($(this).val().trim() !== '') {
            $(this).removeClass('border-red-500 bg-red-50').addClass('border-gray-200 focus:border-musubi');
        }
    });
});