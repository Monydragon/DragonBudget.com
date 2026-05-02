const themeStorageKey = "dragon-budget-theme";
const root = document.documentElement;
const activeScript = document.currentScript || document.querySelector('script[src$="script.js"]');
const scriptSource = activeScript?.getAttribute("src") || "script.js";
const siteRootPrefix = scriptSource.replace(/script\.js(?:\?.*)?$/, "");
const siteRootHref = `${siteRootPrefix}index.html`;

function readSavedTheme() {
  try {
    return window.localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Theme preference is optional; the site still works if storage is blocked.
  }
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  document.querySelectorAll("[data-theme-label]").forEach((label) => {
    label.textContent = nextTheme === "dark" ? "Light" : "Dark";
  });
  document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
    icon.textContent = nextTheme === "dark" ? "☀" : "☾";
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

applyTheme(readSavedTheme() || "light");

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navWrap = document.querySelector(".nav-wrap");
const siteHeader = document.querySelector(".site-header");

if (siteHeader && !document.querySelector(".standard-quick-nav")) {
  const quickNav = document.createElement("nav");
  quickNav.className = "standard-quick-nav";
  quickNav.setAttribute("aria-label", "Standard site shortcuts");
  quickNav.innerHTML = [
    ["Home", siteRootHref],
    ["Calculator", `${siteRootPrefix}can-i-afford-this-calculator/index.html`],
    ["Advisor", `${siteRootPrefix}advisor/index.html`],
    ["Features", `${siteRootPrefix}features/index.html`],
    ["Roadmap", `${siteRootPrefix}roadmap/index.html`],
    ["Guides", `${siteRootPrefix}guides/index.html`],
    ["Site Map", `${siteRootPrefix}site-map/index.html`],
    ["Privacy", `${siteRootPrefix}privacy/index.html`],
  ]
    .map(([label, href]) => `<a href="${href}">${label}</a>`)
    .join("");
  siteHeader.appendChild(quickNav);
}

if (navWrap && !document.querySelector(".theme-toggle")) {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.type = "button";
  themeToggle.setAttribute("aria-label", "Toggle light and dark mode");
  themeToggle.innerHTML = '<span data-theme-icon aria-hidden="true">☾</span><span data-theme-label>Dark</span>';
  navWrap.insertBefore(themeToggle, siteNav || navToggle?.nextSibling || null);
  applyTheme(root.dataset.theme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.textContent = isOpen ? "×" : "☰";
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const calculatorForm = document.querySelector("#affordability-form");

if (calculatorForm) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const fields = [
    "current-balance",
    "upcoming-income",
    "bills-due",
    "planned-expenses",
    "savings-goal",
    "emergency-buffer",
    "purchase-amount",
  ];

  const output = {
    safe: document.querySelector("#safe-to-spend-output"),
    remaining: document.querySelector("#remaining-output"),
    status: document.querySelector("#decision-status"),
    explanation: document.querySelector("#decision-explanation"),
    error: document.querySelector("#calculator-error"),
  };

  function readMoney(id) {
    const input = document.querySelector(`#${id}`);
    const value = Number(input.value);

    if (input.value.trim() === "" || Number.isNaN(value) || value < 0) {
      throw new Error("Please enter zero or a positive number for every field.");
    }

    return value;
  }

  function setStatus(label) {
    output.status.className = "result-status";
    output.status.classList.add(label.toLowerCase());
    output.status.textContent = label;
  }

  function calculate() {
    output.error.textContent = "";

    let values;
    try {
      values = Object.fromEntries(fields.map((id) => [id, readMoney(id)]));
    } catch (error) {
      output.error.textContent = error.message;
      return;
    }

    const safeToSpend =
      values["current-balance"] +
      values["upcoming-income"] -
      values["bills-due"] -
      values["planned-expenses"] -
      values["savings-goal"] -
      values["emergency-buffer"];

    const remainingAfterPurchase = safeToSpend - values["purchase-amount"];

    output.safe.textContent = currency.format(safeToSpend);
    output.remaining.textContent = currency.format(remainingAfterPurchase);

    if (remainingAfterPurchase >= 25) {
      setStatus("Yes");
      output.explanation.textContent =
        "This purchase appears to fit your entered numbers with at least $25 left after the purchase.";
    } else if (remainingAfterPurchase >= 0) {
      setStatus("Maybe");
      output.explanation.textContent =
        "This purchase fits by the numbers, but it leaves less than $25 of extra room. Consider waiting or lowering the purchase amount.";
    } else {
      setStatus("No");
      output.explanation.textContent =
        "This purchase is larger than your estimated safe-to-spend amount based on the numbers you entered.";
    }
  }

  calculatorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });

  document.querySelectorAll("[data-calculator-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const values = JSON.parse(button.dataset.calculatorPreset);
      Object.entries(values).forEach(([id, value]) => {
        const input = document.querySelector(`#${id}`);
        if (input) input.value = value;
      });
      calculate();
    });
  });

  calculatorForm.addEventListener("reset", () => {
    window.setTimeout(() => {
      output.error.textContent = "";
      output.safe.textContent = "$0.00";
      output.remaining.textContent = "$0.00";
      output.status.className = "result-status";
      output.status.textContent = "Enter numbers";
      output.explanation.textContent =
        "Your result will appear here. Calculations stay in this browser session.";
    }, 0);
  });
}

const cashFlowDemo = document.querySelector("[data-cash-flow-demo]");

if (cashFlowDemo) {
  const output = cashFlowDemo.querySelector("[data-cash-flow-output]");
  const startingInput = cashFlowDemo.querySelector("#cash-flow-starting");
  const items = [
    ["Paycheck", 1800, "income"],
    ["Rent", -1200, "bill"],
    ["Netflix", -15.49, "subscription"],
    ["Groceries", -85, "planned"],
    ["Car insurance", -145, "bill"],
    ["Weekend trip", -200, "event"],
  ];
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  function renderCashFlow() {
    let balance = Number(startingInput.value || 0);
    output.innerHTML = items
      .map(([name, amount, type]) => {
        balance += amount;
        const risk = balance < 250 ? " warning" : "";
        return `<li class="demo-row${risk}"><span><strong>${name}</strong><small>${type}</small></span><span>${money.format(amount)}</span><span>${money.format(balance)}</span></li>`;
      })
      .join("");
  }

  startingInput.addEventListener("input", renderCashFlow);
  renderCashFlow();
}

const eventBudgetDemo = document.querySelector("[data-event-budget-demo]");

if (eventBudgetDemo) {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const totalInput = eventBudgetDemo.querySelector("#event-total-budget");
  const output = eventBudgetDemo.querySelector("[data-event-budget-output]");

  function renderEventBudget() {
    const total = Number(totalInput.value || 0);
    const items = [...eventBudgetDemo.querySelectorAll("[data-event-item]")].map((input) => [
      input.dataset.eventItem,
      Number(input.value || 0),
    ]);
    const spent = items.reduce((sum, [, value]) => sum + value, 0);
    const remaining = total - spent;
    output.innerHTML = `<p><strong>Spent:</strong> ${money.format(spent)}</p><p><strong>Remaining:</strong> ${money.format(remaining)}</p><p><strong>Status:</strong> ${remaining >= 0 ? "This event fits the sample budget." : "This event is over the sample budget."}</p>`;
  }

  eventBudgetDemo.addEventListener("input", renderEventBudget);
  renderEventBudget();
}

const subscriptionDemo = document.querySelector("[data-subscription-demo]");

if (subscriptionDemo) {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const output = subscriptionDemo.querySelector("[data-subscription-output]");

  function renderSubscriptions() {
    const rows = [...subscriptionDemo.querySelectorAll("[data-subscription-row]")].map((row) => {
      const name = row.querySelector("[data-sub-name]").value || "Subscription";
      const cost = Number(row.querySelector("[data-sub-cost]").value || 0);
      const cycle = row.querySelector("[data-sub-cycle]").value;
      const monthly = cycle === "yearly" ? cost / 12 : cost;
      return { name, monthly };
    });
    const monthlyTotal = rows.reduce((sum, row) => sum + row.monthly, 0);
    output.innerHTML = `<p><strong>Estimated monthly total:</strong> ${money.format(monthlyTotal)}</p><p><strong>Estimated yearly total:</strong> ${money.format(monthlyTotal * 12)}</p><ul class="plain-list">${rows.map((row) => `<li>${escapeHtml(row.name)}: ${money.format(row.monthly)} per month</li>`).join("")}</ul>`;
  }

  subscriptionDemo.addEventListener("input", renderSubscriptions);
  renderSubscriptions();
}

const advisorPanel = document.querySelector("[data-advisor-panel]");

if (advisorPanel) {
  const advisorAnswers = {
    safe: {
      title: "Why is my safe-to-spend low?",
      answer:
        "Based on the sample entries, your safe-to-spend is lower because rent, car insurance, and the weekend trip are all due before the next payday. The advisor would explain the math instead of giving a vague warning.",
      citations: [
        "Rent: $1,200 due May 20",
        "Car insurance: $145 due May 25",
        "Weekend Trip event budget: $200 planned May 30",
      ],
    },
    cancel: {
      title: "What can I review or cancel?",
      answer:
        "The advisor would look for recurring payments, unused subscriptions, and upcoming renewals. In this sample, Netflix is the first review candidate because it is a recurring subscription before payday.",
      citations: [
        "Netflix subscription: $15.49 due May 18",
        "Internet: $65 due May 28",
        "Subscription Watch module: planned app feature",
      ],
    },
    dinner: {
      title: "Can I afford dinner tonight?",
      answer:
        "Using the sample budget, a $45 dinner would fit if no new bills are added and the emergency buffer remains untouched. The answer should still say this is a budgeting aid, not financial advice.",
      citations: [
        "Estimated safe-to-spend: $237.45",
        "Emergency buffer: included in safe-to-spend estimate",
        "Food and Drinks category: sample event budget line",
      ],
    },
    changed: {
      title: "What changed from last month?",
      answer:
        "A mature advisor should summarize changes plainly: income timing, new bills, subscription increases, and category spending shifts. The static site previews that behavior without pretending live account data exists.",
      citations: [
        "Cash Flow screen: planned monthly timeline",
        "Reports screen: planned month-over-month summary",
        "Insights screen: planned category and trend analysis",
      ],
    },
  };

  const title = advisorPanel.querySelector("[data-advisor-title]");
  const answer = advisorPanel.querySelector("[data-advisor-answer]");
  const citations = advisorPanel.querySelector("[data-advisor-citations]");
  const buttons = document.querySelectorAll("[data-advisor-question]");

  function renderAdvisorAnswer(key) {
    const data = advisorAnswers[key];
    if (!data) return;
    title.textContent = data.title;
    answer.textContent = data.answer;
    citations.innerHTML = data.citations.map((item) => `<li>${item}</li>`).join("");
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.advisorQuestion === key));
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => renderAdvisorAnswer(button.dataset.advisorQuestion));
  });

  renderAdvisorAnswer("safe");
}
