// client/signup_form.js

// 1. 全局設定與選取元素
const API_URL = '/api/signup'; // 使用相對路徑，避免 CORS 問題
const form = document.querySelector('#signup-form');
const submitBtn = document.querySelector('#submit-btn');
const refreshBtn = document.querySelector('#refresh-btn');
const listContainer = document.querySelector('#list-container');
const logoutBtn = document.querySelector('#logout-btn');
const userInfoEl = document.querySelector('#user-info');
const formMessageEl = document.querySelector('#form-message');

// 2. 驗證登入狀態 (最優先執行)
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

if (!token) {
  alert('您尚未登入，將導向登入頁面。');
  window.location.href = 'login.html'; // 假設登入頁檔名為 login.html
}

// 顯示使用者身分
if (userStr) {
  const user = JSON.parse(userStr);
  userInfoEl.textContent = `Hi, ${user.email} (角色: ${user.role})`;
}

// 3. 封裝 Fetch (自動帶入 Token)
async function authFetch(url, options = {}) {
  const headers = options.headers || {};
  // 關鍵：加入 Authorization Header
  headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';

  const response = await fetch(url, { ...options, headers });

  // 處理 Token 過期或無效
  if (response.status === 401) {
    alert('登入時效已過，請重新登入');
    handleLogout();
    return null;
  }
  return response;
}

// 4. 登出功能
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

logoutBtn.addEventListener('click', handleLogout);

// 5. 讀取與渲染列表 (GET)
async function loadData() {
  listContainer.innerHTML = '<div class="text-center text-muted">讀取中...</div>';
  
  try {
    const response = await authFetch(API_URL);
    if (!response) return; // 401 已處理

    const json = await response.json();
    
    // 清空列表
    listContainer.innerHTML = '';

    // 根據後端回傳格式 (假設是 { data: [...] })
    const items = json.data || [];

    if (items.length === 0) {
      listContainer.innerHTML = '<div class="alert alert-secondary">目前沒有資料</div>';
      return;
    }

    // 動態產生列表項目
    items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'card shadow-sm border-0';
      itemEl.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 class="card-title mb-1">${item.name}</h6>
            <p class="card-text text-muted small mb-0">
              ${item.email} | ${item.phone}
            </p>
          </div>
          <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${item._id}">
            刪除
          </button>
        </div>
      `;
      listContainer.appendChild(itemEl);
    });

    // 綁定刪除按鈕事件
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => handleDelete(e.target.dataset.id));
    });

  } catch (error) {
    console.error(error);
    listContainer.innerHTML = `<div class="alert alert-danger">無法讀取資料：${error.message}</div>`;
  }
}

// 6. 處理刪除 (DELETE)
async function handleDelete(id) {
  if (!confirm('確定要刪除這筆資料嗎？')) return;

  try {
    const response = await authFetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response && response.ok) {
      alert('刪除成功');
      loadData(); // 重新整理列表
    } else {
      const err = await response.json();
      alert(`刪除失敗：${err.error || '權限不足'}`);
    }
  } catch (error) {
    alert('連線錯誤');
  }
}

// 7. 處理表單送出 (POST)
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  submitBtn.disabled = true;
  submitBtn.textContent = '處理中...';
  formMessageEl.textContent = '';
  formMessageEl.className = 'mt-2';

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData);

  // 簡單前端驗證
  const phonePattern = /^09\d{8}$/;
  if (!phonePattern.test(payload.phone)) {
    formMessageEl.textContent = '格式錯誤：請輸入 09 開頭的 10 位數字';
    formMessageEl.classList.add('text-danger');
    submitBtn.disabled = false;
    submitBtn.textContent = '送出報名';
    return;
  }

  try {
    const response = await authFetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (response && response.ok) {
      formMessageEl.textContent = '報名成功！';
      formMessageEl.classList.add('text-success');
      form.reset();
      loadData(); // 自動更新列表
    } else {
      const err = await response.json();
      formMessageEl.textContent = `失敗：${err.error}`;
      formMessageEl.classList.add('text-danger');
    }
  } catch (error) {
    formMessageEl.textContent = `錯誤：${error.message}`;
    formMessageEl.classList.add('text-danger');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出報名';
  }
});

refreshBtn.addEventListener('click', loadData);

// 初始化：載入列表
loadData();