const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.style.display = 'none';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('登入成功');
      window.location.href = 'signup_form.html'; // 你的報名表單頁面檔名
    } else {
      errorMsg.textContent = data.error || '登入失敗';
      errorMsg.style.display = 'block';
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = '連線錯誤';
    errorMsg.style.display = 'block';
  }
});