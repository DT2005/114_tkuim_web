const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');
const submitBtn = document.querySelector('#submit-btn');
const getListBtn = document.querySelector('#get-list-btn');

const STORAGE_KEY = 'week09_signup_data';

const fakeDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const updateLoadingState = (isLoading, btn, loadingText, defaultText) => {
  btn.disabled = isLoading;
  btn.textContent = isLoading ? loadingText : defaultText;
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  // 注意：這裡假設你的 HTML input name="phone"，如果你的叫做 "tel" 或 "mobile"，請將下方的 payload.phone 改成對應名稱
  const payload = {
    id: Date.now(),
    ...Object.fromEntries(formData),
    createdAt: new Date().toISOString()
  };

  updateLoadingState(true, submitBtn, '處理中...', '送出');
  resultEl.textContent = '正在驗證並儲存資料...';
  resultEl.classList.remove('text-danger', 'text-success');

  try {
    // --- 【新增】電話號碼驗證區域 ---
    // Regex 解釋: ^09 代表以09開頭, \d{8} 代表後面接著8個數字, $ 代表結束
    const phonePattern = /^09\d{8}$/;
    
    // 這裡假設你 HTML 的 input name 是 "phone"
    if (!payload.phone || !phonePattern.test(payload.phone)) {
      throw new Error('電話號碼格式錯誤：請輸入 09 開頭的 10 位數字');
    }
    // ------------------------------

    await fakeDelay(500);

    const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const isDuplicate = currentData.some(user => user.email === payload.email);
    if (isDuplicate) {
      throw new Error('這個 Email 已經報名過了');
    }

    currentData.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));

    resultEl.textContent = `報名成功 (已存入瀏覽器)！\n\n資料內容：\n${JSON.stringify(payload, null, 2)}`;
    resultEl.classList.add('text-success');
    form.reset();

  } catch (error) {
    resultEl.textContent = `錯誤：${error.message}`;
    resultEl.classList.add('text-danger');
  } finally {
    updateLoadingState(false, submitBtn, '', '送出');
  }
});

getListBtn.addEventListener('click', async () => {
  updateLoadingState(true, getListBtn, '讀取中...', '查看目前報名清單 (GET)');

  try {
    await fakeDelay(300);

    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    resultEl.textContent = `本機儲存總數: ${data.length}\n\n詳細清單:\n${JSON.stringify(data, null, 2)}`;
    resultEl.classList.remove('text-danger');

  } catch (error) {
    resultEl.textContent = `無法讀取：${error.message}`;
  } finally {
    updateLoadingState(false, getListBtn, '', '查看目前報名清單 (GET)');
  }
});