/* ─────────────────────────────────────────────────────────────────────
   SmartEnergy AI — app.js
   SDG 7: Energy Forecasting + Carbon Footprint Advisor
   1M1B AI for Sustainability Virtual Internship
   ───────────────────────────────────────────────────────────────────── */

'use strict';

// ── Constants ────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const BASE_LOADS = {
  sme:      [280, 250, 310, 340, 295, 130, 100],
  campus:   [320, 310, 300, 290, 280, 180, 120],
  hospital: [410, 400, 420, 415, 405, 380, 390],
  factory:  [520, 510, 540, 560, 500, 200, 150],
};

const CLIMATE_FACTORS = {
  tropical:  1.22,
  arid:      1.35,
  temperate: 1.00,
  cool:      0.78,
};

const EMISSION_FACTORS = {
  grid:  0.82,
  mix50: 0.43,
  mix80: 0.18,
  solar: 0.04,
};

const CARBON_CATEGORIES = [
  { name: 'HVAC / Cooling', pct: 38, color: '#E76F51' },
  { name: 'Lighting',       pct: 18, color: '#F4A261' },
  { name: 'Machinery',      pct: 25, color: '#2D6A4F' },
  { name: 'IT Equipment',   pct: 12, color: '#4CC9F0' },
  { name: 'Others',         pct:  7, color: '#94A3B8' },
];

const RECOMMENDATIONS = [
  {
    icon: 'ti-solar-panel-2',
    title: 'Add rooftop solar',
    text: '5kW system generates ~750 kWh/month, offsetting ~38% of grid usage.',
    saving: 'Save ₹2,400/month · 615 kg CO₂',
  },
  {
    icon: 'ti-snowflake',
    title: 'HVAC pre-cooling',
    text: 'Pre-cool to 24°C before 9 AM using off-peak tariff. Reduces peak demand 18%.',
    saving: 'Save ₹1,100/month · 180 kg CO₂',
  },
  {
    icon: 'ti-bulb',
    title: 'LED + occupancy sensors',
    text: 'Replace remaining fluorescents. Auto-dim unoccupied zones. 22% lighting reduction.',
    saving: 'Save ₹640/month · 90 kg CO₂',
  },
  {
    icon: 'ti-plug',
    title: 'Smart power management',
    text: 'Enable power-save mode on idle IT equipment. Eliminates ~60W standby per unit.',
    saving: 'Save ₹380/month · 55 kg CO₂',
  },
];

const ROADMAP = [
  {
    label: 'Quick wins (0–3 months)',
    items: 'Off-peak scheduling, LED retrofit, smart power strips',
    pct: 25, color: '#52B788',
  },
  {
    label: 'Medium-term (3–12 months)',
    items: 'Rooftop solar install, HVAC upgrade, energy audit',
    pct: 55, color: '#F4A261',
  },
  {
    label: 'Long-term (1–3 years)',
    items: 'EV charging bays, battery storage, full net metering',
    pct: 85, color: '#2D6A4F',
  },
];

// ── Bot knowledge base (RAG simulation) ─────────────────────────────
const BOT_KNOWLEDGE = {
  solar: `Based on your profile, adding <strong>10 kW of solar panels</strong> would generate
    ~1,500 kWh/month, cutting your grid dependency by <strong>~40%</strong>. That translates
    to approximately <strong>₹4,800 savings/month</strong> and a reduction of
    <strong>615 kg CO₂/month</strong>. Typical payback in India: 5–7 years.
    <em>PM Surya Ghar Yojana</em> offers up to ₹78,000 subsidy for rooftop solar systems.`,

  carbon: `To cut CO₂ by 30%, I recommend three steps:<br>
    1️⃣ <strong>HVAC scheduling</strong> — 38% of your emissions are from cooling. Pre-cool rooms
    before 9 AM using off-peak tariff.<br>
    2️⃣ <strong>LED retrofit</strong> — saves 18% of lighting energy if not done already.<br>
    3️⃣ <strong>Smart power strips</strong> — eliminates ~60W standby per IT unit.<br>
    Combined impact: <strong>~32% CO₂ reduction within 6 months</strong>.`,

  peak: `Your peak hours are <strong>10 AM–2 PM</strong> (cooling load surge) and
    <strong>6 PM–9 PM</strong> (occupancy peak). Avoid heavy machinery, commercial ovens,
    or server backups during these windows.<br>
    Best off-peak window: <strong>10 PM – 6 AM</strong> when grid tariffs drop 30–40%.`,

  subsidy: `Key solar incentives in India:<br>
    • <strong>PM Surya Ghar Yojana</strong> — up to ₹78,000 subsidy (1–3 kW systems)<br>
    • <strong>MNRE capital subsidy</strong> — 40% for first 2 kW, 20% up to 3 kW<br>
    • <strong>40% accelerated depreciation</strong> in year 1 for businesses<br>
    • <strong>Net metering</strong> — sell surplus power back to the grid<br>
    Contact your state DISCOM for additional state-level benefits.`,

  benchmark: `Your energy intensity is <strong>5.2 kWh/sq ft/month</strong>.
    Industry average for SMEs in tropical zones is <strong>4.1 kWh/sq ft</strong> —
    you're ~27% above benchmark.<br>
    Top areas to close the gap: HVAC efficiency upgrades, occupancy sensors,
    and variable frequency drives on motors.`,

  report: `<strong>📋 Monthly Sustainability Report — SmartEnergy AI</strong><br><br>
    📊 Energy consumed: <strong>1,960 kWh</strong><br>
    🌿 Carbon emitted: <strong>1,607 kg CO₂</strong><br>
    💰 Estimated bill: <strong>₹15,680</strong><br>
    📈 Trend: +4% vs last month<br><br>
    <strong>Top recommendation:</strong> Install 5kW solar → ₹2,400/month saved + 300 kg CO₂ reduced.
    Pre-cool HVAC before 9 AM for 12% demand reduction.<br><br>
    SDG 7 score: <strong class="badge badge-amber">C – Moderate</strong> — action needed to reach B.`,

  default: `Based on your energy profile (~1,960 kWh/week, 0.82 kg CO₂/kWh), my top suggestion
    is to shift energy-intensive tasks to off-peak hours (10 PM–6 AM) for immediate cost savings.
    Would you like me to analyse <em>solar feasibility</em>, <em>peak usage patterns</em>,
    or <em>government incentives</em> for your location?`,
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('solar') || m.includes('panel'))                    return BOT_KNOWLEDGE.solar;
  if (m.includes('carbon') || m.includes('co2') || m.includes('footprint')) return BOT_KNOWLEDGE.carbon;
  if (m.includes('peak')   || m.includes('hour') || m.includes('time'))     return BOT_KNOWLEDGE.peak;
  if (m.includes('subsid') || m.includes('govern') || m.includes('scheme')) return BOT_KNOWLEDGE.subsidy;
  if (m.includes('benchmark')|| m.includes('compar'))                return BOT_KNOWLEDGE.benchmark;
  if (m.includes('report') || m.includes('summary'))                 return BOT_KNOWLEDGE.report;
  return BOT_KNOWLEDGE.default;
}

// ── Helpers ──────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString('en-IN');

function getForecastData() {
  const bt   = $('btype').value;
  const cl   = $('climate').value;
  const area = parseInt($('area').value);
  const occ  = parseInt($('occ').value);
  const it   = parseInt($('it').value);
  const base = BASE_LOADS[bt];
  const cf   = CLIMATE_FACTORS[cl];
  const aF   = area / 5000;
  const oF   = occ  / 50;
  const iF   = it * 0.05 + 1;
  return base.map(v => Math.round(v * cf * aF * oF * iF));
}

// ── Render: bar chart ────────────────────────────────────────────────
function renderBars(data) {
  const max = Math.max(...data);
  $('forecast-bars').innerHTML = data.map((v, i) => {
    const isPeak = v === max;
    const color  = isPeak ? '#E76F51' : '#52B788';
    const h      = Math.round((v / max) * 120);
    return `<div class="bar-wrap">
      <div class="bar-val">${v}</div>
      <div class="bar" style="height:${h}px;background:${color};"></div>
      <div class="bar-label">${DAYS[i]}</div>
    </div>`;
  }).join('');
}

// ── Render: forecast metrics update ─────────────────────────────────
function updateForecastMetrics(data) {
  const total = data.reduce((a, b) => a + b, 0);
  const avg   = Math.round(total / 7);
  const peak  = DAYS[data.indexOf(Math.max(...data))];
  const co2   = Math.round(total * 0.82);
  const cost  = Math.round(total * 8);
  const save  = Math.round(cost * 0.25);

  $('m-kwh').textContent  = fmt(total);
  $('m-co2').textContent  = fmt(co2);
  $('m-cost').textContent = '₹' + fmt(cost);
  $('m-save').textContent = '₹' + fmt(save);
  $('avg-daily').textContent = avg + ' kWh';
  $('peak-day').textContent  = peak;

  const badge = $('eff-badge');
  if (total < 1500)      { badge.textContent = 'A – Excellent';  badge.className = 'badge badge-green'; }
  else if (total < 2200) { badge.textContent = 'B – Moderate';   badge.className = 'badge badge-amber'; }
  else if (total < 3500) { badge.textContent = 'C – High Usage'; badge.className = 'badge badge-red';   }
  else                   { badge.textContent = 'D – Critical';   badge.className = 'badge badge-red';   }

  // Sync kWh input in carbon tab
  if ($('kwh-in')) $('kwh-in').value = total;
  updateCarbon(total);
}

// ── Render: carbon breakdown ─────────────────────────────────────────
function renderCarbonBreakdown(totalCo2) {
  const el = $('carbon-breakdown'); if (!el) return;
  el.innerHTML = CARBON_CATEGORIES.map(cat => {
    const kg = Math.round(totalCo2 * cat.pct / 100);
    return `<div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
        <span>${cat.name}</span>
        <span style="color:#64748B;">${fmt(kg)} kg &nbsp;(${cat.pct}%)</span>
      </div>
      <div class="prog-bar">
        <div class="prog-fill" style="width:${cat.pct * 2.5}%;background:${cat.color};"></div>
      </div>
    </div>`;
  }).join('');
}

// ── Update: carbon panel ─────────────────────────────────────────────
function updateCarbon(kwhOverride) {
  const kwh      = kwhOverride || parseInt($('kwh-in').value) || 1960;
  const src      = ($('source') && $('source').value) || 'grid';
  const solarKw  = parseInt(($('solar-kw') && $('solar-kw').value) || 0);
  const ef       = EMISSION_FACTORS[src] || 0.82;
  const co2      = Math.round(kwh * ef);
  const solarGen = Math.min(solarKw * 5 * 30, kwh);
  const newKwh   = Math.max(0, kwh - solarGen);
  const newCo2   = Math.round(newKwh * ef);
  const saved    = co2 - newCo2;

  if ($('co2-now'))    $('co2-now').textContent    = fmt(co2);
  if ($('co2-solar'))  $('co2-solar').textContent  = fmt(newCo2);
  if ($('co2-equiv'))  $('co2-equiv').textContent  = '= ' + Math.round(co2 / 240) + ' flights Delhi→Mumbai';
  if ($('solar-out'))  $('solar-out').textContent  = solarKw + ' kW';
  if ($('co2-saving')) $('co2-saving').textContent = saved > 0
    ? `↓ Saves ${fmt(saved)} kg CO₂/month`
    : 'Add solar capacity to reduce emissions';

  renderCarbonBreakdown(co2);
}

// ── Update: all (triggered by sliders/selects) ───────────────────────
function updateAll() {
  $('area-out').textContent = fmt(parseInt($('area').value)) + ' sq ft';
  $('occ-out').textContent  = $('occ').value;
  $('it-out').textContent   = $('it').value + ' units';
  const data = getForecastData();
  renderBars(data);
  updateForecastMetrics(data);
  renderRecs();
}

// ── Render: recommendations ──────────────────────────────────────────
function renderRecs() {
  $('rec-grid').innerHTML = RECOMMENDATIONS.map(r => `
    <div class="rec-card">
      <i class="ti ${r.icon} rec-icon"></i>
      <div class="rec-title">${r.title}</div>
      <div class="rec-text">${r.text}</div>
      <div class="rec-saving"><i class="ti ti-trending-down"></i> ${r.saving}</div>
    </div>`).join('');

  $('roadmap').innerHTML = ROADMAP.map(m => `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
        <span style="font-weight:600;">${m.label}</span>
        <span style="color:${m.color};font-weight:600;">${m.pct}% reduction target</span>
      </div>
      <div style="font-size:12px;color:#64748B;margin-bottom:5px;">${m.items}</div>
      <div class="prog-bar">
        <div class="prog-fill" style="width:${m.pct}%;background:${m.color};"></div>
      </div>
    </div>`).join('');
}

// ── Chatbot ──────────────────────────────────────────────────────────
function addMsg(text, type) {
  const area = $('chat-area');
  const div  = document.createElement('div');
  div.className = 'msg ' + type;
  div.innerHTML = text;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
  return div;
}

function sendChat() {
  const inp = $('chat-input');
  const msg = inp.value.trim();
  if (!msg) return;
  addMsg(msg, 'user');
  inp.value = '';
  const typing = addMsg('Thinking…', 'bot typing');
  setTimeout(() => {
    typing.className = 'msg bot';
    typing.innerHTML = getBotReply(msg);
    $('chat-area').scrollTop = $('chat-area').scrollHeight;
  }, 800);
}

// ── Tab switching ────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $('panel-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ── Event wiring ─────────────────────────────────────────────────────
function initEvents() {
  ['btype', 'climate'].forEach(id => $( id).addEventListener('change', updateAll));
  ['area', 'occ', 'it'].forEach(id   => $( id).addEventListener('input',  updateAll));
  ['kwh-in', 'source'].forEach(id    => $( id).addEventListener('input',  () => updateCarbon()));
  $('solar-kw').addEventListener('input', () => updateCarbon());

  $('chat-send').addEventListener('click', sendChat);
  $('chat-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });

  document.querySelectorAll('.qp').forEach(btn => {
    btn.addEventListener('click', () => {
      $('chat-input').value = btn.dataset.q;
      // switch to advisor tab
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.querySelector('[data-tab="advisor"]').classList.add('active');
      $('panel-advisor').classList.add('active');
      sendChat();
    });
  });
}

// ── Init ─────────────────────────────────────────────────────────────
function init() {
  initTabs();
  initEvents();
  updateAll();
  updateCarbon();
  renderRecs();
  addMsg(
    "Hello! I'm your SmartEnergy AI advisor. I can help you forecast energy usage, " +
    "track your carbon footprint, and find clean energy opportunities. " +
    "What would you like to explore?",
    'bot'
  );
}

document.addEventListener('DOMContentLoaded', init);
