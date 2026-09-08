// ============================================================
//  Smart Home Service Automation — Dashboard Logic
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ── Live ETA countdown ── */
  let etaSeconds = 12 * 60; // 12 minutes in seconds
  const etaEl = document.getElementById("etaMinutes");

  function formatEta(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m} min${m !== 1 ? "s" : ""}` : `${s}s`;
  }

  if (etaEl) {
    setInterval(() => {
      if (etaSeconds > 0) {
        etaSeconds--;
        etaEl.textContent = formatEta(etaSeconds);
      } else {
        etaEl.textContent = "Arrived";
        etaEl.style.color = "var(--green)";
      }
    }, 1000);
  }

  /* ── Search focus ── */
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("focus", () => {
      document.querySelector(".search-inner").style.boxShadow =
        "0 0 0 3px rgba(59,47,201,0.1)";
    });
    searchInput.addEventListener("blur", () => {
      document.querySelector(".search-inner").style.boxShadow = "none";
    });
  }

  /* ── Mic button pulse ── */
  const micBtn = document.getElementById("micBtn");
  let micActive = false;
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      micActive = !micActive;
      micBtn.style.color = micActive ? "#EF4444" : "var(--primary)";
      micBtn.style.transform = micActive ? "scale(1.2)" : "scale(1)";
      showToast(micActive ? "🎤 Voice search active…" : "Voice search stopped");
    });
  }

  /* ── Service card clicks ── */
  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", () => {
      const name = card.querySelector(".service-name").textContent;
      showToast(`Opening ${name}…`);
    });
  });

  /* ── Provider call & chat ── */
  document.getElementById("callProvider")?.addEventListener("click", () => {
    showToast("📞 Calling Rahim Uddin…");
  });

  document.getElementById("chatProvider")?.addEventListener("click", () => {
    showToast("💬 Opening chat with Rahim Uddin…");
  });

  /* ── Book Now ── */
  document.getElementById("bookNowBtn")?.addEventListener("click", () => {
    showToast("🌬️ AC Servicing deal applied! Booking now…");
  });

  /* ── Location dropdown ── */
  document.getElementById("locationRow")?.addEventListener("click", () => {
    showToast("📍 Location selector coming soon!");
  });

  /* ── Notification bell ── */
  document.getElementById("notifBtn")?.addEventListener("click", () => {
    showToast("🔔 You have 2 new notifications");
    const badge = document.querySelector(".notif-badge");
    if (badge) badge.style.display = "none";
  });

  /* ── Bottom nav ── */
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      item.classList.add("active");
    });
  });

  /* ── View all requests ── */
  document.getElementById("viewAllRequests")?.addEventListener("click", () => {
    showToast("Showing all 3 requests…");
  });

  /* ── Toast helper ── */
  let toastTimer;
  function showToast(msg) {
    let toast = document.getElementById("dashToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "dashToast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }
});
