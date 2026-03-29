const campaigns = [
  {
    handle: "@founder.ksa",
    title: "مقاطع قصيرة عن ريادة الأعمال والبيع الرقمي",
    category: "ريادة",
    region: "السعودية",
    reward: 36,
    score: 92
  },
  {
    handle: "@studyloop.ar",
    title: "شرح مبسط للدراسة والمنح والمهارات الرقمية",
    category: "تعليم",
    region: "العالم العربي",
    reward: 28,
    score: 88
  },
  {
    handle: "@skin.notes",
    title: "محتوى جمالي صادق وتجارب يومية بعروض أسبوعية",
    category: "جمال",
    region: "الخليج",
    reward: 31,
    score: 84
  },
  {
    handle: "@devlens.io",
    title: "تحديثات تقنية وأدوات إنتاجية لصناع المحتوى",
    category: "تقنية",
    region: "الإمارات",
    reward: 42,
    score: 95
  },
  {
    handle: "@tripcapsule",
    title: "رحلات وتجارب مطاعم وفنادق بنظرة محلية",
    category: "سفر",
    region: "السعودية",
    reward: 30,
    score: 86
  },
  {
    handle: "@academy.spark",
    title: "ورش مباشرة لبناء جمهور وتحسين العرض الشخصي",
    category: "تعليم",
    region: "الخليج",
    reward: 34,
    score: 90
  }
];

const discoveryGrid = document.getElementById("discoveryGrid");
const filterButtons = document.querySelectorAll(".filter-chip");
const toast = document.getElementById("toast");

const handleInput = document.getElementById("handleInput");
const categoryInput = document.getElementById("categoryInput");
const regionInput = document.getElementById("regionInput");
const reachInput = document.getElementById("reachInput");
const pitchInput = document.getElementById("pitchInput");
const campaignForm = document.getElementById("campaignForm");

const reachValue = document.getElementById("reachValue");
const summaryHandle = document.getElementById("summaryHandle");
const summaryCategory = document.getElementById("summaryCategory");
const summaryRegion = document.getElementById("summaryRegion");
const summaryPoints = document.getElementById("summaryPoints");
const summaryEstimate = document.getElementById("summaryEstimate");
const summaryPitch = document.getElementById("summaryPitch");
const pointsValue = document.getElementById("pointsValue");
const campaignCount = document.getElementById("campaignCount");
const heroProgressValue = document.getElementById("heroProgressValue");
const heroProgressBar = document.getElementById("heroProgressBar");

let availablePoints = 2480;
let activeCampaigns = 3;

function formatNumber(value) {
  return new Intl.NumberFormat("ar-SA").format(value);
}

function calculatePoints(reach) {
  return Math.round(reach * 0.3);
}

function calculateEstimate(reach) {
  const min = Math.round(reach * 0.026);
  const max = Math.round(reach * 0.048);
  return `${formatNumber(min)} - ${formatNumber(max)} تفاعلًا`;
}

function updateCampaignSummary() {
  const handle = handleInput.value.trim() || "@brand_name";
  const category = categoryInput.value;
  const region = regionInput.value;
  const reach = Number(reachInput.value);
  const points = calculatePoints(reach);
  const pitch = pitchInput.value.trim();

  reachValue.textContent = formatNumber(reach);
  summaryHandle.textContent = handle.startsWith("@") ? handle : `@${handle}`;
  summaryCategory.textContent = category;
  summaryRegion.textContent = region;
  summaryPoints.textContent = formatNumber(points);
  summaryEstimate.textContent = calculateEstimate(reach);
  summaryPitch.textContent =
    pitch || "سيظهر وصف الحملة هنا فور كتابة نبذة مختصرة عن الحساب أو العرض.";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

function renderCampaignCards(activeFilter = "الكل") {
  const filteredCampaigns = campaigns.filter((campaign) => {
    return activeFilter === "الكل" || campaign.category === activeFilter;
  });

  discoveryGrid.innerHTML = filteredCampaigns
    .map((campaign) => {
      return `
        <article class="discovery-card">
          <header>
            <span class="card-label">فرصة موصى بها</span>
            <h3>${campaign.handle}</h3>
          </header>
          <div class="content">
            <div class="meta">
              <span>${campaign.category}</span>
              <span>${campaign.region}</span>
              <span>ثقة ${campaign.score}%</span>
            </div>
            <p>${campaign.title}</p>
            <div class="card-actions">
              <strong>${campaign.reward} نقطة</strong>
              <button class="engage-button" data-handle="${campaign.handle}">
                احتساب تفاعل
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll(".engage-button").forEach((button) => {
    button.addEventListener("click", () => {
      const { handle } = button.dataset;
      availablePoints += 18;
      pointsValue.textContent = formatNumber(availablePoints);
      showToast(`تم تسجيل تفاعل حقيقي مع ${handle} وإضافة 18 نقطة إلى رصيدك.`);
    });
  });
}

function syncHeroProgress() {
  const progress = Math.min(96, 50 + activeCampaigns * 6);
  heroProgressValue.textContent = `${progress}%`;
  heroProgressBar.style.width = `${progress}%`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((chip) => chip.classList.remove("is-active"));
    button.classList.add("is-active");
    renderCampaignCards(button.dataset.filter);
  });
});

[handleInput, categoryInput, regionInput, reachInput, pitchInput].forEach((input) => {
  input.addEventListener("input", updateCampaignSummary);
});

campaignForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const handle = summaryHandle.textContent;
  const pointsNeeded = calculatePoints(Number(reachInput.value));

  if (pointsNeeded > availablePoints) {
    showToast("رصيد النقاط الحالي لا يكفي لهذه الحملة. زد التفاعل أولاً أو خفف فرص الظهور.");
    return;
  }

  availablePoints -= pointsNeeded;
  activeCampaigns += 1;

  pointsValue.textContent = formatNumber(availablePoints);
  campaignCount.textContent = formatNumber(activeCampaigns);
  syncHeroProgress();

  showToast(`تم إطلاق حملة ${handle} بنجاح داخل المنصة التجريبية.`);
  campaignForm.reset();
  reachInput.value = "2500";
  updateCampaignSummary();
});

updateCampaignSummary();
renderCampaignCards();
syncHeroProgress();
pointsValue.textContent = formatNumber(availablePoints);
campaignCount.textContent = formatNumber(activeCampaigns);
