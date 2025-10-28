// signup_form.js
// 驗證規則、事件委派、localStorage 暫存、送出攔截、重設

const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const savedNote = document.getElementById('saved-note');

// fields
const fld = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  password: document.getElementById('password'),
  confirm: document.getElementById('confirm'),
  interests: document.getElementById('interests'),
  terms: document.getElementById('terms')
};

// error nodes
const err = {
  name: document.getElementById('name-error'),
  email: document.getElementById('email-error'),
  phone: document.getElementById('phone-error'),
  password: document.getElementById('password-error'),
  confirm: document.getElementById('confirm-error'),
  interest: document.getElementById('interest-error'),
  terms: document.getElementById('terms-error')
};

// strength UI
const strengthBar = document.getElementById('password-strength-bar');
const strengthText = document.getElementById('password-strength-text');

// localStorage key
const LS_KEY = 'signup_form_draft_v1';

// ------------ validation helpers ------------
function setFieldError(input, message) {
  // setCustomValidity + visible message + aria
  input.setCustomValidity(message || '');
  const id = input.id;
  if (err[id]) err[id].textContent = message || '';
  if (message) {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
}

function validateName() {
  const v = fld.name.value.trim();
  if (!v) {
    setFieldError(fld.name, '請輸入姓名');
    return false;
  }
  setFieldError(fld.name, '');
  return true;
}

function validateEmail() {
  const v = fld.email.value.trim();
  if (!v) {
    setFieldError(fld.email, '請輸入 Email');
    return false;
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(v)) {
    setFieldError(fld.email, 'Email 格式不正確');
    return false;
  }
  setFieldError(fld.email, '');
  return true;
}

function validatePhone() {
  const v = fld.phone.value.trim();
  if (!v) {
    setFieldError(fld.phone, '請輸入手機號碼');
    return false;
  }
  const re = /^\d{10}$/;
  if (!re.test(v)) {
    setFieldError(fld.phone, '手機需為 10 碼數字 (例如 0912345678)');
    return false;
  }
  setFieldError(fld.phone, '');
  return true;
}

function passwordRules(v) {
  const lengthOk = v.length >= 8;
  const hasLetter = /[A-Za-z]/.test(v);
  const hasNumber = /[0-9]/.test(v);
  return { lengthOk, hasLetter, hasNumber };
}

function evaluateStrength(v) {
  if (!v) return 0;
  const r = passwordRules(v);
  if (!r.lengthOk) return 1; // too short -> weak
  if (r.hasLetter && r.hasNumber && v.length >= 12) return 3; // strong
  if (r.hasLetter && r.hasNumber) return 2; // medium
  return 1; // weak
}

function updateStrengthUI() {
  const v = fld.password.value || '';
  const s = evaluateStrength(v);
  strengthBar.classList.remove('weak','medium','strong');
  strengthText.textContent = '弱';
  if (s === 1) { strengthBar.classList.add('weak'); strengthText.textContent = '弱'; }
  if (s === 2) { strengthBar.classList.add('medium'); strengthText.textContent = '中'; }
  if (s === 3) { strengthBar.classList.add('strong'); strengthText.textContent = '強'; }
}

function validatePassword() {
  const v = fld.password.value;
  if (!v) {
    setFieldError(fld.password, '請輸入密碼');
    updateStrengthUI();
    return false;
  }
  const r = passwordRules(v);
  if (!r.lengthOk) {
    setFieldError(fld.password, '密碼至少 8 碼');
    updateStrengthUI();
    return false;
  }
  if (!(r.hasLetter && r.hasNumber)) {
    setFieldError(fld.password, '密碼需英數混合（至少包含英文字母與數字）');
    updateStrengthUI();
    return false;
  }
  setFieldError(fld.password, '');
  updateStrengthUI();
  return true;
}

function validateConfirm() {
  const v = fld.confirm.value;
  if (!v) {
    setFieldError(fld.confirm, '請再次輸入密碼以確認');
    return false;
  }
  if (v !== fld.password.value) {
    setFieldError(fld.confirm, '確認密碼與密碼不相符');
    return false;
  }
  setFieldError(fld.confirm, '');
  return true;
}

function validateInterests() {
  const boxes = Array.from(fld.interests.querySelectorAll('input[type="checkbox"]'));
  const checked = boxes.filter(b => b.checked);
  if (checked.length < 1) {
    err.interest.textContent = '請至少勾選 1 個興趣';
    fld.interests.classList.remove('has-valid');
    fld.interests.classList.add('has-invalid');
    return false;
  }
  err.interest.textContent = '';
  fld.interests.classList.remove('has-invalid');
  fld.interests.classList.add('has-valid');
  return true;
}

function validateTerms() {
  if (!fld.terms.checked) {
    err.terms.textContent = '必須同意服務條款才能送出';
    fld.terms.classList.add('is-invalid');
    return false;
  }
  err.terms.textContent = '';
  fld.terms.classList.remove('is-invalid');
  return true;
}

// ------------ interest event delegation & visuals ------------
fld.interests.addEventListener('click', (e) => {
  const label = e.target.closest('.tag');
  if (!label) return;
  const checkbox = label.querySelector('input[type="checkbox"]');
  // toggle checkbox if click on label
  if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
  // update selected style
  if (checkbox.checked) label.classList.add('selected'); else label.classList.remove('selected');
  // update validation state/count
  validateInterests();
  saveDraftDebounced();
});

// initialize tag states on load (in case of restored values)
function restoreTagsFromDOM() {
  fld.interests.querySelectorAll('.tag').forEach(label => {
    const cb = label.querySelector('input[type="checkbox"]');
    if (cb.checked) label.classList.add('selected'); else label.classList.remove('selected');
  });
}

// ------------ live event handlers ------------
fld.name.addEventListener('blur', validateName);
fld.email.addEventListener('blur', validateEmail);
fld.phone.addEventListener('blur', validatePhone);
fld.password.addEventListener('blur', validatePassword);
fld.confirm.addEventListener('blur', validateConfirm);

fld.password.addEventListener('input', () => {
  updateStrengthUI();
  // if previously invalid, revalidate
  if (fld.password.classList.contains('is-invalid')) validatePassword();
  // confirm may need revalidate
  if (fld.confirm.value) validateConfirm();
  saveDraftDebounced();
});

[fld.name, fld.email, fld.phone, fld.confirm].forEach(el => {
  el.addEventListener('input', (e) => {
    if (el.classList.contains('is-invalid')) {
      // live update only to clear if valid
      switch (el) {
        case fld.name: validateName(); break;
        case fld.email: validateEmail(); break;
        case fld.phone: validatePhone(); break;
        case fld.confirm: validateConfirm(); break;
      }
    }
    saveDraftDebounced();
  });
});

fld.terms.addEventListener('change', () => {
  if (fld.terms.checked) {
    // optional: show terms text modal/confirm
    const ok = window.confirm('條款簡短說明：使用者同意平台服務規範，按確定表示您同意。');
    if (!ok) {
      fld.terms.checked = false;
    }
  }
  validateTerms();
  saveDraftDebounced();
});

// ------------ form submit handling ------------
function focusFirstInvalidAndReport() {
  // find first invalid field in preferred order
  const order = ['name','email','phone','password','confirm','interests','terms'];
  for (const key of order) {
    let ok;
    switch (key) {
      case 'name': ok = validateName(); if (!ok) { fld.name.focus(); return false; } break;
      case 'email': ok = validateEmail(); if (!ok) { fld.email.focus(); return false; } break;
      case 'phone': ok = validatePhone(); if (!ok) { fld.phone.focus(); return false; } break;
      case 'password': ok = validatePassword(); if (!ok) { fld.password.focus(); return false; } break;
      case 'confirm': ok = validateConfirm(); if (!ok) { fld.confirm.focus(); return false; } break;
      case 'interests': ok = validateInterests(); if (!ok) { fld.interests.querySelector('input')?.focus(); return false; } break;
      case 'terms': ok = validateTerms(); if (!ok) { fld.terms.focus(); return false; } break;
    }
  }
  return true;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // run all validators
  const ok = focusFirstInvalidAndReport();
  if (!ok) return;

  // all valid -> simulate submission
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中…';
  submitBtn.setAttribute('aria-busy','true');

  await new Promise(resolve => setTimeout(resolve, 1000));

  // simulate success
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
  submitBtn.removeAttribute('aria-busy');
  localStorage.removeItem(LS_KEY);
  savedNote.textContent = '送出成功，資料已清除（localStorage 已清除）。';
  // optionally clear form
  form.reset();
  restoreTagsFromDOM();
  updateStrengthUI();
});

// ------------ reset button ------------
resetBtn.addEventListener('click', () => {
  form.reset();
  // clear errors
  Object.values(err).forEach(n => n && (n.textContent=''));
  document.querySelectorAll('input').forEach(i => i.classList.remove('is-invalid'));
  document.querySelectorAll('.tag').forEach(t => t.classList.remove('selected'));
  localStorage.removeItem(LS_KEY);
  savedNote.textContent = '已重設，暫存資料已清除。';
  updateStrengthUI();
});

// ------------ localStorage autosave ------------
function getFormData() {
  const data = {
    name: fld.name.value,
    email: fld.email.value,
    phone: fld.phone.value,
    password: fld.password.value,
    confirm: fld.confirm.value,
    interests: Array.from(fld.interests.querySelectorAll('input[type="checkbox"]')).map(cb => ({value:cb.value,checked:cb.checked})),
    terms: fld.terms.checked,
    ts: Date.now()
  };
  return data;
}

function restoreDraft() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    fld.name.value = data.name || '';
    fld.email.value = data.email || '';
    fld.phone.value = data.phone || '';
    fld.password.value = data.password || '';
    fld.confirm.value = data.confirm || '';
    data.interests && data.interests.forEach(it => {
      const cb = fld.interests.querySelector(`input[value="${it.value}"]`);
      if (cb) cb.checked = !!it.checked;
    });
    fld.terms.checked = !!data.terms;
    restoreTagsFromDOM();
    updateStrengthUI();
    savedNote.textContent = '已自動還原上次填寫資料（暫存）。';
  } catch (err) {
    console.warn('restore draft error', err);
  }
}

function saveDraft() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(getFormData()));
    savedNote.textContent = '已自動暫存表單（localStorage）。';
  } catch (e) {
    console.warn('save draft failed', e);
  }
}
const saveDraftDebounced = debounce(saveDraft, 300);

// simple debounce
function debounce(fn, wait) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// restore on load
restoreDraft();
updateStrengthUI();
restoreTagsFromDOM();
