// 類別選擇器功能
(function () {
    // 等待 DOM 載入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCategorySelector);
    } else {
        initCategorySelector();
    }

    function initCategorySelector() {
        // 在行業別欄位後插入類別選擇器
        const industryGroup = document.querySelector('label[for="industry"]')?.closest('.form-group');
        if (!industryGroup) return;

        const categoryHTML = `
            <div class="form-group" id="categoryGroup">
                <label>類別選擇 *</label>
                <div class="category-selector">
                    <label class="category-checkbox">
                        <input type="checkbox" name="category" value="健康美麗">
                        <span>健康美麗</span>
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="category" value="美食餐飲">
                        <span>美食餐飲</span>
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="category" value="企業顧問">
                        <span>企業顧問</span>
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="category" value="工程裝修">
                        <span>工程裝修</span>
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="category" value="企業行銷">
                        <span>企業行銷</span>
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="category" value="投資理財">
                        <span>投資理財</span>
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="category" value="休閒教育">
                        <span>休閒教育</span>
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="category" value="資訊系統">
                        <span>資訊系統</span>
                    </label>
                </div>
                <small>請選擇 1-2 個最符合您服務的類別</small>
            </div>
        `;

        industryGroup.insertAdjacentHTML('afterend', categoryHTML);

        // 限制最多選擇 2 個
        const checkboxes = document.querySelectorAll('.category-checkbox input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const checked = document.querySelectorAll('.category-checkbox input[type="checkbox"]:checked');
                if (checked.length >= 2) {
                    checkboxes.forEach(cb => {
                        if (!cb.checked) {
                            cb.closest('.category-checkbox').classList.add('disabled');
                            cb.disabled = true;
                        }
                    });
                } else {
                    checkboxes.forEach(cb => {
                        cb.closest('.category-checkbox').classList.remove('disabled');
                        cb.disabled = false;
                    });
                }
            });
        });

        // 修改原有的 collectData 函數以包含類別
        const originalCollectData = window.collectData;
        window.collectData = function () {
            const data = originalCollectData();
            const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            data.categories = selectedCategories;
            return data;
        };

        // 修改 loadData 函數以載入類別
        const originalLoadData = window.loadData;
        if (originalLoadData) {
            window.loadData = function (memberData) {
                originalLoadData(memberData);

                // 載入類別
                if (memberData.categories && Array.isArray(memberData.categories)) {
                    memberData.categories.forEach(cat => {
                        const checkbox = document.querySelector(`.category-checkbox input[value="${cat}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                            checkbox.dispatchEvent(new Event('change'));
                        }
                    });
                } else if (memberData.category) {
                    // 向後兼容：如果是字串，轉換為陣列
                    const checkbox = document.querySelector(`.category-checkbox input[value="${memberData.category}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                }
            };
        }
    }
})();
