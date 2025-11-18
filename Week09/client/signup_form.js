const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.password = payload.confirmPassword = 'demoPass88';
  payload.interests = ['後端入門'];
  payload.terms = true;

  try {
    resultEl.textContent = '送出中...';
    const res = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || '失敗');
    }
    resultEl.textContent = JSON.stringify(data, null, 2);
    form.reset();
  } catch (error) {
    resultEl.textContent = `錯誤：${error.message}`;
  }
});
