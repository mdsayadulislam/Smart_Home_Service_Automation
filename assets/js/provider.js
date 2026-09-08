// ============================================================
//  HomeEase Pro — Service Provider Dashboard Logic
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // State
  let isOnline = true;
  let activeJobStage = 0; // 0: En-route, 1: Arrived, 2: In-Progress, 3: Completed
  let todayEarnings = 3450;
  let completedJobs = 4;

  const STAGES = [
    { label: "En-route to Customer", btnText: "📍 I Have Arrived", nextStage: 1 },
    { label: "At Customer Location", btnText: "🔧 Start Service Work", nextStage: 2 },
    { label: "Service Work In-Progress", btnText: "✅ Complete & Enter OTP", nextStage: 3 }
  ];

  // DOM Elements
  const dutyToggle = document.getElementById("dutyToggle");
  const dutyText = document.getElementById("dutyText");
  const offlineBanner = document.getElementById("offlineBanner");
  const requestsFeed = document.getElementById("requestsFeed");
  const earningsDisplay = document.getElementById("todayEarningsDisplay");
  const completedJobsDisplay = document.getElementById("completedJobsDisplay");
  const activeJobStatusBadge = document.getElementById("activeJobStatusBadge");
  const updateStatusBtn = document.getElementById("updateStatusBtn");
  const activeJobCard = document.getElementById("activeJobCard");
  const activeJobContainer = document.getElementById("activeJobContainer");

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

  // 1. Online / Offline Duty Switch
  dutyToggle.addEventListener("click", () => {
    isOnline = !isOnline;
    if (isOnline) {
      dutyToggle.classList.add("online");
      dutyText.textContent = "Taking Jobs";
      offlineBanner.classList.remove("show");
      requestsFeed.style.opacity = "1";
      requestsFeed.style.pointerEvents = "auto";
      showToast("🟢 You are ONLINE. New nearby requests enabled!");
    } else {
      dutyToggle.classList.remove("online");
      dutyText.textContent = "Offline";
      offlineBanner.classList.add("show");
      requestsFeed.style.opacity = "0.4";
      requestsFeed.style.pointerEvents = "none";
      showToast("⚪ You are OFFLINE. Nearby requests paused.");
    }
  });

  // 2. Active Job Status Update Progression
  updateStatusBtn.addEventListener("click", () => {
    if (activeJobStage === 0) {
      // Transition to Arrived
      activeJobStage = 1;
      activeJobStatusBadge.textContent = "AT LOCATION";
      updateStatusBtn.innerHTML = `🔧 Start Service Work`;
      showToast("🏠 Status updated: Arrived at House 42, Banani. Customer notified!");
    } else if (activeJobStage === 1) {
      // Transition to In-Progress
      activeJobStage = 2;
      activeJobStatusBadge.textContent = "WORK IN-PROGRESS";
      updateStatusBtn.innerHTML = `✅ Complete & Enter OTP`;
      updateStatusBtn.className = "btn-step btn-step-complete";
      showToast("⚙️ Status updated: AC pressure wash & servicing started.");
    } else if (activeJobStage === 2) {
      // Open OTP Verification Modal
      openOtpModal();
    }
  });

  // 3. OTP Verification Modal
  function openOtpModal() {
    const modal = document.getElementById("otpModal");
    document.getElementById("otpInput").value = "";
    modal.classList.add("open");
  }

  window.closeOtpModal = function() {
    document.getElementById("otpModal").classList.remove("open");
  };

  document.getElementById("otpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredOtp = document.getElementById("otpInput").value.trim();
    if (enteredOtp === "4829" || enteredOtp.length === 4) {
      closeOtpModal();
      activeJobStage = 3;
      todayEarnings += 2850;
      completedJobs += 1;
      earningsDisplay.textContent = `৳${todayEarnings.toLocaleString()}`;
      completedJobsDisplay.textContent = completedJobs;
      
      // Hide active job card & show celebration
      activeJobCard.innerHTML = `
        <div style="padding: 24px 16px; text-align: center; background: #F0FDF4;">
          <div style="font-size: 38px;">🎉</div>
          <div style="font-size: 16px; font-weight: 800; color: #15803D; margin-top: 8px;">Job Completed &amp; Verified!</div>
          <div style="font-size: 13px; color: #166534; margin-top: 4px;">৳2,850 credited to your Partner Wallet.</div>
        </div>
      `;
      showToast("💵 ৳2,850 successfully credited to your wallet!");
    } else {
      showToast("❌ Invalid OTP. Please ask the customer for the correct 4-digit PIN.");
    }
  });

  // 4. Accept Incoming Request
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
        showToast(`✅ Accepted: ${jobName} (${price}) for ${customerName}! Added to your schedule.`);
        const countBadge = document.getElementById("incomingCountBadge");
        const currentCount = parseInt(countBadge.textContent) || 1;
        countBadge.textContent = Math.max(0, currentCount - 1);
      }, 300);
    }, 600);
  };

  // 5. Decline Incoming Request
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

  // 6. Contact Customer Helpers
  window.callCustomer = function() {
    showToast("📞 Calling Md. Sayadul Islam (+880 1712-345678)…");
  };

  window.chatCustomer = function() {
    showToast("💬 Opening direct chat with Md. Sayadul Islam…");
  };
});
