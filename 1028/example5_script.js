// example5_script.js
// 攔截 submit，聚焦第一個錯誤並模擬送出流程
const form = document.getElementById('full-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const agree = document.getElementById('agree');

function validateAllInputs(formElement) {
  let firstInvalid = null;
  const controls = Array.from(formElement.querySelectorAll('input, select, textarea'));
  controls.forEach((control) => {
    control.classList.remove('is-invalid');

    // 特別處理 agree：如果打勾但尚未確認，視為 invalid
    if (control === agree) {
      if (agree.checked && agree.dataset.confirmed !== 'true') {
        control.classList.add('is-invalid');
        if (!firstInvalid) firstInvalid = control;
        return;
      }
    }

    if (!control.checkValidity()) {
      control.classList.add('is-invalid');
      if (!firstInvalid) {
        firstInvalid = control;
      }
    }
  });
  return firstInvalid;
}

// 當使用者改變同意勾選時（也支援鍵盤操作）
agree.addEventListener('change', (e) => {
  // 若是嘗試打勾（checked === true），顯示同意視窗
  if (agree.checked) {
    const ok = window.confirm("這是隱私同意條款。\n\n請詳閱內容，按「確定」表示您同意隱私權條款。");
    if (ok) {
      // 使用 data-confirmed 標記已確認，並移除錯誤樣式
      agree.dataset.confirmed = 'true';
      agree.classList.remove('is-invalid');
    } else {
      // 未同意：取消勾選並把焦點放回 checkbox
      agree.checked = false;
      delete agree.dataset.confirmed;
      agree.classList.add('is-invalid');
      agree.focus();
    }
  } else {
    // 取消勾選時移除確認標記和錯誤樣式
    delete agree.dataset.confirmed;
    agree.classList.remove('is-invalid');
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  // 驗證所有欄位（包含同意）
  let firstInvalid = validateAllInputs(form);

  // 若 agree 被勾但尚未確認（例如直接在 console 改 checked），在送出時再提示一次
  if (!firstInvalid && agree.checked && agree.dataset.confirmed !== 'true') {
    const ok = window.confirm("這是隱私同意條款。\n\n請按「確定」以確認您已閱讀並同意隱私權條款。");
    if (ok) {
      agree.dataset.confirmed = 'true';
      agree.classList.remove('is-invalid');
    } else {
      agree.classList.add('is-invalid');
      firstInvalid = agree;
    }
  }

  if (firstInvalid) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    firstInvalid.focus();
    return;
  }

  // 模擬非同步送出
  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('資料已送出，感謝您的聯絡！');
  form.reset();
  // 清除確認標記與錯誤樣式
  delete agree.dataset.confirmed;
  Array.from(form.elements).forEach((element) => element.classList.remove('is-invalid'));
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  delete agree.dataset.confirmed;
  Array.from(form.elements).forEach((element) => {
    element.classList.remove('is-invalid');
  });
});

form.addEventListener('input', (event) => {
  const target = event.target;
  if (target.classList.contains('is-invalid') && target.checkValidity()) {
    target.classList.remove('is-invalid');
  }

  // 若使用者在 textarea/select 等改變而同時已勾選但尚未確認，維持 is-invalid（需重新確認）
  if (target === agree && agree.checked && agree.dataset.confirmed !== 'true') {
    agree.classList.add('is-invalid');
  }
});
