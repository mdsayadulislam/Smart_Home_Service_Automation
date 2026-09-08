// ============================================================
//  Smart Home Service Automation — Login Page Logic
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---- Role Toggle ---- */
  const roleBtns = document.querySelectorAll(".role-toggle button");
  roleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      roleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const role = btn.dataset.role;
      updatePlaceholders(role);
    });
  });

  function updatePlaceholders(role) {
    const mobileInput = document.getElementById("mobileInput");
    if (role === "provider") {
      mobileInput.placeholder = "+880 17XX-XXXXXX or business email";
    } else {
      mobileInput.placeholder = "+880 17XX-XXXXXX or email";
    }
  }

  /* ---- Password Toggle ---- */
  const passwordInput  = document.getElementById("passwordInput");
  const passwordToggle = document.getElementById("passwordToggle");
  const eyeOpen        = document.getElementById("eyeOpen");
  const eyeClosed      = document.getElementById("eyeClosed");

  passwordToggle.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type  = isHidden ? "text" : "password";
    eyeOpen.style.display   = isHidden ? "none"  : "block";
    eyeClosed.style.display = isHidden ? "block" : "none";
  });

  /* ---- Remember Me Toggle ---- */
  const rememberChk   = document.getElementById("rememberMe");
  const toggleWrap    = document.querySelector(".toggle-wrap");

  toggleWrap.addEventListener("click", () => {
    rememberChk.checked = !rememberChk.checked;
  });

  /* ---- Form Submission ---- */
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const mobile   = document.getElementById("mobileInput").value.trim();
    const password = passwordInput.value.trim();

    // Basic validation
    if (!mobile) {
      shake(document.getElementById("mobileWrap"));
      showToast("Please enter your mobile number or email.");
      return;
    }

    if (!password) {
      shake(document.getElementById("passwordWrap"));
      showToast("Please enter your password.");
      return;
    }

    // Simulate login (replace with real API call)
    const btn = document.getElementById("loginBtn");
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin">
        <path d="M21 12a9 9 0 1 1-9-9"/>
      </svg>
      Logging in…
    `;

    const activeRoleBtn = document.querySelector(".role-toggle button.active");
    const role = activeRoleBtn ? activeRoleBtn.dataset.role : "customer";

    setTimeout(() => {
      if (role === "provider") {
        showToast("👨‍🔧 Welcome Partner! Loading Provider Portal…");
        setTimeout(() => {
          window.location.href = "provider-dashboard.html";
        }, 1000);
      } else {
        showToast("✅ Login successful! Loading Dashboard…");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      }
    }, 1200);
  });

  /* ---- Social Login Buttons ---- */
  document.querySelectorAll(".social-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const provider = btn.dataset.provider;
      showToast(`${capitalize(provider)} login coming soon!`);
    });
  });

  /* ---- Forgot Password ---- */
  document.getElementById("forgotLink").addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Password reset link sent to your email!");
  });

  /* ---- Helpers ---- */
  let toastTimeout;

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function shake(el) {
    el.classList.remove("shake");
    void el.offsetWidth; // reflow
    el.classList.add("shake");
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});

