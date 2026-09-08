// ============================================================
//  HomeEase — Interactive Profile & Real-Time Editable State
// ============================================================

const DEFAULT_PROFILE = {
  name: "Md. Sayadul Islam",
  subtitle: "Customer • HomeEase Member since 2024",
  phone: "+880 1712-345678",
  email: "sayadul@email.com",
  avatar: "../assets/images/avatar-sayad.jpg",
  language: "English (BD)",
  notificationsEnabled: true,
  defaultHub: "Dhaka North Hub",
  currency: "BDT (৳)",
  twoFactorAuth: false
};

const DEFAULT_ADDRESSES = [
  { id: 1, label: "Home", icon: "🏠", addressLine: "House 42, Road 11, Banani, Dhaka" },
  { id: 2, label: "Office", icon: "🏢", addressLine: "Level 4, Bashundhara City, Dhaka" }
];

const DEFAULT_PAYMENTS = [
  { id: 1, name: "bKash", mask: "•••• 5678", code: "bK", color: "#E91E8C", isPrimary: true },
  { id: 2, name: "Nagad", mask: "•••• 1234", code: "N", color: "#FF6600", isPrimary: false }
];

// Helper: Local Storage Load/Save
function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

// Global State
let profileData = getStored("homeease_profile", DEFAULT_PROFILE);
let addressList = getStored("homeease_addresses", DEFAULT_ADDRESSES);
let paymentList = getStored("homeease_payments", DEFAULT_PAYMENTS);

let editingAddressId = null;

// Toast Helper
let _toastTimer;
function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// Modal Open / Close Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// Render Profile Details to DOM
function renderProfile() {
  document.getElementById("profileName").textContent = profileData.name;
  document.getElementById("profileSubtitle").textContent = profileData.subtitle;
  document.getElementById("profileAvatarImg").src = profileData.avatar;
  document.getElementById("phoneDisplay").textContent = profileData.phone;
  document.getElementById("emailDisplay").textContent = profileData.email;
  document.getElementById("langDisplay").textContent = profileData.language;
  document.getElementById("hubDisplay").textContent = profileData.defaultHub;
  document.getElementById("currencyDisplay").textContent = profileData.currency;

  // Notification toggle
  const notifToggle = document.getElementById("notifToggle");
  const notifLabel = document.getElementById("notifDisplay");
  if (profileData.notificationsEnabled) {
    notifToggle.classList.add("on");
    notifLabel.textContent = "All enabled";
  } else {
    notifToggle.classList.remove("on");
    notifLabel.textContent = "Muted / Off";
  }

  // 2FA toggle
  const tfaToggle = document.getElementById("tfaToggle");
  const tfaLabel = document.getElementById("tfaDisplay");
  if (profileData.twoFactorAuth) {
    tfaToggle.classList.add("on");
    tfaLabel.textContent = "Enabled (SMS OTP)";
    tfaLabel.style.color = "var(--green)";
  } else {
    tfaToggle.classList.remove("on");
    tfaLabel.textContent = "Off";
    tfaLabel.style.color = "var(--text-muted)";
  }
}

// Render Saved Addresses to DOM
function renderAddresses() {
  const container = document.getElementById("addressContainer");
  container.innerHTML = "";

  if (addressList.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;">
        No saved addresses. Tap below to add one.
      </div>
    `;
    return;
  }

  addressList.forEach(addr => {
    const row = document.createElement("div");
    row.className = "ps-row";
    row.innerHTML = `
      <div class="ps-icon" style="background: ${addr.label === 'Home' ? '#EEF0FF' : '#F0FDF4'};">${addr.icon || '📍'}</div>
      <div class="ps-info">
        <div class="ps-label">${addr.label}</div>
        <div class="ps-value">${addr.addressLine}</div>
      </div>
      <div class="ps-right">
        <button class="ps-btn-sm ps-btn-edit" onclick="handleEditAddress(${addr.id})">Edit</button>
        <button class="ps-btn-sm ps-btn-del" onclick="handleDeleteAddress(${addr.id})">Del</button>
      </div>
    `;
    container.appendChild(row);
  });
}

// Render Payment Methods to DOM
function renderPayments() {
  const container = document.getElementById("paymentContainer");
  container.innerHTML = "";

  paymentList.forEach(pay => {
    const row = document.createElement("div");
    row.className = "ps-row";
    row.innerHTML = `
      <div class="payment-logo" style="background: ${pay.color}; color: #fff;">${pay.code}</div>
      <div class="ps-info">
        <div class="ps-label">${pay.name}</div>
        <div class="ps-value">${pay.mask}</div>
      </div>
      <div class="ps-right">
        ${pay.isPrimary ? '<span class="primary-tag">Primary</span>' : `<button class="ps-btn-sm ps-btn-edit" onclick="setPrimaryPayment(${pay.id})">Set Primary</button>`}
        <button class="ps-btn-sm ps-btn-del" onclick="deletePayment(${pay.id})">✕</button>
      </div>
    `;
    container.appendChild(row);
  });
}

// ── Address Handlers ──
function handleEditAddress(id) {
  const addr = addressList.find(a => a.id === id);
  if (!addr) return;
  editingAddressId = id;
  document.getElementById("addrModalTitle").textContent = "Edit Address";
  document.getElementById("addrLabelInput").value = addr.label;
  document.getElementById("addrLineInput").value = addr.addressLine;
  openModal("addressModal");
}

function handleDeleteAddress(id) {
  if (confirm("Are you sure you want to delete this address?")) {
    addressList = addressList.filter(a => a.id !== id);
    setStored("homeease_addresses", addressList);
    renderAddresses();
    showToast("🗑️ Address removed");
  }
}

function handleAddAddress() {
  editingAddressId = null;
  document.getElementById("addrModalTitle").textContent = "Add New Address";
  document.getElementById("addrLabelInput").value = "Home";
  document.getElementById("addrLineInput").value = "";
  openModal("addressModal");
}

// ── Payment Handlers ──
function setPrimaryPayment(id) {
  paymentList = paymentList.map(p => ({
    ...p,
    isPrimary: p.id === id
  }));
  setStored("homeease_payments", paymentList);
  renderPayments();
  showToast("⭐ Primary payment method updated");
}

function deletePayment(id) {
  if (paymentList.length <= 1) {
    showToast("⚠️ You must keep at least one payment method.");
    return;
  }
  if (confirm("Remove this payment method?")) {
    paymentList = paymentList.filter(p => p.id !== id);
    if (!paymentList.some(p => p.isPrimary)) {
      paymentList[0].isPrimary = true;
    }
    setStored("homeease_payments", paymentList);
    renderPayments();
    showToast("🗑️ Payment method removed");
  }
}

// DOM Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderAddresses();
  renderPayments();

  // 1. Photo Upload
  const avatarFileInput = document.getElementById("avatarFileInput");
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const profileAvatarImg = document.getElementById("profileAvatarImg");

  function triggerFile() {
    avatarFileInput.click();
  }

  changePhotoBtn.addEventListener("click", triggerFile);
  profileAvatarImg.addEventListener("click", triggerFile);

  avatarFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("⚠️ Image file is too large (max 5MB).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        profileData.avatar = dataUrl;
        setStored("homeease_profile", profileData);
        profileAvatarImg.src = dataUrl;
        showToast("✅ Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  });

  // 2. Edit Profile Modal
  document.getElementById("editProfileBtn").addEventListener("click", () => {
    document.getElementById("editNameInput").value = profileData.name;
    document.getElementById("editSubtitleInput").value = profileData.subtitle;
    document.getElementById("editPhoneInput").value = profileData.phone;
    document.getElementById("editEmailInput").value = profileData.email;
    openModal("editProfileModal");
  });

  document.getElementById("editProfileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newName = document.getElementById("editNameInput").value.trim();
    const newSubtitle = document.getElementById("editSubtitleInput").value.trim();
    const newPhone = document.getElementById("editPhoneInput").value.trim();
    const newEmail = document.getElementById("editEmailInput").value.trim();

    if (!newName) {
      showToast("Please enter your name.");
      return;
    }

    profileData.name = newName;
    profileData.subtitle = newSubtitle || "Customer • HomeEase Member";
    profileData.phone = newPhone || profileData.phone;
    profileData.email = newEmail || profileData.email;

    setStored("homeease_profile", profileData);
    renderProfile();
    closeModal("editProfileModal");
    showToast("✅ Profile successfully updated!");
  });

  // 3. Address Modal Form
  document.getElementById("addressForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const label = document.getElementById("addrLabelInput").value.trim() || "Home";
    const line = document.getElementById("addrLineInput").value.trim();

    if (!line) {
      showToast("Please enter an address.");
      return;
    }

    let icon = "📍";
    if (label.toLowerCase().includes("home")) icon = "🏠";
    else if (label.toLowerCase().includes("office") || label.toLowerCase().includes("work")) icon = "🏢";

    if (editingAddressId !== null) {
      addressList = addressList.map(a => a.id === editingAddressId ? { ...a, label, addressLine: line, icon } : a);
      showToast("✅ Address updated!");
    } else {
      const newId = Date.now();
      addressList.push({ id: newId, label, addressLine: line, icon });
      showToast("✅ New address added!");
    }

    setStored("homeease_addresses", addressList);
    renderAddresses();
    closeModal("addressModal");
  });

  // 4. Language Selection Modal
  document.getElementById("languageRow").addEventListener("click", () => {
    document.querySelectorAll(".lang-opt").forEach(item => {
      item.classList.toggle("selected", item.dataset.val === profileData.language);
    });
    openModal("languageModal");
  });

  document.querySelectorAll(".lang-opt").forEach(item => {
    item.addEventListener("click", () => {
      profileData.language = item.dataset.val;
      setStored("homeease_profile", profileData);
      renderProfile();
      closeModal("languageModal");
      showToast(`🌐 Language changed to ${profileData.language}`);
    });
  });

  // 5. Default Hub Selection Modal
  document.getElementById("hubRow").addEventListener("click", () => {
    document.querySelectorAll(".hub-opt").forEach(item => {
      item.classList.toggle("selected", item.dataset.val === profileData.defaultHub);
    });
    openModal("hubModal");
  });

  document.querySelectorAll(".hub-opt").forEach(item => {
    item.addEventListener("click", () => {
      profileData.defaultHub = item.dataset.val;
      setStored("homeease_profile", profileData);
      renderProfile();
      closeModal("hubModal");
      showToast(`📍 Default hub set to ${profileData.defaultHub}`);
    });
  });

  // 6. Currency Selection Modal
  document.getElementById("currencyRow").addEventListener("click", () => {
    document.querySelectorAll(".curr-opt").forEach(item => {
      item.classList.toggle("selected", item.dataset.val === profileData.currency);
    });
    openModal("currencyModal");
  });

  document.querySelectorAll(".curr-opt").forEach(item => {
    item.addEventListener("click", () => {
      profileData.currency = item.dataset.val;
      setStored("homeease_profile", profileData);
      renderProfile();
      closeModal("currencyModal");
      showToast(`💱 Currency changed to ${profileData.currency}`);
    });
  });

  // 7. Notification Toggle
  document.getElementById("notifToggle").addEventListener("click", () => {
    profileData.notificationsEnabled = !profileData.notificationsEnabled;
    setStored("homeease_profile", profileData);
    renderProfile();
    showToast(profileData.notificationsEnabled ? "🔔 All notifications enabled" : "🔕 Notifications muted");
  });

  // 8. 2FA Toggle
  document.getElementById("tfaToggle").addEventListener("click", () => {
    profileData.twoFactorAuth = !profileData.twoFactorAuth;
    setStored("homeease_profile", profileData);
    renderProfile();
    showToast(profileData.twoFactorAuth ? "🛡️ 2-Factor Authentication enabled" : "⚠️ 2FA disabled");
  });

  // 9. Change Password Modal
  document.getElementById("changePasswordRow").addEventListener("click", () => {
    document.getElementById("currPwInput").value = "";
    document.getElementById("newPwInput").value = "";
    document.getElementById("confirmPwInput").value = "";
    openModal("passwordModal");
  });

  document.getElementById("passwordForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const currPw = document.getElementById("currPwInput").value;
    const newPw = document.getElementById("newPwInput").value;
    const confPw = document.getElementById("confirmPwInput").value;

    if (!currPw) {
      showToast("Please enter your current password.");
      return;
    }
    if (newPw.length < 6) {
      showToast("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confPw) {
      showToast("Passwords do not match.");
      return;
    }

    closeModal("passwordModal");
    showToast("🔒 Password successfully changed!");
  });

  // 10. Add Payment Method Modal
  document.getElementById("addPaymentRow").addEventListener("click", () => {
    document.getElementById("payMethodType").value = "bKash";
    document.getElementById("payAccountNum").value = "";
    document.getElementById("payIsPrimary").checked = false;
    openModal("paymentModal");
  });

  document.getElementById("paymentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("payMethodType").value;
    const account = document.getElementById("payAccountNum").value.trim();
    const isPrimary = document.getElementById("payIsPrimary").checked;

    if (!account || account.length < 4) {
      showToast("Please enter a valid account or card number.");
      return;
    }

    const mask = "•••• " + account.slice(-4);
    let code = "bK";
    let color = "#E91E8C";

    if (type === "Nagad") {
      code = "N";
      color = "#FF6600";
    } else if (type === "Rocket") {
      code = "R";
      color = "#8E24AA";
    } else if (type === "Visa" || type === "MasterCard") {
      code = "💳";
      color = "#1E3A8A";
    }

    const newPayment = {
      id: Date.now(),
      name: type,
      mask: mask,
      code: code,
      color: color,
      isPrimary: isPrimary
    };

    if (isPrimary) {
      paymentList.forEach(p => p.isPrimary = false);
    }

    paymentList.push(newPayment);
    setStored("homeease_payments", paymentList);
    renderPayments();
    closeModal("paymentModal");
    showToast(`✅ ${type} payment method added!`);
  });

  // 11. Interactive App Rating Modal
  document.getElementById("rateAppRow").addEventListener("click", () => {
    openModal("rateModal");
  });

  const rateStars = document.querySelectorAll("#modalRateStars span");
  let chosenRating = 5;
  rateStars.forEach((s, idx) => {
    s.addEventListener("click", () => {
      chosenRating = idx + 1;
      rateStars.forEach((st, j) => st.textContent = j < chosenRating ? "⭐" : "☆");
    });
  });

  document.getElementById("submitRatingBtn").addEventListener("click", () => {
    closeModal("rateModal");
    showToast(`🎉 Thank you for rating HomeEase ${chosenRating} stars!`);
  });

  // 12. Policy & Terms & Support Modals
  document.getElementById("privacyRow").addEventListener("click", () => {
    document.getElementById("infoModalTitle").textContent = "Privacy Policy";
    document.getElementById("infoModalContent").innerHTML = `
      <p style="font-size:13px; color:var(--text-muted); line-height:1.6; margin-bottom:12px;">
        HomeEase respects your privacy. All customer data, location coordinates, phone numbers, and NID credentials are encrypted and stored in strict compliance with Bangladesh Data Protection Regulations.
      </p>
      <p style="font-size:13px; color:var(--text-muted); line-height:1.6;">
        We never sell or share your personal contact details with third-party advertising networks.
      </p>
    `;
    openModal("infoModal");
  });

  document.getElementById("termsRow").addEventListener("click", () => {
    document.getElementById("infoModalTitle").textContent = "Terms of Service";
    document.getElementById("infoModalContent").innerHTML = `
      <p style="font-size:13px; color:var(--text-muted); line-height:1.6; margin-bottom:12px;">
        By using HomeEase Smart Home services, customers agree to verify service completion before releasing the OTP to the technician.
      </p>
      <p style="font-size:13px; color:var(--text-muted); line-height:1.6;">
        All completed jobs include our guaranteed 7-Day Free Revisit Warranty in Dhaka, Chattogram, and Sylhet.
      </p>
    `;
    openModal("infoModal");
  });

  document.getElementById("supportRow").addEventListener("click", () => {
    document.getElementById("infoModalTitle").textContent = "Help & Support 24/7";
    document.getElementById("infoModalContent").innerHTML = `
      <div style="background:var(--primary-light); padding:14px; border-radius:12px; margin-bottom:14px;">
        <div style="font-size:13px; font-weight:700; color:var(--primary);">Emergency Hotline: 16420</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:3px;">Toll-free 24/7 dedicated support desk across Bangladesh</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <a href="tel:16420" style="display:block; text-align:center; padding:12px; background:var(--primary); color:#fff; border-radius:10px; font-weight:700; text-decoration:none;">📞 Call 16420</a>
        <button onclick="closeModal('infoModal'); showToast('💬 Live chat support connected!')" style="padding:12px; background:#F1F5F9; border:1px solid var(--border); border-radius:10px; font-weight:700; cursor:pointer;">💬 Start Live Chat</button>
      </div>
    `;
    openModal("infoModal");
  });

  // 13. Log Out
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to log out of HomeEase?")) {
      showToast("👋 Logged out successfully");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    }
  });

  // Close modals on overlay backdrop click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });
});
