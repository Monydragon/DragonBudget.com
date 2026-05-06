const themeStorageKey = "dragon-budget-theme";
const root = document.documentElement;

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

const primaryNavItems = [
  ["home", "index.html", "Home"],
  ["how-it-works", "how-it-works/index.html", "How It Works"],
  ["calculator", "can-i-afford-this-calculator/index.html", "Calculator"],
  ["alpha", "alpha/index.html", "Alpha"],
  ["advisor", "advisor/index.html", "Advisor"],
  ["roadmap", "roadmap/index.html", "Roadmap"],
  ["compare", "dragon-budget-vs-budgeting-apps/index.html", "Compare"],
  ["guides", "guides/index.html", "Guides"],
];

function rootRelativePrefix() {
  const scriptNode =
    document.currentScript ||
    [...document.scripts].find((script) => /script\.js(?:\?|$)/.test(script.src));

  if (!scriptNode?.src) return "";

  const scriptUrl = new URL(scriptNode.src, window.location.href);
  const pageUrl = new URL(window.location.href);
  const rootPath = scriptUrl.pathname.replace(/\/script\.js$/, "/");
  const pageDirectory = pageUrl.pathname.endsWith("/")
    ? pageUrl.pathname
    : pageUrl.pathname.replace(/[^/]*$/, "");

  if (!pageDirectory.startsWith(rootPath)) return "";

  const routeDirectory = pageDirectory
    .slice(rootPath.length)
    .replace(/^\/+|\/+$/g, "");

  if (!routeDirectory) return "";

  return "../".repeat(routeDirectory.split("/").filter(Boolean).length);
}

function currentNavKey() {
  const scriptNode =
    document.currentScript ||
    [...document.scripts].find((script) => /script\.js(?:\?|$)/.test(script.src));

  if (!scriptNode?.src) return null;

  const scriptUrl = new URL(scriptNode.src, window.location.href);
  const pageUrl = new URL(window.location.href);
  const rootPath = scriptUrl.pathname.replace(/\/script\.js$/, "/");

  if (!pageUrl.pathname.startsWith(rootPath)) return null;

  const route = pageUrl.pathname
    .slice(rootPath.length)
    .replace(/\/?index\.html$/, "")
    .replace(/^\/+|\/+$/g, "");

  if (!route) return "home";

  const firstSegment = route.split("/")[0];
  const activeRoutes = {
    "how-it-works": "how-it-works",
    "can-i-afford-this-calculator": "calculator",
    alpha: "alpha",
    "alpha-downloads": "alpha",
    "alpha-survey": "alpha",
    advisor: "advisor",
    "advisor-methodology": "advisor",
    roadmap: "roadmap",
    "dragon-budget-vs-budgeting-apps": "compare",
    "competitive-positioning": "compare",
    guides: "guides",
  };

  return activeRoutes[firstSegment] || null;
}

function navHref(prefix, path) {
  if (prefix) return `${prefix}${path}`;
  return path === "index.html" ? "./index.html" : path;
}

function standardizePrimaryNav() {
  const siteNav = document.querySelector(".site-nav");
  if (!siteNav) return;

  const prefix = rootRelativePrefix();
  const activeKey = currentNavKey();
  siteNav.id = "site-nav";
  siteNav.setAttribute("aria-label", "Main navigation");
  siteNav.innerHTML = primaryNavItems
    .map(([key, path, label]) => {
      const current = key === activeKey ? ' aria-current="page"' : "";
      return `<a href="${navHref(prefix, path)}"${current}>${label}</a>`;
    })
    .join("");
}

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  siteHeader
    .querySelectorAll(".standard-quick-nav, .quick-nav, .secondary-nav, .sub-nav, .subnav, .nav-row")
    .forEach((node) => node.remove());

  let keptPrimaryNav = false;
  siteHeader.querySelectorAll("nav").forEach((nav) => {
    if (nav.classList.contains("site-nav") && !keptPrimaryNav) {
      keptPrimaryNav = true;
      return;
    }

    nav.remove();
  });

  standardizePrimaryNav();
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navWrap = document.querySelector(".nav-wrap");

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

function formFieldValue(form, name) {
  const field = form.elements[name];
  if (!field) return "Not answered";

  if (field instanceof RadioNodeList) {
    return field.value || "Not answered";
  }

  return field.value.trim() || "Not answered";
}

function formChoiceValue(form, name, otherName) {
  const value = formFieldValue(form, name);
  if (value !== "Other" || !otherName) return value;

  return `Other - ${formFieldValue(form, otherName)}`;
}

function setupOtherFields(form) {
  form.querySelectorAll("[data-other-for]").forEach((otherField) => {
    const source = document.getElementById(otherField.dataset.otherFor);
    const wrapper = otherField.closest(".field");

    if (!source || !wrapper) return;

    function syncOtherField() {
      const isOther = source.value === "Other";
      wrapper.classList.toggle("is-hidden", !isOther);
      otherField.required = isOther;
      if (!isOther) otherField.value = "";
    }

    if (otherField.dataset.otherReady !== "true") {
      source.addEventListener("change", syncOtherField);
      otherField.dataset.otherReady = "true";
    }

    syncOtherField();
  });
}

function missingRequiredField(form) {
  return [...form.querySelectorAll("[required]")].find((field) => {
    if (field.offsetParent === null) return false;
    return !field.value.trim();
  });
}

function sendMail(to, subject, lines) {
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

document.querySelectorAll("[data-alpha-survey], [data-support-ticket]").forEach(setupOtherFields);

const alphaSurveyForm = document.querySelector("[data-alpha-survey]");

if (alphaSurveyForm) {
  const error = document.querySelector("#alpha-survey-error");

  alphaSurveyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (error) error.textContent = "";

    const missingField = missingRequiredField(alphaSurveyForm);

    if (missingField) {
      if (error) error.textContent = "Please answer the required device, platform, browser, test area, and clarity questions.";
      missingField.focus();
      return;
    }

    sendMail("alpha@dragonbudget.com", "Dragon Budget Alpha Survey Feedback", [
      "Dragon Budget Alpha Survey",
      "",
      `Name: ${formFieldValue(alphaSurveyForm, "Name")}`,
      `Email: ${formFieldValue(alphaSurveyForm, "Email")}`,
      `Device type: ${formChoiceValue(alphaSurveyForm, "Device type", "Device type other")}`,
      `Platform: ${formChoiceValue(alphaSurveyForm, "Platform", "Platform other")}`,
      `Browser: ${formChoiceValue(alphaSurveyForm, "Browser", "Browser other")}`,
      `Screen size or device model: ${formFieldValue(alphaSurveyForm, "Screen size or device model")}`,
      `What did you test?: ${formChoiceValue(alphaSurveyForm, "What did you test?", "What did you test other")}`,
      `Overall clarity: ${formFieldValue(alphaSurveyForm, "Overall clarity")}`,
      `Follow-up permission: ${formFieldValue(alphaSurveyForm, "Follow-up permission")}`,
      "",
      "What felt most useful?",
      formFieldValue(alphaSurveyForm, "What felt most useful?"),
      "",
      "What was confusing, missing, or broken?",
      formFieldValue(alphaSurveyForm, "What was confusing, missing, or broken?"),
      "",
      "Which planned feature matters most?",
      formFieldValue(alphaSurveyForm, "Most wanted planned feature"),
      "",
      "Anything else?",
      formFieldValue(alphaSurveyForm, "Additional notes"),
      "",
      `Submitted from: ${window.location.href}`,
    ]);
  });

  alphaSurveyForm.addEventListener("reset", () => {
    window.setTimeout(() => setupOtherFields(alphaSurveyForm), 0);
    if (error) error.textContent = "";
  });
}

const supportTicketForm = document.querySelector("[data-support-ticket]");

if (supportTicketForm) {
  const error = document.querySelector("#support-ticket-error");

  supportTicketForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (error) error.textContent = "";

    const missingField = missingRequiredField(supportTicketForm);

    if (missingField) {
      if (error) error.textContent = "Please answer the required ticket type, page or feature, impact, device, platform, browser, and details fields.";
      missingField.focus();
      return;
    }

    sendMail("support@dragonbudget.com", "Dragon Budget Support Ticket", [
      "Dragon Budget Support Ticket",
      "",
      `Name: ${formFieldValue(supportTicketForm, "Name")}`,
      `Email: ${formFieldValue(supportTicketForm, "Email")}`,
      `Ticket type: ${formChoiceValue(supportTicketForm, "Ticket type", "Ticket type other")}`,
      `Page or feature: ${formChoiceValue(supportTicketForm, "Page or feature", "Page or feature other")}`,
      `Impact: ${formFieldValue(supportTicketForm, "Impact")}`,
      `Device type: ${formChoiceValue(supportTicketForm, "Device type", "Device type other")}`,
      `Platform: ${formChoiceValue(supportTicketForm, "Platform", "Platform other")}`,
      `Browser: ${formChoiceValue(supportTicketForm, "Browser", "Browser other")}`,
      `Screen size or device model: ${formFieldValue(supportTicketForm, "Screen size or device model")}`,
      `Can support follow up?: ${formFieldValue(supportTicketForm, "Follow-up permission")}`,
      "",
      "What happened?",
      formFieldValue(supportTicketForm, "What happened?"),
      "",
      "What did you expect instead?",
      formFieldValue(supportTicketForm, "What did you expect instead?"),
      "",
      "Steps to repeat the issue",
      formFieldValue(supportTicketForm, "Steps to repeat the issue"),
      "",
      "Extra notes",
      formFieldValue(supportTicketForm, "Additional notes"),
      "",
      `Submitted from: ${window.location.href}`,
    ]);
  });

  supportTicketForm.addEventListener("reset", () => {
    window.setTimeout(() => setupOtherFields(supportTicketForm), 0);
    if (error) error.textContent = "";
  });
}

const calculatorForm = document.querySelector("#affordability-form");

if (calculatorForm) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  function displayMoney(value) {
    return currency.format(Math.max(0, value));
  }

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

    const safeToSpendRaw =
      values["current-balance"] +
      values["upcoming-income"] -
      values["bills-due"] -
      values["planned-expenses"] -
      values["savings-goal"] -
      values["emergency-buffer"];

    const safeToSpend = Math.max(0, safeToSpendRaw);
    const remainingAfterPurchase = safeToSpend - values["purchase-amount"];
    const shortfall = Math.abs(Math.min(0, remainingAfterPurchase));

    output.safe.textContent = displayMoney(safeToSpend);
    output.remaining.textContent = displayMoney(remainingAfterPurchase);

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
        `This purchase is larger than your estimated safe-to-spend amount. You would need ${currency.format(shortfall)} more room before this fits.`;
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
    ["Paycheck", 1800, "income", "in"],
    ["Rent", 1200, "bill", "out"],
    ["Netflix", 15.49, "subscription", "out"],
    ["Groceries", 85, "planned", "out"],
    ["Car insurance", 145, "bill", "out"],
    ["Weekend trip", 200, "event", "out"],
  ];
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  function formatBalance(balance) {
    return balance >= 0 ? money.format(balance) : `Short by ${money.format(Math.abs(balance))}`;
  }

  function renderCashFlow() {
    let balance = Number(startingInput.value || 0);
    output.innerHTML = items
      .map(([name, amount, type, direction]) => {
        balance += direction === "in" ? amount : -amount;
        const risk = balance < 250 ? " warning" : "";
        const amountLabel = direction === "in" ? "Income" : "Outflow";
        return `<li class="demo-row${risk}"><span><strong>${name}</strong><small>${type}</small></span><span><small>${amountLabel}</small>${money.format(amount)}</span><span>${formatBalance(balance)}</span></li>`;
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
    const overage = Math.abs(Math.min(0, remaining));
    output.innerHTML = `<p><strong>Spent:</strong> ${money.format(spent)}</p><p><strong>Remaining:</strong> ${money.format(Math.max(0, remaining))}</p><p><strong>Status:</strong> ${remaining >= 0 ? "This event fits the sample budget." : `This event is over the sample budget by ${money.format(overage)}.`}</p>`;
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
      const cost = Math.max(0, Number(row.querySelector("[data-sub-cost]").value || 0));
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
        "A mature advisor should summarize changes plainly: income timing, new bills, subscription increases, and category spending shifts. The public site previews that behavior without pretending live account data exists.",
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
