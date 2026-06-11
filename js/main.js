// js/main.js

$(document).ready(function() {
    renderLatestItems();

    function renderLatestItems() {
        const container = $('#latest-items-container');
        container.empty(); 

        // 1. 合併假資料與使用者上報資料
        let userReports = JSON.parse(localStorage.getItem('kimiReports')) || [];
        let allItems = typeof mockItems !== 'undefined' ? mockItems.concat(userReports) : userReports;

        // 2. 🌟 排除被管理員下架的黑名單
        let deletedPosts = JSON.parse(localStorage.getItem('kimiDeletedPosts')) || [];
        let visibleItems = allItems.filter(item => !deletedPosts.includes(item.id));

        // 3. 反轉陣列 (讓最新的在前面)，並只取前 3 筆
        const latestItems = visibleItems.reverse().slice(0, 3);

        if (latestItems.length === 0) {
            container.append('<div class="col-span-3 text-center py-10 text-gray-500">目前沒有任何星塵落下喔。</div>');
            return;
        }

        latestItems.forEach(function(item) {
            let statusColorClass = item.status === '尋找中' ? 'bg-musubi text-white' : 'bg-green-600 text-white';
            const badgeText = `${item.type} | ${item.status}`;

            const cardHTML = `
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col">
                    <div class="h-48 bg-gray-200 relative overflow-hidden">
                        <img src="${item.imageUrl || 'https://via.placeholder.com/400x300?text=KimiFind'}" alt="${item.name}" class="w-full h-full object-cover">
                        <div class="absolute top-3 right-3 ${statusColorClass} backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            ${badgeText}
                        </div>
                    </div>
                    <div class="p-5 flex-1 flex flex-col">
                        <div class="text-xs text-musubi font-bold mb-1">${item.category} • ${item.district}</div>
                        <h3 class="text-lg font-bold text-gray-800 mb-2">${item.name}</h3>
                        <p class="text-sm text-gray-500 mb-4 line-clamp-2">${item.description}</p>
                        <div class="mt-auto pt-4 border-t border-gray-50">
                            <a href="detail.html?id=${item.id}" class="block text-center w-full py-2 bg-gray-50 text-twilight font-bold rounded-lg hover:bg-gray-100 transition">
                                查看詳情
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.append(cardHTML);
        });
    }
});