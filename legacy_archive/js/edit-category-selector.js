// 類別選擇器功能
(function () {
    // 使用 MutationObserver 監聽表單顯示
    function waitForEditForm() {
        const editForm = document.getElementById('edit-form');
        if (editForm && editForm.style.display !== 'none') {
            initCategorySelector();
        } else {
            // 如果表單還沒顯示，等待它顯示
            const observer = new MutationObserver((mutations) => {
                const editForm = document.getElementById('edit-form');
                if (editForm && editForm.style.display !== 'none') {
                    observer.disconnect();
                    initCategorySelector();
                }
            });

            // 監聽整個 body 的變化
            observer.observe(document.body, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['style']
            });
        }
    }

    function initCategorySelector() {
        // 檢查是否已經插入過
        if (document.getElementById('categoryGroup')) {
            return;
        }

        // 在行業別欄位後插入類別選擇器
        const industryGroup = document.querySelector('label[for="industry"]')?.closest('.form-group');
        if (!industryGroup) {
            console.log('找不到行業別欄位');
            return;
        }

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
        console.log('類別選擇器已插入');

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
        if (window.collectData) {
            const originalCollectData = window.collectData;
            window.collectData = function () {
                const data = originalCollectData();
                const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox input[type="checkbox"]:checked'))
                    .map(cb => cb.value);
                data.categories = selectedCategories;
                return data;
            };
        }

        // 修改 populateForm 函數以載入類別
        if (window.populateForm) {
            const originalPopulateForm = window.populateForm;
            window.populateForm = function (memberData) {
                originalPopulateForm(memberData);

                // 載入類別
                setTimeout(() => {
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
                }, 100);
            };
        }
    }

    // 等待 DOM 載入後開始監聽
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForEditForm);
    } else {
        waitForEditForm();
    }
})();
