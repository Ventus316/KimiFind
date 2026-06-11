// js/nav.js
$(document).ready(function() {
    $("#nav-placeholder").load("navbar.html", function() {
        
        // --- 1. 權限顯示邏輯 ---
        const currentUserStr = localStorage.getItem('kimiUser');
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

        if (currentUser) {
            $('.guest-only').hide();
            $('.auth-only').show();
            $('#nav-username').text(`嗨，${currentUser.name}`);

            // 🌟 變更點：判斷身分，設定點擊名字後跳轉的頁面
            if (currentUser.role === 'admin') {
                $('#nav-username').attr('href', 'admin.html');
            } else {
                $('#nav-username').attr('href', 'dashboard.html');
            }
        } else {
            $('.guest-only').show();
            $('.auth-only').hide();
        }

        // --- 2. 登出邏輯 ---
        $('#logout-btn').on('click', function() {
            const confirmLogout = confirm("確定要登出嗎？");
            if (confirmLogout) {
                // 清除登入紀錄
                localStorage.removeItem('kimiUser');
                alert("已成功登出，期待下次與您相遇。");
                // 強制導回首頁
                window.location.href = 'index.html';
            }
        });

        // --- 3. 高亮當前頁面與手機選單邏輯 (保留你原本的) ---
        const currentPath = window.location.pathname.split("/").pop(); 
        if (currentPath) {
            $(`.nav-link[href="${currentPath}"]`).addClass("text-musubi font-bold").removeClass("text-gray-700");
        } else {
            $(`.nav-link[href="index.html"]`).addClass("text-musubi font-bold").removeClass("text-gray-700");
        }

        $("#mobile-menu-btn").on("click", function() {
            // 請依照你的設計展開手機菜單
        });
    });
});