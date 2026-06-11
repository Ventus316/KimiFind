// js/report.js

$(document).ready(function() {
    // 取得表單與按鈕節點
    const $reportForm = $('form');
    const $submitBtn = $('button:contains("送出資料")');
    const $textInputs = $('input[type="text"], textarea');

    // 點擊送出按鈕事件
    $submitBtn.on('click', function() {
        let isValid = true;

        // 1. 遍歷檢查所有文字輸入框與文字區域
        $textInputs.each(function() {
            const val = $(this).val().trim();
            
            if (val === '') {
                // 若為空，加上結繩紅的警告邊框
                $(this).removeClass('border-gray-200 focus:border-musubi').addClass('border-red-500 bg-red-50');
                isValid = false;
            } else {
                // 若有值，恢復正常樣式
                $(this).removeClass('border-red-500 bg-red-50').addClass('border-gray-200 focus:border-musubi');
            }
        });

        // 2. 驗證失敗的視覺回饋
        if (!isValid) {
            const originalText = $submitBtn.text();
            $submitBtn.text('請填寫完整資訊').addClass('bg-red-800');
            
            // 2秒後按鈕恢復原狀
            setTimeout(() => {
                $submitBtn.text(originalText).removeClass('bg-red-800');
            }, 2000);
            return; // 終止執行，不送出表單
        }

        // 3. 驗證成功的視覺回饋 (模擬送出)
        // 鎖定按鈕，改變顏色與文字，營造資料傳輸感
        $submitBtn.text('✨ 訊號已送達星空 (處理中...)')
                  .removeClass('bg-musubi hover:bg-red-600')
                  .addClass('bg-green-500 cursor-not-allowed')
                  .prop('disabled', true);

        // 模擬伺服器延遲 1.5 秒後完成
        setTimeout(() => {
            $submitBtn.text('登記成功！即將返回首頁...');
            
            // 模擬再過 1.5 秒後跳轉回首頁
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        }, 1500);
    });

    // 貼心設計：當使用者開始輸入文字時，即時消除紅色警告邊框
    $textInputs.on('input', function() {
        if ($(this).val().trim() !== '') {
            $(this).removeClass('border-red-500 bg-red-50').addClass('border-gray-200 focus:border-musubi');
        }
    });
});