// example3_script.js
// 透過 input/blur 事件實作即時錯誤，僅在使用者操作後顯示訊息

const form = document.getElementById('signup-form');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm');
const passwordError = document.getElementById('password-error');
const confirmError = document.getElementById('confirm-error');

const touched = new Set();

function validatePassword() {
  const value = password.value.trim();
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  // 新增: 檢查是否包含符號 (任何非英文字母或數字的字符)
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  let message = '';

  if (!value) {
    message = '請輸入密碼。';
  } else if (value.length < 8) {
    message = '密碼至少需 8 碼。';
  } else if (!hasLetter || !hasNumber || !hasSymbol) {
    // 修改: 判斷條件現在包含 hasSymbol
    message = '密碼需同時包含英文字母、數字與符號。';
  }

  password.setCustomValidity(message);
  passwordError.textContent = message;
  return !message;
}

function validateConfirm() {
  const passwordValue = password.value.trim();
  const confirmValue = confirmPassword.value.trim();
  let message = '';

  if (!confirmValue) {
    message = '請再次輸入密碼。';
  } else if (passwordValue !== confirmValue) {
    message = '兩次輸入的密碼不一致。';
  }

  confirmPassword.setCustomValidity(message);
  confirmError.textContent = message;
  return !message;
}

function handleBlur(event) {
  touched.add(event.target.id);
  runValidation(event.target.id);
}

function handleInput(event) {
  if (!touched.has(event.target.id)) {
    return;
  }
  runValidation(event.target.id);
}

function runValidation(fieldId) {
  if (fieldId === 'password') {
    validatePassword();
    // 當密碼欄位變動時，如果確認密碼欄位被操作過，也需要重新驗證
    if (touched.has('confirm')) {
      validateConfirm();
    }
  }
  if (fieldId === 'confirm') {
    validateConfirm();
  }
}

[password, confirmPassword].forEach((input) => {
  input.addEventListener('blur', handleBlur);
  input.addEventListener('input', handleInput);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // 提交時，強制標記為已操作，確保所有錯誤訊息顯示
  touched.add('password');
  touched.add('confirm');
  const passwordOk = validatePassword();
  const confirmOk = validateConfirm();
  
  if (passwordOk && confirmOk) {
    alert('註冊成功');
    form.reset();
    // 成功後清除錯誤訊息和標記
    passwordError.textContent = '';
    confirmError.textContent = '';
    touched.clear();
  }
});