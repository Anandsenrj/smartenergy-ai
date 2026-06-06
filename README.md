# SmartEnergy AI 🌿⚡
**SDG 7 — Affordable & Clean Energy | SDG 13 — Climate Action**
*1M1B AI for Sustainability Virtual Internship · IBM SkillsBuild & AICTE*

---

## 📁 Project Structure

```
smartenergy-ai/
├── index.html   ← Main app (all UI markup)
├── style.css    ← Complete stylesheet (responsive)
├── app.js       ← All logic: forecast, carbon, chatbot, recommendations
└── README.md    ← This file
```

---

## 🚀 How to Host — 4 Options

---

### ✅ Option 1: GitHub Pages (FREE — Recommended)

**Step 1** — Create a free account at https://github.com

**Step 2** — Click **"New repository"**, name it `smartenergy-ai`, set it to **Public**, click **Create**.

**Step 3** — Upload files:
- Click **"Add file" → "Upload files"**
- Drag and drop `index.html`, `style.css`, `app.js`
- Click **"Commit changes"**

**Step 4** — Enable GitHub Pages:
- Go to **Settings → Pages**
- Under "Branch", select `main` → `/ (root)` → click **Save**
- Wait ~60 seconds

**Step 5** — Your site is live at:
```
https://YOUR-USERNAME.github.io/smartenergy-ai/
```

---

### ✅ Option 2: Netlify (FREE — Drag & Drop, Fastest)

**Step 1** — Go to https://netlify.com → Sign up free

**Step 2** — On the dashboard, find the **"Deploy manually"** section

**Step 3** — Drag the entire `smartenergy-ai/` folder onto the deploy box

**Step 4** — Done! Netlify gives you a live URL instantly:
```
https://random-name-123.netlify.app
```

**Step 5 (optional)** — Click "Site settings → Change site name" to get:
```
https://smartenergy-ai.netlify.app
```

---

### ✅ Option 3: Vercel (FREE — via CLI or drag & drop)

**Step 1** — Go to https://vercel.com → Sign up with GitHub

**Step 2** — Install Vercel CLI (optional):
```bash
npm install -g vercel
```

**Step 3** — From inside the project folder, run:
```bash
cd smartenergy-ai
vercel
```
Follow the prompts — your site deploys in seconds.

**OR** — Use the web UI: https://vercel.com/new → Import GitHub repo

**Live URL:**
```
https://smartenergy-ai.vercel.app
```

---

### ✅ Option 4: Run Locally (no internet needed)

**Option A — Just open the file:**
```
Double-click index.html → Opens in your browser
```

**Option B — Use Python local server (better for testing):**
```bash
cd smartenergy-ai

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open: http://localhost:8000

**Option C — Use Node.js:**
```bash
npm install -g serve
serve .
```
Then open: http://localhost:3000

---

## 🛠 Customisation Tips

| What to change | Where |
|---|---|
| Building types / base loads | `app.js` → `BASE_LOADS` object |
| Emission factor (India = 0.82) | `app.js` → `EMISSION_FACTORS` |
| Chatbot answers | `app.js` → `BOT_KNOWLEDGE` |
| Colors / theme | `style.css` → `:root` variables |
| Add more tabs | `index.html` + `app.js` |

---

## 🌿 SDG Alignment

| SDG | Target | Feature |
|-----|--------|---------|
| SDG 7.2 | Renewable energy share | Solar calculator, source mix |
| SDG 7.3 | Energy efficiency | Forecast + efficiency rating |
| SDG 13.2 | Climate in planning | Carbon tracker + roadmap |
| SDG 13.3 | Climate awareness | AI advisor chatbot |

---

## 📋 Tech Stack

- **Frontend:** Vanilla HTML + CSS + JavaScript (no framework needed)
- **Icons:** Tabler Icons (CDN)
- **AI Simulation:** RAG-style keyword routing in `app.js` (replace with real IBM Granite API for production)
- **Hosting:** Static site — works on any CDN or web server

---

## 🔌 Upgrading to Real IBM Granite API

Replace the `getBotReply()` function in `app.js` with a real API call:

```javascript
async function getBotReply(msg) {
  const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_IBM_WATSONX_TOKEN',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: 'ibm/granite-13b-chat-v2',
      input: `You are a clean energy advisor. Answer: ${msg}`,
      parameters: { max_new_tokens: 300 }
    })
  });
  const data = await response.json();
  return data.results[0].generated_text;
}
```

Get your API key at: https://www.ibm.com/watsonx

---

*Built for 1M1B AI for Sustainability Virtual Internship · IBM SkillsBuild & AICTE*
