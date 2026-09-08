// ============================================================
//  HomeEase Pro — Service Provider Dashboard Logic (Dynamic Category)
// ============================================================

// Sample Requests per Category
const CATEGORY_REQUESTS = {
  "Plumbing": [
    { title: "Pipe Leakage & Joint Sealing", payout: "৳850", location: "Banani Road 8", dist: "1.4 km", cust: "Farzana Rahman", notes: "Water dripping under kitchen cabinet valve.", icon: "wrench", color: "#FFF3E0", iconColor: "#F97316" },
    { title: "Water Filter & Tap Replacement", payout: "৳1,100", location: "Gulshan-1 Ave", dist: "2.1 km", cust: "Tanvir Ahmed", notes: "Kitchen RO filter pipe replacement and master tap fitting.", icon: "wrench", color: "#FFF3E0", iconColor: "#F97316" },
    { title: "Bathroom Commode Flush Repair", payout: "৳1,450", location: "Dhanmondi 27", dist: "3.2 km", cust: "Nusrat Jahan", notes: "Continuous water flow in master bath cistern.", icon: "wrench", color: "#FFF3E0", iconColor: "#F97316" }
  ],
  "Car Care & Repair": [
    { title: "Mobile Foam Wash & Vacuum", payout: "৳1,200", location: "Banani DOHS", dist: "1.2 km", cust: "Imtiaz Hossain", notes: "Full exterior foam wash and interior vacuuming at home.", icon: "car", color: "#F1F5F9", iconColor: "#475569" },
    { title: "Engine Diagnostic & Oil Change", payout: "৳2,200", location: "Gulshan-2", dist: "2.5 km", cust: "Sabbir Khan", notes: "Toyota Premio 2018 synthetic engine oil + filter replacement.", icon: "car", color: "#F1F5F9", iconColor: "#475569" },
    { title: "Battery Jumpstart & Terminal Fix", payout: "৳800", location: "Mohakhali", dist: "3.1 km", cust: "Rafiqul Islam", notes: "Car not cranking in basement parking.", icon: "car", color: "#F1F5F9", iconColor: "#475569" }
  ],
  "Personal Care": [
    { title: "Haircut, Beard Trim & Head Massage", payout: "৳750", location: "Banani Road 11", dist: "0.9 km", cust: "Zubair Al-Mamun", notes: "Men grooming package with hot towel facial.", icon: "scissors", color: "#FDF4FF", iconColor: "#A21CAF" },
    { title: "Women's Herbal Facial & Home Spa", payout: "৳1,800", location: "Gulshan-2 Ave", dist: "1.8 km", cust: "Shirin Akter", notes: "Herbal facial, pedicure and hair treatment.", icon: "sparkles", color: "#FDF4FF", iconColor: "#A21CAF" },
    { title: "Manicure, Pedicure & Waxing", payout: "৳2,100", location: "Uttara Sector 7", dist: "4.2 km", cust: "Mehnaz Chowdhury", notes: "Premium organic skin care kit requested.", icon: "heart", color: "#FDF4FF", iconColor: "#A21CAF" }
  ],
  "Appliance & Gadgets": [
    { title: "AC Filter Servicing (1.5 Ton)", payout: "৳1,200", location: "Gulshan-2", dist: "1.2 km", cust: "Tanvir Ahmed", notes: "General seasonal cleaning, dust filter spray wash.", icon: "tv", color: "#EEF0FF", iconColor: "#3B2FC9" },
    { title: "Microwave Oven Magnetron Repair", payout: "৳1,100", location: "Banani Rd 11", dist: "1.6 km", cust: "Tasnim Reza", notes: "Plate rotating but not heating food.", icon: "tv", color: "#EEF0FF", iconColor: "#3B2FC9" },
    { title: "Smart TV Wall Mount Installation", payout: "৳700", location: "Mohakhali DOHS", dist: "2.8 km", cust: "Shakib Al Hasan", notes: "55-inch Sony Bravia swivel bracket mounting.", icon: "tv", color: "#EEF0FF", iconColor: "#3B2FC9" }
  ],
  "Electrical": [
    { title: "Short Circuit & MCB Trip Fix", payout: "৳950", location: "Baridhara DOHS", dist: "1.5 km", cust: "Kamal Uddin", notes: "Master bedroom circuit breaker tripping on high load.", icon: "zap", color: "#FFFBEB", iconColor: "#D97706" },
    { title: "Ceiling Fan Installation & Wiring", payout: "৳650", location: "Mohakhali", dist: "2.2 km", cust: "Shakib Al Hasan", notes: "New fan replacement in guest bedroom.", icon: "zap", color: "#FFFBEB", iconColor: "#D97706" },
    { title: "Generator Changeover Switch Fix", payout: "৳2,500", location: "Gulshan-1", dist: "3.0 km", cust: "Rezaul Karim", notes: "Automatic transfer switch wiring inspection.", icon: "zap", color: "#FFFBEB", iconColor: "#D97706" }
  ],
  "Cleaning & Pest": [
    { title: "Deep Apartment Cleaning 3BHK", payout: "৳3,200", location: "Gulshan-2", dist: "1.1 km", cust: "Farhana Yasmin", notes: "Full house vacuuming, tile scrubbing and glass polish.", icon: "home", color: "#F0FDF4", iconColor: "#16A34A" },
    { title: "Kitchen Degreasing & Sanitization", payout: "৳1,200", location: "Banani", dist: "1.7 km", cust: "Saima Noor", notes: "Heavy grease clean on chimney, stove, and tiles.", icon: "home", color: "#F0FDF4", iconColor: "#16A34A" },
    { title: "Cockroach Spray Pest Control", payout: "৳1,600", location: "Dhanmondi", dist: "3.5 km", cust: "Asif Mahmood", notes: "Odourless gel and spray treatment with 3-month guarantee.", icon: "home", color: "#F0FDF4", iconColor: "#16A34A" }
  ],
  "Home Maintenance": [
    { title: "Wall Emulsion Painting Touchup", payout: "৳2,400", location: "Banani Road 4", dist: "1.3 km", cust: "Mahbub Alam", notes: "Moisture repair and Berger primer + plastic paint coat.", icon: "tool", color: "#FFF1F2", iconColor: "#E11D48" },
    { title: "Door Lock & Hinge Carpentry", payout: "৳800", location: "Gulshan", dist: "2.4 km", cust: "Sadia Afrin", notes: "Front security lock jammed, needs replacement.", icon: "tool", color: "#FFF1F2", iconColor: "#E11D48" },
    { title: "Heavy Wall Drilling & Curtain Mount", payout: "৳600", location: "Dhanmondi", dist: "3.8 km", cust: "Nazmul Huda", notes: "8 holes drill in concrete wall for double curtain rod.", icon: "tool", color: "#FFF1F2", iconColor: "#E11D48" }
  ],
  "Moving & Shifting": [
    { title: "1-Ton Pickup Furniture Transport", payout: "৳3,800", location: "Banani to Uttara", dist: "4.5 km", cust: "Hasan Tariq", notes: "1 sofa set, 1 bed frame, and 4 carton boxes shifting.", icon: "truck", color: "#F0FDFA", iconColor: "#0D9488" },
    { title: "2BHK Complete Home Shifting", payout: "৳6,500", location: "Gulshan to Mirpur", dist: "6.2 km", cust: "Monirul Islam", notes: "Bubble wrap packing, loading, transport and unloading.", icon: "truck", color: "#F0FDFA", iconColor: "#0D9488" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  // Load Provider Profile
  let proData = {
    category: "Plumbing",
    name: "Kazi Rahim",
    phone: "+880 1733-445566",
    hub: "Dhaka North Hub",
    rating: "4.9",
    photo: "../assets/images/logo.png"
  };

  try {
    const saved = localStorage.getItem("homeease_provider_profile");
    if (saved) {
      proData = { ...proData, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Storage read error:", e);
  }

  // Update Hero UI with Provider Profile & Category
  const proNameEl = document.getElementById("proNameDisplay");
  const proSpecialtyEl = document.getElementById("proSpecialtyDisplay");
  const proCategoryBadge = document.getElementById("proCategoryBadge");
  const proHubEl = document.getElementById("proHubDisplay");
  const proAvatarEl = document.getElementById("proAvatarDisplay");

  if (proNameEl) proNameEl.textContent = proData.name;
  if (proSpecialtyEl) proSpecialtyEl.textContent = `${proData.category} Specialist • ${proData.hub || 'Dhaka Hub'}`;
  if (proCategoryBadge) proCategoryBadge.textContent = proData.category.toUpperCase();
  if (proHubEl) proHubEl.textContent = proData.hub || "Dhaka North Hub";
  if (proAvatarEl && proData.photo) {
    if (proData.photo.startsWith("data:") || proData.photo.includes("/")) {
      proAvatarEl.innerHTML = `<img src="${proData.photo}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" alt="Pro Photo" />`;
    }
  }

  // Render Requests Specifically for This Category
  renderCategoryRequests(proData.category);

  // State
  let isOnline = true;
  let activeJobStage = 0; // 0: En-route, 1: Arrived, 2: In-Progress, 3: Completed
  let todayEarnings = 3450;
  let completedJobs = 4;

  const dutyToggle = document.getElementById("dutyToggle");
  const dutyText = document.getElementById("dutyText");
  const offlineBanner = document.getElementById("offlineBanner");
  const requestsFeed = document.getElementById("requestsFeed");
  const earningsDisplay = document.getElementById("todayEarningsDisplay");
  const completedJobsDisplay = document.getElementById("completedJobsDisplay");
  const activeJobStatusBadge = document.getElementById("activeJobStatusBadge");
  const updateStatusBtn = document.getElementById("updateStatusBtn");
  const activeJobCard = document.getElementById("activeJobCard");

  // Duty Toggle
  dutyToggle.addEventListener("click", () => {
    isOnline = !isOnline;
    if (isOnline) {
      dutyToggle.classList.add("online");
      dutyText.textContent = "Taking Jobs";
      offlineBanner.classList.remove("show");
      requestsFeed.style.opacity = "1";
      requestsFeed.style.pointerEvents = "auto";
      showToast("🟢 You are ONLINE. Showing requests for " + proData.category);
    } else {
      dutyToggle.classList.remove("online");
      dutyText.textContent = "Offline";
      offlineBanner.classList.add("show");
      requestsFeed.style.opacity = "0.4";
      requestsFeed.style.pointerEvents = "none";
      showToast("⚪ You are OFFLINE. Requests paused.");
    }
  });

  // Active Job Progression
  if (updateStatusBtn) {
    updateStatusBtn.addEventListener("click", () => {
      if (activeJobStage === 0) {
        activeJobStage = 1;
        activeJobStatusBadge.textContent = "AT LOCATION";
        updateStatusBtn.innerHTML = `🔧 Start Service Work`;
        showToast("🏠 Status updated: Arrived at customer location.");
      } else if (activeJobStage === 1) {
        activeJobStage = 2;
        activeJobStatusBadge.textContent = "WORK IN-PROGRESS";
        updateStatusBtn.innerHTML = `✅ Complete & Enter OTP`;
        updateStatusBtn.className = "btn-step btn-step-complete";
        showToast("⚙️ Status updated: Service work started.");
      } else if (activeJobStage === 2) {
        document.getElementById("otpModal").classList.add("open");
      }
    });
  }

  // OTP Verification
  window.closeOtpModal = function() {
    document.getElementById("otpModal").classList.remove("open");
  };

  const otpForm = document.getElementById("otpForm");
  if (otpForm) {
    otpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredOtp = document.getElementById("otpInput").value.trim();
      if (enteredOtp === "4829" || enteredOtp.length === 4) {
        closeOtpModal();
        activeJobStage = 3;
        todayEarnings += 2850;
        completedJobs += 1;
        earningsDisplay.textContent = `৳${todayEarnings.toLocaleString()}`;
        completedJobsDisplay.textContent = completedJobs;
        
        activeJobCard.innerHTML = `
          <div style="padding: 24px 16px; text-align: center; background: #F0FDF4;">
            <div style="font-size: 38px;">🎉</div>
            <div style="font-size: 16px; font-weight: 800; color: #15803D; margin-top: 8px;">Job Completed &amp; Verified!</div>
            <div style="font-size: 13px; color: #166534; margin-top: 4px;">৳2,850 credited to your Partner Wallet.</div>
          </div>
        `;
        showToast("💵 ৳2,850 successfully credited to your wallet!");
      } else {
        showToast("❌ Invalid OTP. Enter customer's 4-digit code (4829).");
      }
    });
  }

  // Render Requests Feed
  function renderCategoryRequests(category) {
    const list = CATEGORY_REQUESTS[category] || CATEGORY_REQUESTS["Plumbing"];
    const feed = document.getElementById("requestsFeed");
    const countBadge = document.getElementById("incomingCountBadge");

    if (!feed) return;
    feed.innerHTML = "";
    if (countBadge) countBadge.textContent = list.length;

    list.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "request-feed-card";
      card.innerHTML = `
        <div class="req-top-meta">
          <div class="req-distance">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            ${item.dist} &bull; ${item.location}
          </div>
          <div class="req-payout">${item.payout}</div>
        </div>
        <div class="req-main-info">
          <div class="req-icon-box" style="background:${item.color};color:${item.iconColor};">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div class="req-details">
            <div class="req-title">${item.title}</div>
            <div class="req-address">Customer: ${item.cust} &bull; ${item.location}</div>
            <div class="req-notes">"${item.notes}"</div>
          </div>
        </div>
        <div class="req-btn-row">
          <button class="req-btn req-btn-accept" onclick="acceptRequest(this, '${item.title}', '${item.payout}', '${item.cust}', '${item.dist}')">
            ✓ Accept Job
          </button>
          <button class="req-btn req-btn-decline" onclick="declineRequest(this)">
            Pass
          </button>
        </div>
      `;
      feed.appendChild(card);
    });
  }

  // Action Helpers
  window.acceptRequest = function(btn, jobName, price, customerName, distance) {
    const card = btn.closest(".request-feed-card");
    btn.disabled = true;
    btn.innerHTML = `Accepting…`;

    setTimeout(() => {
      card.style.transition = "all 0.3s ease";
      card.style.transform = "scale(0.95)";
      card.style.opacity = "0";

      setTimeout(() => {
        card.remove();
        showToast(`✅ Accepted: ${jobName} (${price}) for ${customerName}!`);
        const countBadge = document.getElementById("incomingCountBadge");
        const currentCount = parseInt(countBadge.textContent) || 1;
        countBadge.textContent = Math.max(0, currentCount - 1);
      }, 300);
    }, 600);
  };

  window.declineRequest = function(btn) {
    const card = btn.closest(".request-feed-card");
    card.style.transition = "all 0.3s ease";
    card.style.opacity = "0";
    card.style.transform = "translateX(-20px)";
    setTimeout(() => {
      card.remove();
      showToast("Request passed.");
      const countBadge = document.getElementById("incomingCountBadge");
      const currentCount = parseInt(countBadge.textContent) || 1;
      countBadge.textContent = Math.max(0, currentCount - 1);
    }, 300);
  };

  window.callCustomer = function() {
    showToast("📞 Calling customer…");
  };

  window.chatCustomer = function() {
    showToast("💬 Opening direct customer chat…");
  };

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
