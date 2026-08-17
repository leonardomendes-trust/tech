/**
 * app.js — Shell e Inicialização (Design System 2.0 / Premium Enterprise)
 *
 * TRUST Revenue Command Center
 */

import { store } from './state/StateManager.js';
import { renderOverview }   from './views/overview.js';
import { renderWorkstreams }from './views/workstreams.js';
import { renderRisks, renderDecisions } from './views/risks-decisions.js';
import { renderStrategy }   from './views/strategy.js';
import { renderGantt }      from './views/gantt.js';
import { renderKPICockpit } from './views/kpi-cockpit.js';
import { renderForecastEngine } from './views/forecast-engine.js';
import { renderWarRoom }    from './views/war-room.js';
import { renderCopilot }    from './views/copilot.js';
import { renderIntegrations } from './views/integrations.js';
import { renderActivityLog } from './views/activity-log.js';
import { renderGuide }       from './views/guide.js';
import { renderProfile }     from './views/profile.js';
import { drawer } from './ui/DrawerManager.js';
import './ui/Modals.js';

// ============================================================
// NAV CONFIG (MENU LATERAL LIMPO & ESSENCIAL)
// ============================================================
const NAV = [
  {
    section: 'OPERAÇÕES',
    items: [
      { id: 'overview',     label: 'Cockpit HOJE',         icon: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>`, badge: null },
      { id: 'workstreams',  label: 'Frentes & Tarefas',    icon: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 4h14M1 8h10M1 12h6"/></svg>`, badge: null },
      { id: 'gantt',        label: 'Gantt Operacional',    icon: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 3h7M5 7h8M2 11h9M3 1v14"/></svg>`, badge: null },
      { id: 'kpis',         label: 'RevOps Funil & Metas', icon: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 14h12M4 10l3-3 3 3 4-4"/></svg>`, badge: null },
      { id: 'decisions',    label: 'Decision Center & Riscos', icon: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="7"/><path d="M8 5v4M8 11v1"/></svg>`, badge: 'decisions' },
    ],
  },
  {
    section: 'ESTRATÉGIA & AUDITORIA',
    items: [
      { id: 'strategy',     label: 'ICPs · Evidências · POPs', icon: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="5" r="3"/><path d="M1 14c0-3.866 3.134-7 7-7s7 3.134 7 7"/></svg>`, badge: null },
      { id: 'copilot',      label: 'TRUST Intelligence',   icon: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="7"/><path d="M5 8h6M8 5v6"/></svg>`, badge: null },
      { id: 'activity-log', label: 'Memória Operacional',  icon: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h12v10H2zM5 6h6M5 9h4"/></svg>`, badge: null },
    ],
  },
];

const RENDERERS = {
  overview:     renderOverview,
  'war-room':   renderWarRoom,
  workstreams:  renderWorkstreams,
  gantt:        renderGantt,
  kpis:         renderKPICockpit,
  forecast:     renderForecastEngine,
  risks:        renderRisks,
  decisions:    renderDecisions,
  strategy:     renderStrategy,
  copilot:      renderCopilot,
  guide:        renderGuide,
  profile:      renderProfile,
  integrations: renderIntegrations,
  'activity-log': renderActivityLog,
};

function renderShell(state) {
  const config = state.platformConfig;
  const dayInfo = store.getCurrentDayInfo();
  const currentTheme = document.body.getAttribute('data-theme') || 'dark';

  return `
    <header class="topbar">
      <div class="topbar__brand">
        <div class="topbar__logo">T</div>
        <div class="topbar__title">
          Revenue Command Center
          <span>TRUST Holding · Sistema Operacional</span>
        </div>
      </div>

      <div class="topbar__center">
        <!-- Time-Travel Simulator Control -->
        <div class="topbar__pill">
          <span>Ciclo:</span>
          <select id="time-travel-select" class="filter-select" style="padding: 2px 6px; font-size: 11px; height: 24px; font-family: var(--font-mono); border: none; background: transparent; font-weight: bold; color: var(--clr-brand);" onchange="changeTimeTravelDay(this.value)">
            <option value="REAL" ${!dayInfo.isSimulated ? 'selected' : ''}>Tempo Real (${dayInfo.dayLabel})</option>
            <option value="1" ${dayInfo.currentDay === 1 && dayInfo.isSimulated ? 'selected' : ''}>D01 · Kickoff</option>
            <option value="5" ${dayInfo.currentDay === 5 && dayInfo.isSimulated ? 'selected' : ''}>D05 · S1 Encerramento</option>
            <option value="10" ${dayInfo.currentDay === 10 && dayInfo.isSimulated ? 'selected' : ''}>D10 · S2 Aquisição</option>
            <option value="15" ${dayInfo.currentDay === 15 && dayInfo.isSimulated ? 'selected' : ''}>D15 · Mid-Point</option>
            <option value="20" ${dayInfo.currentDay === 20 && dayInfo.isSimulated ? 'selected' : ''}>D20 · Tração</option>
            <option value="30" ${dayInfo.currentDay === 30 && dayInfo.isSimulated ? 'selected' : ''}>D30 · Go-Live Pleno</option>
          </select>
        </div>
        <div class="topbar__pill">
          <span class="badge badge--on-track">Operação independente</span>
        </div>
      </div>

      <div class="topbar__actions">
        <!-- Menu Superior à Direita (Perfil, Tema e Governança) -->
        <div class="user-menu-wrap">
          <button class="user-avatar-btn" onclick="toggleUserMenu()">
            <div class="user-avatar-circle">LO</div>
            <span>Leonardo</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6l4 4 4-4"/></svg>
          </button>

          <div class="user-dropdown-menu" id="user-dropdown-menu">
            <div class="px-3 py-2 text-2xs text-muted fw-semibold uppercase" style="border-bottom: 1px solid var(--border-subtle); margin-bottom: 4px;">
              Governança & Sistema
            </div>
            <button class="user-dropdown-item" onclick="navigateToFromMenu('profile')">
              👤 Perfil do Operador
            </button>
            <button class="user-dropdown-item" onclick="navigateToFromMenu('guide')">
              📖 Guia Operacional
            </button>
            <button class="user-dropdown-item" onclick="navigateToFromMenu('integrations')">
              ⚙️ Fontes & Autonomia
            </button>

            <div class="user-dropdown-divider"></div>
            
            <div class="px-3 py-2 flex justify-between items-center text-xs">
              <span class="text-muted">Aparência:</span>
              <div class="theme-switch">
                <button class="theme-btn ${currentTheme === 'dark' ? 'active' : ''}" onclick="setTheme('dark'); event.stopPropagation();">Dark</button>
                <button class="theme-btn ${currentTheme === 'light' ? 'active' : ''}" onclick="setTheme('light'); event.stopPropagation();">Light</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="app-shell">
      <nav class="sidebar" id="sidebar">
        ${NAV.map(group => `
          <div class="nav-group-label">${group.section}</div>
          ${group.items.map(item => {
            const badgeCount = getBadgeCount(item.badge, state);
            return `
              <button class="nav-link ${state.activePage === item.id ? 'active' : ''}"
                      data-page="${item.id}"
                      onclick="navigateTo('${item.id}')">
                <span>${item.icon}</span>
                <span class="nav-text">${item.label}</span>
                ${badgeCount > 0 ? `<span class="nav-badge">${badgeCount}</span>` : ''}
              </button>
            `;
          }).join('')}
        `).join('')}
      </nav>

      <main class="main-viewport" id="main-viewport">
        <div class="content-container" id="page-container">
          ${renderPage(state.activePage, state)}
        </div>
      </main>
    </div>

    <!-- Unified Detail Drawer Container -->
    <div id="drawer-container"></div>
  `;
}

function getBadgeCount(badgeKey, state) {
  if (!badgeKey) return 0;
  if (badgeKey === 'decisions') return state.decisions?.filter(d => d.status === 'PENDING').length || 0;
  if (badgeKey === 'risks') return state.risks?.filter(r => r.severity === 'CRITICAL' && r.status === 'OPEN').length || 0;
  return 0;
}

function renderPage(pageId, state) {
  const renderer = RENDERERS[pageId];
  if (!renderer) return `<div>Módulo em construção</div>`;
  return renderer();
}

window.navigateTo = function(pageId) {
  drawer.close();
  store.navigateTo(pageId);
  const pageContainer = document.getElementById('page-container');
  if (pageContainer) {
    pageContainer.innerHTML = renderPage(pageId, store.getState());
    const viewport = document.getElementById('main-viewport');
    if (viewport) viewport.scrollTop = 0;
    document.querySelectorAll('.nav-link').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageId);
    });
  }
};

window.changeTimeTravelDay = function(value) {
  store.setSimulatedDay(value);
  const pageContainer = document.getElementById('page-container');
  if (pageContainer) {
    pageContainer.innerHTML = renderPage(store.getState().activePage, store.getState());
  }
  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.innerHTML = renderShell(store.getState());
  }
};

window.toggleUserMenu = function(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) menu.classList.toggle('active');
};

window.navigateToFromMenu = function(pageId) {
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) menu.classList.remove('active');
  window.navigateTo(pageId);
};

document.addEventListener('click', (e) => {
  const wrap = document.querySelector('.user-menu-wrap');
  const menu = document.getElementById('user-dropdown-menu');
  if (menu && wrap && !wrap.contains(e.target)) {
    menu.classList.remove('active');
  }
});

window.store = store;

window.setTheme = function(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('trust_rcc_theme', theme);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === theme);
  });
};

function mount() {
  store.subscribe('activePage', (state) => {
    const pageContainer = document.getElementById('page-container');
    if (pageContainer) {
      pageContainer.innerHTML = renderPage(state.activePage, state);
      const viewport = document.getElementById('main-viewport');
      if (viewport) viewport.scrollTop = 0;
      document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.toggle('active', el.dataset.page === state.activePage);
      });
    }
  });

  store.subscribe('selectedWorkstreamId', (state) => {
    if (state.activePage === 'workstreams') {
      const pageContainer = document.getElementById('page-container');
      if (pageContainer) pageContainer.innerHTML = renderPage('workstreams', state);
    }
  });

  store.subscribe('selectedICPSolution', (state) => {
    if (state.activePage === 'strategy') {
      const pageContainer = document.getElementById('page-container');
      if (pageContainer) pageContainer.innerHTML = renderPage('strategy', state);
    }
  });

  store.subscribe('selectedBCSolution', (state) => {
    if (state.activePage === 'strategy') {
      const pageContainer = document.getElementById('page-container');
      if (pageContainer) pageContainer.innerHTML = renderPage('strategy', state);
    }
  });

  store.subscribe('filters', (state) => {
    if (state.activePage === 'activity-log') {
      const pageContainer = document.getElementById('page-container');
      if (pageContainer) pageContainer.innerHTML = renderPage('activity-log', state);
    }
  });
}

async function boot() {
  try {
    const savedTheme = localStorage.getItem('trust_rcc_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    // Inicializar Sessão de Autenticação (Fase 7A)
    await auth.init();

    await store.init();
    mount();
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = renderShell(store.getState());
    }
  } catch (err) {
    console.error('[App] Erro crítico na inicialização:', err);
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = `
        <div style="padding: 40px; text-align: center; font-family: sans-serif;">
          <h2 style="color: #ef4444;">Erro de Inicialização</h2>
          <p style="color: #888; font-size: 14px;">${err.message}</p>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', boot);
