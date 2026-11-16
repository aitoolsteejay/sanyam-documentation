// ==========================================================================
// MYNTMORE AI Prompt Library - Client Application (Production Grade)
// Supports Website, Dashboard, Outreach Tool, and Workshop Systems (369 Prompts)
// ==========================================================================

(function () {
  'use strict';

  const STORAGE_KEY_CUSTOM = 'mm_custom_prompts_v1';
  const STORAGE_KEY_VIEW = 'mm_prompt_view_mode_v1';
  const STORAGE_KEY_THEME = 'mm_theme_v1';
  const STORAGE_KEY_FAVORITES = 'mm_favorites_v1';

  // Application State
  let allPrompts = [];
  let currentCategory = 'All'; // 'All' | 'Website' | 'Dashboard' | 'Outreach Tool' | 'Workshop'
  let currentSubcategory = 'All';
  let searchQuery = '';
  let selectedTag = 'All';
  let selectedTool = 'All';
  let selectedRisk = 'All'; // 'All' | 'High Risk' | 'Medium Risk' | 'Low Risk'
  let sortBy = 'newest';
  let viewMode = localStorage.getItem(STORAGE_KEY_VIEW) || 'grid';
  let filterOnlyFavorites = false;
  let favorites = new Set();
  let expandedCardIds = new Set();

  // Modal State
  let activeModalPrompt = null;
  let activeModalVariables = {};

  // =========================================================================
  // Initialization
  // =========================================================================
  function init() {
    initTheme();
    loadFavorites();
    loadPrompts();
    setupKeyboardShortcuts();
    renderApp();
  }

  // Theme Management (Default to Dark Mode for sleek modern developer aesthetic)
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    const sunIcon = document.getElementById('theme-sun-icon');
    const moonIcon = document.getElementById('theme-moon-icon');

    if (theme === 'dark') {
      html.classList.add('dark');
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
    } else {
      html.classList.remove('dark');
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }

  window.toggleTheme = function () {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  };

  // Favorites Management
  function loadFavorites() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (stored) {
        favorites = new Set(JSON.parse(stored));
      }
    } catch (e) {
      favorites = new Set();
    }
    updateFavoritesBadge();
  }

  function saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(favorites)));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
    updateFavoritesBadge();
  }

  function updateFavoritesBadge() {
    const badge = document.getElementById('favorites-count');
    if (badge) badge.textContent = favorites.size;

    const btn = document.getElementById('favorites-toggle-btn');
    const icon = document.getElementById('favorites-icon');
    if (btn && icon) {
      if (filterOnlyFavorites) {
        btn.classList.add('bg-amber-500/10', 'border-amber-500/30', 'text-amber-500');
        icon.setAttribute('fill', 'currentColor');
      } else {
        btn.classList.remove('bg-amber-500/10', 'border-amber-500/30', 'text-amber-500');
        icon.setAttribute('fill', 'none');
      }
    }
  }

  window.toggleFavorite = function (promptId, event) {
    if (event) event.stopPropagation();
    if (favorites.has(promptId)) {
      favorites.delete(promptId);
      showToast('Removed from saved bookmarks');
    } else {
      favorites.add(promptId);
      showToast('Added to saved bookmarks! ★');
    }
    saveFavorites();
    renderPrompts();
    updateResultsCountText();
  };

  window.toggleFavoritesFilter = function () {
    filterOnlyFavorites = !filterOnlyFavorites;
    updateFavoritesBadge();
    renderPrompts();
    updateResultsCountText();
  };

  // Load Prompts Data
  function loadPrompts() {
    const seedData = window.PROMPTS_DATA || [];
    let customPrompts = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM);
      if (stored) {
        customPrompts = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load custom prompts from localStorage:', e);
    }

    const customIds = new Set(customPrompts.map(p => p.id));
    const nonDuplicatedSeed = seedData.filter(p => !customIds.has(p.id));
    allPrompts = [...customPrompts, ...nonDuplicatedSeed];
  }

  function saveCustomPrompts() {
    try {
      const customOnly = allPrompts.filter(p => p.isCustom);
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customOnly));
    } catch (e) {
      console.error('Failed to save custom prompts:', e);
    }
  }

  // Parameter Variable Parsing (<ANGLE_BRACKETS>, [BRACKETS], {{VARS}})
  function extractVariables(text) {
    if (!text) return [];
    const vars = new Set();
    const regex1 = /\[([^\]]{2,250})\]/g;
    const regex2 = /<([^>]{2,250})>/g;
    const regex3 = /\{\{([^}]{2,100})\}\}/g;
    let match;
    while ((match = regex1.exec(text)) !== null) {
      const v = match[1].replace(/\s+/g, ' ').trim();
      if (v) vars.add(v);
    }
    while ((match = regex2.exec(text)) !== null) {
      const v = match[1].replace(/\s+/g, ' ').trim();
      if (v && !v.startsWith('http')) vars.add(v);
    }
    while ((match = regex3.exec(text)) !== null) {
      const v = match[1].replace(/\s+/g, ' ').trim();
      if (v) vars.add(v);
    }
    return Array.from(vars);
  }

  function getPromptVariables(p) {
    if (p && Array.isArray(p.variables) && p.variables.length > 0) {
      return p.variables;
    }
    return extractVariables(p ? p.prompt : '');
  }

  // =========================================================================
  // Rendering Core Application
  // =========================================================================
  function renderApp() {
    updateCategoryCounts();
    renderSubcategoryRail();
    renderTagChips();
    renderPrompts();
    updateResultsCountText();
  }

  // Update Top Metric Counters & Tab Active States
  function updateCategoryCounts() {
    const counts = {
      All: allPrompts.length,
      Website: 0,
      Dashboard: 0,
      'Outreach Tool': 0,
      Workshop: 0
    };

    allPrompts.forEach(p => {
      if (p.category === 'Website') counts.Website++;
      else if (p.category === 'Dashboard') counts.Dashboard++;
      else if (p.category === 'Outreach Tool') counts['Outreach Tool']++;
      else if (p.category === 'Workshop') counts.Workshop++;
    });

    // Top metrics (header)
    const cAll = document.getElementById('count-all');
    const cWeb = document.getElementById('count-website');
    const cDash = document.getElementById('count-dashboard');
    const cOut = document.getElementById('count-outreach');
    const cWs = document.getElementById('count-workshop');

    if (cAll) cAll.textContent = counts.All;
    if (cWeb) cWeb.textContent = counts.Website;
    if (cDash) cDash.textContent = counts.Dashboard;
    if (cOut) cOut.textContent = counts['Outreach Tool'];
    if (cWs) cWs.textContent = counts.Workshop;

    // Segmented tab badges
    const bAll = document.getElementById('badge-all');
    const bWeb = document.getElementById('badge-website');
    const bDash = document.getElementById('badge-dashboard');
    const bOut = document.getElementById('badge-outreach');
    const bWs = document.getElementById('badge-workshop');

    if (bAll) bAll.textContent = counts.All;
    if (bWeb) bWeb.textContent = counts.Website;
    if (bDash) bDash.textContent = counts.Dashboard;
    if (bOut) bOut.textContent = counts['Outreach Tool'];
    if (bWs) bWs.textContent = counts.Workshop;

    // Active pill highlight
    const tabMap = {
      All: 'cat-tab-all',
      Website: 'cat-tab-website',
      Dashboard: 'cat-tab-dashboard',
      'Outreach Tool': 'cat-tab-outreach',
      Workshop: 'cat-tab-workshop'
    };

    const activeColors = {
      All: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
      Website: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
      Dashboard: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20',
      'Outreach Tool': 'bg-purple-600 text-white shadow-md shadow-purple-500/20',
      Workshop: 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
    };

    Object.entries(tabMap).forEach(([cat, id]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (cat === currentCategory) {
        el.className = `category-pill flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${activeColors[cat]}`;
        const badge = el.querySelector('span:last-child');
        if (badge) badge.className = 'px-2 py-0.5 rounded-full text-xs font-mono bg-white/20 text-white';
      } else {
        el.className = 'category-pill flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex-shrink-0';
        const badge = el.querySelector('span:last-child');
        if (badge) badge.className = 'px-2 py-0.5 rounded-full text-xs font-mono bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300';
      }
    });
  }

  // Interactive Subcategory Pills Rail (Replaces the clunky hidden dropdown)
  function renderSubcategoryRail() {
    const rail = document.getElementById('subcategory-rail');
    if (!rail) return;

    // Count subcategories for current category
    const subcatCounts = {};
    const relevantPrompts = currentCategory === 'All'
      ? allPrompts
      : allPrompts.filter(p => p.category === currentCategory);

    relevantPrompts.forEach(p => {
      if (p.subcategory) {
        const sc = p.subcategory.trim();
        subcatCounts[sc] = (subcatCounts[sc] || 0) + 1;
      }
    });

    const subcats = Object.keys(subcatCounts).sort();

    if (subcats.length <= 1 && currentCategory === 'All') {
      rail.classList.add('hidden');
      return;
    }
    rail.classList.remove('hidden');

    // Build pills
    let html = `
      <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
        <span>Section:</span>
      </span>
      <button 
        onclick="handleSubcategoryFilter('All')" 
        class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex-shrink-0 flex items-center gap-1.5 ${
          currentSubcategory === 'All'
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
        }">
        <span>All Sections</span>
        <span class="text-[10px] font-mono px-1 rounded-full ${currentSubcategory === 'All' ? 'bg-white/20 dark:bg-black/10' : 'bg-slate-200 dark:bg-white/10'}">${relevantPrompts.length}</span>
      </button>
    `;

    subcats.forEach(sc => {
      const isSel = currentSubcategory === sc;
      const count = subcatCounts[sc];
      html += `
        <button 
          onclick="handleSubcategoryFilter('${escapeHtml(sc)}')" 
          class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex-shrink-0 flex items-center gap-1.5 ${
            isSel
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
          }">
          <span>${escapeHtml(sc)}</span>
          <span class="text-[10px] font-mono px-1 rounded-full ${isSel ? 'bg-white/20' : 'bg-slate-200 dark:bg-white/10'}">${count}</span>
        </button>
      `;
    });

    rail.innerHTML = html;
  }

  // Interactive Tag Filter Chips Strip
  function renderTagChips() {
    const container = document.getElementById('tag-chips-container');
    if (!container) return;

    // Extract top tags for current category
    const relevantPrompts = currentCategory === 'All' 
      ? allPrompts 
      : allPrompts.filter(p => p.category === currentCategory);

    const tagCounts = {};
    relevantPrompts.forEach(p => {
      (p.tags || []).forEach(t => {
        const clean = t.trim();
        // Skip common duplicates that match the category name
        if (clean.toLowerCase() === currentCategory.toLowerCase()) return;
        tagCounts[clean] = (tagCounts[clean] || 0) + 1;
      });
    });

    // Sort by frequency, take top 18
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 18)
      .map(entry => entry[0]);

    if (topTags.length === 0) {
      container.classList.add('hidden');
      return;
    }
    container.classList.remove('hidden');

    let html = `
      <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
        <span>Tags:</span>
      </span>
      <button 
        onclick="handleTagClick('All')" 
        class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
          selectedTag === 'All' 
            ? 'bg-slate-800 text-white dark:bg-white/20 dark:text-white font-bold' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/10'
        }">
        All Tags
      </button>
    `;

    topTags.forEach(tag => {
      const isSel = selectedTag === tag;
      const count = tagCounts[tag];
      html += `
        <button 
          onclick="handleTagClick('${escapeHtml(tag)}')" 
          class="px-2 py-0.5 rounded-lg text-xs transition-all flex-shrink-0 flex items-center gap-1 ${
            isSel
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10'
          }">
          <span>#${escapeHtml(tag)}</span>
          <span class="text-[10px] font-mono opacity-70">${count}</span>
        </button>
      `;
    });

    container.innerHTML = html;
  }

  // Filter & Search Logic
  function getFilteredPrompts() {
    let list = [...allPrompts];

    // Category filter
    if (currentCategory !== 'All') {
      list = list.filter(p => p.category === currentCategory);
    }

    // Subcategory filter
    if (currentSubcategory !== 'All') {
      list = list.filter(p => (p.subcategory || '').trim() === currentSubcategory.trim());
    }

    // Target Tool filter
    if (selectedTool !== 'All') {
      list = list.filter(p => {
        const tool = (p.targetTool || '').toLowerCase();
        return tool.includes(selectedTool.toLowerCase());
      });
    }

    // Tag filter
    if (selectedTag !== 'All') {
      list = list.filter(p => {
        return (p.tags || []).some(t => t.toLowerCase() === selectedTag.toLowerCase());
      });
    }

    // Favorites only filter
    if (filterOnlyFavorites) {
      list = list.filter(p => favorites.has(p.id));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const inTitle = (p.title || '').toLowerCase().includes(q);
        const inDesc = (p.description || '').toLowerCase().includes(q);
        const inPrompt = (p.prompt || '').toLowerCase().includes(q);
        const inSubcat = (p.subcategory || '').toLowerCase().includes(q);
        const inTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
        const inVars = (p.variables || []).some(v => v.toLowerCase().includes(q));
        const inId = (p.id || '').toLowerCase().includes(q);
        return inTitle || inDesc || inPrompt || inSubcat || inTags || inVars || inId;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '');
      }
      if (sortBy === 'variables') {
        const varA = getPromptVariables(a).length;
        const varB = getPromptVariables(b).length;
        return varB - varA;
      }
      // Default: Natural ID order or creation
      const numA = parseInt((a.id || '').replace(/\D/g, ''), 10);
      const numB = parseInt((b.id || '').replace(/\D/g, ''), 10);
      if (a.category === b.category && numA && numB) {
        return numA - numB;
      }
      return 0;
    });

    return list;
  }

  // Render Grid / List of Prompts
  function renderPrompts() {
    const container = document.getElementById('prompts-grid');
    const emptyState = document.getElementById('empty-state');
    if (!container) return;

    const filtered = getFilteredPrompts();

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    if (viewMode === 'list') {
      container.className = 'flex flex-col gap-2.5';
      container.innerHTML = filtered.map(renderListItem).join('');
    } else {
      container.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5';
      container.innerHTML = filtered.map(renderCard).join('');
    }
  }

  // Category Accent Definitions
  function getCategoryStyle(category) {
    switch (category) {
      case 'Website':
        return {
          bar: 'bg-blue-500',
          bg: 'bg-blue-500/10 dark:bg-blue-500/15',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-500/25',
          dot: 'bg-blue-500'
        };
      case 'Dashboard':
        return {
          bar: 'bg-emerald-500',
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-500/25',
          dot: 'bg-emerald-500'
        };
      case 'Outreach Tool':
        return {
          bar: 'bg-purple-500',
          bg: 'bg-purple-500/10 dark:bg-purple-500/15',
          text: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-500/25',
          dot: 'bg-purple-500'
        };
      case 'Workshop':
        return {
          bar: 'bg-amber-500',
          bg: 'bg-amber-500/10 dark:bg-amber-500/15',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-500/25',
          dot: 'bg-amber-500'
        };
      default:
        return {
          bar: 'bg-slate-500',
          bg: 'bg-slate-500/10 dark:bg-slate-500/15',
          text: 'text-slate-600 dark:text-slate-400',
          border: 'border-slate-500/25',
          dot: 'bg-slate-500'
        };
    }
  }

  // Format Code Preview with Parameter Highlighting
  function formatPromptPreview(text, maxChars = 240, isExpanded = false) {
    if (!text) return '';
    let preview = text;
    if (!isExpanded && text.length > maxChars) {
      preview = text.slice(0, maxChars) + '...';
    }

    let escaped = escapeHtml(preview);

    // Highlight bracket variables [PARAM] and <PARAM> and {{PARAM}}
    escaped = escaped.replace(/\[([^\]]{2,200})\]/g, '<span class="var-token">[$1]</span>');
    escaped = escaped.replace(/&lt;([^&>]{2,200})&gt;/g, '<span class="var-token">&lt;$1&gt;</span>');
    escaped = escaped.replace(/\{\{([^}]{2,80})\}\}/g, '<span class="var-token">{{$1}}</span>');

    return escaped;
  }

  // Toggle in-place card expansion
  window.toggleCardExpand = function (id, event) {
    if (event) event.stopPropagation();
    if (expandedCardIds.has(id)) {
      expandedCardIds.delete(id);
    } else {
      expandedCardIds.add(id);
    }
    renderPrompts();
  };

  // Render a Single Card (Grid View)
  function renderCard(p) {
    const catStyle = getCategoryStyle(p.category);
    const variables = getPromptVariables(p);
    const wordCount = (p.prompt || '').trim().split(/\s+/).filter(Boolean).length;
    const isFav = favorites.has(p.id);
    const isExpanded = expandedCardIds.has(p.id);
    const isLongPrompt = (p.prompt || '').length > 220;

    // Detect risk tag if present
    const riskTag = (p.tags || []).find(t => t.toLowerCase().includes('risk'));
    let riskBadge = '';
    if (riskTag) {
      const isHigh = riskTag.toLowerCase().includes('high');
      const isMed = riskTag.toLowerCase().includes('medium');
      const colorClass = isHigh
        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
        : isMed
        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
      riskBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold border ${colorClass}">${escapeHtml(riskTag)}</span>`;
    }

    const tagsHtml = (p.tags || []).slice(0, 4).map(t => `
      <span onclick="handleTagClick('${escapeHtml(t)}'); event.stopPropagation();" class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer">
        #${escapeHtml(t)}
      </span>
    `).join('');

    return `
      <div class="prompt-card bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group relative">
        
        <!-- Category Top Accent Strip -->
        <div class="h-1 w-full ${catStyle.bar}"></div>

        <div class="p-5 flex-1 flex flex-col">
          
          <!-- Card Header Badges & Actions -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-1.5 flex-wrap min-w-0">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${catStyle.bg} ${catStyle.text} border ${catStyle.border}">
                <span class="w-1.5 h-1.5 rounded-full ${catStyle.dot}"></span>
                ${escapeHtml(p.category)}
              </span>
              ${p.targetTool ? `
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                  ${escapeHtml(p.targetTool)}
                </span>
              ` : ''}
              ${riskBadge}
            </div>

            <!-- Bookmark Star Button -->
            <button 
              onclick="toggleFavorite('${escapeHtml(p.id)}', event)" 
              title="${isFav ? 'Remove bookmark' : 'Bookmark prompt'}" 
              class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-300 dark:text-slate-600 hover:text-amber-400 transition-colors">
              <svg class="w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            </button>
          </div>

          <!-- Title -->
          <h3 onclick="openDetailModal('${escapeHtml(p.id)}')" class="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer leading-snug mb-1.5">
            ${escapeHtml(p.title)}
          </h3>

          <!-- Description -->
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            ${escapeHtml(p.description || 'No description provided.')}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1 mb-4">
            ${tagsHtml}
          </div>

          <!-- Prompt Box Preview -->
          <div class="relative mt-auto bg-slate-900 dark:bg-[#0A0F1D] rounded-xl p-3 text-xs font-mono text-slate-200 border border-slate-800 dark:border-white/10 shadow-inner group/box">
            <div class="text-[11px] leading-relaxed select-all">
              ${formatPromptPreview(p.prompt, 220, isExpanded)}
            </div>

            <!-- Expand / Collapse button if prompt is long -->
            ${isLongPrompt ? `
              <div class="pt-2 mt-2 border-t border-slate-800 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <button onclick="toggleCardExpand('${escapeHtml(p.id)}', event)" class="hover:text-white flex items-center gap-1 font-semibold">
                  <span>${isExpanded ? 'Collapse' : 'Show Full Prompt'}</span>
                  <svg class="w-3 h-3 transform ${isExpanded ? 'rotate-180' : ''} transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <span class="font-mono text-slate-500">${wordCount} words</span>
              </div>
            ` : ''}
          </div>

        </div>

        <!-- Card Footer Action Controls -->
        <div class="px-5 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] flex items-center justify-between gap-2">
          
          <!-- Variable Count Indicator -->
          <div>
            ${variables.length > 0 ? `
              <span class="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-amber-600 dark:text-amber-400">
                <span>⚡</span> ${variables.length} ${variables.length === 1 ? 'var' : 'vars'}
              </span>
            ` : `
              <span class="text-[11px] font-mono text-slate-400">${wordCount} words</span>
            `}
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-1.5">
            <button onclick="openDetailModal('${escapeHtml(p.id)}')" class="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 rounded-xl transition-all">
              ${variables.length > 0 ? 'Fill & Test' : 'Expand'}
            </button>
            <button onclick="copyPromptText('${escapeHtml(p.id)}', this)" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <span>Copy</span>
            </button>
          </div>

        </div>

      </div>
    `;
  }

  // Render a Single List Item (Compact List View)
  function renderListItem(p) {
    const catStyle = getCategoryStyle(p.category);
    const variables = getPromptVariables(p);
    const isFav = favorites.has(p.id);

    return `
      <div class="bg-white dark:bg-[#131B2E] rounded-xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-md p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group transition-all">
        
        <div class="flex items-start gap-3 min-w-0 flex-1">
          <div class="w-2.5 h-2.5 rounded-full ${catStyle.dot} mt-1.5 flex-shrink-0"></div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="text-xs font-bold ${catStyle.text}">${escapeHtml(p.category)}</span>
              <span class="text-slate-300 dark:text-slate-600">•</span>
              <h3 onclick="openDetailModal('${escapeHtml(p.id)}')" class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors cursor-pointer truncate">
                ${escapeHtml(p.title)}
              </h3>
              ${p.targetTool ? `
                <span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                  ${escapeHtml(p.targetTool)}
                </span>
              ` : ''}
              ${variables.length > 0 ? `
                <span class="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  ${variables.length} vars
                </span>
              ` : ''}
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate max-w-2xl">
              ${escapeHtml(p.description || p.prompt.slice(0, 100))}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
          <button 
            onclick="toggleFavorite('${escapeHtml(p.id)}', event)" 
            title="${isFav ? 'Remove bookmark' : 'Bookmark prompt'}" 
            class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-300 dark:text-slate-600 hover:text-amber-400 transition-colors">
            <svg class="w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
          </button>
          <button onclick="openDetailModal('${escapeHtml(p.id)}')" class="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-all">
            ${variables.length > 0 ? 'Fill' : 'View'}
          </button>
          <button onclick="copyPromptText('${escapeHtml(p.id)}', this)" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            <span>Copy</span>
          </button>
        </div>

      </div>
    `;
  }

  // Update Status Text
  function updateResultsCountText() {
    const textEl = document.getElementById('results-count-text');
    const indicator = document.getElementById('active-filter-indicator');
    const filtered = getFilteredPrompts();

    const isFiltered = currentCategory !== 'All' || 
                       currentSubcategory !== 'All' || 
                       selectedTool !== 'All' || 
                       selectedTag !== 'All' || 
                       filterOnlyFavorites || 
                       searchQuery.trim().length > 0;

    if (textEl) {
      if (isFiltered) {
        textEl.innerHTML = `Showing <strong class="text-slate-900 dark:text-white font-bold">${filtered.length}</strong> of ${allPrompts.length} prompts`;
      } else {
        textEl.innerHTML = `Showing all <strong class="text-slate-900 dark:text-white font-bold">${allPrompts.length}</strong> production prompts`;
      }
    }

    if (indicator) {
      if (isFiltered) indicator.classList.remove('hidden');
      else indicator.classList.add('hidden');
    }
  }

  // =========================================================================
  // Interactive Event Handlers
  // =========================================================================

  // Category Filter
  window.filterCategory = function (category) {
    currentCategory = category;
    currentSubcategory = 'All';
    selectedTag = 'All';
    renderApp();
  };

  // Subcategory Filter
  window.handleSubcategoryFilter = function (subcat) {
    currentSubcategory = subcat;
    renderPrompts();
    renderSubcategoryRail();
    updateResultsCountText();
  };

  // Tool Filter
  window.handleToolFilter = function (tool) {
    selectedTool = tool;
    renderPrompts();
    updateResultsCountText();
  };

  // Search
  window.handleSearch = function (val) {
    searchQuery = val;
    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) {
      if (val.trim()) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    }
    renderPrompts();
    updateResultsCountText();
  };

  window.clearSearch = function () {
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    searchQuery = '';
    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) clearBtn.classList.add('hidden');
    renderPrompts();
    updateResultsCountText();
  };

  // Sort
  window.handleSort = function (val) {
    sortBy = val;
    renderPrompts();
  };

  // View Mode
  window.setViewMode = function (mode) {
    viewMode = mode;
    localStorage.setItem(STORAGE_KEY_VIEW, mode);

    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');

    if (mode === 'list') {
      if (gridBtn) gridBtn.className = 'p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all';
      if (listBtn) listBtn.className = 'p-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-white/10 shadow-xs transition-all';
    } else {
      if (gridBtn) gridBtn.className = 'p-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-white/10 shadow-xs transition-all';
      if (listBtn) listBtn.className = 'p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all';
    }

    renderPrompts();
  };

  // Tag Click
  window.handleTagClick = function (tag) {
    if (selectedTag === tag) {
      selectedTag = 'All';
    } else {
      selectedTag = tag;
    }
    renderTagChips();
    renderPrompts();
    updateResultsCountText();
  };

  // Reset Filters
  window.resetAllFilters = function () {
    currentCategory = 'All';
    currentSubcategory = 'All';
    selectedTag = 'All';
    selectedTool = 'All';
    filterOnlyFavorites = false;
    searchQuery = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) clearBtn.classList.add('hidden');
    const toolSelect = document.getElementById('filter-tool');
    if (toolSelect) toolSelect.value = 'All';

    renderApp();
  };

  // =========================================================================
  // Studio Modal & Parameter Filling
  // =========================================================================

  window.openDetailModal = function (promptId) {
    const prompt = allPrompts.find(p => p.id === promptId);
    if (!prompt) return;

    activeModalPrompt = prompt;
    activeModalVariables = {};

    const modal = document.getElementById('detail-modal');
    const titleEl = document.getElementById('modal-title');
    const catBadge = document.getElementById('modal-category-badge');
    const toolBadge = document.getElementById('modal-tool-badge');
    const subcatEl = document.getElementById('modal-subcategory');
    const descEl = document.getElementById('modal-description');
    const tagsContainer = document.getElementById('modal-tags-container');
    const varsSection = document.getElementById('modal-variables-section');
    const varInputsContainer = document.getElementById('modal-variable-inputs');
    const wordCountEl = document.getElementById('modal-word-count');

    if (titleEl) titleEl.textContent = prompt.title;
    if (descEl) descEl.textContent = prompt.description || 'No additional description provided.';
    if (subcatEl) subcatEl.textContent = prompt.subcategory || '';
    if (toolBadge) toolBadge.textContent = prompt.targetTool || 'General AI';

    // Style Category Badge
    const catStyle = getCategoryStyle(prompt.category);
    if (catBadge) {
      catBadge.className = `px-2.5 py-0.5 rounded-full text-[11px] font-bold ${catStyle.bg} ${catStyle.text} border ${catStyle.border}`;
      catBadge.textContent = prompt.category;
    }

    // Tags
    if (tagsContainer) {
      tagsContainer.innerHTML = (prompt.tags || []).map(t => `
        <span class="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">#${escapeHtml(t)}</span>
      `).join('');
    }

    // Variables Section
    const variables = getPromptVariables(prompt);
    if (variables.length > 0 && varsSection && varInputsContainer) {
      varsSection.classList.remove('hidden');
      varInputsContainer.innerHTML = variables.map(v => `
        <div>
          <label class="block text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 mb-1 truncate" title="${escapeHtml(v)}">
            ${escapeHtml(v)}
          </label>
          <input 
            type="text" 
            placeholder="Type value..." 
            data-variable="${escapeHtml(v)}" 
            oninput="handleVariableInput('${escapeHtml(v)}', this.value)" 
            class="w-full text-xs font-mono bg-white dark:bg-[#0A0F1D] border border-amber-500/30 dark:border-amber-500/30 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
      `).join('');
    } else if (varsSection) {
      varsSection.classList.add('hidden');
    }

    if (wordCountEl) {
      const words = (prompt.prompt || '').trim().split(/\s+/).filter(Boolean).length;
      wordCountEl.textContent = `${words} words`;
    }

    updateModalPromptPreview();

    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeDetailModal = function () {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
    activeModalPrompt = null;
    activeModalVariables = {};
  };

  window.handleVariableInput = function (varName, value) {
    if (value.trim()) {
      activeModalVariables[varName] = value;
    } else {
      delete activeModalVariables[varName];
    }
    updateModalPromptPreview();
  };

  window.resetModalVariables = function () {
    activeModalVariables = {};
    const inputs = document.querySelectorAll('#modal-variable-inputs input');
    inputs.forEach(input => input.value = '');
    updateModalPromptPreview();
  };

  function updateModalPromptPreview() {
    const contentEl = document.getElementById('modal-prompt-content');
    if (!contentEl || !activeModalPrompt) return;

    let text = activeModalPrompt.prompt;

    // Replace filled variables with highlighted tokens
    Object.entries(activeModalVariables).forEach(([key, val]) => {
      // Escape for regex
      const safeKey = escapeRegExp(key);
      const regSquare = new RegExp(`\\[${safeKey}\\]`, 'g');
      const regAngle = new RegExp(`<${safeKey}>`, 'g');
      const regCurl = new RegExp(`\\{\\{${safeKey}\\}\\}`, 'g');

      const replacement = `__CUSTOM_VAL_START__${val}__CUSTOM_VAL_END__`;
      text = text.replace(regSquare, replacement);
      text = text.replace(regAngle, replacement);
      text = text.replace(regCurl, replacement);
    });

    let escaped = escapeHtml(text);

    // Turn custom values into bright highlighted text
    escaped = escaped.replace(/__CUSTOM_VAL_START__([\s\S]*?)__CUSTOM_VAL_END__/g, '<span class="bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded shadow-xs">$1</span>');

    // Highlight unfilled bracket parameters
    escaped = escaped.replace(/\[([^\]]{2,200})\]/g, '<span class="var-token">[$1]</span>');
    escaped = escaped.replace(/&lt;([^&>]{2,200})&gt;/g, '<span class="var-token">&lt;$1&gt;</span>');
    escaped = escaped.replace(/\{\{([^}]{2,80})\}\}/g, '<span class="var-token">{{$1}}</span>');

    contentEl.innerHTML = escaped;
  }

  // Copy modal customized text
  window.copyModalPrompt = function (btn) {
    if (!activeModalPrompt) return;
    let text = activeModalPrompt.prompt;

    Object.entries(activeModalVariables).forEach(([key, val]) => {
      const safeKey = escapeRegExp(key);
      text = text.replace(new RegExp(`\\[${safeKey}\\]`, 'g'), val);
      text = text.replace(new RegExp(`<${safeKey}>`, 'g'), val);
      text = text.replace(new RegExp(`\\{\\{${safeKey}\\}\\}`, 'g'), val);
    });

    copyToClipboard(text, () => {
      const copyText = document.getElementById('modal-copy-text');
      if (copyText) copyText.textContent = 'Copied! ✓';
      if (btn) btn.classList.add('bg-emerald-600', 'copy-pulse-anim');

      showToast('Copied customized prompt to clipboard!');
      setTimeout(() => {
        if (copyText) copyText.textContent = 'Copy Ready Prompt';
        if (btn) btn.classList.remove('bg-emerald-600', 'copy-pulse-anim');
      }, 2000);
    });
  };

  // Copy raw template text
  window.copyRawModalPrompt = function (btn) {
    if (!activeModalPrompt) return;
    copyToClipboard(activeModalPrompt.prompt, () => {
      showToast('Copied raw prompt template!');
    });
  };

  // Quick Copy from Card
  window.copyPromptText = function (promptId, btn) {
    const prompt = allPrompts.find(p => p.id === promptId);
    if (!prompt) return;

    copyToClipboard(prompt.prompt, () => {
      const originalText = btn.innerHTML;
      btn.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        <span>Copied!</span>
      `;
      btn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
      btn.classList.add('bg-emerald-600', 'hover:bg-emerald-500', 'copy-pulse-anim');

      showToast(`Copied "${prompt.title.slice(0, 30)}..." to clipboard!`);

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500', 'copy-pulse-anim');
        btn.classList.add('bg-blue-600', 'hover:bg-blue-500');
      }, 1800);
    });
  };

  // =========================================================================
  // Add Prompt Modal
  // =========================================================================
  window.openAddModal = function () {
    const modal = document.getElementById('add-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeAddModal = function () {
    const modal = document.getElementById('add-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.handleAddPrompt = function (event) {
    event.preventDefault();
    const title = document.getElementById('new-title').value.trim();
    const cat = document.getElementById('new-category').value;
    const tool = document.getElementById('new-target-tool').value;
    const subcat = document.getElementById('new-subcategory').value.trim();
    const desc = document.getElementById('new-description').value.trim();
    const tagsRaw = document.getElementById('new-tags').value;
    const promptText = document.getElementById('new-prompt').value.trim();

    if (!title || !promptText) return;

    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    if (!tags.includes(cat)) tags.unshift(cat);

    const newPrompt = {
      id: `custom-${Date.now().toString(36)}`,
      title: title,
      category: cat,
      subcategory: subcat || 'General',
      targetTool: tool,
      tags: tags,
      description: desc || title,
      prompt: promptText,
      variables: extractVariables(promptText),
      author: 'User Custom',
      isCustom: true,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    allPrompts.unshift(newPrompt);
    saveCustomPrompts();
    closeAddModal();

    // Switch to category of added prompt
    currentCategory = cat;
    renderApp();
    showToast('New prompt saved successfully!');
  };

  // =========================================================================
  // Export Modal
  // =========================================================================
  window.openExportModal = function () {
    const modal = document.getElementById('export-modal');
    const textarea = document.getElementById('export-json-area');
    if (textarea) {
      textarea.value = JSON.stringify(allPrompts, null, 2);
    }
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeExportModal = function () {
    const modal = document.getElementById('export-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.copyExportJson = function () {
    const textarea = document.getElementById('export-json-area');
    if (!textarea) return;
    copyToClipboard(textarea.value, () => {
      const copyText = document.getElementById('export-copy-text');
      if (copyText) copyText.textContent = 'Copied JSON! ✓';
      showToast('Copied JSON database to clipboard!');
      setTimeout(() => {
        if (copyText) copyText.textContent = 'Copy JSON';
      }, 2000);
    });
  };

  window.downloadJsonFile = function () {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allPrompts, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'prompts.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Downloaded prompts.json');
  };

  // =========================================================================
  // Utilities
  // =========================================================================
  function copyToClipboard(text, callback) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(callback).catch(() => {
        fallbackCopyText(text, callback);
      });
    } else {
      fallbackCopyText(text, callback);
    }
  }

  function fallbackCopyText(text, callback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-message');
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
  }

  // Keyboard Shortcuts (⌘K search, 1-5 categories, Esc closes modals)
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', e => {
      // ⌘K or / to search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const search = document.getElementById('search-input');
        if (search) {
          search.focus();
          search.select();
        }
      } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const search = document.getElementById('search-input');
        if (search) search.focus();
      } else if (e.key === 'Escape') {
        closeDetailModal();
        closeAddModal();
        closeExportModal();
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
