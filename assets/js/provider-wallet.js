// ============================================================
//  HomeEase Pro — Partner Wallet Controller
// ============================================================

const DEFAULT_TRXS = [
  { id: 1, title: "Job Payout: AC Deep Servicing", code: "#HE-8824-DH", amount: "+৳2,850", isPlus: true, time: "Today, 02:45 PM", icon: "💰" },
  { id: 2, title: "Job Payout: AC Filter Servicing", code: "#HE-7911-DH", amount: "+৳1,200", isPlus: true, time: "Today, 11:30 AM", icon: "💰" },
  { id: 3, title: "Withdrawal to bKash", code: "TRX-BK-918231", amount: "-৳5,000", isPlus: false, time: "Yesterday, 06:10 PM", icon: "💸" },
  { id: 4, title: "Job Payout: Pipe Leakage Repair", code: "#HE-6523-DH", amount: "+৳850", isPlus: true, time: "Sep 06, 2026", icon: "💰" }
];

document.addEventListener("DOMContentLoaded", () => {
  let balance = 14250;
  try {
    const savedBal = localStorage.getItem("homeease_wallet_balance");
    if (savedBal) balance = parseFloat(savedBal);
  } catch (e) {}

  let trxs = DEFAULT_TRXS;
  try {
    const savedTrxs = localStorage.getItem("homeease_wallet_trxs");
    if (savedTrxs) trxs = JSON.parse(savedTrxs);
  } catch (e) {}

  const balDisplay = document.getElementById("walletBalDisplay");
  if (balDisplay) balDisplay.textContent = `৳${balance.toLocaleString()}`;

  renderTransactions();

  // Cashout Modal open
  window.openWithdrawModal = function() {
    document.getElementById("withdrawModal").classList.add("open");
    document.getElementById("withdrawAmount").value = "";
  };

  window.closeWithdrawModal = function() {
    document.getElementById("withdrawModal").classList.remove("open");
  };

  // Cashout Form Submit
  const withdrawForm = document.getElementById("withdrawForm");
  if (withdrawForm) {
    withdrawForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const amountVal = parseFloat(document.getElementById("withdrawAmount").value);
      const method = document.getElementById("withdrawMethod").value;
      const accountNum = document.getElementById("withdrawAccountNum").value.trim();

      if (isNaN(amountVal) || amountVal < 100) {
        showToast("Minimum withdrawal is ৳100.");
        return;
      }

      if (amountVal > balance) {
        showToast("⚠️ Insufficient wallet balance.");
        return;
      }

      // Process Withdrawal
      balance -= amountVal;
      try {
        localStorage.setItem("homeease_wallet_balance", balance.toString());
      } catch (e) {}

      if (balDisplay) balDisplay.textContent = `৳${balance.toLocaleString()}`;

      const newTrx = {
        id: Date.now(),
        title: `Withdrawal to ${method}`,
        code: `TRX-${method.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: `-৳${amountVal.toLocaleString()}`,
        isPlus: false,
        time: "Just now",
        icon: "💸"
      };

      trxs.unshift(newTrx);
      try {
        localStorage.setItem("homeease_wallet_trxs", JSON.stringify(trxs));
      } catch (e) {}

      renderTransactions();
      closeWithdrawModal();
      showToast(`✅ ৳${amountVal.toLocaleString()} transferred to ${method} (${accountNum.slice(-4)})!`);
    });
  }

  function renderTransactions() {
    const listEl = document.getElementById("trxList");
    if (!listEl) return;
    listEl.innerHTML = "";

    trxs.forEach(t => {
      const item = document.createElement("div");
      item.className = "trx-item";
      item.innerHTML = `
        <div class="trx-left">
          <div class="trx-icon ${t.isPlus ? 'income' : 'payout'}">${t.icon}</div>
          <div>
            <div class="trx-title">${t.title}</div>
            <div class="trx-sub">${t.code}</div>
          </div>
        </div>
        <div class="trx-right">
          <div class="trx-amount ${t.isPlus ? 'plus' : 'minus'}">${t.amount}</div>
          <div class="trx-date">${t.time}</div>
        </div>
      `;
      listEl.appendChild(item);
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
