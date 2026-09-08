// ============================================================
//  Smart Home Service Automation — Sign Up & Registration Logic
// ============================================================

// Helper: Normalize phone numbers
function normalizePhone(input) {
  if (!input) return "";
  let p = input.trim().replace(/[\s\-()]/g, "");
  if (p.startsWith("+880")) p = "0" + p.slice(4);
  else if (p.startsWith("880")) p = "0" + p.slice(3);
  else if (!p.startsWith("0") && p.length === 10) p = "0" + p;
  return p;
}

// Get user database from localStorage
function getUsersDB() {
  try {
    const raw = localStorage.getItem("homeease_users_db");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveUserToDB(newUser) {
  const users = getUsersDB();
  users.push(newUser);
  try {
    localStorage.setItem("homeease_users_db", JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save user:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  /* ---- Role Toggle ---- */
  const roleBtns = document.querySelectorAll(".role-toggle button");
  roleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      roleBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    });
  });

  /* ---- Password Visibility Toggles ---- */
  function setupToggle(toggleId, inputId, openId, closedId) {
    const toggle = document.getElementById(toggleId);
    const input  = document.getElementById(inputId);
    const open   = document.getElementById(openId);
    const closed = document.getElementById(closedId);

    if (toggle && input) {
      toggle.addEventListener("click", () => {
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        if (open && closed) {
          open.style.display   = isHidden ? "none"  : "block";
          closed.style.display = isHidden ? "block" : "none";
        }
      });
    }
  }

  setupToggle("passwordToggle", "passwordInput", "eyeOpen1", "eyeClosed1");
  setupToggle("confirmToggle", "confirmPasswordInput", "eyeOpen2", "eyeClosed2");

  /* ---- Form Submission ---- */
  const signupForm = document.getElementById("signupForm");
  const signupBtn  = document.getElementById("signupBtn");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput    = document.getElementById("fullNameInput");
      const mobileInput  = document.getElementById("mobileInput");
      const emailInput   = document.getElementById("emailInput");
      const pwInput      = document.getElementById("passwordInput");
      const cpwInput     = document.getElementById("confirmPasswordInput");

      const name     = nameInput ? nameInput.value.trim() : "";
      const rawPhone = mobileInput ? mobileInput.value.trim() : "";
      const email    = emailInput ? emailInput.value.trim() : "";
      const password = pwInput ? pwInput.value.trim() : "";
      const confirmPw= cpwInput ? cpwInput.value.trim() : "";

      // 1. Validations
      if (!name) {
        shake(document.getElementById("nameWrap"));
        showToast("Please enter your full name.");
        return;
      }

      if (!rawPhone || rawPhone.length < 8) {
        shake(document.getElementById("mobileWrap"));
        showToast("Please enter a valid mobile number.");
        return;
      }

      if (!password || password.length < 6) {
        shake(document.getElementById("passwordWrap"));
        showToast("Password must be at least 6 characters long.");
        return;
      }

      if (password !== confirmPw) {
        shake(document.getElementById("confirmWrap"));
        showToast("❌ Passwords do not match! Please verify.");
        return;
      }

      const activeRoleBtn = document.querySelector(".role-toggle button.active");
      const role = activeRoleBtn ? activeRoleBtn.dataset.role : "customer";

      // 2. Check for duplicate account
      const users = getUsersDB();
      const normPhone = normalizePhone(rawPhone);

      const exists = users.find(u => {
        const phoneMatch = normalizePhone(u.phone) === normPhone;
        const emailMatch = email && u.email && u.email.toLowerCase() === email.toLowerCase();
        return phoneMatch || emailMatch;
      });

      if (exists) {
        shake(document.getElementById("mobileWrap"));
        showToast(`⚠️ An account with this mobile number already exists as a ${exists.role.toUpperCase()}.`);
        return;
      }

      // 3. Register New User
      const newUser = {
        name,
        phone: normPhone,
        email: email || `${normPhone}@user.homeease.bd`,
        password,
        role,
        createdAt: new Date().toISOString()
      };

      saveUserToDB(newUser);

      // Save session
      try {
        localStorage.setItem("homeease_current_user", JSON.stringify(newUser));
        localStorage.setItem("homeease_current_role", role);
      } catch (err) {}

      // UI Loading state
      if (signupBtn) {
        signupBtn.disabled = true;
        signupBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin">
            <path d="M21 12a9 9 0 1 1-9-9"/>
          </svg>
          Creating Account…
        `;
      }

      // 4. Role-based redirect
      setTimeout(() => {
        if (role === "provider") {
          showToast(`🎉 Partner account created! Setting up trade profile…`);
          setTimeout(() => {
            window.location.href = "provider-profile-setup.html";
          }, 1000);
        } else {
          showToast(`🎉 Account created! Welcome, ${name}!`);
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1000);
        }
      }, 1000);
    });
  }

  /* ---- Helpers ---- */
  let toastTimeout;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 3500);
  }

  function shake(el) {
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }
});
