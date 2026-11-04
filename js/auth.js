/**
 * NexusArena - Authentication & Account Management JavaScript
 * Handles Login Credential Validation, Sign Up Form Validation,
 * Password Matching Verification, Show/Hide Password, and Forgot Password Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initLoginForm();
  initSignUpForm();
  initForgotPasswordForm();
  initQuickDemoAccounts();
});

// Show / Hide Password Toggle
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.toggle-password-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      btn.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });
}

// Safe navigation helper supporting both local file:// and web hosting with/without trailing slashes
function safeNavigate(target) {
  if (window.location.protocol === 'file:') {
    window.location.href = target;
  } else {
    // Check if target already has leading slash or if we should route from root
    const cleanTarget = target.startsWith('/') ? target : ('/' + target);
    window.location.href = cleanTarget;
  }
}

// 1. LOGIN CREDENTIAL VALIDATION
window.handleLoginSubmit = function(e) {
  if (e && e.preventDefault) e.preventDefault();

  const identifierInput = document.getElementById('loginIdentifier');
  const passwordInput = document.getElementById('loginPassword');
  const errorAlert = document.getElementById('loginErrorAlert');
  const successAlert = document.getElementById('loginSuccessAlert');

  if (errorAlert) errorAlert.style.display = 'none';
  if (successAlert) successAlert.style.display = 'none';

  if (!identifierInput || !passwordInput) return false;

  const identifier = identifierInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!identifier || !password) {
    if (errorAlert) {
      document.getElementById('loginErrorMessage').textContent = 'Please enter both your student username/email and password.';
      errorAlert.style.display = 'flex';
    }
    if (typeof showToast === 'function') showToast('Please enter both username/email and password', 'error');
    return false;
  }

  // Check credentials against simulated database (predefined variables + localStorage)
  const users = typeof getRegisteredUsers === 'function' ? getRegisteredUsers() : DEFAULT_SAMPLE_ACCOUNTS;
  const matchedUser = users.find(u => 
    (u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier) &&
    u.password === password
  );

  if (matchedUser) {
    // Credential validation success
    if (typeof setCurrentUser === 'function') setCurrentUser(matchedUser);

    if (successAlert) {
      const nameEl = document.getElementById('loginSuccessName');
      if (nameEl) nameEl.textContent = matchedUser.fullName;
      successAlert.style.display = 'flex';
    }

    if (typeof showToast === 'function') showToast(`Welcome back, ${matchedUser.fullName}!`, 'success');

    setTimeout(() => {
      safeNavigate('events.html');
    }, 1000);
    return true;
  } else {
    // Credential validation failure
    if (errorAlert) {
      document.getElementById('loginErrorMessage').textContent = 'Invalid username/email or password. Please verify your credentials or use the sample accounts below.';
      errorAlert.style.display = 'flex';
    }
    if (typeof showToast === 'function') showToast('Authentication failed: Invalid credentials', 'error');
    return false;
  }
};

function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', window.handleLoginSubmit);
}

// Quick Demo Account Buttons for Rapid Teacher / Evaluator Testing
function initQuickDemoAccounts() {
  const demoButtons = document.querySelectorAll('[data-demo-user]');
  const idInput = document.getElementById('loginIdentifier');
  const passInput = document.getElementById('loginPassword');

  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-demo-user');
      if (type === 'alex') {
        if (idInput) idInput.value = 'alex@campus.edu';
        if (passInput) passInput.value = 'Password123!';
      } else if (type === 'sarah') {
        if (idInput) idInput.value = 'sarah@univ.edu';
        if (passInput) passInput.value = 'TechLead2026';
      } else if (type === 'guest') {
        if (idInput) idInput.value = 'guest@campus.edu';
        if (passInput) passInput.value = 'GuestPassword';
      }
      showToast('Sample credentials loaded into inputs!', 'info');
    });
  });
}

// 2. SIGN UP FORM VALIDATION WITH MANDATORY PASSWORD MATCHING
function initSignUpForm() {
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return;

  const fullNameInput = document.getElementById('signupFullName');
  const usernameInput = document.getElementById('signupUsername');
  const emailInput = document.getElementById('signupEmail');
  const passwordInput = document.getElementById('signupPassword');
  const confirmPasswordInput = document.getElementById('signupConfirmPassword');
  const matchIndicator = document.getElementById('passwordMatchIndicator');

  // Live password matching check on typing
  function checkPasswordMatch() {
    const p1 = passwordInput.value;
    const p2 = confirmPasswordInput.value;

    if (!p2) {
      if (matchIndicator) {
        matchIndicator.innerHTML = '';
        matchIndicator.className = 'match-indicator';
      }
      return;
    }

    if (p1 === p2) {
      if (matchIndicator) {
        matchIndicator.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Passwords match perfectly</span>
        `;
        matchIndicator.className = 'match-indicator matched';
      }
      confirmPasswordInput.classList.remove('is-invalid');
      confirmPasswordInput.classList.add('is-valid');
    } else {
      if (matchIndicator) {
        matchIndicator.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <span>Passwords do not match</span>
        `;
        matchIndicator.className = 'match-indicator unmatched';
      }
      confirmPasswordInput.classList.add('is-invalid');
      confirmPasswordInput.classList.remove('is-valid');
    }
  }

  if (passwordInput && confirmPasswordInput) {
    passwordInput.addEventListener('input', checkPasswordMatch);
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
  }

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Full name
    if (!fullNameInput.value.trim() || fullNameInput.value.trim().length < 3) {
      setFieldError('signupFullName', 'Full name must contain at least 3 characters.');
      isValid = false;
    } else {
      clearField('signupFullName');
    }

    // Username
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(usernameInput.value.trim())) {
      setFieldError('signupUsername', 'Username must be 3-20 alphanumeric characters (letters, numbers, underscore).');
      isValid = false;
    } else {
      clearField('signupUsername');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      setFieldError('signupEmail', 'Please provide a valid university email address.');
      isValid = false;
    } else {
      // Check if email already registered
      const existingUsers = getRegisteredUsers();
      if (existingUsers.some(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase())) {
        setFieldError('signupEmail', 'This email address is already registered. Please sign in instead.');
        isValid = false;
      } else {
        clearField('signupEmail');
      }
    }

    // Password
    if (!passwordInput.value || passwordInput.value.length < 6) {
      setFieldError('signupPassword', 'Password must be at least 6 characters long.');
      isValid = false;
    } else {
      clearField('signupPassword');
    }

    // Confirm Password - CRITICAL REQUIREMENT: Explicit check that password and confirm match perfectly
    if (passwordInput.value !== confirmPasswordInput.value) {
      setFieldError('signupConfirmPassword', 'Passwords do not match. Both fields must be identical.');
      isValid = false;
    } else if (!confirmPasswordInput.value) {
      setFieldError('signupConfirmPassword', 'Please confirm your password.');
      isValid = false;
    } else {
      clearField('signupConfirmPassword');
    }

    if (!isValid) {
      showToast('Please fix the form errors before registering.', 'error');
      return;
    }

    // Create New Simulated Account
    const newAccount = {
      fullName: fullNameInput.value.trim(),
      username: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      role: "Campus Student Member",
      studentId: "STU-" + Math.floor(1000 + Math.random() * 9000)
    };

    saveRegisteredUser(newAccount);
    setCurrentUser(newAccount);

    const successAlert = document.getElementById('signupSuccessAlert');
    if (successAlert) {
      document.getElementById('signupSuccessName').textContent = newAccount.fullName;
      successAlert.style.display = 'flex';
      successAlert.scrollIntoView({ behavior: 'smooth' });
    }

    showToast(`Account created successfully for ${newAccount.fullName}!`, 'success');

    setTimeout(() => {
      safeNavigate('events.html');
    }, 1200);
  });

  function setFieldError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (input) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }
  }

  function clearField(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (input) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  }
}

// 3. FORGOT PASSWORD SIMULATION & EMAIL VALIDATION
function initForgotPasswordForm() {
  const forgotForm = document.getElementById('forgotPasswordForm');
  if (!forgotForm) return;

  const emailInput = document.getElementById('forgotEmail');
  const errorAlert = document.getElementById('forgotErrorAlert');
  const successAlert = document.getElementById('forgotSuccessAlert');
  const confirmedEmailSpan = document.getElementById('forgotConfirmedEmail');

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (errorAlert) errorAlert.style.display = 'none';
    if (successAlert) successAlert.style.display = 'none';

    const email = emailInput.value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (!email || !emailRegex.test(email)) {
      if (errorAlert) {
        document.getElementById('forgotErrorMessage').textContent = 'Please enter a valid university email address.';
        errorAlert.style.display = 'flex';
      }
      emailInput.classList.add('is-invalid');
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    emailInput.classList.remove('is-invalid');

    // Simulate lookup in registered accounts
    const users = getRegisteredUsers();
    const accountExists = users.find(u => u.email.toLowerCase() === email);

    if (accountExists) {
      // Simulate successful recovery process
      if (confirmedEmailSpan) {
        // Mask email slightly (e.g. al***@campus.edu)
        const parts = email.split('@');
        const masked = parts[0].substring(0, 2) + '***@' + parts[1];
        confirmedEmailSpan.textContent = masked;
      }
      if (successAlert) successAlert.style.display = 'flex';
      showToast(`Password recovery link simulated for ${email}!`, 'success');
      forgotForm.reset();
    } else {
      // Informative feedback
      if (errorAlert) {
        document.getElementById('forgotErrorMessage').textContent = `No campus account found matching '${email}'. Try one of our sample accounts like 'alex@campus.edu' or 'sarah@univ.edu'.`;
        errorAlert.style.display = 'flex';
      }
      showToast('Account not found with this email.', 'error');
    }
  });
}
