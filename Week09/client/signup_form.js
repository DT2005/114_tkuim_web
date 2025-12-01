const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');
const submitBtn = document.querySelector('#submit-btn');
const getListBtn = document.querySelector('#get-list-btn');

const API_URL = 'http://localhost:3001/api/signup';

const updateLoadingState = (isLoading, btn, loadingText, defaultText) => {
  btn.disabled = isLoading;
  btn.textContent = isLoading ? loadingText : defaultText;
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  // 關鍵：這行必須在 try 之前定義，payload 才能被讀取到
  const payload = Object.fromEntries(formData);

  updateLoadingState(true, submitBtn, '處理中...', '送出');
  resultEl.textContent = '正在驗證並傳送資料...';
  resultEl.classList.remove('text-danger', 'text-success');

  try {
    // Regex 驗證電話 (09開頭 + 8碼數字)
    const phonePattern = /^09\d{8}$/;
    
    // 確保 payload.phone 存在且符合格式
    if (!payload.phone || !phonePattern.test(payload.phone)) {
      throw new Error('電話號碼格式錯誤：請輸入 09 開頭的 10 位數字');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '送出失敗');
    }

    resultEl.textContent = `報名成功 (已存入資料庫)！\n\n伺服器回應 ID：\n${data.id}`;
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
    const response = await fetch(`${API_URL}?page=1&limit=10`);
    
    if (!response.ok) {
      throw new Error('無法連接伺服器');
    }

    const data = await response.json();

    resultEl.textContent = `資料庫總筆數: ${data.total}\n\n詳細清單 (最新 10 筆):\n${JSON.stringify(data.items, null, 2)}`;
    resultEl.classList.remove('text-danger');

  } catch (error) {
    resultEl.textContent = `無法讀取：${error.message}`;
    resultEl.classList.add('text-danger');
  } finally {
    updateLoadingState(false, getListBtn, '', '查看目前報名清單 (GET)');
  }
});