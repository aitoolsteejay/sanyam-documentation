// MYNTMORE Operations & Handover Portal Engine
// Enhanced Navigation, Prominent Zoho WorkDrive Links, Fathom Calls, Split-View Reader

(function () {
  'use strict';

  const DATA = window.PORTAL_DATA || {};
  let currentTab = 'overview';
  let activeDocKey = 'website_bible';
  let selectedSearchResultIndex = 0;
  
  // LocalStorage Keys
  const STORAGE_KEYS = {
    VAULT: 'mm_credentials_vault_v1',
    CHECKLIST: 'mm_checklist_state_v1',
    DECISIONS: 'mm_tejas_decisions_v1',
    APPS_VIEW_MODE: 'mm_apps_view_mode_v1'
  };

  // State
  let vaultState = {};
  let checklistState = {};
  let decisionsState = {};
  let appsViewMode = localStorage.getItem(STORAGE_KEYS.APPS_VIEW_MODE) || 'grid'; // 'grid' | 'table'

  const TAB_ORDER = ['overview', 'looms', 'vault', 'apps', 'domains', 'tasks', 'checklist', 'leadmagnets', 'clients', 'growth', 'docs'];

  const TAB_LABELS = {
    overview: 'Overview & Readiness',
    looms: 'Zoho WorkDrive Videos',
    vault: 'Keys & Password Vault',
    checklist: 'Handover Checklist',
    apps: 'Apps & Code Repositories',
    domains: 'Domains & Inboxes',
    tasks: 'Operating Rhythm & SOPs',
    leadmagnets: 'AI Lead Magnets',
    clients: 'Client Deliverables',
    growth: 'SEO & Growth Engine',
    docs: 'System Bibles & Docs'
  };

  // Initialize data stores from LocalStorage
  function initState() {
    try {
      const savedVault = localStorage.getItem(STORAGE_KEYS.VAULT);
      if (savedVault) {
        vaultState = JSON.parse(savedVault);
      } else {
        vaultState = {};
        if (DATA.systems && Array.isArray(DATA.systems)) {
          DATA.systems.forEach((s, idx) => {
            const keyId = 'sys_' + idx;
            vaultState[keyId] = {
              id: keyId,
              name: s['Tool'] || 'System',
              category: s['Category'] || 'General',
              login: s['Login email'] || '',
              apiKey: '',
              password: '',
              location: s['Password location'] || '',
              notes: s['Notes'] || '',
              usedFor: s['Used for'] || '',
              billing: s['Billing'] || '',
              status: s['Status'] || 'Mapped',
              isCustom: false
            };
          });
        }
        saveVaultState();
      }
    } catch (e) {
      console.error('Error initializing vault state:', e);
      vaultState = {};
    }

    try {
      const savedChecklist = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      checklistState = savedChecklist ? JSON.parse(savedChecklist) : {};
    } catch (e) {
      checklistState = {};
    }

    try {
      const savedDecisions = localStorage.getItem(STORAGE_KEYS.DECISIONS);
      decisionsState = savedDecisions ? JSON.parse(savedDecisions) : {};
    } catch (e) {
      decisionsState = {};
    }

    updateHeaderBadges();
  }

  function saveVaultState() {
    localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(vaultState));
    updateHeaderBadges();
  }

  function saveChecklistState() {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklistState));
    updateHeaderBadges();
  }

  function saveDecisionsState() {
    localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisionsState));
  }

  function updateHeaderBadges() {
    const vaultItems = Object.values(vaultState);
    const filledCount = vaultItems.filter(item => (item.apiKey && item.apiKey.trim()) || (item.password && item.password.trim())).length;
    const missingCount = vaultItems.length - filledCount;

    const badgeVault = document.getElementById('header-vault-badge');
    const navMissing = document.getElementById('nav-missing-keys-pill');
    if (badgeVault) {
      badgeVault.innerText = `${filledCount}/${vaultItems.length}`;
    }
    if (navMissing) {
      navMissing.innerText = missingCount > 0 ? `${missingCount} needed` : 'All set';
      navMissing.className = missingCount > 0 
        ? 'ml-auto text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold'
        : 'ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold';
    }

    const totalChecklist = (DATA.checklist || []).length;
    const checkedCount = Object.values(checklistState).filter(Boolean).length;
    const badgeChecklist = document.getElementById('header-checklist-progress');
    const navPercent = document.getElementById('nav-checklist-percent');
    
    if (badgeChecklist) {
      badgeChecklist.innerText = `${checkedCount}/${totalChecklist}`;
    }
    if (navPercent && totalChecklist > 0) {
      const pct = Math.round((checkedCount / totalChecklist) * 100);
      navPercent.innerText = `${pct}%`;
    }
  }

  // Toast Utility
  window.showToast = function (msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;
    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-16', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.add('translate-y-16', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2200);
  };

  // Clipboard copy helper
  window.copyToClipboard = function (text, label) {
    if (!text) {
      showToast('Field is empty');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast(label ? `${label} copied!` : 'Copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy');
    });
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Markdown Parser with Heading Extraction for TOC
  function parseMarkdownWithTOC(md) {
    if (!md) return { html: '<p class="text-slate-500">No content available.</p>', headings: [] };
    
    let headings = [];
    let headingCounter = 0;

    let html = md
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/```([a-z0-9]*)\n([\s\S]*?)```/gm, function(match, lang, code) {
        return `<pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400 my-4"><code>${escapeHtml(code.trim())}</code></pre>`;
      })
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
      // Headers with slug anchors
      .replace(/^### (.*$)/gim, function(match, title) {
        const id = 'heading_' + (++headingCounter);
        headings.push({ id, title: title.replace(/<[^>]*>/g, '').trim(), level: 3 });
        return `<h3 id="${id}" class="text-base font-bold text-slate-100 mt-5 mb-2">${title}</h3>`;
      })
      .replace(/^## (.*$)/gim, function(match, title) {
        const id = 'heading_' + (++headingCounter);
        headings.push({ id, title: title.replace(/<[^>]*>/g, '').trim(), level: 2 });
        return `<h2 id="${id}" class="text-lg font-extrabold text-white mt-6 mb-3 border-b border-slate-800 pb-1.5">${title}</h2>`;
      })
      .replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-white mt-6 mb-4 pb-2 border-b border-indigo-500/30">$1</h1>')
      .replace(/<aside>([\s\S]*?)<\/aside>/gim, '<div class="my-4 p-4 rounded-xl bg-indigo-950/30 border-l-4 border-indigo-500 text-slate-300 text-xs">$1</div>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 text-slate-400 italic my-2">$1</blockquote>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-slate-300">$1</em>')
      .replace(/^---$/gim, '<hr class="border-slate-800 my-6" />')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300 text-xs my-1">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">$1</a>');

    const lines = html.split('\n');
    let out = [];
    let inList = false;

    lines.forEach(line => {
      let trimmed = line.trim();
      if (trimmed.startsWith('<li')) {
        if (!inList) {
          out.push('<ul class="my-2 space-y-1">');
          inList = true;
        }
        out.push(trimmed);
      } else {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        if (trimmed && !trimmed.startsWith('<h') && !trimmed.startsWith('<pre') && !trimmed.startsWith('<div') && !trimmed.startsWith('<hr') && !trimmed.startsWith('<blockquote')) {
          out.push(`<p class="text-xs text-slate-300 leading-relaxed my-2">${trimmed}</p>`);
        } else {
          out.push(trimmed);
        }
      }
    });

    if (inList) out.push('</ul>');
    return { html: out.join('\n'), headings };
  }

  // Tab Switcher with Hash Routing and Top Nav Ribbon sync
  window.switchTab = function (tabId, updateHash = true) {
    if (!tabId || !TAB_LABELS[tabId]) tabId = 'overview';
    currentTab = tabId;

    if (updateHash && window.location.hash !== '#' + tabId) {
      window.location.hash = '#' + tabId;
    }

    // Update active state in Sidebar Nav
    document.querySelectorAll('#sidebar-nav .nav-item').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update active state in Sticky Top Nav Ribbon
    document.querySelectorAll('.top-nav-btn').forEach(btn => {
      const target = btn.getAttribute('data-top-tab');
      if (target === tabId) {
        if (tabId === 'looms') {
          btn.className = 'top-nav-btn active px-3.5 py-1.5 rounded-lg font-bold text-white bg-emerald-600 shadow-lg shadow-emerald-500/30 border border-emerald-400/50 transition-all flex items-center gap-1.5';
        } else {
          btn.className = 'top-nav-btn active px-3.5 py-1.5 rounded-lg font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-500/30 border border-indigo-400/50 transition-all flex items-center gap-1.5';
        }
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else if (target === 'looms') {
        btn.className = 'top-nav-btn px-3 py-1.5 rounded-lg font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm';
      } else {
        btn.className = 'top-nav-btn px-3 py-1.5 rounded-lg font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-1.5';
      }
    });

    // Update Breadcrumb
    const bc = document.getElementById('breadcrumb-current-tab');
    if (bc) {
      bc.innerText = TAB_LABELS[tabId] || 'Overview';
    }

    // Mobile sidebar auto-close
    const sidebar = document.getElementById('sidebar-nav');
    if (window.innerWidth < 1024 && sidebar && !sidebar.classList.contains('hidden')) {
      sidebar.classList.add('hidden');
    }

    const container = document.getElementById('main-content');
    if (!container) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    let contentHtml = '';
    switch (tabId) {
      case 'overview': contentHtml = renderOverviewTab(); break;
      case 'looms': contentHtml = renderLoomsTab(); break;
      case 'vault': contentHtml = renderVaultTab(); break;
      case 'apps': contentHtml = renderAppsTab(); break;
      case 'domains': contentHtml = renderDomainsTab(); break;
      case 'tasks': contentHtml = renderTasksTab(); break;
      case 'leadmagnets': contentHtml = renderLeadMagnetsTab(); break;
      case 'clients': contentHtml = renderClientsTab(); break;
      case 'growth': contentHtml = renderGrowthTab(); break;
      case 'docs': contentHtml = renderDocsTab(); break;
      case 'checklist': contentHtml = renderChecklistTab(); break;
      default: contentHtml = renderOverviewTab();
    }

    // Append Navigation Footer to make exploring guided
    container.innerHTML = contentHtml + renderTabNavigationFooter(tabId);
  };

  function renderTabNavigationFooter(tabId) {
    const idx = TAB_ORDER.indexOf(tabId);
    const prevTab = idx > 0 ? TAB_ORDER[idx - 1] : null;
    const nextTab = idx < TAB_ORDER.length - 1 ? TAB_ORDER[idx + 1] : null;

    return `
      <div class="mt-12 pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs">
        <div>
          ${prevTab ? `
            <button onclick="switchTab('${prevTab}')" class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-2 transition-all">
              <span>←</span>
              <div class="text-left">
                <div class="text-[10px] text-slate-500 uppercase tracking-wider">Previous</div>
                <div class="font-bold text-white">${TAB_LABELS[prevTab]}</div>
              </div>
            </button>
          ` : '<div></div>'}
        </div>

        <div>
          ${nextTab ? `
            <button onclick="switchTab('${nextTab}')" class="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/10">
              <div class="text-right">
                <div class="text-[10px] text-indigo-400 uppercase tracking-wider">Next Section</div>
                <div class="font-bold text-white">${TAB_LABELS[nextTab]}</div>
              </div>
              <span>→</span>
            </button>
          ` : `
            <button onclick="switchTab('overview')" class="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white flex items-center gap-2">
              <span>Back to Overview ↑</span>
            </button>
          `}
        </div>
      </div>
    `;
  }

  /* -------------------------------------------------------------
     1. TAB: OVERVIEW & READINESS
  ------------------------------------------------------------- */
  function renderOverviewTab() {
    const meta = DATA.metadata || {};
    const stats = meta.stats || {};
    const totalVault = Object.values(vaultState).length;
    const filledVault = Object.values(vaultState).filter(item => (item.apiKey && item.apiKey.trim()) || (item.password && item.password.trim())).length;
    const workdriveVideos = (DATA.looms || []).filter(v => v.hasWorkdrive);

    return `
      <div class="tab-pane space-y-6">
        
        <!-- Welcome Hero Banner -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
          <div class="relative z-10 max-w-3xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Operations & System Handover
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sanyam × Myntmore Central Command
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete technical and operational ownership transfer for Myntmore's growth marketing systems, website, internal Command Center dashboard, automated outreach, and client deliverables.
            </p>
            <div class="flex flex-wrap items-center gap-2.5 pt-2 text-xs text-slate-400">
              <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-medium text-slate-200">
                Outgoing: <strong class="text-white">Sanyam</strong>
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-medium text-slate-200">
                Management: <strong class="text-white">Tejas Jhaveri</strong>
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 font-medium text-indigo-300">
                Incoming: <strong class="text-white">Tech Ops Intern</strong>
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-mono text-[11px]">
                Exported: Nov 2, 2026
              </span>
            </div>
          </div>
          <!-- Decorative Background Glow -->
          <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <!-- FEATURED ZOHO WORKDRIVE VIDEO SHOWCASE (COMPREHENSIVE DIRECT ACCESS) -->
        <div class="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/40 border border-emerald-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg shadow-inner">
                🎬
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-base sm:text-lg font-bold text-white">
                    Zoho WorkDrive Video Library
                  </h2>
                  <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                    12 Recordings Live
                  </span>
                </div>
                <p class="text-xs text-slate-300 mt-0.5">
                  Direct walkthrough recordings created by Sanyam covering critical production workflows, architecture, data entry, and automations.
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button onclick="copyAllWorkdriveLinks()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all">
                <span>📋 Copy All 12 Links</span>
              </button>
              <button onclick="switchTab('looms')" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5">
                <span>Open Video Hub</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- All 12 WorkDrive Videos Direct Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${workdriveVideos.map((v, vIdx) => {
              const numBadge = v.videoNumber ? `#${String(v.videoNumber).padStart(2, '0')}` : `#${vIdx + 1}`;
              const parts = v.parts && v.parts.length ? v.parts : (v.workdriveLinks || []).map((l, p) => ({ title: `Part ${p+1}`, url: l }));
              return `
                <div class="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-3.5 flex flex-col justify-between space-y-3 group transition-all">
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                        ${numBadge}
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">${escapeHtml(v.category || v['System'] || 'WorkDrive')}</span>
                      ${v['Length'] ? `<span class="text-[10px] text-slate-400 font-mono ml-auto">⏱ ${escapeHtml(v['Length'])}</span>` : ''}
                    </div>
                    <h4 class="font-bold text-white text-xs sm:text-sm group-hover:text-emerald-300 transition-colors line-clamp-1">
                      ${escapeHtml(v['Video'])}
                    </h4>
                    <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      ${escapeHtml(v['What to show'] || 'Step-by-step video demonstration on Zoho WorkDrive.')}
                    </p>
                  </div>

                  <div class="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <div class="flex items-center gap-1.5">
                      ${parts.map((p, pIdx) => `
                        <a href="${p.url}" target="_blank" class="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-sm">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                          <span class="truncate">${parts.length > 1 ? `Part ${p.part || pIdx + 1} ↗` : 'Watch on WorkDrive ↗'}</span>
                        </a>
                      `).join('')}
                    </div>
                    <div class="flex items-center justify-between gap-1 text-[10px] text-slate-400 font-mono">
                      <span class="truncate text-emerald-400/90 select-all" title="${parts[0]?.url}">${parts[0]?.url.slice(0, 36)}...</span>
                      <button onclick="copyToClipboard('${parts[0]?.url}', 'WorkDrive URL ${numBadge}')" class="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-semibold flex-shrink-0">
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4 Quick Action Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div onclick="switchTab('vault')" class="hub-card p-4 cursor-pointer hover:border-emerald-500/50 group">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                🔑
              </div>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${filledCountStatus(filledVault, totalVault)}">
                ${filledVault}/${totalVault} Configured
              </span>
            </div>
            <h3 class="text-sm font-bold text-white mt-3 group-hover:text-emerald-300 transition-colors">API & Password Vault</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Drop in Gemini key, Supabase tokens, and platform logins.</p>
          </div>

          <div onclick="switchTab('apps')" class="hub-card p-4 cursor-pointer hover:border-cyan-500/50 group">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                💻
              </div>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                ${stats.apps_count || 25} Projects
              </span>
            </div>
            <h3 class="text-sm font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">Apps & Repos Tracker</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Website, Dashboard, Outreach Tool, Workshop, Client tools.</p>
          </div>

          <div onclick="switchTab('tasks')" class="hub-card p-4 cursor-pointer hover:border-violet-500/50 group">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
                🔁
              </div>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                ${stats.recurring_tasks_count || 31} SOPs
              </span>
            </div>
            <h3 class="text-sm font-bold text-white mt-3 group-hover:text-violet-300 transition-colors">Operating Rhythm</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Monday audits, weekly SEO, blog publishing, YouTube Shorts.</p>
          </div>

          <div onclick="switchTab('checklist')" class="hub-card p-4 cursor-pointer hover:border-indigo-500/50 group">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                ✅
              </div>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                53 Checkpoints
              </span>
            </div>
            <h3 class="text-sm font-bold text-white mt-3 group-hover:text-indigo-300 transition-colors">Handover Checklist</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Track verification tasks from discovery through close-out.</p>
          </div>
        </div>

        <!-- Priority Risks to Close Alert Banner -->
        <div class="rounded-2xl bg-amber-950/20 border border-amber-500/30 p-5 space-y-3">
          <div class="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <span>Priority Operational Risks & Vulnerabilities to Close</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            <div class="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/20 space-y-1">
              <strong class="text-amber-200">1. Supabase Backups (Free Tier):</strong>
              <p class="text-slate-400 leading-relaxed text-[11px]">Both Supabase projects operate on the free plan with zero automated backups. Database changes must be manually applied in SQL editor. Establish export procedures before destructive schema edits.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/20 space-y-1">
              <strong class="text-amber-200">2. Zoho Failure Alerting:</strong>
              <p class="text-slate-400 leading-relaxed text-[11px]">Calendly booking → Zoho Flow → CRM Deals error recovery is currently reactive. Missing Deals are only caught when reported. Set up daily reconciliation.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/20 space-y-1">
              <strong class="text-amber-200">3. Shared Gemini API Key:</strong>
              <p class="text-slate-400 leading-relaxed text-[11px]">Multiple client applications share a single Google Cloud project & Gemini key. Audit usage monthly in AI Studio to prevent unexpected quota depletion.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/20 space-y-1">
              <strong class="text-amber-200">4. Live Proxy Credentials:</strong>
              <p class="text-slate-400 leading-relaxed text-[11px]">Proxy logins previously stored in Notion have been removed from pages. Ensure replacement credentials are vault-secured and rotated regularly.</p>
            </div>
          </div>
        </div>

        <!-- 5-Minute Safe Change Triage & Operating Rules -->
        <div class="hub-card p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              5-Minute Triage Before Any Production Change
            </h2>
            <button onclick="openDocModal('incident_sops')" class="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Read Full Incident SOP →</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div class="font-bold text-indigo-400">1. Impact Scope</div>
              <p class="text-slate-400 text-[11px]">Identify affected users: public visitors, dashboard team members, or external clients.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div class="font-bold text-indigo-400">2. Find Linked SOP</div>
              <p class="text-slate-400 text-[11px]">Check who approves: small website fixes can proceed; DB & billing changes require Tejas.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div class="font-bold text-indigo-400">3. Reversible Mode</div>
              <p class="text-slate-400 text-[11px]">Prefer preview deploys, branch PRs, and ensure rollbacks exist before proceeding.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div class="font-bold text-indigo-400">4. Capture Evidence</div>
              <p class="text-slate-400 text-[11px]">Record deployment ID, commit hash, before/after PageSpeed score, or test submission record.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div class="font-bold text-indigo-400">5. Update Runbook</div>
              <p class="text-slate-400 text-[11px]">Document the outcome and hand off to the relevant team lead or account manager.</p>
            </div>
          </div>
        </div>

        <!-- Leadership Decisions Checklist (Tejas Jhaveri) -->
        <div class="hub-card p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 class="text-sm sm:text-base font-bold text-white">Decisions Required from Management (Tejas)</h2>
              <p class="text-xs text-slate-400">Essential governance checkpoints to finalize before closing handover.</p>
            </div>
            <span class="text-xs px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              Action Required
            </span>
          </div>

          <div class="space-y-2" id="decisions-container">
            ${renderDecisionsList()}
          </div>
        </div>

      </div>
    `;
  }

  function filledCountStatus(filled, total) {
    if (filled === total) return 'bg-emerald-500/20 text-emerald-300';
    if (filled > 0) return 'bg-amber-500/20 text-amber-300';
    return 'bg-slate-800 text-slate-400';
  }

  function renderDecisionsList() {
    const decisions = [
      { id: 'dec_1', text: 'Confirm the incoming technical successor and formal reporting line.' },
      { id: 'dec_2', text: 'Agree training duration and practical test readiness criteria.' },
      { id: 'dec_3', text: 'Define Sanyam’s post-handover advisory support window and escalation protocol.' },
      { id: 'dec_4', text: 'Confirm production approval boundaries (which changes need founder sign-off).' },
      { id: 'dec_5', text: 'Approve Supabase backup/recovery protocol before any destructive changes.' },
      { id: 'dec_6', text: 'Confirm named backup owners for GitHub, Vercel, Zoho, and GoDaddy accounts.' },
      { id: 'dec_7', text: 'Verify proxy credential migration to approved password vault.' },
      { id: 'dec_8', text: 'Assign ongoing owner for Zoho Flow reconciliation and monthly Gemini API reviews.' }
    ];

    return decisions.map(d => {
      const isChecked = !!decisionsState[d.id];
      return `
        <label class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-900/60 cursor-pointer transition-colors border border-transparent hover:border-slate-800">
          <input type="checkbox" onchange="toggleDecision('${d.id}')" ${isChecked ? 'checked' : ''} class="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-800" />
          <span class="text-xs ${isChecked ? 'text-slate-500 line-through' : 'text-slate-200'}">${d.text}</span>
        </label>
      `;
    }).join('');
  }

  window.toggleDecision = function (id) {
    decisionsState[id] = !decisionsState[id];
    saveDecisionsState();
    const container = document.getElementById('decisions-container');
    if (container) {
      container.innerHTML = renderDecisionsList();
    }
  };

  /* -------------------------------------------------------------
     2. TAB: ZOHO WORKDRIVE VIDEOS & FATHOM RECORDINGS (USER FOCUS)
  ------------------------------------------------------------- */
  let activeLoomFilter = 'workdrive';
  let loomsViewMode = localStorage.getItem('myntmore_looms_view_mode') || 'cards';

  // Copy All 12 WorkDrive Links to Clipboard
  window.copyAllWorkdriveLinks = function () {
    const looms = (DATA.looms || []).filter(v => v.hasWorkdrive);
    let output = [
      '🎬 MYNTMORE — OFFICIAL ZOHO WORKDRIVE VIDEO LIBRARY (12 RECORDINGS)',
      '==================================================================',
      ''
    ];
    looms.forEach((v, idx) => {
      const numBadge = v.videoNumber ? `#${String(v.videoNumber).padStart(2, '0')}` : `#${idx + 1}`;
      output.push(`${numBadge}: ${v.Video}`);
      if (v.category) output.push(`  Category: ${v.category} | Duration: ${v['Length'] || 'N/A'}`);
      if (v['What to show']) output.push(`  Walkthrough: ${v['What to show']}`);
      const parts = v.parts && v.parts.length ? v.parts : (v.workdriveLinks || []).map((l, p) => ({ title: `Part ${p+1}`, url: l }));
      parts.forEach(p => {
        output.push(`  ▶ ${p.title}: ${p.url}`);
      });
      output.push('');
    });
    copyToClipboard(output.join('\n'), 'All 12 WorkDrive Links');
  };

  function renderLoomsTab() {
    const looms = DATA.looms || [];
    const fathomCalls = DATA.fathom_calls || [];
    const workdriveCount = looms.filter(v => v.hasWorkdrive).length;

    return `
      <div class="tab-pane space-y-6">
        
        <!-- Header Banner with WorkDrive Branding -->
        <div class="rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/40 border border-emerald-500/40 p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Official Handover Video Recordings
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Zoho WorkDrive Video Library</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">12 Videos Ready</span>
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every production walkthrough recorded by Sanyam is hosted on <strong>Zoho WorkDrive</strong>. Watch demonstrations, copy direct URLs, and review strategy calls with Tejas.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button onclick="copyAllWorkdriveLinks()" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              <span>📋 Copy All 12 WorkDrive Links</span>
            </button>
            <div class="flex items-center gap-2">
              <div class="px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-center">
                <div class="text-xl font-black text-emerald-400 font-mono">${workdriveCount}</div>
                <div class="text-[9px] text-slate-400 uppercase font-semibold">WorkDrive Ready</div>
              </div>
              <div class="px-3 py-2 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-center">
                <div class="text-xl font-black text-indigo-400 font-mono">${fathomCalls.length}</div>
                <div class="text-[9px] text-slate-400 uppercase font-semibold">Fathom Calls</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Controls & View Switcher -->
        <div class="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <!-- Filter Pills -->
            <div class="flex flex-wrap items-center gap-1.5 text-xs" id="looms-filter-pills">
              <button onclick="setLoomsFilter('workdrive', this)" class="loom-pill px-3 py-1.5 rounded-lg ${activeLoomFilter === 'workdrive' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-slate-300 hover:text-white'} flex items-center gap-1.5">
                <span>🟢 All WorkDrive (12)</span>
              </button>
              <button onclick="setLoomsFilter('stack', this)" class="loom-pill px-3 py-1.5 rounded-lg ${activeLoomFilter === 'stack' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}">
                🛠️ Stack & Cloud (3)
              </button>
              <button onclick="setLoomsFilter('website', this)" class="loom-pill px-3 py-1.5 rounded-lg ${activeLoomFilter === 'website' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}">
                🌐 Website & SEO (3)
              </button>
              <button onclick="setLoomsFilter('dashboard', this)" class="loom-pill px-3 py-1.5 rounded-lg ${activeLoomFilter === 'dashboard' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}">
                📊 Dashboard (2)
              </button>
              <button onclick="setLoomsFilter('coldemail', this)" class="loom-pill px-3 py-1.5 rounded-lg ${activeLoomFilter === 'coldemail' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}">
                ✉️ Cold Email (3)
              </button>
              <button onclick="setLoomsFilter('media', this)" class="loom-pill px-3 py-1.5 rounded-lg ${activeLoomFilter === 'media' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}">
                🎬 Shorts (1)
              </button>
              <button onclick="setLoomsFilter('fathom', this)" class="loom-pill px-3 py-1.5 rounded-lg ${activeLoomFilter === 'fathom' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-indigo-300 hover:text-white'} flex items-center gap-1.5">
                <span>📞 Fathom Strategy Calls (${fathomCalls.length})</span>
              </button>
              <button onclick="setLoomsFilter('torecord', this)" class="loom-pill px-3 py-1.5 rounded-lg ${activeLoomFilter === 'torecord' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-amber-300 hover:text-white'} flex items-center gap-1.5">
                <span>⏳ Pending (${looms.length - workdriveCount})</span>
              </button>
            </div>

            <!-- View Mode Switcher & Search Bar -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <div class="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                <button id="btn-looms-cards" onclick="setLoomsViewMode('cards')" class="p-1.5 rounded-lg ${loomsViewMode === 'cards' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}" title="Card Grid View">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                </button>
                <button id="btn-looms-table" onclick="setLoomsViewMode('table')" class="p-1.5 rounded-lg ${loomsViewMode === 'table' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}" title="Scannable Table View">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                </button>
              </div>
              <div class="w-full sm:w-56">
                <input type="text" id="looms-search" oninput="filterLoomsGrid()" placeholder="Filter video title, topic..." class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Video Cards or Table Container -->
        <div id="looms-grid-container">
          ${renderLoomsContent()}
        </div>

      </div>
    `;
  }

  function renderLoomsContent() {
    const q = (document.getElementById('looms-search')?.value || '').toLowerCase();
    const looms = DATA.looms || [];
    const fathomCalls = DATA.fathom_calls || [];

    if (activeLoomFilter === 'fathom') {
      const filteredFathom = fathomCalls.filter(f => {
        const text = `${f.title} ${f.topic} ${f.date}`.toLowerCase();
        return text.includes(q);
      });

      if (filteredFathom.length === 0) {
        return '<div class="py-12 text-center text-slate-500 text-xs">No Fathom calls matching search.</div>';
      }

      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${filteredFathom.map(f => `
            <div class="hub-card p-5 space-y-3.5 flex flex-col justify-between border-indigo-500/30">
              <div class="space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                    Fathom Strategy Call
                  </span>
                  <span class="text-xs text-slate-400 font-mono">${escapeHtml(f.date)}</span>
                </div>
                <h3 class="font-bold text-white text-base">${escapeHtml(f.title)}</h3>
                <p class="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  ${escapeHtml(f.topic)}
                </p>
              </div>

              <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a href="${f.url}" target="_blank" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-500/20">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                  <span>Listen / Watch on Fathom ↗</span>
                </a>
                <button onclick="copyToClipboard('${f.url}', 'Fathom Call URL')" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700">
                  Copy Link
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    const filteredLooms = looms.filter(v => {
      if (activeLoomFilter === 'workdrive' && !v.hasWorkdrive) return false;
      if (activeLoomFilter === 'torecord' && v.hasWorkdrive) return false;
      if (activeLoomFilter === 'stack' && (!v.hasWorkdrive || v.category !== 'Stack & Cloud')) return false;
      if (activeLoomFilter === 'website' && (!v.hasWorkdrive || v.category !== 'Website & SEO')) return false;
      if (activeLoomFilter === 'dashboard' && (!v.hasWorkdrive || v.category !== 'Command Center Dashboard')) return false;
      if (activeLoomFilter === 'coldemail' && (!v.hasWorkdrive || v.category !== 'Cold Email & Domains')) return false;
      if (activeLoomFilter === 'media' && (!v.hasWorkdrive || v.category !== 'Content & Media')) return false;

      if (q) {
        const text = `${v['Video']} ${v['System']} ${v['category']} ${v['What to show']} ${v['Status']}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });

    if (filteredLooms.length === 0) {
      return '<div class="py-12 text-center text-slate-500 text-xs">No video walkthroughs matching filter.</div>';
    }

    return loomsViewMode === 'cards' ? renderLoomsCards(filteredLooms) : renderLoomsTable(filteredLooms);
  }

  function renderLoomsCards(list) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${list.map((v, idx) => {
          const hasLinks = v.hasWorkdrive;
          const parts = v.parts && v.parts.length ? v.parts : (v.workdriveLinks || []).map((l, p) => ({ title: `Part ${p+1}`, url: l }));
          const numBadge = v.videoNumber ? `VIDEO #${String(v.videoNumber).padStart(2, '0')}` : `VIDEO #${idx + 1}`;

          return `
            <div class="hub-card p-5 space-y-4 flex flex-col justify-between ${hasLinks ? 'border-emerald-500/40 hover:border-emerald-500/80 shadow-emerald-950/20' : 'border-slate-800'}">
              
              <!-- Video Info -->
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-black px-2 py-0.5 rounded-md ${hasLinks ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'} flex items-center gap-1.5 font-mono">
                      <span class="w-1.5 h-1.5 rounded-full ${hasLinks ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
                      ${numBadge}
                    </span>
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                      ${escapeHtml(v.category || v['System'] || 'System')}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    ${v['Length'] ? `<span>⏱ ${escapeHtml(v['Length'])}</span>` : ''}
                  </div>
                </div>

                <h3 class="font-bold text-white text-base leading-snug">${escapeHtml(v['Video'] || 'Untitled Video')}</h3>

                ${v['What to show'] ? `
                  <div class="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 leading-relaxed space-y-1.5">
                    <div class="flex items-center justify-between text-[11px] font-bold text-slate-300">
                      <span>Walkthrough Breakdown:</span>
                      ${parts.length > 1 ? `<span class="text-emerald-400 font-mono text-[10px]">${parts.length} Video Parts</span>` : ''}
                    </div>
                    <p class="text-slate-400 text-xs">${escapeHtml(v['What to show'])}</p>
                  </div>
                ` : ''}
              </div>

              <!-- PROMINENT ZOHO WORKDRIVE ACTION BUTTONS & URL BOXES -->
              <div class="pt-3 border-t border-slate-800 space-y-2.5">
                ${hasLinks ? `
                  <!-- Main Watch Action Buttons -->
                  <div class="flex flex-col sm:flex-row gap-2">
                    ${parts.map((p, pIdx) => `
                      <a href="${p.url}" target="_blank" class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 group">
                        <svg class="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                        <span>${parts.length > 1 ? `Watch Part ${p.part || pIdx + 1} on WorkDrive ↗` : 'Watch on Zoho WorkDrive ↗'}</span>
                      </a>
                    `).join('')}
                  </div>

                  <!-- Direct WorkDrive Link Display & Copy Button for Each Part -->
                  <div class="space-y-1.5">
                    ${parts.map((p, pIdx) => `
                      <div class="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800/90 text-[11px] font-mono group">
                        <span class="text-slate-500 text-[10px] flex-shrink-0 px-1 font-semibold">${parts.length > 1 ? `Part ${p.part || pIdx + 1}:` : 'URL:'}</span>
                        <div class="flex-1 truncate text-emerald-400 select-all" title="${escapeHtml(p.url)}">
                          ${escapeHtml(p.url)}
                        </div>
                        <button onclick="copyToClipboard('${p.url}', 'WorkDrive URL ${parts.length > 1 ? p.part || pIdx + 1 : ''}')" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-[10px] font-semibold flex-shrink-0 transition-colors">
                          Copy URL
                        </button>
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <div class="py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-center text-xs text-amber-400/80 flex items-center justify-center gap-2">
                    <span>⏳</span>
                    <span>To be recorded during initial onboarding sprint.</span>
                  </div>
                `}
              </div>

            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderLoomsTable(list) {
    return `
      <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th class="py-3 px-4 w-14 text-center">#</th>
              <th class="py-3 px-4 min-w-[240px]">Video & Walkthrough Breakdown</th>
              <th class="py-3 px-4 w-36">Category</th>
              <th class="py-3 px-4 w-24">Length</th>
              <th class="py-3 px-4 min-w-[280px]">Zoho WorkDrive Direct Link</th>
              <th class="py-3 px-4 w-44 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            ${list.map((v, idx) => {
              const hasLinks = v.hasWorkdrive;
              const parts = v.parts && v.parts.length ? v.parts : (v.workdriveLinks || []).map((l, p) => ({ title: `Part ${p+1}`, url: l }));
              const numBadge = v.videoNumber ? `#${String(v.videoNumber).padStart(2, '0')}` : `#${idx + 1}`;

              return `
                <tr class="hover:bg-slate-800/40 transition-colors">
                  <td class="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                    ${numBadge}
                  </td>
                  <td class="py-3 px-4 space-y-1">
                    <div class="font-bold text-white text-xs sm:text-sm">${escapeHtml(v['Video'] || 'Untitled')}</div>
                    ${v['What to show'] ? `
                      <p class="text-[11px] text-slate-400 line-clamp-2 max-w-xl leading-relaxed">${escapeHtml(v['What to show'])}</p>
                    ` : ''}
                  </td>
                  <td class="py-3 px-4">
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      ${escapeHtml(v.category || v['System'] || 'General')}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    ${escapeHtml(v['Length'] || '—')}
                  </td>
                  <td class="py-3 px-4 space-y-1.5">
                    ${hasLinks ? parts.map((p, pIdx) => `
                      <div class="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 font-mono text-[10px]">
                        <span class="text-slate-500 flex-shrink-0">${parts.length > 1 ? `P${p.part || pIdx+1}:` : 'URL:'}</span>
                        <a href="${p.url}" target="_blank" class="text-emerald-400 hover:underline truncate max-w-xs" title="${p.url}">${escapeHtml(p.url)}</a>
                        <button onclick="copyToClipboard('${p.url}', 'WorkDrive Link')" class="ml-auto px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-semibold flex-shrink-0" title="Copy URL">Copy</button>
                      </div>
                    `).join('') : '<span class="text-slate-500 italic text-[11px]">Pending recording</span>'}
                  </td>
                  <td class="py-3 px-4 text-right">
                    ${hasLinks ? (parts.length === 1 ? `
                      <a href="${parts[0].url}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/20">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                        <span>Watch ↗</span>
                      </a>
                    ` : `
                      <div class="flex flex-col gap-1 items-end">
                        ${parts.map((p, pIdx) => `
                          <a href="${p.url}" target="_blank" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all">
                            <span>Watch Part ${p.part || pIdx + 1} ↗</span>
                          </a>
                        `).join('')}
                      </div>
                    `) : '<span class="text-slate-500 text-[10px]">To be recorded</span>'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  window.setLoomsFilter = function (filter, btn) {
    activeLoomFilter = filter;
    document.querySelectorAll('#looms-filter-pills .loom-pill').forEach(b => {
      b.className = 'loom-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs';
    });
    btn.className = 'loom-pill px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20';
    filterLoomsGrid();
  };

  window.setLoomsViewMode = function (mode) {
    loomsViewMode = mode;
    localStorage.setItem('myntmore_looms_view_mode', mode);
    const container = document.getElementById('looms-grid-container');
    if (container) container.innerHTML = renderLoomsContent();
    const btnCards = document.getElementById('btn-looms-cards');
    const btnTable = document.getElementById('btn-looms-table');
    if (btnCards && btnTable) {
      if (mode === 'cards') {
        btnCards.className = 'p-1.5 rounded-lg bg-slate-800 text-white shadow';
        btnTable.className = 'p-1.5 rounded-lg text-slate-400 hover:text-white';
      } else {
        btnTable.className = 'p-1.5 rounded-lg bg-slate-800 text-white shadow';
        btnCards.className = 'p-1.5 rounded-lg text-slate-400 hover:text-white';
      }
    }
  };

  window.filterLoomsGrid = function () {
    const container = document.getElementById('looms-grid-container');
    if (container) container.innerHTML = renderLoomsContent();
  };

  window.filterLoomsGrid = function () {
    const container = document.getElementById('looms-grid-container');
    if (container) container.innerHTML = renderLoomsContent();
  };

  /* -------------------------------------------------------------
     3. TAB: CREDENTIALS & API KEYS VAULT
  ------------------------------------------------------------- */
  let activeVaultFilter = 'all';

  function renderVaultTab() {
    const vaultItems = Object.values(vaultState);
    const filledCount = vaultItems.filter(item => (item.apiKey && item.apiKey.trim()) || (item.password && item.password.trim())).length;
    const missingCount = vaultItems.length - filledCount;

    return `
      <div class="tab-pane space-y-6">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-bold text-white">Credentials & API Keys Vault</h1>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">Local & Private</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              Drop in live API keys, tokens, and passwords. All values remain strictly in your browser storage.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="openBulkPasteModal()" class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span>Bulk Paste .env</span>
            </button>
            <button onclick="openCustomSecretModal()" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              <span>Add Custom Key</span>
            </button>
            <button onclick="exportVaultJSON()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors">
              Export (JSON)
            </button>
            <label class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer">
              Import
              <input type="file" accept=".json" onchange="importVaultJSON(event)" class="hidden" />
            </label>
            <button onclick="clearVaultConfirmation()" class="px-2.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs border border-red-800/40" title="Reset Vault">
              Reset
            </button>
          </div>
        </div>

        <!-- WorkDrive Video 02 Guidance Alert for Vault -->
        <div class="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/30 border border-emerald-500/40 p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0 text-base">
              🎬
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>Looking for Gemini API keys & Supabase credentials?</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">Video 02 Ready</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                Watch <strong>Video 02: "Gemini API key & Supabase projects: where they live"</strong> (3–5 min) recorded by Sanyam on Zoho WorkDrive.
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <a href="https://workdrive.zohoexternal.com/external/7c7ca0a74e9178ab4a0048e227e212c4b0a1df292eb33a643486bf2179a6aa29" target="_blank" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
              <span>Watch Video 02 on WorkDrive ↗</span>
            </a>
            <button onclick="copyToClipboard('https://workdrive.zohoexternal.com/external/7c7ca0a74e9178ab4a0048e227e212c4b0a1df292eb33a643486bf2179a6aa29', 'Video 02 WorkDrive Link')" class="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700">
              Copy URL
            </button>
          </div>
        </div>

        <!-- Quick Filter Pills: All vs Missing vs Configured -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80">
          <div class="flex flex-wrap items-center gap-2 text-xs" id="vault-filter-pills">
            <button onclick="setVaultFilter('all', this)" class="vault-pill px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold">
              All Systems (${vaultItems.length})
            </button>
            <button onclick="setVaultFilter('missing', this)" class="vault-pill px-3 py-1.5 rounded-lg bg-slate-800 text-amber-300 hover:text-white flex items-center gap-1.5">
              <span>⚠️ Needs Key / Password</span>
              <span class="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] font-mono">${missingCount}</span>
            </button>
            <button onclick="setVaultFilter('configured', this)" class="vault-pill px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-300 hover:text-white flex items-center gap-1.5">
              <span>✅ Configured</span>
              <span class="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[10px] font-mono">${filledCount}</span>
            </button>
          </div>

          <div class="w-full sm:w-64">
            <input type="text" id="vault-filter-search" oninput="filterVaultCards()" placeholder="Filter system, login, note..." class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="vault-cards-container">
          ${renderVaultCards(getFilteredVaultItems())}
        </div>

      </div>
    `;
  }

  function getFilteredVaultItems() {
    const q = (document.getElementById('vault-filter-search')?.value || '').toLowerCase();
    return Object.values(vaultState).filter(item => {
      const hasKey = item.apiKey && item.apiKey.trim().length > 0;
      const hasPwd = item.password && item.password.trim().length > 0;
      const isConfigured = hasKey || hasPwd;

      if (activeVaultFilter === 'missing' && isConfigured) return false;
      if (activeVaultFilter === 'configured' && !isConfigured) return false;

      if (q) {
        const text = `${item.name} ${item.login} ${item.category} ${item.notes} ${item.location} ${item.usedFor}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }

  function renderVaultCards(items) {
    if (!items || items.length === 0) {
      return '<div class="col-span-2 py-12 text-center text-slate-500 text-xs">No systems found matching the selected filter.</div>';
    }

    return items.map(item => {
      const hasKey = item.apiKey && item.apiKey.trim().length > 0;
      const hasPwd = item.password && item.password.trim().length > 0;
      const isSaved = hasKey || hasPwd;

      return `
        <div class="hub-card p-5 space-y-4 relative group" data-vault-id="${item.id}">
          
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-white text-sm sm:text-base">${escapeHtml(item.name)}</h3>
                ${item.isCustom ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono">CUSTOM</span>' : ''}
              </div>
              <div class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span class="text-indigo-400 font-medium">${escapeHtml(item.category || 'System')}</span>
                ${item.billing ? `<span>·</span> <span class="text-slate-400 font-mono text-[10px]">${escapeHtml(item.billing)}</span>` : ''}
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${isSaved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}">
                ${isSaved ? '● Configured' : '⚠️ Missing Value'}
              </span>
              ${item.isCustom ? `
                <button onclick="deleteCustomSecret('${item.id}')" class="text-slate-500 hover:text-red-400 p-1" title="Delete custom key">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              ` : ''}
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Account / Login Handle</label>
            <div class="flex items-center gap-2">
              <input type="text" value="${escapeHtml(item.login || '')}" onchange="updateVaultField('${item.id}', 'login', this.value)" placeholder="e.g. aitoolsteejay@gmail.com" class="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono" />
              <button onclick="copyToClipboard(vaultState['${item.id}'].login, 'Login')" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors" title="Copy Login">
                Copy
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>API Key / Secret Token</span>
              <span class="text-[10px] text-slate-500 lowercase">auto-saves</span>
            </label>
            <div class="flex items-center gap-1.5">
              <div class="relative flex-1">
                <input type="password" id="key_input_${item.id}" value="${escapeHtml(item.apiKey || '')}" oninput="updateVaultField('${item.id}', 'apiKey', this.value)" placeholder="Paste API key here..." class="secret-input w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 pr-8 text-xs text-emerald-400 font-mono focus:outline-none focus:border-indigo-500" />
                <button type="button" onclick="togglePasswordVisibility('key_input_${item.id}')" class="absolute right-2 top-2 text-slate-500 hover:text-slate-300">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
              </div>
              <button onclick="copyToClipboard(vaultState['${item.id}'].apiKey, 'API Key')" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors" title="Copy Key">
                Copy
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Password / 2FA Note</span>
              <span class="text-[10px] text-slate-500 lowercase">auto-saves</span>
            </label>
            <div class="flex items-center gap-1.5">
              <div class="relative flex-1">
                <input type="password" id="pwd_input_${item.id}" value="${escapeHtml(item.password || '')}" oninput="updateVaultField('${item.id}', 'password', this.value)" placeholder="Paste password here..." class="secret-input w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 pr-8 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500" />
                <button type="button" onclick="togglePasswordVisibility('pwd_input_${item.id}')" class="absolute right-2 top-2 text-slate-500 hover:text-slate-300">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
              </div>
              <button onclick="copyToClipboard(vaultState['${item.id}'].password, 'Password')" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors" title="Copy Password">
                Copy
              </button>
            </div>
          </div>

          ${item.notes || item.location ? `
            <div class="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              ${item.location ? `<div><strong class="text-slate-300">Location:</strong> ${escapeHtml(item.location)}</div>` : ''}
              ${item.notes ? `<div><strong class="text-slate-300">Notes:</strong> ${escapeHtml(item.notes)}</div>` : ''}
              ${item.usedFor ? `<div><strong class="text-slate-300">Used For:</strong> ${escapeHtml(item.usedFor)}</div>` : ''}
            </div>
          ` : ''}

        </div>
      `;
    }).join('');
  }

  window.setVaultFilter = function (filter, btn) {
    activeVaultFilter = filter;
    document.querySelectorAll('.vault-pill').forEach(b => {
      b.className = 'vault-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs';
    });
    btn.className = 'vault-pill px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs';
    filterVaultCards();
  };

  window.filterVaultCards = function () {
    const container = document.getElementById('vault-cards-container');
    if (container) {
      container.innerHTML = renderVaultCards(getFilteredVaultItems());
    }
  };

  window.togglePasswordVisibility = function (inputId) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.type = el.type === 'password' ? 'text' : 'password';
  };

  window.updateVaultField = function (id, field, val) {
    if (!vaultState[id]) return;
    vaultState[id][field] = val;
    saveVaultState();
  };

  // Bulk .env Parser Modal
  window.openBulkPasteModal = function () {
    const modal = document.getElementById('bulk-paste-modal');
    if (modal) modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('bulk-paste-input')?.focus();
  };

  window.closeBulkPasteModal = function () {
    const modal = document.getElementById('bulk-paste-modal');
    if (modal) modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  window.handleProcessBulkPaste = function () {
    const text = document.getElementById('bulk-paste-input')?.value || '';
    if (!text.trim()) {
      showToast('No environment variables provided');
      return;
    }

    let parsed = 0;
    const lines = text.split('\n');

    lines.forEach(line => {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }

        if (key.includes('GEMINI')) {
          const sys = Object.values(vaultState).find(s => s.name.toLowerCase().includes('gemini') || s.name.toLowerCase().includes('ai studio'));
          if (sys) { sys.apiKey = val; parsed++; }
        } else if (key.includes('SUPABASE')) {
          const sys = Object.values(vaultState).find(s => s.name.toLowerCase().includes('supabase'));
          if (sys) { sys.apiKey = val; parsed++; }
        } else if (key.includes('WAALAXY')) {
          const sys = Object.values(vaultState).find(s => s.name.toLowerCase().includes('waalaxy') || s.name.toLowerCase().includes('outreach'));
          if (sys) { sys.apiKey = val; parsed++; }
        } else {
          const id = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
          vaultState[id] = {
            id: id,
            name: key,
            category: 'Environment Variable',
            login: '',
            apiKey: val,
            password: '',
            notes: 'Imported via Bulk .env paste',
            isCustom: true
          };
          parsed++;
        }
      }
    });

    saveVaultState();
    closeBulkPasteModal();
    showToast(`Processed ${parsed} environment variables!`);
    if (currentTab === 'vault') {
      const container = document.getElementById('main-content');
      if (container) container.innerHTML = renderVaultTab();
    }
  };

  window.openCustomSecretModal = function () {
    const modal = document.getElementById('custom-secret-modal');
    if (modal) modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('cs-name')?.focus();
  };

  window.closeCustomSecretModal = function () {
    const modal = document.getElementById('custom-secret-modal');
    if (modal) modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('custom-secret-form')?.reset();
  };

  window.handleSaveCustomSecret = function (e) {
    e.preventDefault();
    const name = document.getElementById('cs-name')?.value.trim();
    const category = document.getElementById('cs-category')?.value.trim() || 'Custom';
    const login = document.getElementById('cs-login')?.value.trim();
    const secret = document.getElementById('cs-secret')?.value.trim();
    const notes = document.getElementById('cs-notes')?.value.trim();

    if (!name || !secret) {
      showToast('Please provide a name and secret value');
      return;
    }

    const id = 'custom_' + Date.now();
    vaultState[id] = {
      id: id,
      name: name,
      category: category,
      login: login,
      apiKey: secret,
      password: '',
      notes: notes,
      isCustom: true
    };

    saveVaultState();
    closeCustomSecretModal();
    showToast(`Saved ${name} to Vault!`);
    
    if (currentTab === 'vault') {
      const container = document.getElementById('main-content');
      if (container) container.innerHTML = renderVaultTab();
    }
  };

  window.deleteCustomSecret = function (id) {
    if (!confirm('Are you sure you want to remove this secret from your vault?')) return;
    delete vaultState[id];
    saveVaultState();
    showToast('Secret deleted');
    if (currentTab === 'vault') {
      const container = document.getElementById('main-content');
      if (container) container.innerHTML = renderVaultTab();
    }
  };

  window.exportVaultJSON = function () {
    const str = JSON.stringify(vaultState, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `myntmore-credentials-vault-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Vault exported to JSON');
  };

  window.importVaultJSON = function (e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const imported = JSON.parse(ev.target.result);
        if (typeof imported === 'object' && imported !== null) {
          vaultState = Object.assign({}, vaultState, imported);
          saveVaultState();
          showToast('Vault successfully imported!');
          if (currentTab === 'vault') {
            const container = document.getElementById('main-content');
            if (container) container.innerHTML = renderVaultTab();
          }
        } else {
          showToast('Invalid JSON file');
        }
      } catch (err) {
        showToast('Error parsing JSON file');
      }
    };
    reader.readAsText(file);
  };

  window.clearVaultConfirmation = function () {
    if (confirm('Warning: This will clear all stored API keys & passwords from your browser. Are you sure?')) {
      localStorage.removeItem(STORAGE_KEYS.VAULT);
      initState();
      showToast('Vault reset');
      if (currentTab === 'vault') {
        const container = document.getElementById('main-content');
        if (container) container.innerHTML = renderVaultTab();
      }
    }
  };

  /* -------------------------------------------------------------
     4. TAB: APPS & REPOS TRACKER
  ------------------------------------------------------------- */
  let activeAppFilter = 'all';

  function renderAppsTab() {
    const apps = DATA.apps || [];

    return `
      <div class="tab-pane space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Apps & Code Repositories
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">${apps.length}</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
              All applications, codebases, and Vercel hosting projects under the <code class="text-cyan-400 font-mono">aitoolsteejay</code> GitHub organization.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button onclick="setAppsViewMode('grid')" class="p-1.5 rounded-lg ${appsViewMode === 'grid' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}" title="Grid Cards View">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              </button>
              <button onclick="setAppsViewMode('table')" class="p-1.5 rounded-lg ${appsViewMode === 'table' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}" title="Compact Table View">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              </button>
            </div>
            <div class="w-48 sm:w-60">
              <input type="text" id="apps-search" oninput="filterAppsGrid()" placeholder="Filter app or repo..." class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-xs" id="apps-filter-pills">
          <button onclick="setAppTypeFilter('all', this)" class="app-type-pill px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold">All Projects (${apps.length})</button>
          <button onclick="setAppTypeFilter('Internal', this)" class="app-type-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Internal Tools (17)</button>
          <button onclick="setAppTypeFilter('Client', this)" class="app-type-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Client Tools (8)</button>
          <button onclick="setAppTypeFilter('Live - in use', this)" class="app-type-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Live In-Use</button>
        </div>

        <div id="apps-view-container">
          ${appsViewMode === 'grid' ? renderAppsCards(getFilteredApps()) : renderAppsTable(getFilteredApps())}
        </div>

      </div>
    `;
  }

  window.setAppsViewMode = function (mode) {
    appsViewMode = mode;
    localStorage.setItem(STORAGE_KEYS.APPS_VIEW_MODE, mode);
    const container = document.getElementById('apps-view-container');
    if (container) {
      container.innerHTML = mode === 'grid' ? renderAppsCards(getFilteredApps()) : renderAppsTable(getFilteredApps());
    }
  };

  function getFilteredApps() {
    const q = (document.getElementById('apps-search')?.value || '').toLowerCase();
    const apps = DATA.apps || [];
    
    return apps.filter(app => {
      if (activeAppFilter === 'Internal' && app['Type'] !== 'Internal') return false;
      if (activeAppFilter === 'Client' && app['Type'] !== 'Client') return false;
      if (activeAppFilter === 'Live - in use' && !app['Status']?.includes('in use')) return false;

      if (q) {
        const text = `${app['Project']} ${app['System']} ${app['Framework']} ${app['What it is']} ${app['GitHub repo']} ${app['Keys used (names only)']}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }

  function renderAppsCards(list) {
    if (!list || list.length === 0) {
      return '<div class="col-span-2 py-12 text-center text-slate-500 text-xs">No applications match your filter.</div>';
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${list.map(app => {
          const status = app['Status'] || '';
          let statusColor = 'bg-slate-800 text-slate-400';
          if (status.includes('in use')) statusColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
          else if (status.includes('progress')) statusColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
          else if (status.includes('Stuck') || status.includes('Failed')) statusColor = 'bg-red-500/20 text-red-300 border border-red-500/30';

          const repo = app['GitHub repo'] || '';
          const liveUrl = app['Live URL'] || '';
          const flag = app['Flag'] || '';
          const assocVids = app.associatedVideos || [];

          return `
            <div class="hub-card p-5 space-y-3.5 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="font-bold text-white text-base">${escapeHtml(app['Project'] || 'Untitled')}</h3>
                    <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span class="text-indigo-400 font-medium">${escapeHtml(app['System'] || '')}</span>
                      <span>·</span>
                      <span class="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">${escapeHtml(app['Framework'] || 'App')}</span>
                      ${app['Type'] ? `<span>·</span> <span class="text-slate-400">${escapeHtml(app['Type'])}</span>` : ''}
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 flex-wrap justify-end">
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor}">
                      ${escapeHtml(status || 'Planned')}
                    </span>
                  </div>
                </div>

                <p class="text-xs text-slate-300 leading-relaxed">
                  ${escapeHtml(app['What it is'] || '')}
                </p>

                ${flag ? `
                  <div class="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-300/90 leading-relaxed space-y-0.5">
                    <span class="font-bold text-amber-400 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      Tech Debt / Gotchas:
                    </span>
                    <div>${escapeHtml(flag)}</div>
                  </div>
                ` : ''}

                ${app['Keys used (names only)'] ? `
                  <div class="text-[11px] text-slate-400">
                    <strong class="text-slate-300">Keys:</strong>
                    <code class="text-cyan-400 font-mono text-[10px] ml-1">${escapeHtml(app['Keys used (names only)'])}</code>
                  </div>
                ` : ''}

                ${assocVids.length > 0 ? `
                  <div class="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <div class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎬</span>
                      <span>Zoho WorkDrive Walkthrough (${assocVids.length})</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      ${assocVids.map(av => `
                        <a href="${av.url}" target="_blank" class="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm group">
                          <svg class="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                          <span class="truncate max-w-[200px]">Video ${av.num}: ${escapeHtml(av.title.replace(/^\d+\s*·\s*/, ''))}</span>
                          <span class="text-[9px] text-emerald-400 font-mono">↗</span>
                        </a>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  ${repo ? `
                    <button onclick="copyToClipboard('git clone https://github.com/${repo}.git', 'Clone command')" class="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors" title="Copy git clone">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>
                      <span>${repo.split('/')[1] || repo}</span>
                    </button>
                    <a href="https://github.com/${repo}" target="_blank" class="text-slate-400 hover:text-white" title="Open GitHub Repo">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  ` : '<span class="text-slate-500 text-[11px]">No repo</span>'}
                </div>

                ${liveUrl ? `
                  <a href="${liveUrl}" target="_blank" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 text-[11px]">
                    <span>Open Live</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderAppsTable(list) {
    if (!list || list.length === 0) {
      return '<div class="py-12 text-center text-slate-500 text-xs">No applications match your filter.</div>';
    }

    return `
      <div class="hub-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
              <tr>
                <th class="py-3 px-4">Project</th>
                <th class="py-3 px-3">Framework</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3">Walkthrough Video</th>
                <th class="py-3 px-3">GitHub Repo</th>
                <th class="py-3 px-3">Keys Required</th>
                <th class="py-3 px-4">Live URL</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              ${list.map(app => {
                const repo = app['GitHub repo'] || '';
                const liveUrl = app['Live URL'] || '';
                const assocVids = app.associatedVideos || [];
                return `
                  <tr class="hover:bg-slate-900/40 transition-colors">
                    <td class="py-3 px-4 font-bold text-white">
                      <div>${escapeHtml(app['Project'])}</div>
                      <div class="text-[10px] text-slate-400 font-normal font-sans">${escapeHtml(app['System'])}</div>
                    </td>
                    <td class="py-3 px-3 font-mono text-[11px] text-slate-300">${escapeHtml(app['Framework'] || '—')}</td>
                    <td class="py-3 px-3">
                      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${app['Status']?.includes('in use') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}">
                        ${escapeHtml(app['Status'] || '—')}
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      ${assocVids.length > 0 ? `
                        <div class="flex flex-col gap-1">
                          ${assocVids.map(av => `
                            <a href="${av.url}" target="_blank" class="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold truncate max-w-[150px]" title="${escapeHtml(av.title)}">
                              <span>🎬 V#${av.num} ↗</span>
                            </a>
                          `).join('')}
                        </div>
                      ` : '<span class="text-slate-600">—</span>'}
                    </td>
                    <td class="py-3 px-3 font-mono text-[11px] text-indigo-400">
                      ${repo ? `<a href="https://github.com/${repo}" target="_blank" class="hover:underline">${repo.split('/')[1] || repo}</a>` : '—'}
                    </td>
                    <td class="py-3 px-3 font-mono text-[10px] text-slate-400 max-w-xs truncate">${escapeHtml(app['Keys used (names only)'] || 'None')}</td>
                    <td class="py-3 px-4">
                      ${liveUrl ? `<a href="${liveUrl}" target="_blank" class="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"><span>Open</span> →</a>` : '—'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  window.setAppTypeFilter = function (filter, btn) {
    activeAppFilter = filter;
    document.querySelectorAll('.app-type-pill').forEach(b => {
      b.className = 'app-type-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs';
    });
    btn.className = 'app-type-pill px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs';
    filterAppsGrid();
  };

  window.filterAppsGrid = function () {
    const container = document.getElementById('apps-view-container');
    if (container) {
      container.innerHTML = appsViewMode === 'grid' ? renderAppsCards(getFilteredApps()) : renderAppsTable(getFilteredApps());
    }
  };

  /* -------------------------------------------------------------
     5. TAB: DOMAINS & INBOXES
  ------------------------------------------------------------- */
  function renderDomainsTab() {
    const domains = DATA.domains || [];

    return `
      <div class="tab-pane space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Domains & Cold Email Infrastructure
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">${domains.length}</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
              GoDaddy registrar inventory, Smartlead email inboxes, 301 Vercel redirects, and renewal schedules.
            </p>
          </div>

          <div class="w-full sm:w-64">
            <input type="text" id="domains-search" oninput="filterDomainsTable()" placeholder="Search domain, registrar, status..." class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div class="hub-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs" id="domains-table">
              <thead class="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                <tr>
                  <th class="py-3 px-4">Domain</th>
                  <th class="py-3 px-3">Use / Purpose</th>
                  <th class="py-3 px-3">Registrar & Renewal</th>
                  <th class="py-3 px-3">Smartlead Inboxes</th>
                  <th class="py-3 px-3">Vercel Status</th>
                  <th class="py-3 px-4">Setup & DNS Steps</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60" id="domains-table-body">
                ${renderDomainsRows(domains)}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  function renderDomainsRows(list) {
    if (!list || list.length === 0) {
      return '<tr><td colspan="6" class="py-8 text-center text-slate-500 text-xs">No domains found.</td></tr>';
    }

    return list.map(d => {
      const isMain = d['Domain']?.includes('myntmore.com') && !d['Domain']?.includes('media') && !d['Domain']?.includes('team');
      return `
        <tr class="hover:bg-slate-900/40 transition-colors">
          <td class="py-3 px-4">
            <a href="${d['Domain']}" target="_blank" class="font-bold text-white hover:text-cyan-400 flex items-center gap-1">
              <span>${d['Domain'].replace('http://', '').replace('https://', '')}</span>
              <svg class="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
            ${isMain ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase mt-0.5 inline-block">Primary Brand Domain</span>' : ''}
          </td>
          <td class="py-3 px-3 text-slate-300">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${isMain ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-300'}">
              ${escapeHtml(d['Use'] || 'Cold email')}
            </span>
            ${d['Notes'] ? `<div class="text-[10px] text-slate-500 mt-1 max-w-xs">${escapeHtml(d['Notes'])}</div>` : ''}
          </td>
          <td class="py-3 px-3 text-slate-300 font-mono text-[11px]">
            <div>${escapeHtml(d['Registrar'] || 'GoDaddy')}</div>
            <div class="text-[10px] text-amber-400 font-sans">${escapeHtml(d['Renewal date'] || '')}</div>
          </td>
          <td class="py-3 px-3">
            <div class="font-mono text-slate-200 text-xs">${escapeHtml(d['Inboxes'] ? `${d['Inboxes']} inboxes` : '—')}</div>
            <div class="text-[10px] text-slate-500">${escapeHtml(d['Inbox provider'] || '')}</div>
          </td>
          <td class="py-3 px-3">
            <span class="text-[10px] font-medium px-2 py-0.5 rounded ${d['Vercel status'] === 'Verified' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}">
              ${escapeHtml(d['Vercel status'] || 'Pending')}
            </span>
          </td>
          <td class="py-3 px-4 text-[11px] text-slate-300">
            <div class="max-w-xs leading-relaxed text-slate-400">
              ${escapeHtml(d['Setup steps done'] || 'DMARC, 301 redirect')}
            </div>
            ${d['Next step'] ? `<div class="text-[10px] text-cyan-400 mt-0.5">${escapeHtml(d['Next step'])}</div>` : ''}
          </td>
        </tr>
      `;
    }).join('');
  }

  window.filterDomainsTable = function () {
    const q = (document.getElementById('domains-search')?.value || '').toLowerCase();
    const domains = DATA.domains || [];
    const filtered = domains.filter(d => {
      const text = `${d['Domain']} ${d['Registrar']} ${d['Use']} ${d['Setup steps done']} ${d['Notes']}`.toLowerCase();
      return text.includes(q);
    });
    const body = document.getElementById('domains-table-body');
    if (body) body.innerHTML = renderDomainsRows(filtered);
  };

  /* -------------------------------------------------------------
     6. TAB: RECURRING RHYTHM & SOPS
  ------------------------------------------------------------- */
  let activeCadenceFilter = 'all';

  function renderTasksTab() {
    const tasks = DATA.recurring_tasks || [];

    return `
      <div class="tab-pane space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Operating Rhythm & Recurring Tasks
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">${tasks.length}</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
              Standard operating procedures for Mondays, weekly SEO reports, blogs, Shorts, and monthly infra checks.
            </p>
          </div>

          <div class="w-full sm:w-64">
            <input type="text" id="tasks-search" oninput="filterTasksList()" placeholder="Filter task name, tools, cadence..." class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500" />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-xs">
          <button onclick="filterTaskCadence('all', this)" class="task-cadence-pill px-3 py-1.5 rounded-lg bg-violet-600 text-white font-semibold">All Cadences (${tasks.length})</button>
          <button onclick="filterTaskCadence('Weekly', this)" class="task-cadence-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Weekly / Monday</button>
          <button onclick="filterTaskCadence('Monthly', this)" class="task-cadence-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Monthly</button>
          <button onclick="filterTaskCadence('Ongoing', this)" class="task-cadence-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Ongoing / On-Demand</button>
        </div>

        <div class="space-y-3" id="tasks-list-container">
          ${renderTasksCards(tasks)}
        </div>

      </div>
    `;
  }

  function renderTasksCards(list) {
    if (!list || list.length === 0) {
      return '<div class="py-12 text-center text-slate-500 text-xs">No recurring tasks match query.</div>';
    }

    return list.map((t, idx) => {
      const freq = t['Frequency'] || '';
      let badgeClass = 'bg-slate-800 text-slate-300';
      if (freq.includes('Weekly')) badgeClass = 'bg-violet-500/20 text-violet-300 border border-violet-500/30';
      else if (freq.includes('Monthly')) badgeClass = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
      else if (freq.includes('Ongoing')) badgeClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';

      return `
        <div class="hub-card p-4 space-y-2.5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold">
                ${idx + 1}
              </span>
              <h3 class="font-bold text-white text-sm sm:text-base">${escapeHtml(t['Task'] || 'Untitled Task')}</h3>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}">
                ${escapeHtml(freq || 'Ongoing')}
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-medium">
                ${escapeHtml(t['Area'] || 'General')}
              </span>
            </div>
          </div>

          <div class="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <strong class="text-slate-200 block mb-1">Standard Operating Procedure:</strong>
            ${escapeHtml(t['When / how'] || 'Execute per system documentation.')}
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
            <div class="flex items-center gap-3">
              ${t['Tools'] ? `<span><strong class="text-slate-300">Tools:</strong> ${escapeHtml(t['Tools'])}</span>` : ''}
              ${t['System'] ? `<span><strong class="text-slate-300">System:</strong> ${escapeHtml(t['System'])}</span>` : ''}
            </div>
            ${t.associatedVideo ? `
              <div class="flex items-center gap-2">
                <a href="${t.associatedVideo.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                  <span>Watch Video ${t.associatedVideo.num} on WorkDrive ↗</span>
                </a>
                <button onclick="copyToClipboard('${t.associatedVideo.url}', 'WorkDrive Video Link')" class="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 transition-colors">
                  Copy
                </button>
              </div>
            ` : (t['Loom recorded'] === 'Yes' ? `
              <a href="#looms" onclick="switchTab('looms')" class="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs">
                🎬 WorkDrive Walkthrough Available
              </a>
            ` : '')}
          </div>
        </div>
      `;
    }).join('');
  }

  window.filterTaskCadence = function (cadence, btn) {
    activeCadenceFilter = cadence;
    document.querySelectorAll('.task-cadence-pill').forEach(b => {
      b.className = 'task-cadence-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs';
    });
    btn.className = 'task-cadence-pill px-3 py-1.5 rounded-lg bg-violet-600 text-white font-semibold text-xs';
    filterTasksList();
  };

  window.filterTasksList = function () {
    const q = (document.getElementById('tasks-search')?.value || '').toLowerCase();
    const tasks = DATA.recurring_tasks || [];
    const filtered = tasks.filter(t => {
      if (activeCadenceFilter !== 'all' && !t['Frequency']?.includes(activeCadenceFilter)) return false;
      const text = `${t['Task']} ${t['When / how']} ${t['Area']} ${t['Tools']}`.toLowerCase();
      return text.includes(q);
    });
    const container = document.getElementById('tasks-list-container');
    if (container) container.innerHTML = renderTasksCards(filtered);
  };

  /* -------------------------------------------------------------
     7. TAB: AI LEAD MAGNETS & TOOLS
  ------------------------------------------------------------- */
  function renderLeadMagnetsTab() {
    const tools = DATA.lovable_tools || [];

    return `
      <div class="tab-pane space-y-6">
        
        <div class="border-b border-slate-800 pb-4">
          <h1 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            AI Lead Magnets & Website Tools
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono">10 Tools</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            Free high-conversion AI tools embedded on <a href="https://www.myntmore.com/tools" target="_blank" class="text-pink-400 underline">myntmore.com/tools</a>, built on Lovable & Next.js with Gemini 2.5 Flash.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${tools.map(tool => {
            const name = tool['\ufeffName'] || tool['Name'] || 'Untitled Tool';
            const link = tool['Link'] || '';
            const use = tool['Use of the tool'] || '';
            const strategy = tool['Marketing Strategy'] || '';

            return `
              <div class="hub-card p-5 space-y-4 flex flex-col justify-between">
                <div class="space-y-3">
                  <div class="flex items-start justify-between gap-2">
                    <h3 class="font-bold text-white text-base">${escapeHtml(name)}</h3>
                    ${link ? `
                      <a href="${link}" target="_blank" class="text-xs px-2.5 py-1 bg-pink-600/20 text-pink-300 hover:bg-pink-600/30 rounded-lg border border-pink-500/30 flex items-center gap-1">
                        <span>Open Tool</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    ` : ''}
                  </div>

                  <p class="text-xs text-slate-300 leading-relaxed">
                    ${escapeHtml(use)}
                  </p>

                  ${strategy ? `
                    <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                      <span class="font-bold text-cyan-400 block">LinkedIn Outbound / Marketing Playbook:</span>
                      <pre class="whitespace-pre-wrap font-sans text-slate-300 text-[11px] leading-relaxed">${escapeHtml(strategy)}</pre>
                    </div>
                  ` : ''}
                </div>

                <div class="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                  Lead Gate: Zoho Forms + Supabase leads table
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  }

  /* -------------------------------------------------------------
     8. TAB: CLIENT DELIVERABLES
  ------------------------------------------------------------- */
  function renderClientsTab() {
    const clients = DATA.client_projects || [];

    return `
      <div class="tab-pane space-y-6">
        
        <div class="border-b border-slate-800 pb-4">
          <h1 class="text-xl sm:text-2xl font-bold text-white">Client Projects & Active Retainers</h1>
          <p class="text-xs text-slate-400 mt-1">
            Custom client deliverables, landing page builds, lead magnet calculators, and SEO maintenance scopes.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${clients.map(c => `
            <div class="hub-card p-5 space-y-3">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-bold text-white text-base">${escapeHtml(c.name)}</h3>
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  ${escapeHtml(c.status)}
                </span>
              </div>

              <div class="text-xs text-slate-300 space-y-2">
                <div>
                  <strong class="text-slate-200">Scope of Work:</strong>
                  <p class="text-slate-400 mt-0.5 leading-relaxed">${escapeHtml(c.scope)}</p>
                </div>
                <div>
                  <strong class="text-slate-200">Deliverables:</strong>
                  <p class="text-slate-400 mt-0.5 leading-relaxed">${escapeHtml(c.deliverables)}</p>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                ${c.repo ? `<span class="text-slate-400 font-mono text-[11px]">Repo: ${escapeHtml(c.repo)}</span>` : '<span></span>'}
                ${c.url ? `
                  <a href="${c.url}" target="_blank" class="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium">
                    <span>View Live</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  /* -------------------------------------------------------------
     9. TAB: GROWTH & SEO ENGINE
  ------------------------------------------------------------- */
  function renderGrowthTab() {
    return `
      <div class="tab-pane space-y-6">
        
        <div class="border-b border-slate-800 pb-4">
          <h1 class="text-xl sm:text-2xl font-bold text-white">SEO, AEO & GEO Growth Engine</h1>
          <p class="text-xs text-slate-400 mt-1">
            Weekly 13-task audit checklist, AI Search visibility tracking (ChatGPT, Perplexity, Claude, Grok), and content pipelines.
          </p>
        </div>

        <div class="hub-card p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              Every Monday: 13-Task Website & SEO Health Audit
            </h2>
            <button onclick="openDocModal('seo_checklist')" class="text-xs text-orange-400 hover:text-orange-300">View Full 59-Task Matrix →</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="font-bold text-orange-400">1. Site Health Sweep</span>
              <p class="text-slate-400 text-[11px]">Run <code class="text-cyan-300 font-mono text-[10px]">python3 scripts/seo-crawl.py</code> in Claude Code. Ensure 135/135 URLs return HTTP 200.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="font-bold text-orange-400">2. Schema Coverage</span>
              <p class="text-slate-400 text-[11px]">Verify JSON-LD structured data on all pages (target 90%+ coverage).</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="font-bold text-orange-400">3. Search Console Indexing</span>
              <p class="text-slate-400 text-[11px]">Check <code class="text-slate-200">sc-domain:myntmore.com</code>. Ensure 90%+ pages remain valid and indexed.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="font-bold text-orange-400">4. Canonical Tag Validation</span>
              <p class="text-slate-400 text-[11px]">Verify zero "Duplicate without user-selected canonical" alerts in GSC.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="font-bold text-orange-400">5. Redirect Hops</span>
              <p class="text-slate-400 text-[11px]">Verify single 301 hop from bare domain to <code class="text-cyan-300 font-mono text-[10px]">https://www.myntmore.com</code>.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="font-bold text-orange-400">6. Orphan Page Sweep</span>
              <p class="text-slate-400 text-[11px]">Ensure all published pages are interlinked and discoverable via sitemap.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="font-bold text-orange-400">7. Core Web Vitals</span>
              <p class="text-slate-400 text-[11px]">Run PageSpeed Insights checks on desktop and mobile (LCP < 2.5s, CLS < 0.1).</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="font-bold text-orange-400">8. City Page Positions</span>
              <p class="text-slate-400 text-[11px]">Track rankings across 8 major Indian cities (Ahmedabad, Chennai, Mumbai, Delhi, etc.).</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="font-bold text-orange-400">9. Lead Form Integrity</span>
              <p class="text-slate-400 text-[11px]">Submit test lead. Confirm Zoho CRM record and Slack #website-leads notification.</p>
            </div>
          </div>
        </div>

        <div class="hub-card p-6 space-y-4">
          <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            AI Search Visibility (AEO & GEO Monitoring)
          </h2>
          <p class="text-xs text-slate-400">
            Monthly queries submitted to ChatGPT, Claude, Perplexity, Gemini, and Grok to audit agency citations:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
              <span class="text-indigo-400 font-bold block">Query 1 (Outbound / Lead Gen):</span>
              "Who are the best B2B lead generation and LinkedIn outbound agencies in India?"
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
              <span class="text-indigo-400 font-bold block">Query 2 (Founder Branding):</span>
              "Top agencies for CXO and founder personal branding on LinkedIn in Mumbai / India?"
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
              <span class="text-indigo-400 font-bold block">Query 3 (AI Sales Systems):</span>
              "Agencies that build automated outbound pipelines using AI agents and cold email?"
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
              <span class="text-indigo-400 font-bold block">Query 4 (Agency Leader):</span>
              "What is Tejas Jhaveri known for in B2B growth and outbound lead generation?"
            </div>
          </div>
        </div>

      </div>
    `;
  }

  /* -------------------------------------------------------------
     10. TAB: SYSTEM BIBLES & DOCS
  ------------------------------------------------------------- */
  function renderDocsTab() {
    const docs = DATA.docs || {};
    const keys = Object.keys(docs);

    return `
      <div class="tab-pane space-y-6">
        
        <div class="border-b border-slate-800 pb-4">
          <h1 class="text-xl sm:text-2xl font-bold text-white">System Bibles & Documentation Library</h1>
          <p class="text-xs text-slate-400 mt-1">
            Read comprehensive technical architecture manuals, schema specifications, runbooks, and hiring guides with interactive section jumping.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${keys.map(k => {
            const d = docs[k];
            return `
              <div onclick="openDocModal('${k}')" class="hub-card p-5 cursor-pointer space-y-2.5 hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
                <div class="space-y-1.5">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                    ${escapeHtml(d.category || 'Documentation')}
                  </span>
                  <h3 class="font-bold text-white text-sm sm:text-base group-hover:text-indigo-300 transition-colors">${escapeHtml(d.title)}</h3>
                  <p class="text-xs text-slate-400 font-mono text-[11px] truncate">
                    ${escapeHtml(d.path.split('/').pop())}
                  </p>
                </div>
                <div class="pt-2 border-t border-slate-800 text-xs text-indigo-400 font-medium flex items-center gap-1">
                  <span>Read Full Guide</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  }

  window.openDocModal = function (docKey) {
    activeDocKey = docKey;
    const doc = DATA.docs?.[docKey];
    if (!doc) return;

    document.getElementById('doc-modal-title').innerText = doc.title;
    document.getElementById('doc-modal-cat').innerText = (doc.category || 'MANUAL').toUpperCase();
    document.getElementById('doc-modal-path').innerText = doc.path;

    const { html, headings } = parseMarkdownWithTOC(doc.content);

    // Companion WorkDrive Walkthroughs for this document
    const docVideoMappings = {
      website_bible: [4, 6, 7],
      dashboard_bible: [8, 9],
      workshop_bible: [2],
      responsibilities: [1, 7, 8, 14, 15, 16, 17, 20],
      incident_sops: [1, 10, 11],
      handover_overview: [1, 2, 4, 6, 7, 8, 9, 14, 15, 16, 17, 20]
    };
    const targetNums = docVideoMappings[docKey] || [];
    const companionVids = (DATA.looms || []).filter(l => targetNums.includes(l.videoNumber) && l.hasWorkdrive);

    let companionBannerHtml = '';
    if (companionVids.length > 0) {
      companionBannerHtml = `
        <div class="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/40 border border-emerald-500/40 space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <span>🎬</span> Companion Zoho WorkDrive Walkthroughs
            </div>
            <span class="text-[10px] text-slate-400 font-mono">${companionVids.length} Videos Available</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${companionVids.map(mv => `
              <a href="${mv.primaryWorkdriveLink}" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                <span>${escapeHtml(mv.Video)} ↗</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    document.getElementById('doc-modal-body').innerHTML = companionBannerHtml + html;

    const tocNav = document.getElementById('doc-toc-nav');
    if (tocNav) {
      if (headings.length > 0) {
        tocNav.innerHTML = headings.map(h => `
          <a href="#${h.id}" onclick="jumpToHeading(event, '${h.id}')" class="toc-link ${h.level === 3 ? 'pl-4 text-[11px]' : ''}" title="${escapeHtml(h.title)}">
            ${escapeHtml(h.title)}
          </a>
        `).join('');
      } else {
        tocNav.innerHTML = '<span class="text-[11px] text-slate-500 italic px-2">No section headings</span>';
      }
    }

    const modal = document.getElementById('doc-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };

  window.jumpToHeading = function (e, id) {
    e.preventDefault();
    const target = document.getElementById(id);
    const body = document.getElementById('doc-modal-body');
    if (target && body) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.closeDocModal = function () {
    const modal = document.getElementById('doc-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.copyDocModalContent = function () {
    const doc = DATA.docs?.[activeDocKey];
    if (doc?.content) {
      copyToClipboard(doc.content, 'Raw Markdown');
    }
  };

  /* -------------------------------------------------------------
     11. TAB: INTERACTIVE HANDOVER CHECKLIST
  ------------------------------------------------------------- */
  let activeChecklistFilter = 'all';

  function renderChecklistTab() {
    const checklist = DATA.checklist || [];
    const total = checklist.length;
    const checked = Object.values(checklistState).filter(Boolean).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

    return `
      <div class="tab-pane space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Master Handover Checklist
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">${checked}/${total} Done</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
              Click items as tasks are verified and transferred. Changes persist in your browser.
            </p>
          </div>

          <div class="w-full sm:w-64">
            <input type="text" id="checklist-search" oninput="filterChecklistItems()" placeholder="Search checklist..." class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        <div class="hub-card p-4 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-300 font-semibold">Handover Completion Progress</span>
            <span class="font-bold text-emerald-400 font-mono">${pct}%</span>
          </div>
          <div class="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-300" style="width: ${pct}%"></div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-xs">
          <button onclick="setChecklistFilter('all', this)" class="chk-filter-pill px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold">All Items (${total})</button>
          <button onclick="setChecklistFilter('pending', this)" class="chk-filter-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Pending Only (${total - checked})</button>
          <button onclick="setChecklistFilter('completed', this)" class="chk-filter-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Completed (${checked})</button>
          <button onclick="setChecklistFilter('high', this)" class="chk-filter-pill px-3 py-1.5 rounded-lg bg-slate-800 text-red-400 hover:text-white">High Priority</button>
        </div>

        <div class="space-y-2" id="checklist-rows-container">
          ${renderChecklistRows(getFilteredChecklist())}
        </div>

      </div>
    `;
  }

  function getFilteredChecklist() {
    const q = (document.getElementById('checklist-search')?.value || '').toLowerCase();
    const checklist = DATA.checklist || [];

    return checklist.map((item, idx) => ({ ...item, originalIndex: idx })).filter(item => {
      const isDone = !!checklistState['chk_' + item.originalIndex];
      
      if (activeChecklistFilter === 'pending' && isDone) return false;
      if (activeChecklistFilter === 'completed' && !isDone) return false;
      if (activeChecklistFilter === 'high' && item['Priority'] !== 'High') return false;

      if (q) {
        const text = `${item['Task']} ${item['Notes']} ${item['Area']} ${item['Phase']}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }

  function renderChecklistRows(list) {
    if (!list || list.length === 0) {
      return '<div class="py-12 text-center text-slate-500 text-xs">No checklist items found.</div>';
    }

    return list.map(item => {
      const id = 'chk_' + item.originalIndex;
      const isDone = !!checklistState[id];
      const priority = item['Priority'] || '';
      let prioColor = 'text-slate-400';
      if (priority === 'High') prioColor = 'text-red-400 font-bold';
      else if (priority === 'Medium') prioColor = 'text-amber-400';

      return `
        <label class="hub-card p-3.5 flex items-start gap-3.5 cursor-pointer hover:bg-slate-900/60 transition-colors block">
          <input type="checkbox" onchange="toggleChecklistItem('${id}')" ${isDone ? 'checked' : ''} class="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-800 cursor-pointer" />
          <div class="flex-1 min-w-0 space-y-1">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span class="text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}">
                ${escapeHtml(item['Task'] || 'Untitled Task')}
              </span>
              <div class="flex items-center gap-2 flex-shrink-0 text-[10px]">
                ${item['Phase'] ? `<span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">${escapeHtml(item['Phase'])}</span>` : ''}
                <span class="${prioColor}">${escapeHtml(priority)} Priority</span>
              </div>
            </div>
            ${item['Notes'] ? `<p class="text-[11px] text-slate-400 leading-relaxed">${escapeHtml(item['Notes'])}</p>` : ''}
          </div>
        </label>
      `;
    }).join('');
  }

  window.setChecklistFilter = function (filter, btn) {
    activeChecklistFilter = filter;
    document.querySelectorAll('.chk-filter-pill').forEach(b => {
      b.className = 'chk-filter-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs';
    });
    btn.className = 'chk-filter-pill px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs';
    filterChecklistItems();
  };

  window.toggleChecklistItem = function (id) {
    checklistState[id] = !checklistState[id];
    saveChecklistState();
    
    const total = (DATA.checklist || []).length;
    const checked = Object.values(checklistState).filter(Boolean).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    const countEl = document.querySelector('.hub-card .text-emerald-400.font-mono');
    const barEl = document.querySelector('.hub-card .bg-gradient-to-r');
    if (countEl) countEl.innerText = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;
  };

  window.filterChecklistItems = function () {
    const container = document.getElementById('checklist-rows-container');
    if (container) container.innerHTML = renderChecklistRows(getFilteredChecklist());
  };

  /* -------------------------------------------------------------
     GLOBAL SEARCH WITH WORKDRIVE SUGGESTIONS & KEYBOARD NAV
  ------------------------------------------------------------- */
  window.openSearchModal = function () {
    const modal = document.getElementById('search-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const input = document.getElementById('modal-search-input');
    if (input) {
      input.value = '';
      input.focus();
      handleGlobalSearch('');
    }
  };

  window.closeSearchModal = function () {
    const modal = document.getElementById('search-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.quickSearchTag = function (tag) {
    const input = document.getElementById('modal-search-input');
    if (input) {
      input.value = tag;
      handleGlobalSearch(tag);
      input.focus();
    }
  };

  function handleGlobalSearch(query) {
    const list = document.getElementById('search-results-list');
    if (!list) return;

    selectedSearchResultIndex = 0;
    const q = query.trim().toLowerCase();
    if (!q) {
      list.innerHTML = `
        <div class="py-8 text-center text-slate-500 text-xs leading-relaxed">
          Search across 12 Zoho WorkDrive recordings, 25 applications, 21 domains, 14 systems & secrets, 31 recurring SOPs, and 11 manuals.
        </div>
      `;
      return;
    }

    let results = [];

    // Search WorkDrive Videos FIRST for high visibility
    (DATA.looms || []).forEach(l => {
      const match = `${l['Video']} ${l['What to show']} ${l['System']} ${l.hasWorkdrive ? 'workdrive zoho video loom' : ''}`.toLowerCase();
      if (match.includes(q)) {
        results.push({
          type: l.hasWorkdrive ? 'WorkDrive Video' : 'Loom (Pending)',
          title: l['Video'],
          subtitle: l['What to show'] || 'Video Walkthrough',
          badge: l.hasWorkdrive ? '▶ Ready to Watch' : 'Pending',
          action: () => {
            closeSearchModal();
            if (l.primaryWorkdriveLink) {
              window.open(l.primaryWorkdriveLink, '_blank');
            } else {
              switchTab('looms');
            }
          }
        });
      }
    });

    // Search Apps
    (DATA.apps || []).forEach(app => {
      const match = `${app['Project']} ${app['What it is']} ${app['System']} ${app['Keys used (names only)']}`.toLowerCase();
      if (match.includes(q)) {
        results.push({
          type: 'App / Repo',
          title: app['Project'],
          subtitle: app['What it is'],
          badge: app['Status'],
          action: () => { closeSearchModal(); switchTab('apps'); }
        });
      }
    });

    // Search Domains
    (DATA.domains || []).forEach(d => {
      const match = `${d['Domain']} ${d['Notes']} ${d['Use']}`.toLowerCase();
      if (match.includes(q)) {
        results.push({
          type: 'Domain',
          title: d['Domain'],
          subtitle: `${d['Use']} · Registrar: ${d['Registrar']} · Renewal: ${d['Renewal date']}`,
          badge: d['Status'] || 'Domain',
          action: () => { closeSearchModal(); switchTab('domains'); }
        });
      }
    });

    // Search Systems / Vault
    (DATA.systems || []).forEach(s => {
      const match = `${s['Tool']} ${s['Login email']} ${s['Used for']} ${s['Notes']}`.toLowerCase();
      if (match.includes(q)) {
        results.push({
          type: 'System / Secret',
          title: s['Tool'],
          subtitle: `${s['Login email']} · ${s['Used for']}`,
          badge: 'Vault',
          action: () => { closeSearchModal(); switchTab('vault'); }
        });
      }
    });

    // Search Tasks / SOPs
    (DATA.recurring_tasks || []).forEach(t => {
      const match = `${t['Task']} ${t['When / how']} ${t['Tools']}`.toLowerCase();
      if (match.includes(q)) {
        results.push({
          type: 'Recurring SOP',
          title: t['Task'],
          subtitle: t['When / how'],
          badge: t['Frequency'],
          action: () => { closeSearchModal(); switchTab('tasks'); }
        });
      }
    });

    // Search Docs
    Object.entries(DATA.docs || {}).forEach(([key, d]) => {
      const match = `${d.title} ${d.category} ${d.content.slice(0, 500)}`.toLowerCase();
      if (match.includes(q)) {
        results.push({
          type: 'Manual / Bible',
          title: d.title,
          subtitle: `Category: ${d.category}`,
          badge: 'Doc',
          action: () => { closeSearchModal(); openDocModal(key); }
        });
      }
    });

    if (results.length === 0) {
      list.innerHTML = `<div class="py-8 text-center text-slate-500 text-xs">No records found matching "${escapeHtml(query)}".</div>`;
      return;
    }

    list.innerHTML = results.slice(0, 15).map((r, i) => `
      <div id="search-item-${i}" onclick="window.__globalSearchResults[${i}].action()" class="search-item p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-3 group transition-colors ${i === 0 ? 'bg-slate-800/80' : ''}">
        <div class="space-y-0.5 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold px-1.5 py-0.2 rounded ${r.type.includes('WorkDrive') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'} font-mono uppercase">${escapeHtml(r.type)}</span>
            <span class="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">${escapeHtml(r.title)}</span>
          </div>
          <p class="text-[11px] text-slate-400 truncate max-w-xl">${escapeHtml(r.subtitle || '')}</p>
        </div>
        ${r.badge ? `<span class="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 ${r.type.includes('WorkDrive') ? 'text-emerald-400' : 'text-slate-400'} font-mono flex-shrink-0">${escapeHtml(r.badge)}</span>` : ''}
      </div>
    `).join('');

    window.__globalSearchResults = results.slice(0, 15);
  }

  // Keyboard shortcut listener
  document.addEventListener('keydown', function (e) {
    const searchModal = document.getElementById('search-modal');
    const isSearchOpen = searchModal && !searchModal.classList.contains('hidden');

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape') {
      closeSearchModal();
      closeDocModal();
      closeCustomSecretModal();
      closeBulkPasteModal();
    } else if (isSearchOpen) {
      const results = window.__globalSearchResults || [];
      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedSearchResultIndex = (selectedSearchResultIndex + 1) % results.length;
        updateSearchSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedSearchResultIndex = (selectedSearchResultIndex - 1 + results.length) % results.length;
        updateSearchSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedSearchResultIndex]) {
          results[selectedSearchResultIndex].action();
        }
      }
    }
  });

  function updateSearchSelection() {
    document.querySelectorAll('.search-item').forEach((item, idx) => {
      if (idx === selectedSearchResultIndex) {
        item.classList.add('bg-slate-800');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('bg-slate-800');
      }
    });
  }

  document.getElementById('modal-search-input')?.addEventListener('input', function (e) {
    handleGlobalSearch(e.target.value);
  });

  document.getElementById('mobile-menu-toggle')?.addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar-nav');
    if (sidebar) sidebar.classList.toggle('hidden');
  });

  window.addEventListener('hashchange', function () {
    const hash = window.location.hash.replace('#', '') || 'overview';
    switchTab(hash, false);
  });

  function initWorkDriveHeaderQuickList() {
    const list = document.getElementById('header-workdrive-quicklist');
    if (!list) return;
    const workdriveVideos = (DATA.looms || []).filter(v => v.hasWorkdrive);
    list.innerHTML = workdriveVideos.map((v, idx) => {
      const num = v.videoNumber ? `#${String(v.videoNumber).padStart(2, '0')}` : `#${idx+1}`;
      const url = v.primaryWorkdriveLink;
      return `
        <div class="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors group">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex-shrink-0">${num}</span>
            <a href="${url}" target="_blank" class="text-xs text-slate-200 hover:text-white truncate" title="${escapeHtml(v['Video'])}">
              ${escapeHtml(v['Video'].replace(/^\d+\s*·\s*/, ''))}
            </a>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <a href="${url}" target="_blank" class="p-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[10px] transition-colors" title="Open on WorkDrive">
              ↗
            </a>
            <button onclick="copyToClipboard('${url}', 'WorkDrive Link ${num}')" class="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px]" title="Copy Link">
              📋
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Startup
  initState();
  initWorkDriveHeaderQuickList();
  const initialHash = window.location.hash.replace('#', '') || 'overview';
  switchTab(initialHash, false);

})();
