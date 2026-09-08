// ============================================================
//  HomeEase Pro — Service Provider Profile Setup Controller
// ============================================================

const DEFAULT_PRO_DATA = {
  category: "Plumbing",
  categorySlug: "plumbing",
  name: "Kazi Rahim",
  phone: "+880 1733-445566",
  email: "kazi.rahim@homeease.bd",
  experience: "4.8 yrs",
  hub: "Dhaka North Hub",
  vehicleType: "Motorcycle",
  vehicleNumber: "Dhaka Metro-Ha 42-9912",
  nidNumber: "19942691234567890",
  photo: "../assets/images/logo.png",
  rating: "4.9",
  totalReviews: 218
};

document.addEventListener("DOMContentLoaded", () => {
  // Load existing or default profile
  let proData = DEFAULT_PRO_DATA;
  try {
    const saved = localStorage.getItem("homeease_provider_profile");
    if (saved) {
      proData = { ...DEFAULT_PRO_DATA, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Storage read error:", e);
  }

  // Prepopulate form fields
  document.getElementById("proNameInput").value = proData.name || "";
  document.getElementById("proPhoneInput").value = proData.phone || "";
  document.getElementById("proEmailInput").value = proData.email || "";
  document.getElementById("proExpSelect").value = proData.experience || "3-5 yrs";
  document.getElementById("proHubSelect").value = proData.hub || "Dhaka North Hub";
  document.getElementById("proVehicleType").value = proData.vehicleType || "Motorcycle";
  document.getElementById("proVehicleNumber").value = proData.vehicleNumber || "";
  document.getElementById("proNidInput").value = proData.nidNumber || "";
  if (proData.photo) {
    document.getElementById("proPhotoPreview").src = proData.photo;
  }

  // Select current category card
  let selectedCategory = proData.category || "Plumbing";
  let selectedSlug = proData.categorySlug || "plumbing";

  const catCards = document.querySelectorAll(".cat-select-card");
  catCards.forEach(card => {
    if (card.dataset.cat === selectedCategory) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }

    card.addEventListener("click", () => {
      catCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedCategory = card.dataset.cat;
      selectedSlug = card.dataset.slug;
      showToast(`🎯 Selected Category: ${selectedCategory}`);
    });
  });

  // Photo Upload Handler
  const photoInput = document.getElementById("proPhotoInput");
  const photoPreview = document.getElementById("proPhotoPreview");

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("⚠️ Image is too large (max 5MB).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        photoPreview.src = event.target.result;
        proData.photo = event.target.result;
        showToast("✅ Profile photo uploaded!");
      };
      reader.readAsDataURL(file);
    }
  });

  // Form Submit Handler
  const setupForm = document.getElementById("providerSetupForm");
  setupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("proNameInput").value.trim();
    const phone = document.getElementById("proPhoneInput").value.trim();
    const email = document.getElementById("proEmailInput").value.trim();
    const exp = document.getElementById("proExpSelect").value;
    const hub = document.getElementById("proHubSelect").value;
    const vehicleType = document.getElementById("proVehicleType").value;
    const vehicleNumber = document.getElementById("proVehicleNumber").value.trim();
    const nid = document.getElementById("proNidInput").value.trim();

    if (!name) {
      showToast("Please enter your full name.");
      return;
    }
    if (!phone) {
      showToast("Please enter your contact mobile number.");
      return;
    }
    if (!selectedCategory) {
      showToast("Please choose your service trade category.");
      return;
    }

    const updatedProfile = {
      ...proData,
      name,
      phone,
      email,
      category: selectedCategory,
      categorySlug: selectedSlug,
      experience: exp,
      hub: hub,
      vehicleType,
      vehicleNumber,
      nidNumber: nid
    };

    try {
      localStorage.setItem("homeease_provider_profile", JSON.stringify(updatedProfile));
    } catch (err) {
      console.error("Storage write error:", err);
    }

    const submitBtn = document.getElementById("saveProBtn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Saving Profile…`;

    showToast(`🎉 Partner Profile registered under ${selectedCategory}!`);

    setTimeout(() => {
      window.location.href = "provider-dashboard.html";
    }, 1200);
  });

  // Toast Helper
  let _tt;
  function showToast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(_tt);
    _tt = setTimeout(() => t.classList.remove("show"), 3000);
  }
});

