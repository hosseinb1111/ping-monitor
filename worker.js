export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "GET, HEAD",
        },
      });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#07090e">
<meta
  name="description"
  content="Browser-side network latency monitor"
>

<link
  rel="icon"
  href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%236366f1'/%3E%3Ctext x='50' y='70' text-anchor='middle' font-size='58'%3E%E2%9A%A1%3C/text%3E%3C/svg%3E"
>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap"
  rel="stylesheet"
>

<title>Ping Monitor</title>

<style>
  :root {
    --bg: #07090e;
    --glass-bg: rgba(15, 23, 42, 0.65);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);

    --text: #f8fafc;
    --text-muted: #64748b;
    --text-secondary: #94a3b8;

    --accent: #6366f1;
    --accent-hover: #4f46e5;
    --accent-glow: rgba(99, 102, 241, 0.35);
    --accent-soft: rgba(99, 102, 241, 0.14);

    --green: #10b981;
    --red: #f43f5e;
    --yellow: #f59e0b;
    --orange: #f97316;

    --radius-xl: 24px;
    --radius-lg: 16px;
    --radius-md: 12px;

    --transition: 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  ::selection {
    background: rgba(99, 102, 241, 0.55);
    color: #ffffff;
  }

  ::-moz-selection {
    background: rgba(99, 102, 241, 0.55);
    color: #ffffff;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family:
      "Plus Jakarta Sans",
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;

    min-height: 100vh;
    display: flex;
    justify-content: center;

    padding: 60px 20px;

    background-image:
      radial-gradient(
        circle at 50% 0%,
        rgba(99, 102, 241, 0.15) 0%,
        transparent 60%
      ),
      radial-gradient(
        circle at 100% 100%,
        rgba(168, 85, 247, 0.08) 0%,
        transparent 50%
      );

    background-attachment: fixed;
  }

  button:focus-visible,
  select:focus-visible {
    outline: 2px solid rgba(165, 180, 252, 0.85);
    outline-offset: 2px;
  }

  button,
  select {
    font: inherit;
  }

  button {
    -webkit-tap-highlight-color: transparent;
  }

  .container {
    width: 100%;
    max-width: 860px;

    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* --------------------------------------------
     Header
  -------------------------------------------- */

  .header {
    text-align: center;

    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 12px;
  }

  .header .badge {
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.3);

    color: #a5b4fc;

    font-size: 0.75rem;
    font-weight: 600;

    padding: 6px 16px;

    border-radius: 100px;

    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .header h1 {
    font-size: 2.75rem;
    font-weight: 700;

    letter-spacing: -0.03em;

    background:
      linear-gradient(
        135deg,
        #ffffff 30%,
        #a5b4fc 100%
      );

    -webkit-background-clip: text;
    background-clip: text;

    -webkit-text-fill-color: transparent;

    line-height: 1.1;
  }

  .header p {
    color: var(--text-secondary);

    font-size: 0.92rem;

    max-width: 520px;

    line-height: 1.6;
  }

  .header p strong {
    color: var(--text);
    font-weight: 600;
  }

  /* --------------------------------------------
     Glass
  -------------------------------------------- */

  .glass {
    background: var(--glass-bg);

    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);

    border: 1px solid var(--glass-border);

    border-radius: var(--radius-xl);

    box-shadow: var(--glass-shadow);
  }

  /* --------------------------------------------
     Summary
  -------------------------------------------- */

  .summary {
    display: grid;

    grid-template-columns:
      repeat(4, 1fr);

    padding: 18px;

    gap: 14px;

    text-align: center;
  }

  .summary-card {
    display: flex;
    flex-direction: column;

    gap: 4px;

    padding: 12px 10px;

    background:
      rgba(255, 255, 255, 0.02);

    border:
      1px solid rgba(255, 255, 255, 0.03);

    border-radius: var(--radius-md);
  }

  .summary-card .label {
    font-size: 0.72rem;

    color: var(--text-secondary);

    text-transform: uppercase;

    letter-spacing: 0.05em;

    font-weight: 600;
  }

  .summary-card .value {
    font-size: 1.4rem;

    font-weight: 700;

    color: var(--text);

    font-family:
      "JetBrains Mono",
      monospace;
  }

  .summary-card.online .value {
    color: var(--green);
  }

  .summary-card.offline .value {
    color: var(--red);
  }

  .summary-card.jitter .value {
    color: var(--yellow);
  }

  /* --------------------------------------------
     Toolbar
  -------------------------------------------- */

  .toolbar {
    display: flex;

    justify-content: space-between;
    align-items: center;

    gap: 12px;

    flex-wrap: wrap;
  }

  .toolbar-left,
  .toolbar-right {
    display: flex;

    align-items: center;

    gap: 10px;

    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 8px;

    min-height: 44px;

    padding:
      0 22px;

    border: none;

    border-radius: 100px;

    background:
      linear-gradient(
        135deg,
        var(--accent),
        var(--accent-hover)
      );

    color: white;

    font-weight: 600;

    font-size: 0.92rem;

    cursor: pointer;

    box-shadow:
      0 4px 20px var(--accent-glow);

    transition:
      transform var(--transition),
      box-shadow var(--transition),
      opacity var(--transition);
  }

  .btn:hover {
    transform: translateY(-2px);

    box-shadow:
      0 8px 25px var(--accent-glow);
  }

  .btn:active {
    transform: translateY(0);
  }

  .btn:disabled {
    opacity: 0.55;

    cursor: not-allowed;

    transform: none;

    box-shadow: none;
  }

  .btn.secondary {
    padding: 0 18px;

    background:
      rgba(255, 255, 255, 0.04);

    border:
      1px solid rgba(255, 255, 255, 0.08);

    color: var(--text-secondary);

    box-shadow: none;
  }

  .btn.secondary:hover {
    background:
      rgba(255, 255, 255, 0.07);

    color: var(--text);

    transform: none;

    box-shadow: none;
  }

  select {
    min-height: 44px;

    padding:
      0 38px 0 14px;

    border-radius: 100px;

    border:
      1px solid rgba(255, 255, 255, 0.08);

    background:
      rgba(255, 255, 255, 0.04);

    color: var(--text-secondary);

    outline: none;

    cursor: pointer;
  }

  select:focus {
    border-color:
      rgba(99, 102, 241, 0.55);

    box-shadow:
      0 0 0 3px
      rgba(99, 102, 241, 0.12);
  }

  select option {
    background: #0f172a;
    color: #f8fafc;
  }

  /* --------------------------------------------
     Site List
  -------------------------------------------- */

  .site-list {
    overflow: hidden;

    position: relative;
  }

  .progress-bar {
    position: absolute;

    top: 0;
    left: 0;

    height: 2px;

    width: 0%;

    background:
      linear-gradient(
        90deg,
        var(--accent),
        #818cf8
      );

    transition:
      width 0.25s ease;
  }

  .site-row {
    border-bottom:
      1px solid rgba(255, 255, 255, 0.04);
  }

  .site-row:last-child {
    border-bottom: none;
  }

  .site-main {
    display: grid;

    grid-template-columns:
      minmax(220px, 1fr)
      88px
      88px
      88px
      104px
      26px;

    align-items: center;

    gap: 12px;

    padding:
      15px 24px;

    cursor: pointer;

    transition:
      background var(--transition);
  }

  .site-main:hover {
    background:
      rgba(255, 255, 255, 0.03);
  }

  .site-info {
    display: flex;

    align-items: center;

    min-width: 0;

    gap: 14px;
  }

  .site-avatar {
    width: 38px;
    height: 38px;

    flex-shrink: 0;

    border-radius: 11px;

    display: flex;

    align-items: center;
    justify-content: center;

    font-weight: 700;

    font-size: 1rem;

    color: white;

    overflow: hidden;

    position: relative;

    box-shadow:
      inset 0 0 0 1px
      rgba(255, 255, 255, 0.14);
  }

  .site-avatar img {
    width: 22px;
    height: 22px;

    object-fit: contain;

    border-radius: 4px;
  }

  .site-avatar .avatar-fallback {
    font-size: 1rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
  }

  .site-name {
    font-weight: 600;

    font-size: 0.95rem;

    color: var(--text);
  }

  .site-url {
    display: block;

    margin-top: 3px;

    color: var(--text-muted);

    font-size: 0.68rem;

    font-family:
      "JetBrains Mono",
      monospace;

    overflow: hidden;

    white-space: nowrap;

    text-overflow: ellipsis;
  }

  .metric {
    font-family:
      "JetBrains Mono",
      monospace;

    font-size: 0.83rem;

    font-weight: 600;

    white-space: nowrap;

    text-align: right;
  }

  .metric.muted {
    color: var(--text-secondary);
  }

  .latency.fast {
    color: var(--green);
  }

  .latency.medium {
    color: var(--yellow);
  }

  .latency.slow {
    color: var(--orange);
  }

  .latency.very-slow {
    color: var(--red);
  }

  .status-badge {
    display: inline-flex;

    align-items: center;

    justify-self: end;

    gap: 6px;

    padding:
      5px 9px;

    border-radius: 100px;

    background:
      rgba(255, 255, 255, 0.03);

    font-size: 0.72rem;

    font-weight: 600;

    color: var(--text-secondary);

    white-space: nowrap;
  }

  .status-dot {
    width: 8px;
    height: 8px;

    flex-shrink: 0;

    border-radius: 50%;

    background: var(--text-muted);
  }

  .status-badge.online {
    color: #86efac;

    background:
      rgba(16, 185, 129, 0.1);
  }

  .status-badge.online .status-dot {
    background: var(--green);

    box-shadow:
      0 0 10px
      rgba(16, 185, 129, 0.75);
  }

  .status-badge.degraded {
    color: #fde68a;

    background:
      rgba(245, 158, 11, 0.1);
  }

  .status-badge.degraded .status-dot {
    background: var(--yellow);
  }

  .status-badge.failed,
  .status-badge.timeout {
    color: #fca5a5;

    background:
      rgba(244, 63, 94, 0.1);
  }

  .status-badge.failed .status-dot,
  .status-badge.timeout .status-dot {
    background: var(--red);
  }

  .expand-button {
    width: 26px;
    height: 26px;

    display: grid;

    place-items: center;

    border: none;

    background: transparent;

    color: var(--text-muted);

    cursor: pointer;

    border-radius: 50%;

    font-size: 0.8rem;

    transition:
      background var(--transition),
      color var(--transition),
      transform var(--transition);
  }

  .expand-button:hover {
    color: #a5b4fc;

    background: var(--accent-soft);
  }

  .site-row.expanded .expand-button {
    transform:
      rotate(180deg);
  }

  /* --------------------------------------------
     Details
  -------------------------------------------- */

  .details {
    max-height: 0;

    overflow: hidden;

    padding: 0 24px;

    opacity: 0;

    transition:
      max-height 0.3s ease,
      opacity 0.25s ease,
      padding 0.3s ease;
  }

  .site-row.expanded .details {
    max-height: 260px;

    opacity: 1;

    padding: 0 24px 18px;
  }

  .detail-panel {
    padding: 14px;

    border-radius:
      var(--radius-md);

    background:
      rgba(255, 255, 255, 0.02);

    border:
      1px solid rgba(255, 255, 255, 0.04);
  }

  .detail-grid {
    display: grid;

    grid-template-columns:
      repeat(5, 1fr);

    gap: 9px;
  }

  .detail-card {
    padding: 10px;

    border-radius:
      10px;

    background:
      rgba(255, 255, 255, 0.02);
  }

  .detail-label {
    display: block;

    margin-bottom: 5px;

    color: var(--text-muted);

    font-size: 0.66rem;

    font-weight: 600;

    text-transform: uppercase;

    letter-spacing: 0.06em;
  }

  .detail-value {
    font-family:
      "JetBrains Mono",
      monospace;

    font-size: 0.78rem;

    font-weight: 600;

    color: var(--text);
  }

  .samples {
    display: flex;

    flex-wrap: wrap;

    gap: 6px;

    margin-top: 12px;
  }

  .sample {
    padding:
      5px 8px;

    border-radius: 7px;

    background:
      rgba(255, 255, 255, 0.035);

    color: var(--text-secondary);

    font-family:
      "JetBrains Mono",
      monospace;

    font-size: 0.68rem;
  }

  /* --------------------------------------------
     Footer
  -------------------------------------------- */

  .footer {
    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 12px;

    flex-wrap: wrap;

    color: var(--text-muted);

    font-size: 0.72rem;
  }

  .footer strong {
    color: var(--text-secondary);
  }

  .legend {
    display: flex;

    align-items: center;

    gap: 12px;

    flex-wrap: wrap;
  }

  .legend span {
    display: inline-flex;

    align-items: center;

    gap: 5px;
  }

  .legend-dot {
    width: 7px;
    height: 7px;

    border-radius: 50%;
  }

  .legend-fast {
    background: var(--green);
  }

  .legend-medium {
    background: var(--yellow);
  }

  .legend-slow {
    background: var(--orange);
  }

  .legend-bad {
    background: var(--red);
  }

  /* --------------------------------------------
     Responsive
  -------------------------------------------- */

  @media (max-width: 820px) {
    .site-main {
      grid-template-columns:
        minmax(170px, 1fr)
        80px
        80px
        96px
        26px;
    }

    .average-column {
      display: none;
    }
  }

  @media (max-width: 700px) {
    body {
      padding:
        35px 14px 45px;
    }

    .container {
      gap: 20px;
    }

    .header h1 {
      font-size: 2.2rem;
    }

    .summary {
      grid-template-columns:
        repeat(2, 1fr);
    }

    .toolbar {
      align-items: stretch;
    }

    .toolbar-left,
    .toolbar-right {
      width: 100%;
    }

    .toolbar-left .btn {
      flex: 1;
    }

    .toolbar-right select {
      flex: 1;
    }

    .site-main {
      grid-template-columns:
        minmax(0, 1fr)
        76px
        92px
        26px;
    }

    .jitter-column {
      display: none;
    }

    .detail-grid {
      grid-template-columns:
        repeat(3, 1fr);
    }
  }

  @media (max-width: 480px) {
    .summary {
      grid-template-columns: 1fr 1fr;
    }

    .site-url {
      display: none;
    }

    .details {
      padding-left: 16px;
      padding-right: 16px;
    }

    .site-row.expanded .details {
      padding: 0 16px 14px;
    }

    .site-main {
      padding:
        14px 16px;

      grid-template-columns:
        minmax(0, 1fr)
        68px
        84px
        24px;
    }

    .detail-grid {
      grid-template-columns:
        repeat(2, 1fr);
    }

    .footer {
      align-items: flex-start;

      flex-direction: column;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;

      transition-duration:
        0.01ms !important;
    }
  }
</style>
</head>

<body>

<div class="container">

  <header class="header">

    <span class="badge">
      Browser-Side Diagnostic
    </span>

    <h1>Ping Monitor</h1>

    <p>
      Measures <strong>browser HTTPS request latency</strong>, not ICMP
      ping. Five samples are collected per service to calculate median
      latency, jitter, and stability.
    </p>

  </header>

  <section class="glass summary">

    <div class="summary-card online">
      <span class="label">
        Online
      </span>

      <span
        class="value"
        id="onlineCount"
      >
        —
      </span>
    </div>

    <div class="summary-card offline">
      <span class="label">
        Offline / Failed
      </span>

      <span
        class="value"
        id="offlineCount"
      >
        —
      </span>
    </div>

    <div class="summary-card">
      <span class="label">
        Median Latency
      </span>

      <span
        class="value"
        id="medianPing"
      >
        —
      </span>
    </div>

    <div class="summary-card jitter">
      <span class="label">
        Jitter
      </span>

      <span
        class="value"
        id="jitterPing"
      >
        —
      </span>
    </div>

  </section>

  <div class="toolbar">

    <div class="toolbar-left">

      <button
        class="btn"
        id="btnPing"
        type="button"
      >
        ⚡ Ping All
      </button>

      <button
        class="btn secondary"
        id="btnExpand"
        type="button"
      >
        <span>Expand All</span>
      </button>

      <button
        class="btn secondary"
        id="btnCollapse"
        type="button"
      >
        <span>Collapse All</span>
      </button>

    </div>

    <div class="toolbar-right">

      <label for="sortSelect" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;">
        Sort services
      </label>

      <select
        id="sortSelect"
        aria-label="Sort services"
      >
        <option value="default">
          Sort: Default
        </option>

        <option value="fastest">
          Sort: Fastest
        </option>

        <option value="slowest">
          Sort: Slowest
        </option>

        <option value="status">
          Sort: Status
        </option>

        <option value="name">
          Sort: Name
        </option>
      </select>

    </div>

  </div>

  <section class="glass site-list">

    <div
      class="progress-bar"
      id="progressBar"
    ></div>

    <div id="siteContainer"></div>

  </section>

  <footer class="footer">

    <div>
      Last checked:
      <strong id="lastChecked">
        Never
      </strong>
    </div>

    <div class="legend">

      <span>
        <i
          class="legend-dot legend-fast"
        ></i>
        Fast
      </span>

      <span>
        <i
          class="legend-dot legend-medium"
        ></i>
        Normal
      </span>

      <span>
        <i
          class="legend-dot legend-slow"
        ></i>
        Slow
      </span>

      <span>
        <i
          class="legend-dot legend-bad"
        ></i>
        Very slow
      </span>

    </div>

  </footer>

</div>

<script>
(function () {
  "use strict";

  /* ============================================
     Configuration
  ============================================ */

  var CONFIG = {
    samplesPerSite: 5,
    timeoutMs: 4500,
    maxConcurrent: 4,
    cacheBust: true
  };

  /* ============================================
     Service definitions

     "url" is the endpoint actually measured.
     "icon" is only used for the small avatar
     image and has no effect on the measurement.
  ============================================ */

  var SITES = [
    {
      name: "Google",
      url: "https://www.google.com/generate_204",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=google.com",
      color: "#5a9cf5"
    },

    {
      name: "Facebook",
      url: "https://www.facebook.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=facebook.com",
      color: "#2d88ff"
    },

    {
      name: "GitHub",
      url: "https://github.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=github.com",
      color: "#444d56"
    },

    {
      name: "Telegram",
      url: "https://telegram.org/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=telegram.org",
      color: "#2ea6d9"
    },

    {
      name: "YouTube",
      url: "https://www.youtube.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=youtube.com",
      color: "#ff3333"
    },

    {
      name: "Wikipedia",
      url: "https://www.wikipedia.org/static/favicon/wikipedia.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org",
      color: "#636466"
    },

    {
      name: "Amazon",
      url: "https://www.amazon.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=amazon.com",
      color: "#ff9900"
    },

    {
      name: "Reddit",
      url: "https://www.reddit.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=reddit.com",
      color: "#ff5700"
    },

    {
      name: "X",
      url: "https://x.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=x.com",
      color: "#2b2b2b"
    },

    {
      name: "Instagram",
      url: "https://www.instagram.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=instagram.com",
      color: "#d93172"
    },

    {
      name: "WhatsApp",
      url: "https://www.whatsapp.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com",
      color: "#2dd36f"
    },

    {
      name: "Discord",
      url: "https://discord.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=discord.com",
      color: "#6d83f2"
    },

    {
      name: "TikTok",
      url: "https://www.tiktok.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=tiktok.com",
      color: "#2b2b2b"
    },

    {
      name: "Netflix",
      url: "https://www.netflix.com/favicon.ico",
      icon: "https://www.google.com/s2/favicons?sz=64&domain=netflix.com",
      color: "#e61525"
    }
  ];

  /* ============================================
     DOM references
  ============================================ */

  var siteContainer =
    document.getElementById(
      "siteContainer"
    );

  var btnPing =
    document.getElementById(
      "btnPing"
    );

  var btnExpand =
    document.getElementById(
      "btnExpand"
    );

  var btnCollapse =
    document.getElementById(
      "btnCollapse"
    );

  var sortSelect =
    document.getElementById(
      "sortSelect"
    );

  var progressBar =
    document.getElementById(
      "progressBar"
    );

  var onlineCount =
    document.getElementById(
      "onlineCount"
    );

  var offlineCount =
    document.getElementById(
      "offlineCount"
    );

  var medianPing =
    document.getElementById(
      "medianPing"
    );

  var jitterPing =
    document.getElementById(
      "jitterPing"
    );

  var lastChecked =
    document.getElementById(
      "lastChecked"
    );

  /* ============================================
     Helpers
  ============================================ */

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function median(values) {
    if (!values.length) {
      return null;
    }

    var sorted =
      values.slice().sort(
        function (a, b) {
          return a - b;
        }
      );

    var middle =
      Math.floor(
        sorted.length / 2
      );

    if (sorted.length % 2) {
      return sorted[middle];
    }

    return (
      sorted[middle - 1] +
      sorted[middle]
    ) / 2;
  }

  function average(values) {
    if (!values.length) {
      return null;
    }

    return (
      values.reduce(
        function (sum, value) {
          return sum + value;
        },
        0
      ) / values.length
    );
  }

  function jitter(values) {
    if (values.length < 2) {
      return 0;
    }

    var avg =
      average(values);

    var variance =
      values.reduce(
        function (sum, value) {
          return (
            sum +
            Math.pow(
              value - avg,
              2
            )
          );
        },
        0
      ) / values.length;

    return Math.sqrt(
      variance
    );
  }

  function formatMs(value) {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(value)
    ) {
      return "—";
    }

    return (
      Math.round(value) +
      " ms"
    );
  }

  function formatPercent(value) {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(value)
    ) {
      return "—";
    }

    return (
      Math.round(value * 100) +
      "%"
    );
  }

  function latencyClass(ms) {
    if (ms === null) {
      return "";
    }

    if (ms < 100) {
      return "fast";
    }

    if (ms < 250) {
      return "medium";
    }

    if (ms < 600) {
      return "slow";
    }

    return "very-slow";
  }

  function statusLabel(status) {
    switch (status) {
      case "online":
        return "Online";

      case "degraded":
        return "Degraded";

      case "timeout":
        return "Timeout";

      case "failed":
        return "Failed";

      default:
        return "Waiting";
    }
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    ).format(date);
  }

  /* ============================================
     State
  ============================================ */

  var state =
    new Map();

  var isChecking = false;

  SITES.forEach(
    function (site) {
      state.set(
        site.name,
        {
          site: site,
          samples: [],
          successRate: 0,
          status: "idle",
          reason: null,
          element: null
        }
      );
    }
  );

  /* ============================================
     UI creation
  ============================================ */

  function createSiteRow(site) {
    var row =
      document.createElement(
        "div"
      );

    row.className =
      "site-row";

    row.dataset.name =
      site.name;

    row.innerHTML =
      '<div class="site-main">' +

        '<div class="site-info">' +

          '<div ' +
            'class="site-avatar" ' +
            'style="background-color:' +
            site.color +
            '">' +

            '<img ' +
              'src="' +
              site.icon +
              '" ' +
              'alt="" ' +
              'loading="lazy">' +

          '</div>' +

          '<div style="min-width:0">' +

            '<div class="site-name">' +
              escapeHtml(
                site.name
              ) +
            '</div>' +

            '<span class="site-url">' +
              escapeHtml(
                site.url
              ) +
            '</span>' +

          '</div>' +

        '</div>' +

        '<span ' +
          'class="metric latency" ' +
          'data-median>' +
          '—' +
        '</span>' +

        '<span ' +
          'class="metric muted average-column" ' +
          'data-average>' +
          '—' +
        '</span>' +

        '<span ' +
          'class="metric muted jitter-column" ' +
          'data-jitter-main>' +
          '—' +
        '</span>' +

        '<span ' +
          'class="status-badge status-column" ' +
          'data-status>' +

          '<span ' +
            'class="status-dot">' +
          '</span>' +

          '<span>' +
            'Waiting' +
          '</span>' +

        '</span>' +

        '<button ' +
          'class="expand-button" ' +
          'type="button" ' +
          'aria-expanded="false" ' +
          'aria-label="Show details">' +

          '⌄' +

        '</button>' +

      '</div>' +

      '<div class="details">' +

        '<div class="detail-panel">' +

          '<div class="detail-grid">' +

            '<div class="detail-card">' +
              '<span class="detail-label">Best</span>' +
              '<span class="detail-value" data-best>—</span>' +
            '</div>' +

            '<div class="detail-card">' +
              '<span class="detail-label">Median</span>' +
              '<span class="detail-value" data-detail-median>—</span>' +
            '</div>' +

            '<div class="detail-card">' +
              '<span class="detail-label">Average</span>' +
              '<span class="detail-value" data-detail-average>—</span>' +
            '</div>' +

            '<div class="detail-card">' +
              '<span class="detail-label">Worst</span>' +
              '<span class="detail-value" data-worst>—</span>' +
            '</div>' +

            '<div class="detail-card">' +
              '<span class="detail-label">Success</span>' +
              '<span class="detail-value" data-success>—</span>' +
            '</div>' +

          '</div>' +

          '<div ' +
            'class="samples" ' +
            'data-samples>' +

          '</div>' +

        '</div>' +

      '</div>';

    siteContainer.appendChild(
      row
    );

    var item =
      state.get(
        site.name
      );

    item.element =
      row;

    var image =
      row.querySelector(
        ".site-avatar img"
      );

    image.addEventListener(
      "error",
      function () {
        this.style.display =
          "none";

        if (
          !this.parentElement
            .querySelector(
              ".avatar-fallback"
            )
        ) {
          var fallback =
            document.createElement(
              "span"
            );

          fallback.className =
            "avatar-fallback";

          fallback.textContent =
            site.name.charAt(
              0
            );

          this.parentElement.appendChild(
            fallback
          );
        }
      }
    );

    var expandButton =
      row.querySelector(
        ".expand-button"
      );

    function toggleRow() {
      var willExpand =
        !row.classList.contains(
          "expanded"
        );

      row.classList.toggle(
        "expanded",
        willExpand
      );

      expandButton.setAttribute(
        "aria-expanded",
        willExpand ? "true" : "false"
      );

      expandButton.setAttribute(
        "aria-label",
        willExpand ? "Hide details" : "Show details"
      );
    }

    expandButton.addEventListener(
      "click",
      function (event) {
        event.stopPropagation();

        toggleRow();
      }
    );

    row.querySelector(
      ".site-main"
    ).addEventListener(
      "click",
      function (event) {
        if (
          event.target.closest(
            ".expand-button"
          )
        ) {
          return;
        }

        toggleRow();
      }
    );
  }

  SITES.forEach(
    createSiteRow
  );

  /* ============================================
     UI updates
  ============================================ */

  function updateSite(siteName) {
    var data =
      state.get(
        siteName
      );

    if (
      !data ||
      !data.element
    ) {
      return;
    }

    var values =
      data.samples;

    var med =
      values.length
        ? median(values)
        : null;

    var avg =
      values.length
        ? average(values)
        : null;

    var best =
      values.length
        ? Math.min.apply(
            Math,
            values
          )
        : null;

    var worst =
      values.length
        ? Math.max.apply(
            Math,
            values
          )
        : null;

    var jit =
      values.length
        ? jitter(values)
        : null;

    if (
      values.length === 0
    ) {
      if (
        data.reason ===
        "timeout"
      ) {
        data.status =
          "timeout";
      } else {
        data.status =
          "failed";
      }
    } else if (
      data.successRate < 1
    ) {
      data.status =
        "degraded";
    } else {
      data.status =
        "online";
    }

    var row =
      data.element;

    var medianEl =
      row.querySelector(
        "[data-median]"
      );

    var averageEl =
      row.querySelector(
        "[data-average]"
      );

    var jitterMainEl =
      row.querySelector(
        "[data-jitter-main]"
      );

    var statusEl =
      row.querySelector(
        "[data-status]"
      );

    var bestEl =
      row.querySelector(
        "[data-best]"
      );

    var detailMedian =
      row.querySelector(
        "[data-detail-median]"
      );

    var detailAverage =
      row.querySelector(
        "[data-detail-average]"
      );

    var worstEl =
      row.querySelector(
        "[data-worst]"
      );

    var successEl =
      row.querySelector(
        "[data-success]"
      );

    var samplesEl =
      row.querySelector(
        "[data-samples]"
      );

    medianEl.textContent =
      formatMs(med);

    medianEl.className =
      "metric latency " +
      latencyClass(med);

    averageEl.textContent =
      formatMs(avg);

    jitterMainEl.textContent =
      formatMs(jit);

    statusEl.className =
      "status-badge " +
      "status-column " +
      data.status;

    statusEl.innerHTML =
      '<span class="status-dot"></span>' +
      '<span>' +
      statusLabel(
        data.status
      ) +
      "</span>";

    bestEl.textContent =
      formatMs(best);

    detailMedian.textContent =
      formatMs(med);

    detailAverage.textContent =
      formatMs(avg);

    worstEl.textContent =
      formatMs(worst);

    successEl.textContent =
      data.status !== "idle"
        ? formatPercent(
            data.successRate
          )
        : "—";

    samplesEl.innerHTML =
      "";

    if (
      values.length === 0
    ) {
      if (
        data.status !== "idle"
      ) {
        var sample =
          document.createElement(
            "span"
          );

        sample.className =
          "sample";

        sample.textContent =
          data.reason ===
          "timeout"
            ? "Requests timed out"
            : "No successful samples";

        samplesEl.appendChild(
          sample
        );
      }

      return;
    }

    values.forEach(
      function (value, index) {
        var sampleEl =
          document.createElement(
            "span"
          );

        sampleEl.className =
          "sample";

        sampleEl.textContent =
          "#" +
          (index + 1) +
          " " +
          Math.round(value) +
          " ms";

        samplesEl.appendChild(
          sampleEl
        );
      }
    );
  }

  /* ============================================
     Request logic
  ============================================ */

  function buildTestUrl(url) {
    if (
      !CONFIG.cacheBust
    ) {
      return url;
    }

    var separator =
      url.indexOf("?") !== -1
        ? "&"
        : "?";

    return (
      url +
      separator +
      "_ping=" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2)
    );
  }

  function attempt(url) {
    var controller =
      new AbortController();

    var timer =
      setTimeout(
        function () {
          controller.abort();
        },
        CONFIG.timeoutMs
      );

    var start =
      performance.now();

    return fetch(
      buildTestUrl(url),
      {
        method: "GET",

        mode: "no-cors",

        cache: "no-store",

        redirect: "follow",

        signal:
          controller.signal
      }
    ).then(
      function () {
        var ms =
          Math.max(
            1,
            Math.round(
              performance.now() -
              start
            )
          );

        return {
          success: true,
          ms: ms,
          reason: null
        };
      }
    ).catch(
      function (error) {
        return {
          success: false,
          ms: null,
          reason:
            error &&
            error.name ===
              "AbortError"
              ? "timeout"
              : "failed"
        };
      }
    ).finally(
      function () {
        clearTimeout(
          timer
        );
      }
    );
  }

  /* ============================================
     Measurement

     Samples for a single service run sequentially,
     one after another, never in parallel.
  ============================================ */

  function measureSite(
    site
  ) {
    var samples =
      [];

    var lastReason =
      null;

    var chain =
      Promise.resolve();

    for (
      var i = 0;
      i <
      CONFIG.samplesPerSite;
      i++
    ) {
      chain = chain.then(
        function () {
          return attempt(
            site.url
          );
        }
      ).then(
        function (result) {
          if (
            result.success
          ) {
            samples.push(
              result.ms
            );
          } else {
            lastReason =
              result.reason;
          }
        }
      );
    }

    return chain.then(
      function () {
        return {
          samples: samples,

          successRate:
            samples.length /
            CONFIG.samplesPerSite,

          reason:
            samples.length
              ? null
              : lastReason
        };
      }
    );
  }

  /* ============================================
     Concurrency

     Up to CONFIG.maxConcurrent services are
     measured at the same time. Each service's
     own samples still run one at a time.
  ============================================ */

  function runConcurrent(
    items,
    worker,
    limit
  ) {
    var index = 0;

    var completed = 0;

    function runner() {
      function next() {
        var current =
          index++;

        if (
          current >=
          items.length
        ) {
          return Promise.resolve();
        }

        return worker(
          items[current]
        ).then(
          function () {
            completed++;

            progressBar.style.width =
              Math.round(
                (
                  completed /
                  items.length
                ) *
                100
              ) +
              "%";

            return next();
          }
        );
      }

      return next();
    }

    var runners =
      [];

    var count =
      Math.min(
        limit,
        items.length
      );

    for (
      var i = 0;
      i < count;
      i++
    ) {
      runners.push(
        runner()
      );
    }

    return Promise.all(
      runners
    );
  }

  /* ============================================
     Global statistics
  ============================================ */

  function updateGlobal() {
    var allSamples =
      [];

    var online = 0;
    var offline = 0;

    state.forEach(
      function (item) {
        if (
          item.samples.length
        ) {
          online++;

          allSamples =
            allSamples.concat(
              item.samples
            );
        } else if (
          item.status !==
          "idle"
        ) {
          offline++;
        }
      }
    );

    onlineCount.textContent =
      online;

    offlineCount.textContent =
      offline;

    var med =
      allSamples.length
        ? median(allSamples)
        : null;

    var jit =
      allSamples.length
        ? jitter(allSamples)
        : null;

    medianPing.textContent =
      formatMs(med);

    jitterPing.textContent =
      formatMs(jit);
  }

  /* ============================================
     Sorting

     Sorting only reorders the DOM. It never
     changes stored measurements.
  ============================================ */

  function sortRows() {
    var rows =
      Array.prototype.slice.call(
        siteContainer.querySelectorAll(
          ".site-row"
        )
      );

    var mode =
      sortSelect.value;

    rows.sort(
      function (a, b) {
        var aData =
          state.get(
            a.dataset.name
          );

        var bData =
          state.get(
            b.dataset.name
          );

        var aMedian =
          aData.samples.length
            ? median(
                aData.samples
              )
            : Infinity;

        var bMedian =
          bData.samples.length
            ? median(
                bData.samples
              )
            : Infinity;

        if (
          mode ===
          "fastest"
        ) {
          return (
            aMedian -
            bMedian
          );
        }

        if (
          mode ===
          "slowest"
        ) {
          return (
            bMedian -
            aMedian
          );
        }

        if (
          mode ===
          "name"
        ) {
          return aData.site.name.localeCompare(
            bData.site.name
          );
        }

        if (
          mode ===
          "status"
        ) {
          var weight = {
            online: 1,
            degraded: 2,
            timeout: 3,
            failed: 4,
            idle: 5
          };

          return (
            (
              weight[
                aData.status
              ] || 99
            ) -
            (
              weight[
                bData.status
              ] || 99
            )
          );
        }

        return (
          SITES.findIndex(
            function (site) {
              return (
                site.name ===
                aData.site.name
              );
            }
          ) -
          SITES.findIndex(
            function (site) {
              return (
                site.name ===
                bData.site.name
              );
            }
          )
        );
      }
    );

    rows.forEach(
      function (row) {
        siteContainer.appendChild(
          row
        );
      }
    );
  }

  /* ============================================
     Ping All

     The only way a test starts is a user click.
     There is no automatic or interval-based
     pinging anywhere in this file.
  ============================================ */

  function pingAll() {
    if (
      isChecking
    ) {
      return;
    }

    isChecking =
      true;

    btnPing.disabled =
      true;

    btnPing.textContent =
      "⏳ Checking...";

    progressBar.style.width =
      "0%";

    state.forEach(
      function (item) {
        item.samples = [];
        item.successRate = 0;
        item.status = "idle";
        item.reason = null;

        updateSite(
          item.site.name
        );
      }
    );

    updateGlobal();

    runConcurrent(
      SITES,

      function (site) {
        return measureSite(
          site
        ).then(
          function (result) {
            var item =
              state.get(
                site.name
              );

            item.samples =
              result.samples;

            item.successRate =
              result.successRate;

            item.reason =
              result.reason;

            updateSite(
              site.name
            );

            updateGlobal();
          }
        );
      },

      CONFIG.maxConcurrent
    ).then(
      function () {
        sortRows();

        lastChecked.textContent =
          formatTime(
            new Date()
          );
      }
    ).finally(
      function () {
        isChecking =
          false;

        btnPing.disabled =
          false;

        btnPing.textContent =
          "⚡ Ping All";

        setTimeout(
          function () {
            progressBar.style.width =
              "0%";
          },
          400
        );
      }
    );
  }

  /* ============================================
     Expand / Collapse
  ============================================ */

  btnExpand.addEventListener(
    "click",
    function () {
      var rows =
        document.querySelectorAll(
          ".site-row"
        );

      for (
        var i = 0;
        i < rows.length;
        i++
      ) {
        rows[i].classList.add(
          "expanded"
        );

        var button =
          rows[i].querySelector(
            ".expand-button"
          );

        button.setAttribute(
          "aria-expanded",
          "true"
        );

        button.setAttribute(
          "aria-label",
          "Hide details"
        );
      }
    }
  );

  btnCollapse.addEventListener(
    "click",
    function () {
      var rows =
        document.querySelectorAll(
          ".site-row"
        );

      for (
        var i = 0;
        i < rows.length;
        i++
      ) {
        rows[i].classList.remove(
          "expanded"
        );

        var button =
          rows[i].querySelector(
            ".expand-button"
          );

        button.setAttribute(
          "aria-expanded",
          "false"
        );

        button.setAttribute(
          "aria-label",
          "Show details"
        );
      }
    }
  );

  btnPing.addEventListener(
    "click",
    pingAll
  );

  sortSelect.addEventListener(
    "change",
    sortRows
  );

  /* ============================================
     Initialization
  ============================================ */

  updateGlobal();

})();
</script>

</body>
</html>
`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "no-store",
      },
    });
  },
};
