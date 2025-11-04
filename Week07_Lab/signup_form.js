document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const successMessage = document.getElementById('successMessage');
    const interestTagsContainer = document.getElementById('interestTags');
    const tagsCountElement = document.getElementById('tags-count');

    // 所有需要即時驗證的輸入欄位
    const formFields = [
        'name', 'email', 'phone', 'password', 'confirmPassword', 'terms'
    ].map(id => document.getElementById(id));

    // 專門用於密碼強度檢查的元素
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('password-strength-bar');
    const strengthInfo = document.getElementById('password-strength-info');

    // 1. 本地儲存 (localStorage) 暫存欄位內容 (進階功能)
    const STORAGE_KEY = 'signupFormData';

    
    //從 localStorage 載入資料並恢復表單
    function loadFormData() {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const data = JSON.parse(storedData);
            formFields.forEach(field => {
                if (field.type === 'checkbox') {
                    field.checked = data[field.name] === 'on';
                } else if (field.name !== 'password' && field.name !== 'confirmPassword') {

                    field.value = data[field.name] || '';
                }
            });

            // 恢復興趣標籤
            const storedInterests = data.interest || [];
            document.querySelectorAll('#interestTags input[type="checkbox"]').forEach(checkbox => {
                const isChecked = storedInterests.includes(checkbox.value);
                checkbox.checked = isChecked;
                const label = checkbox.closest('.tag-label');
                if (label) {
                    label.classList.toggle('selected', isChecked);
                }
            });

            updateTagsCount();
            // 不恢復密碼，所以密碼強度條會是空的
        }
    }

    // 儲存資料的邏輯保持不變
    function saveFormData() {
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            if (key === 'interest') {
                if (!data.interest) data.interest = [];
                data.interest.push(value);
            } else {
                data[key] = value;
            }
        }
        delete data.password;
        delete data.confirmPassword;
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 啟動時載入資料，並監聽 input 事件儲存
    loadFormData();
    form.addEventListener('input', saveFormData);

    // 2. 密碼強度條 (修正核心邏輯)
    //檢查密碼強度並更新 UI
    function checkPasswordStrength(password = passwordInput.value) {
        let strength = 0;
        let info = '密碼強度：無';
        let width = '0%';
        let className = '';

        if (!password) {
             // 密碼為空時的初始狀態
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar';
            strengthInfo.textContent = '密碼強度：無';
            return;
        }

        if (password.length >= 8) {strength++; // 8 碼長度
        }
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {strength++; // 包含大小寫字母
        }
        if (/\d/.test(password)) {strength++; // 包含數字
        }
        if (/[^a-zA-Z0-9]/.test(password)) { strength++; // 包含特殊符號
        }
        
        // 根據計分設置強度等級
        if (strength <= 1) {
            info = '密碼強度：弱';
            width = '33%';
            className = 'strength-weak';
        } else if (strength === 2 || (strength === 3 && password.length < 10)) {
            info = '密碼強度：中';
            width = '66%';
            className = 'strength-medium';
        } else { // strength >= 3 (且長度足夠), 或 strength == 4
            info = '密碼強度：強';
            width = '100%';
            className = 'strength-strong';
        }

        strengthBar.style.width = width;
        strengthBar.className = `strength-bar ${className}`;
        strengthInfo.textContent = info;
    }

    // 密碼欄位的 input 事件即時更新強度條
    passwordInput.addEventListener('input', checkPasswordStrength);
    // 初始載入時也檢查一次（雖然是空的）
    checkPasswordStrength(); 


    // 3. 事件委派：興趣標籤 (保持不變)
    function updateTagsCount() {
        const checkedCount = interestTagsContainer.querySelectorAll('input[type="checkbox"]:checked').length;
        tagsCountElement.textContent = `已勾選 ${checkedCount} 個`;

        const tagsErrorElement = document.getElementById('tags-error');
        if (checkedCount === 0) {
            tagsCountElement.style.color = 'var(--danger-color)';
            tagsErrorElement.textContent = '請至少勾選 1 個興趣標籤。';
            interestTagsContainer.setAttribute('aria-invalid', 'true');
        } else {
            tagsCountElement.style.color = '#6c757d';
            tagsErrorElement.textContent = '';
            interestTagsContainer.removeAttribute('aria-invalid');
        }
    }

    interestTagsContainer.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox' && event.target.name === 'interest') {
            const label = event.target.closest('.tag-label');
            label.classList.toggle('selected', event.target.checked);
            updateTagsCount();
            saveFormData();
        }
    });

    updateTagsCount();

    // 4. 客製訊息與即時驗證 (setCustomValidity) (微調密碼驗證邏輯)
    function displayError(input, message) {
        const errorElementId = input.id + '-error';
        const errorElement = document.getElementById(errorElementId);
        
        input.setCustomValidity(message);

        if (errorElement) {
            errorElement.textContent = message;
            if (message) {
                input.setAttribute('aria-invalid', 'true');
            } else {
                input.removeAttribute('aria-invalid');
            }
        }
    }

    function validateField(input) {
        const value = input.value; // 避免 trim 影響密碼長度判斷
        let errorMessage = '';

        input.setCustomValidity(''); 
        
        // 1. 執行瀏覽器內建驗證 (required, type, minlength, pattern)
        if (!input.checkValidity()) {
            if (input.validity.valueMissing) {
                errorMessage = '此欄位為必填。';
            } else if (input.id === 'email' && input.validity.typeMismatch) {
                errorMessage = '請輸入有效的 Email 格式。';
            } else if (input.id === 'phone' && input.validity.patternMismatch) {
                errorMessage = '手機號碼必須是 10 碼數字。';
            } else if (input.id === 'password' && input.validity.tooShort) {
                errorMessage = `密碼長度不足，請輸入至少 ${input.minLength} 碼。`;
            } else if (input.id === 'password' && input.validity.patternMismatch) {
                 errorMessage = '密碼格式不正確。';
            } else if (input.id === 'terms' && !input.checked) {
                errorMessage = '請務必勾選同意服務條款。';
            }
        }

        // 2. 客製化驗證 (英數混合, 密碼一致性)
        if (!errorMessage) { // 只有在原生驗證通過後才檢查客製化規則
            if (input.id === 'password') {
                // 密碼：英數混合 (至少一個字母，至少一個數字)
                if (value.length >= 8 && (!/[a-zA-Z]/.test(value) || !/\d/.test(value))) {
                    errorMessage = '密碼必須包含英文字母與數字。';
                }
            } else if (input.id === 'confirmPassword') {
                // 確認密碼
                if (value && value !== passwordInput.value) {
                    errorMessage = '確認密碼與密碼不一致。';
                }
            }
        }

        // 3. 顯示客製錯誤
        displayError(input, errorMessage);
    }

    const blurredFields = new Set();

    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            blurredFields.add(field.id);
            validateField(field);
        });

        // input 時即時更新 (如果已經 blur 過)
        field.addEventListener('input', () => {
            if (blurredFields.has(field.id)) {
                validateField(field);
            }
        });
    });

    // 特殊處理：確認密碼的即時驗證需要考慮密碼欄位的變動
    passwordInput.addEventListener('input', () => {
        if (blurredFields.has('confirmPassword')) {
            validateField(document.getElementById('confirmPassword'));
        }
    });

    // 5. 送出攔截與防重送 (保持不變)

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (submitBtn.disabled) return;

        let isFormValid = true;
        let firstInvalidField = null;

        // 啟動所有欄位的驗證
        formFields.forEach(field => {
            blurredFields.add(field.id);
            validateField(field); 
            if (!field.checkValidity() && isFormValid) {
                isFormValid = false;
                firstInvalidField = field;
            }
        });

        // 額外檢查興趣標籤
        updateTagsCount();
        const tagsValid = interestTagsContainer.querySelectorAll('input[type="checkbox"]:checked').length > 0;
        if (!tagsValid && isFormValid) {
            isFormValid = false;
            firstInvalidField = document.getElementById('name'); // 聚焦到名稱欄位
        }

        if (!isFormValid) {
            if (firstInvalidField) {
                firstInvalidField.focus(); 
            }
            return;
        }

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '送出中...';
        successMessage.hidden = true;

        setTimeout(() => {
            console.log('表單資料已成功送出:', new FormData(form));

            successMessage.hidden = false;
            successMessage.focus();

            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '註冊';

            localStorage.removeItem(STORAGE_KEY);
            
            // 延遲清空表單，讓使用者看到成功訊息 1 秒
            setTimeout(resetForm, 1000); 

        }, 1000);
    });

    // 6. 實作「重設」按鈕 (保持不變)
    function resetForm() {
        form.reset();
        
        document.querySelectorAll('.error-message').forEach(p => p.textContent = '');
        document.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
        
        // 重設密碼強度條
        checkPasswordStrength(''); 
        
        document.querySelectorAll('.tag-label').forEach(label => label.classList.remove('selected'));
        updateTagsCount();
        
        blurredFields.clear();

        successMessage.hidden = true;

        localStorage.removeItem(STORAGE_KEY);
    }

    resetBtn.addEventListener('click', resetForm);
});