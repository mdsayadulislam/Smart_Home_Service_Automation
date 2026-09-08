// ============================================================
//  Smart Home Service Automation — Sign Up Page Logic
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---- Role Toggle ---- */
  const roleBtns = document.querySelectorAll(".role-toggle button");
  roleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      roleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ---- Password Visibility Toggle ---- */
  const passwordInput  = document.getElementById("passwordInput");
  const passwordToggle = document.getElementById("passwordToggle");
  const eyeOpen        = document.getElementById("eyeOpen");
  const eyeClosed      = document.getElementById("eyeClosed");

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display   = isHidden ? "none"  : "block";
        eyeClosed.style.display = isHidden ? "block" : "none";
      }
    });
  }

  /* ---- Form Submission ---- */
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("nameInput");
      const phoneInput = document.getElementById("phoneInput");
      const name = nameInput ? nameInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      if (!name) {
        shake(document.getElementById("nameWrap"));
        showToast("Please enter your full name.");
        return;
      }

      if (!phone) {
        shake(document.getElementById("phoneWrap"));
        showToast("Please enter your mobile number.");
        return;
      }

      if (!password || password.length < 6) {
        shake(document.getElementById("passwordWrap"));
        showToast("Password must be at least 6 characters.");
        return;
      }

      const activeRoleBtn = document.querySelector(".role-toggle button.active");
      const role = activeRoleBtn ? activeRoleBtn.dataset.role : "customer";

      const btn = document.getElementById("signupBtn");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin">
            <path d="M21 12a9 9 0 1 1-9-9"/>
          </svg>
          Creating Account…
        `;
      }

      setTimeout(() => {
        if (role === "provider") {
          showToast("🎉 Account created! Welcome to Partner Hub…");
          setTimeout(() => {
            window.location.href = "provider-dashboard.html";
          }, 1000);
        } else {
          showToast("🎉 Account created! Loading Dashboard…");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1000);
        }
      }, 1200);
    });
  }

  /* ---- Social Sign Up Buttons ---- */
  document.querySelectorAll(".social-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const provider = btn.dataset.provider;
      showToast(`${capitalize(provider)} sign up coming soon!`);
    });
  });

  /* ---- Helpers ---- */
  let toastTimeout;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function shake(el) {
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }
});

