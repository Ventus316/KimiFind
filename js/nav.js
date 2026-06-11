// js/nav.js

$(document).ready(function() {
    // 透過 jQuery 動態載入 navbar.html
    // 假設 navbar.html 放在根目錄。如果放在 components 資料夾，請改成 "components/navbar.html"
    $("#nav-placeholder").load("navbar.html", function() {
        
        // --- 以下程式碼會在導覽列載入完成後才執行 ---

        // 1. 自動高亮當前頁面的功能 (視覺優化)
        // 抓取網址結尾 (例如 search.html)
        const currentPath = window.location.pathname.split("/").pop(); 
        if (currentPath) {
            // 找到對應的連結，加上結繩紅的顏色與粗體，並移除原本的灰色
            $(`.nav-link[href="${currentPath}"]`)
                .addClass("text-musubi font-bold")
                .removeClass("text-gray-700");
        } else {
            // 如果網址沒有結尾 (例如預設的 index.html)，高亮首頁
            $(`.nav-link[href="index.html"]`)
                .addClass("text-musubi font-bold")
                .removeClass("text-gray-700");
        }

        // 2. 手機版漢堡選單的開關切換
        $("#mobile-menu-btn").on("click", function() {
            $("#mobile-menu").slideToggle("fast");
        });
    });
});