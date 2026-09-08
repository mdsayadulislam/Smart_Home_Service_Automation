// ============================================================
//  Smart Home Service Automation — Secure Role-Based Authentication
// ============================================================

// Default Seed Users (if not already initialized in localStorage)
const INITIAL_USERS = [
  {
    name: "Md. Sayadul Islam",
    phone: "01712345678",
    email: "sayadul@email.com",
    password: "password123",
    role: "customer"
  },
  {
    name: "Kazi Rahim",
    phone: "01733445566",
    email: "kazi.rahim@homeease.bd",
    password: "pro12345",
    role: "provider",
    category: "Plumbing"
  },
  {
    name: "Rahim Uddin",
    phone: "01722334455",
    email: "rahim.uddin@homeease.bd",
    password: "pro12345",
    role: "provider",
    category: "Appliance & Gadgets"
  }
];

// Helper: Normalize phone numbers for easy matching (+88017... -> 017...)
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
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Storage error:", e);
  }
  // Initialize default seed users
  localStorage.setItem("homeease_users_db", JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
}

document.addEventListener("DOMContentLoaded", () => {
  // Ensure DB is initialized
  getUsersDB();

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
      const role = btn.dataset.role;
      updatePlaceholders(role);
    });
  });

  function updatePlaceholders(role) {
    const mobileInput = document.getElementById("mobileInput");
    if (role === "provider") {
      mobileInput.placeholder = "01733445566 or business email";
    } else {
      mobileInput.placeholder = "01712345678 or email";
    }
  }

  /* ---- Password Visibility Toggle ---- */
  const passwordInput  = document.getElementById("passwordInput");
  const passwordToggle = document.getElementById("passwordToggle");
  const eyeOpen        = document.getElementById("eyeOpen");
  const eyeClosed      = document.getElementById("eyeClosed");

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type  = isHidden ? "text" : "password";
      eyeOpen.style.display   = isHidden ? "none"  : "block";
      eyeClosed.style.display = isHidden ? "block" : "none";
    });
  }

  /* ---- Remember Me Toggle ---- */
  const rememberChk = document.getElementById("rememberMe");
  const toggleWrap  = document.querySelector(".toggle-wrap");
  if (toggleWrap && rememberChk) {
    toggleWrap.addEventListener("click", () => {
      rememberChk.checked = !rememberChk.checked;
    });
  }

  /* ---- Form Submission with Strict Role & Password Validation ---- */
  const loginForm = document.getElementById("loginForm");
  const loginBtn  = document.getElementById("loginBtn");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const rawIdentifier = document.getElementById("mobileInput").value.trim();
    const password = passwordInput.value.trim();

    // 1. Basic empty check
    if (!rawIdentifier) {
      shake(document.getElementById("mobileWrap"));
      showToast("Please enter your mobile number or email.");
      return;
    }

    if (!password) {
      shake(document.getElementById("passwordWrap"));
      showToast("Please enter your password.");
      return;
    }

    // Get selected login role (customer vs provider)
    const activeRoleBtn = document.querySelector(".role-toggle button.active");
    const requestedRole = activeRoleBtn ? activeRoleBtn.dataset.role : "customer";

    const users = getUsersDB();
    const normalizedId = normalizePhone(rawIdentifier);

    // 2. Find user by normalized phone OR by email
    const user = users.find(u => {
      const uPhone = normalizePhone(u.phone);
      const isPhoneMatch = uPhone === normalizedId;
      const isEmailMatch = u.email && u.email.toLowerCase() === rawIdentifier.toLowerCase();
      return isPhoneMatch || isEmailMatch;
    });

    // 3. User does not exist
    if (!user) {
      shake(document.getElementById("mobileWrap"));
      showToast(`❌ No account found for "${rawIdentifier}". Please Sign Up.`);
      return;
    }

    // 4. Validate Password strictly!
    if (user.password !== password) {
      shake(document.getElementById("passwordWrap"));
      showToast("❌ Incorrect password! Please check and try again.");
      return;
    }

    // 5. Strict Role Isolation Check!
    // Customer cannot log in as Provider, and Provider cannot log in as Customer
    if (user.role !== requestedRole) {
      shake(document.querySelector(".role-toggle"));
      if (user.role === "customer" && requestedRole === "provider") {
        showToast("⛔ Access Denied: This is a Customer account! Please switch to the 'Customer' tab to log in.");
      } else {
        showToast("⛔ Access Denied: This is a Service Provider account! Please switch to the 'Service Provider' tab to log in.");
      }
      return;
    }

    // 6. Login Verified!
    loginBtn.disabled = true;
    loginBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin">
        <path d="M21 12a9 9 0 1 1-9-9"/>
      </svg>
      Verifying credentials…
    `;

    // Save active session
    try {
      localStorage.setItem("homeease_current_user", JSON.stringify(user));
      localStorage.setItem("homeease_current_role", user.role);
    } catch (err) {}

    setTimeout(() => {
      if (user.role === "provider") {
        showToast(`👨‍🔧 Welcome Partner ${user.name}! Loading Provider Portal…`);
        setTimeout(() => {
          window.location.href = "provider-dashboard.html";
        }, 1000);
      } else {
        showToast(`✅ Welcome back, ${user.name}! Loading Dashboard…`);
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      }
    }, 900);
  });

  /* ---- Social Login Buttons ---- */
  document.querySelectorAll(".social-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const provider = btn.dataset.provider;
      showToast(`${capitalize(provider)} login coming soon!`);
    });
  });

  /* ---- Forgot Password ---- */
  const forgotLink = document.getElementById("forgotLink");
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("💡 Demo logins: Customer = password123 | Provider = pro12345");
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

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }
});
