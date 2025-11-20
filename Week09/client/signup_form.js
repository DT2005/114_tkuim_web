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
  const payload = {
    id: Date.now(), 
    ...Object.fromEntries(formData),
    createdAt: new Date().toISOString()
  };

  updateLoadingState(true, submitBtn, '處理中...', '送出');
  resultEl.textContent = '正在儲存資料...';
  resultEl.classList.remove('text-danger', 'text-success');

  try {
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