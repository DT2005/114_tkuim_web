// example2_script.js
// 驗證 Email 與手機欄位，拋出自訂訊息後再提示使用者

const form = document.getElementById('contact-form');
const email = document.getElementById('email');
const phone = document.getElementById('phone');

function showValidity(input) {
  if (input.validity.valueMissing) {
    // 必填檢查
    input.setCustomValidity('這個欄位必填');
  } else if (input.validity.typeMismatch) {
    // type="email" 檢查
    input.setCustomValidity('格式不正確，請確認輸入內容');
  } else if (input.validity.patternMismatch) {
    // 專門處理 patternMismatch 的情況，強制提示自訂訊息
    if (input.id === 'email') {
        // 新增：如果是不符合 Email pattern 的錯誤，設定為指定訊息
        input.setCustomValidity('請使用@o365.tku.edu.tw');
    } else {
        // 其他欄位（例如手機）仍然使用 title 屬性作為提示
        input.setCustomValidity(input.title || '格式不正確');
    }
  } else {
    // 驗證通過
    input.setCustomValidity('');
  }
  return input.reportValidity();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailOk = showValidity(email);
  const phoneOk = showValidity(phone);
  if (emailOk && phoneOk) {
    alert('表單驗證成功，準備送出資料');
    form.reset();
  }
});

email.addEventListener('blur', () => {
  showValidity(email);
});

phone.addEventListener('blur', () => {
  showValidity(phone);
});