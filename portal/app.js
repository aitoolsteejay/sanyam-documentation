// MYNTMORE AI Prompt Library - Client Application
// Supports Website, Dashboard, Outreach Tool, and Workshop Prompts
// Search, Categorization, Tag Filtering, Variable Filling, Copying & Exporting

(function () {
  'use strict';

  const STORAGE_KEY_CUSTOM = 'mm_custom_prompts_v1';
  const STORAGE_KEY_VIEW = 'mm_prompt_view_mode_v1';

  // State
  let allPrompts = [];
  let currentCategory = 'All'; // 'All' | 'Website' | 'Dashboard' | 'Outreach Tool' | 'Workshop'
  let currentSubcategory = 'All';
  let searchQuery = '';
  let selectedTag = 'All';
  let selectedTool = 'All';
  let sortBy = 'newest';
  let viewMode = localStorage.getItem(STORAGE_KEY_VIEW) || 'grid';
  let activeModalPrompt = null;
  let activeModalVariables = {};

  // Initialize
  function init() {
    loadPrompts();
    setupKeyboardShortcuts();
    renderApp();
  }

  // Load from static seed data and localStorage
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

    // Merge: custom prompts first (newest additions), then seed data
    const customIds = new Set(customPrompts.map(p => p.id));
    const nonDuplicatedSeed = seedData.filter(p => !customIds.has(p.id));
    allPrompts = [...customPrompts, ...nonDuplicatedSeed];
  }

  // Save custom prompts to localStorage
  function saveCustomPrompts() {
    try {
      const customOnly = allPrompts.filter(p => p.isCustom);
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customOnly));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // Escape regex special characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Detect bracketed variables like [URL], <ANGLE_BRACKETS>, or {{CLIENT_NAME}}
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

  // Get variables for prompt (prefer precomputed array)
  function getPromptVariables(p) {
    if (p && Array.isArray(p.variables) && p.variables.length > 0) {
      return p.variables;
    }
    return extractVariables(p ? p.prompt : '');
  }

  // Render everything
  function renderApp() {
    updateCategoryCounts();
    renderSubcategoryFilter();
    renderTagChips();
    renderPrompts();
    updateResultsCountText();
  }

  // Populate subcategory filter dropdown based on category
  function renderSubcategoryFilter() {
    const select = document.getElementById('filter-subcategory');
    if (!select) return;

    const subcats = new Set();
    const relevant = currentCategory === 'All' 
      ? allPrompts 
      : allPrompts.filter(p => p.category === currentCategory);

    relevant.forEach(p => {
      if (p.subcategory) subcats.add(p.subcategory.trim());
    });

    const sortedSubcats = Array.from(subcats).sort();
    let optionsHtml = '<option value="All">All Subcategories</option>';
    sortedSubcats.forEach(sc => {
      const isSel = currentSubcategory === sc ? 'selected' : '';
      optionsHtml += `<option value="${escapeHtml(sc)}" ${isSel}>${escapeHtml(sc)}</option>`;
    });

    select.innerHTML = optionsHtml;
  }

  // Compute and update category badge counts
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

    // Top metrics
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

    // Tab badges
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

    Object.entries(tabMap).forEach(([cat, id]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (cat === currentCategory) {
        el.className = 'category-pill active flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-[#1546D9] text-white shadow-sm';
        const badge = el.querySelector('span:last-child');
        if (badge) badge.className = 'px-2 py-0.5 rounded-full text-xs font-mono bg-white/20 text-white';
      } else {
        el.className = 'category-pill flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all';
        const badge = el.querySelector('span:last-child');
        if (badge) badge.className = 'px-2 py-0.5 rounded-full text-xs font-mono bg-slate-200/80 text-slate-700';
      }
    });
  }

  // Extract all tags for current category
  function getAvailableTags() {
    const tags = new Set();
    const filtered = currentCategory === 'All' 
      ? allPrompts 
      : allPrompts.filter(p => p.category === currentCategory);

    filtered.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => tags.add(t.trim()));
      }
    });

    return Array.from(tags).sort();
  }

  // Render tag chips
  function renderTagChips() {
    const container = document.getElementById('tag-chips-container');
    if (!container) return;

    const tags = getAvailableTags();
    if (tags.length === 0) {
      container.innerHTML = '';
      return;
    }

    let html = `
      <button onclick="handleTagClick('All')" class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
        selectedTag === 'All' 
          ? 'bg-slate-800 text-white shadow-xs' 
          : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
      }">
        All Tags
      </button>
    `;

    tags.forEach(tag => {
      const isActive = selectedTag.toLowerCase() === tag.toLowerCase();
      html += `
        <button onclick="handleTagClick('${escapeHtml(tag)}')" class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
          isActive 
            ? 'bg-[#1546D9] text-white shadow-xs font-semibold' 
            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
        }">
          #${escapeHtml(tag)}
        </button>
      `;
    });

    container.innerHTML = html;
  }

  // Filter and sort prompts
  function getFilteredPrompts() {
    return allPrompts.filter(p => {
      // Category filter
      if (currentCategory !== 'All' && p.category !== currentCategory) {
        return false;
      }

      // Subcategory filter
      if (currentSubcategory !== 'All' && p.subcategory !== currentSubcategory) {
        return false;
      }

      // Tool filter
      if (selectedTool !== 'All') {
        const toolLower = (p.targetTool || '').toLowerCase();
        const selLower = selectedTool.toLowerCase();
        if (!toolLower.includes(selLower) && !selLower.includes(toolLower)) {
          return false;
        }
      }

      // Tag filter
      if (selectedTag !== 'All') {
        const hasTag = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
        if (!hasTag) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = (p.title || '').toLowerCase().includes(q);
        const inDesc = (p.description || '').toLowerCase().includes(q);
        const inCat = (p.category || '').toLowerCase().includes(q);
        const inSubcat = (p.subcategory || '').toLowerCase().includes(q);
        const inTool = (p.targetTool || '').toLowerCase().includes(q);
        const inPrompt = (p.prompt || '').toLowerCase().includes(q);
        const inTags = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q));

        if (!inTitle && !inDesc && !inCat && !inSubcat && !inTool && !inPrompt && !inTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '');
      }
      // 'newest' default (respect numeric IDs if present)
      const numA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0;
      const numB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0;
      if (a.category === b.category && numA && numB) {
        return numA - numB;
      }
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });
  }

  // Render cards or list items
  function renderPrompts() {
    const grid = document.getElementById('prompts-grid');
    const emptyState = document.getElementById('empty-state');
    if (!grid) return;

    const filtered = getFilteredPrompts();

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    if (viewMode === 'list') {
      grid.className = 'flex flex-col gap-3';
      grid.innerHTML = filtered.map(p => renderListItem(p)).join('');
    } else {
      grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
      grid.innerHTML = filtered.map(p => renderCard(p)).join('');
    }
  }

  // Get Category visual styling
  function getCategoryStyle(cat) {
    switch (cat) {
      case 'Website':
        return {
          bg: 'bg-blue-50',
          text: 'text-[#1546D9]',
          border: 'border-blue-200',
          dot: 'bg-[#1546D9]'
        };
      case 'Dashboard':
        return {
          bg: 'bg-emerald-50',
          text: 'text-[#059669]',
          border: 'border-emerald-200',
          dot: 'bg-[#059669]'
        };
      case 'Outreach Tool':
        return {
          bg: 'bg-purple-50',
          text: 'text-[#7C3AED]',
          border: 'border-purple-200',
          dot: 'bg-[#7C3AED]'
        };
      case 'Workshop':
        return {
          bg: 'bg-amber-50',
          text: 'text-[#D97706]',
          border: 'border-amber-200',
          dot: 'bg-[#D97706]'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-500'
        };
    }
  }

  // Format prompt preview with variable badges highlighted
  function formatPromptPreview(text, maxChars = 220) {
    if (!text) return '';
    let preview = text.slice(0, maxChars);
    if (text.length > maxChars) preview += '...';

    // Escape HTML first
    let escaped = escapeHtml(preview);

    // Highlight bracket variables [PARAM] and <PARAM> and {{PARAM}}
    escaped = escaped.replace(/\[([^\]]{2,200})\]/g, '<span class="text-amber-300 font-semibold bg-amber-950/40 px-1 rounded">[$1]</span>');
    escaped = escaped.replace(/&lt;([^&>]{2,200})&gt;/g, '<span class="text-amber-300 font-semibold bg-amber-950/40 px-1 rounded">&lt;$1&gt;</span>');
    escaped = escaped.replace(/\{\{([^}]{2,80})\}\}/g, '<span class="text-amber-300 font-semibold bg-amber-950/40 px-1 rounded">{{$1}}</span>');

    return escaped;
  }

  // Render a single Card (Grid view)
  function renderCard(p) {
    const catStyle = getCategoryStyle(p.category);
    const variables = getPromptVariables(p);
    const wordCount = (p.prompt || '').trim().split(/\s+/).filter(Boolean).length;

    const tagsHtml = (p.tags || []).map(t => `
      <span onclick="handleTagClick('${escapeHtml(t)}'); event.stopPropagation();" class="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer">
        #${escapeHtml(t)}
      </span>
    `).join('');

    const varBadge = variables.length > 0 
      ? `<span class="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
           <span>⚡</span> ${variables.length} ${variables.length === 1 ? 'variable' : 'variables'}
         </span>`
      : '';

    return `
      <div class="prompt-card bg-white rounded-2xl border border-slate-200 hover:border-[#1546D9]/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
        
        <div class="p-5 flex-1 flex flex-col">
          <!-- Card Header Badges -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${catStyle.bg} ${catStyle.text} border ${catStyle.border}">
                <span class="w-1.5 h-1.5 rounded-full ${catStyle.dot}"></span>
                ${escapeHtml(p.category)}
              </span>
              ${p.targetTool ? `
                <span class="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  ${escapeHtml(p.targetTool)}
                </span>
              ` : ''}
            </div>
            ${varBadge}
          </div>

          <!-- Title -->
          <h3 onclick="openDetailModal('${escapeHtml(p.id)}')" class="text-base font-bold text-slate-900 group-hover:text-[#1546D9] transition-colors cursor-pointer leading-snug mb-1.5">
            ${escapeHtml(p.title)}
          </h3>

          <!-- Description -->
          <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            ${escapeHtml(p.description || 'No description provided.')}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1 mb-4">
            ${tagsHtml}
          </div>

          <!-- Prompt Box Preview -->
          <div onclick="openDetailModal('${escapeHtml(p.id)}')" class="cursor-pointer relative mt-auto bg-slate-900 text-slate-200 rounded-xl p-3 text-xs font-mono leading-relaxed max-h-32 overflow-hidden border border-slate-800">
            <div class="text-[11px] leading-relaxed">
              ${formatPromptPreview(p.prompt, 180)}
            </div>
            <div class="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div class="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>${wordCount} words</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button onclick="openDetailModal('${escapeHtml(p.id)}')" class="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all">
              ${variables.length > 0 ? 'Fill & Test' : 'View Full'}
            </button>
            <button onclick="copyPromptText('${escapeHtml(p.id)}', this)" class="inline-flex items-center gap-1 px-3 py-1 bg-[#1546D9] hover:bg-[#113BB8] text-white text-xs font-bold rounded-lg transition-all shadow-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <span>Copy</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }

  // Render a single List Item (List view)
  function renderListItem(p) {
    const catStyle = getCategoryStyle(p.category);
    const variables = getPromptVariables(p);

    return `
      <div class="bg-white rounded-xl border border-slate-200 hover:border-[#1546D9]/40 hover:shadow-xs p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group transition-all">
        
        <div class="flex items-start gap-3 min-w-0 flex-1">
          <div class="w-2.5 h-2.5 rounded-full ${catStyle.dot} mt-1.5 flex-shrink-0"></div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="text-xs font-bold ${catStyle.text}">${escapeHtml(p.category)}</span>
              <span class="text-slate-300">•</span>
              <h3 onclick="openDetailModal('${escapeHtml(p.id)}')" class="text-sm font-bold text-slate-900 group-hover:text-[#1546D9] transition-colors cursor-pointer truncate">
                ${escapeHtml(p.title)}
              </h3>
              ${p.targetTool ? `
                <span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                  ${escapeHtml(p.targetTool)}
                </span>
              ` : ''}
              ${variables.length > 0 ? `
                <span class="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  ${variables.length} vars
                </span>
              ` : ''}
            </div>
            <p class="text-xs text-slate-500 line-clamp-1">
              ${escapeHtml(p.description || '')}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button onclick="openDetailModal('${escapeHtml(p.id)}')" class="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            Open
          </button>
          <button onclick="copyPromptText('${escapeHtml(p.id)}', this)" class="inline-flex items-center gap-1 px-3 py-1 bg-[#1546D9] hover:bg-[#113BB8] text-white text-xs font-bold rounded-lg transition-all shadow-xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            <span>Copy</span>
          </button>
        </div>

      </div>
    `;
  }

  // Update footer results count indicator
  function updateResultsCountText() {
    const countEl = document.getElementById('results-count-text');
    const filterInd = document.getElementById('active-filter-indicator');
    if (!countEl) return;

    const filtered = getFilteredPrompts();
    const isFiltered = currentCategory !== 'All' || selectedTag !== 'All' || selectedTool !== 'All' || searchQuery.trim() !== '';

    countEl.textContent = `Showing ${filtered.length} of ${allPrompts.length} prompts`;

    if (filterInd) {
      if (isFiltered) {
        filterInd.classList.remove('hidden');
        filterInd.classList.add('flex');
      } else {
        filterInd.classList.add('hidden');
        filterInd.classList.remove('flex');
      }
    }
  }

  // Filter category handler
  window.filterCategory = function (category) {
    currentCategory = category;
    currentSubcategory = 'All';
    selectedTag = 'All'; // reset tag when changing category
    renderApp();
  };

  // Subcategory filter handler
  window.handleSubcategoryFilter = function (subcat) {
    currentSubcategory = subcat;
    renderPrompts();
    updateResultsCountText();
  };

  // Search input handler
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

  // Clear search input
  window.clearSearch = function () {
    const input = document.getElementById('search-input');
    if (input) {
      input.value = '';
      handleSearch('');
      input.focus();
    }
  };

  // Tag click handler
  window.handleTagClick = function (tag) {
    selectedTag = tag;
    renderTagChips();
    renderPrompts();
    updateResultsCountText();
  };

  // Tool filter handler
  window.handleToolFilter = function (tool) {
    selectedTool = tool;
    renderPrompts();
    updateResultsCountText();
  };

  // Sort handler
  window.handleSort = function (sort) {
    sortBy = sort;
    renderPrompts();
  };

  // View mode handler
  window.setViewMode = function (mode) {
    viewMode = mode;
    try {
      localStorage.setItem(STORAGE_KEY_VIEW, mode);
    } catch (e) {}

    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');

    if (gridBtn && listBtn) {
      if (mode === 'grid') {
        gridBtn.className = 'p-1.5 rounded-md text-slate-700 bg-white shadow-xs';
        listBtn.className = 'p-1.5 rounded-md text-slate-500 hover:text-slate-800';
      } else {
        listBtn.className = 'p-1.5 rounded-md text-slate-700 bg-white shadow-xs';
        gridBtn.className = 'p-1.5 rounded-md text-slate-500 hover:text-slate-800';
      }
    }

    renderPrompts();
  };

  // Reset all filters
  window.resetAllFilters = function () {
    currentCategory = 'All';
    currentSubcategory = 'All';
    searchQuery = '';
    selectedTag = 'All';
    selectedTool = 'All';
    sortBy = 'newest';

    const sInput = document.getElementById('search-input');
    if (sInput) sInput.value = '';
    const tSelect = document.getElementById('filter-tool');
    if (tSelect) tSelect.value = 'All';
    const subcatSelect = document.getElementById('filter-subcategory');
    if (subcatSelect) subcatSelect.value = 'All';
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'newest';

    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) clearBtn.classList.add('hidden');

    renderApp();
  };

  // Copy raw prompt text from card
  window.copyPromptText = function (id, btnEl) {
    const promptObj = allPrompts.find(p => p.id === id);
    if (!promptObj) return;

    copyToClipboard(promptObj.prompt);

    if (btnEl) {
      const originalHtml = btnEl.innerHTML;
      btnEl.innerHTML = `
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        <span>Copied!</span>
      `;
      btnEl.classList.remove('bg-[#1546D9]');
      btnEl.classList.add('bg-emerald-600');

      setTimeout(() => {
        btnEl.innerHTML = originalHtml;
        btnEl.classList.add('bg-[#1546D9]');
        btnEl.classList.remove('bg-emerald-600');
      }, 1800);
    }

    showToast('Prompt copied to clipboard!');
  };

  // Open Detail / Variable Filler Modal
  window.openDetailModal = function (id) {
    const p = allPrompts.find(item => item.id === id);
    if (!p) return;

    activeModalPrompt = p;
    activeModalVariables = {};

    const modal = document.getElementById('detail-modal');
    const titleEl = document.getElementById('modal-title');
    const catBadge = document.getElementById('modal-category-badge');
    const toolBadge = document.getElementById('modal-tool-badge');
    const subcatEl = document.getElementById('modal-subcategory');
    const descEl = document.getElementById('modal-description');
    const tagsContainer = document.getElementById('modal-tags-container');
    const varsSection = document.getElementById('modal-variables-section');
    const varsInputs = document.getElementById('modal-variable-inputs');
    const idEl = document.getElementById('modal-id-text');

    if (titleEl) titleEl.textContent = p.title;
    if (descEl) descEl.textContent = p.description || 'No description provided.';
    if (subcatEl) subcatEl.textContent = p.subcategory || '';
    if (idEl) idEl.textContent = `ID: ${p.id} • Target: ${p.targetTool || 'General'}`;

    // Category Badge
    const catStyle = getCategoryStyle(p.category);
    if (catBadge) {
      catBadge.className = `px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${catStyle.bg} ${catStyle.text} border ${catStyle.border}`;
      catBadge.textContent = p.category;
    }

    if (toolBadge) {
      toolBadge.textContent = p.targetTool || 'General';
    }

    // Tags
    if (tagsContainer) {
      tagsContainer.innerHTML = (p.tags || []).map(t => `
        <span class="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">#${escapeHtml(t)}</span>
      `).join('');
    }

    // Variable inputs
    const variables = getPromptVariables(p);
    if (varsSection && varsInputs) {
      if (variables.length > 0) {
        varsSection.classList.remove('hidden');
        varsInputs.innerHTML = variables.map(v => `
          <div>
            <label class="block text-[11px] font-mono font-bold text-slate-700 mb-1">${escapeHtml(v)}</label>
            <input 
              type="text" 
              placeholder="e.g. value for ${escapeHtml(v)}..." 
              data-var="${escapeHtml(v)}" 
              oninput="handleVariableInput('${escapeHtml(v)}', this.value)"
              class="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2 focus:border-[#1546D9] focus:ring-1 focus:ring-[#1546D9] outline-none"
            />
          </div>
        `).join('');
      } else {
        varsSection.classList.add('hidden');
        varsInputs.innerHTML = '';
      }
    }

    updateModalPromptPreview();
    if (modal) modal.classList.remove('hidden');
  };

  // Handle variable input change
  window.handleVariableInput = function (varName, val) {
    activeModalVariables[varName] = val;
    updateModalPromptPreview();
  };

  // Update the preview inside the detail modal
  function updateModalPromptPreview() {
    if (!activeModalPrompt) return;

    let text = activeModalPrompt.prompt || '';
    const statsEl = document.getElementById('modal-prompt-stats');
    const promptPre = document.getElementById('modal-prompt-text');

    // Replace filled variables safely (supporting multiline whitespace)
    Object.entries(activeModalVariables).forEach(([key, val]) => {
      if (val && val.trim()) {
        const safeKeyPattern = escapeRegExp(key).replace(/\s+/g, '[\\s\\n]+');
        const reg1 = new RegExp('\\[' + safeKeyPattern + '\\]', 'g');
        const reg2 = new RegExp('<' + safeKeyPattern + '>', 'g');
        const reg3 = new RegExp('\\{\\{' + safeKeyPattern + '\\}\\}', 'g');
        text = text.replace(reg1, val.trim());
        text = text.replace(reg2, val.trim());
        text = text.replace(reg3, val.trim());
      }
    });

    if (promptPre) promptPre.textContent = text;

    if (statsEl) {
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const chars = text.length;
      statsEl.textContent = `${words} words • ${chars} chars`;
    }
  }

  // Copy prompt from detail modal
  window.copyModalPrompt = function () {
    const promptPre = document.getElementById('modal-prompt-text');
    if (!promptPre) return;

    copyToClipboard(promptPre.textContent);

    const btn = document.getElementById('modal-copy-btn');
    const textEl = document.getElementById('modal-copy-text');
    if (btn && textEl) {
      const origText = textEl.textContent;
      textEl.textContent = 'Copied!';
      btn.classList.remove('bg-[#1546D9]');
      btn.classList.add('bg-emerald-600');

      setTimeout(() => {
        textEl.textContent = origText;
        btn.classList.add('bg-[#1546D9]');
        btn.classList.remove('bg-emerald-600');
      }, 1800);
    }

    showToast('Customized prompt copied to clipboard!');
  };

  // Close detail modal
  window.closeDetailModal = function () {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('hidden');
    activeModalPrompt = null;
    activeModalVariables = {};
  };

  // Open Add Prompt Modal
  window.openAddModal = function () {
    const modal = document.getElementById('add-modal');
    if (modal) {
      modal.classList.remove('hidden');
      const titleInput = document.getElementById('new-title');
      if (titleInput) titleInput.focus();
    }
  };

  // Close Add Prompt Modal
  window.closeAddModal = function () {
    const modal = document.getElementById('add-modal');
    if (modal) modal.classList.add('hidden');
    const form = document.getElementById('add-prompt-form');
    if (form) form.reset();
  };

  // Submit New Prompt
  window.submitNewPrompt = function (event) {
    event.preventDefault();

    const cat = document.getElementById('new-category').value;
    const tool = document.getElementById('new-tool').value;
    const title = document.getElementById('new-title').value.trim();
    const subcat = document.getElementById('new-subcategory').value.trim();
    const rawTags = document.getElementById('new-tags').value.trim();
    const desc = document.getElementById('new-description').value.trim();
    const promptText = document.getElementById('new-prompt').value.trim();

    if (!title || !promptText) return;

    const tags = rawTags 
      ? rawTags.split(',').map(t => t.trim()).filter(Boolean)
      : [cat];

    const newId = `${cat.toLowerCase().slice(0, 3)}-custom-${Date.now().toString().slice(-6)}`;
    const variables = extractVariables(promptText);

    const newPrompt = {
      id: newId,
      title: title,
      category: cat,
      subcategory: subcat || 'General',
      tags: tags,
      targetTool: tool,
      description: desc,
      prompt: promptText,
      variables: variables,
      author: 'User',
      isCustom: true,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    allPrompts.unshift(newPrompt);
    saveCustomPrompts();
    closeAddModal();
    renderApp();
    showToast(`Added "${title}" to Prompt Library!`);

    // Switch to category of added prompt
    filterCategory(cat);
  };

  // Open Export Modal
  window.openExportModal = function () {
    const modal = document.getElementById('export-modal');
    const area = document.getElementById('export-json-area');
    if (area) {
      area.value = JSON.stringify(allPrompts, null, 2);
    }
    if (modal) modal.classList.remove('hidden');
  };

  // Close Export Modal
  window.closeExportModal = function () {
    const modal = document.getElementById('export-modal');
    if (modal) modal.classList.add('hidden');
  };

  // Copy exported JSON
  window.copyExportJson = function () {
    const area = document.getElementById('export-json-area');
    if (!area) return;

    copyToClipboard(area.value);

    const btn = document.getElementById('export-copy-btn');
    const textEl = document.getElementById('export-copy-text');
    if (btn && textEl) {
      textEl.textContent = 'Copied JSON!';
      btn.classList.add('bg-emerald-600');
      btn.classList.remove('bg-[#1546D9]');
      setTimeout(() => {
        textEl.textContent = 'Copy to Clipboard';
        btn.classList.remove('bg-emerald-600');
        btn.classList.add('bg-[#1546D9]');
      }, 1800);
    }
    showToast('Full prompt database copied to clipboard!');
  };

  // Download prompts.json file
  window.downloadJsonFile = function () {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allPrompts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'prompts.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded prompts.json');
  };

  // Copy to clipboard helper
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy error:', err);
      }
      document.body.removeChild(textarea);
    }
  }

  // Toast notification
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;

    msgEl.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2500);
  }

  // Global Keyboard Shortcuts
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // ⌘K or Ctrl+K or / to focus search
      if ((e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape key closes modals
      if (e.key === 'Escape') {
        closeDetailModal();
        closeAddModal();
        closeExportModal();
      }
    });
  }

  // Utility to escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
