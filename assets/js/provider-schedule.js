// ============================================================
//  HomeEase Pro — Partner Schedule & Appointment Controller
// ============================================================

const SCHEDULE_DATA = {
  "Today": [
    { time: "09:30 AM – 11:00 AM", title: "AC Filter Servicing (1.5 Ton)", cust: "Tanvir Ahmed &bull; Gulshan-2", status: "completed", statusText: "Completed", price: "৳1,200" },
    { time: "01:30 PM – 03:00 PM", title: "AC Deep Servicing & Gas Refill", cust: "Md. Sayadul Islam &bull; House 42, Banani", status: "progress", statusText: "In-Progress", price: "৳2,850" },
    { time: "04:30 PM – 05:45 PM", title: "Pipe Leakage & Joint Sealing", cust: "Farzana Rahman &bull; Banani Road 8", status: "upcoming", statusText: "Confirmed", price: "৳850" }
  ],
  "Tomorrow": [
    { time: "10:00 AM – 11:30 AM", title: "Kitchen Sink Pipe Replacement", cust: "Zubair Al-Mamun &bull; Banani", status: "upcoming", statusText: "Confirmed", price: "৳1,100" },
    { time: "02:30 PM – 04:00 PM", title: "Water Motor Line Installation", cust: "Sabbir Khan &bull; Gulshan-1", status: "upcoming", statusText: "Confirmed", price: "৳1,800" }
  ],
  "Upcoming": [
    { time: "11:00 AM – 12:30 PM", title: "Bathroom Commode Flush Fitting", cust: "Nusrat Jahan &bull; Dhanmondi", status: "upcoming", statusText: "Scheduled", price: "৳1,450" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  let activeDayKey = "Today";

  // Day chip click handler
  const dayChips = document.querySelectorAll(".s-day-chip");
  dayChips.forEach(chip => {
    chip.addEventListener("click", () => {
      dayChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeDayKey = chip.dataset.day || "Today";
      renderSchedule(activeDayKey);
      showToast(`📅 Showing appointments for ${chip.querySelector(".sd-day-name").textContent}`);
    });
  });

  renderSchedule("Today");

  function renderSchedule(dayKey) {
    const list = SCHEDULE_DATA[dayKey] || SCHEDULE_DATA["Upcoming"];
    const container = document.getElementById("scheduleTimelineContainer");
    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); background:#fff; border-radius:16px; border:1.5px solid var(--border);">
          No scheduled bookings for this day. You can take on-demand jobs!
        </div>
      `;
      return;
    }

    list.forEach(item => {
      const card = document.createElement("div");
      card.className = `slot-card ${item.status === 'progress' ? 'in-progress' : ''}`;
      card.innerHTML = `
        <div class="slot-top-row">
          <div class="slot-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${item.time}
          </div>
          <span class="slot-badge ${item.status}">${item.statusText}</span>
        </div>
        <div class="slot-service-title">${item.title}</div>
        <div class="slot-customer-info">${item.cust}</div>
        <div class="slot-meta-row">
          <div class="slot-price">${item.price}</div>
          <button onclick="showToast('📍 Opening directions on map…')" style="padding:5px 12px; font-size:11.5px; font-weight:700; border-radius:999px; border:1px solid var(--border); background:#fff; cursor:pointer; color:var(--primary);">
            Get Directions →
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    // Add Open Slot placeholder
    const openCard = document.createElement("div");
    openCard.className = "slot-card open-slot";
    openCard.innerHTML = `
      <div style="font-size:12px; font-weight:700; color:var(--text-muted);">
        ⚡ 06:00 PM – 08:00 PM • Open Slot for On-Demand Requests
      </div>
    `;
    container.appendChild(openCard);
  }

  // Working Hours Toggle
  const scheduleToggle = document.getElementById("scheduleDutyToggle");
  if (scheduleToggle) {
    scheduleToggle.addEventListener("click", () => {
      const isOn = scheduleToggle.classList.toggle("on");
      scheduleToggle.setAttribute("aria-checked", isOn);
      showToast(isOn ? "🟢 Available for scheduled bookings" : "⚪ Day off / Booking slots paused");
    });
  }

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

