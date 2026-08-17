/**
 * views/integrations.js — Integration Health & Autonomous Operations
 *
 * TRUST Revenue Command Center
 *
 * Princípio:
 * "External integrations accelerate the Command Center, but never determine whether it can operate."
 */

import { store } from '../state/StateManager.js';

export function renderIntegrations() {
  const state = store.getState();
  const { platformConfig, integrationHealth, tasks } = state;

  const internalCount = tasks.filter(t => t.source === 'INTERNAL' || !t.source).length;
  const externalCount = tasks.filter(t => t.source && t.source !== 'INTERNAL' && t.source !== 'DEMO_SEED').length;
  const demoCount = tasks.filter(t => t.source === 'DEMO_SEED').length;

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Governança, Backup & Integrações</div>
        <h1 class="page-header__title">Fontes, Autonomia & Backup de Dados</h1>
        <p class="page-header__subtitle">
          Operação 100% autônoma e ferramentas de snapshot com segurança de dados (Zero Data Loss).
        </p>
      </div>
      <div class="flex gap-2">
        <button class="btn-subtle" onclick="exportFullDataSnapshot()">
          💾 Exportar Snapshot Completo (.JSON)
        </button>
        <button class="btn-prime" onclick="document.getElementById('import-snapshot-input').click()">
          📥 Restaurar Snapshot
        </button>
        <input type="file" id="import-snapshot-input" style="display:none;" accept=".json" onchange="importFullDataSnapshot(event)" />
      </div>
    </div>
      <div class="flex gap-2">
        <button class="solution-tab ${platformConfig?.mode === 'AUTONOMOUS' ? 'active' : ''}"
                onclick="store.setMode('AUTONOMOUS')">
          Modo Autônomo (Prod)
        </button>
        <button class="solution-tab ${platformConfig?.mode === 'DEMO' ? 'active' : ''}"
                onclick="store.setMode('DEMO')">
          Modo Demo (Seed)
        </button>
      </div>
    </div>

    <!-- STATUS DO MODO & DIAGNÓSTICO DE BANCO (FASE 6B) -->
    <div class="section">
      <div class="grid-3" style="gap: var(--sp-4);">
        <div class="metric-card">
          <div class="metric-card__accent" style="background: ${store._adapter?.getDiagnosticInfo?.()?.state === 'CLOUD' ? 'var(--clr-success)' : store._adapter?.getDiagnosticInfo?.()?.state === 'CLOUD_ERROR' ? 'var(--clr-danger)' : 'var(--clr-brand-primary)'};"></div>
          <div class="metric-card__eyebrow">Diagnóstico de Persistência</div>
          <div class="metric-card__value" style="font-size: var(--fs-xl);">
            ${store._adapter?.getDiagnosticInfo?.()?.state || 'LOCAL'}
          </div>
          <div class="metric-card__label">
            ${store._adapter?.getDiagnosticInfo?.()?.state === 'CLOUD' ? '🟢 Conectado ao Supabase (PostgreSQL)' : store._adapter?.getDiagnosticInfo?.()?.state === 'CLOUD_ERROR' ? '🔴 Erro de Nuvem (Trava de Escrita Ativa)' : '🔵 Modo Local (localStorage DEV)'}
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-card__accent" style="background: var(--clr-success);"></div>
          <div class="metric-card__eyebrow">Registros Internos</div>
          <div class="metric-card__value">${internalCount}</div>
          <div class="metric-card__label">Gerenciados diretamente na Torre</div>
        </div>
        <div class="metric-card">
          <div class="metric-card__accent" style="background: var(--clr-info);"></div>
          <div class="metric-card__eyebrow">Fontes Conectadas</div>
          <div class="metric-card__value">0<span>/3</span></div>
          <div class="metric-card__label">ClickUp, RD e Apollo em Standalone</div>
        </div>
      </div>
    </div>

    <!-- TABELA DE INTEGRAÇÕES -->
    <div class="section">
      <div class="section__header">
        <div>
          <div class="section__title">Status dos Conectores (Data Sources)</div>
          <div class="section__subtitle">Conectores opcionais. Nenhuma ausência bloqueia o sistema.</div>
        </div>
      </div>
      <div class="card">
        <div class="card__body" style="padding: 0;">
          ${integrationHealth.map(int => `
            <div class="task-item" style="padding: var(--sp-4) var(--sp-6);">
              <div style="width: 32px; height: 32px; border-radius: var(--radius-md); background: var(--clr-bg-elevated); display: flex; align-items: center; justify-content: center; font-size: var(--fs-md); flex-shrink: 0;">
                ${int.id === 'int-clickup' ? '⚡' : int.id === 'int-rd-crm' ? '📊' : int.id === 'int-apollo' ? '🎯' : '📥'}
              </div>
              <div class="task-item__content">
                <div class="flex items-center gap-3">
                  <span class="fw-semibold text-primary">${int.name}</span>
                  <span class="badge ${int.status === 'READY' ? 'badge--on-track' : 'badge--neutral'}">${int.status}</span>
                  ${int.isOptional ? '<span class="text-xs text-muted">(Opcional)</span>' : ''}
                </div>
                <div class="text-xs text-muted mt-1">${int.type} · ${int.message}</div>
              </div>
              <div class="text-xs font-mono text-muted">
                ${int.lastSyncedAt ? `Último sync: ${new Date(int.lastSyncedAt).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}` : 'Sem sincronização ativa'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- CARGA DE DADOS CSV / MANUAL -->
    <div class="section">
      <div class="section__header">
        <div>
          <div class="section__title">Carga Manual & Importação CSV</div>
          <div class="section__subtitle">Importe dados brutos diretamente para o Modelo Canônico da TRUST.</div>
        </div>
      </div>
      <div class="card">
        <div class="card__body">
          <div class="grid-2" style="gap: var(--sp-6);">
            <div>
              <div class="fw-semibold text-primary mb-2">Importar Tarefas via CSV / JSON</div>
              <p class="text-xs text-muted mb-4" style="line-height: var(--lh-relaxed);">
                Cole abaixo um array JSON ou linhas CSV contendo tarefas. Os dados serão normalizados pela <code>DataIngestionLayer</code> e salvos no storage autônomo.
              </p>
              <textarea id="import-data-input" class="filter-select" style="width: 100%; height: 120px; font-family: var(--font-mono); font-size: var(--fs-xs); resize: vertical; padding: var(--sp-3);" placeholder='[{"code": "F1-08", "title": "Nova Tarefa Importada", "workstreamId": "ws-1", "owner": "Comercial", "status": "TODO"}]'></textarea>
              <button class="solution-tab active mt-3" style="background: var(--clr-brand-primary); color: white;" onclick="handleDataImport()">
                Processar Ingestão de Dados
              </button>
            </div>

            <div style="background: var(--clr-bg-elevated); border: 1px solid var(--clr-border-subtle); border-radius: var(--radius-md); padding: var(--sp-4);">
              <div class="fw-semibold text-primary mb-2">Exportação do Modelo Canônico</div>
              <p class="text-xs text-muted mb-4" style="line-height: var(--lh-relaxed);">
                Faça backup ou exporte os dados canônicos locais para auditoria ou uso em planilhas externas.
              </p>
              <div class="flex gap-2">
                <button class="solution-tab" onclick="exportData('tasks')">Exportar Tarefas (JSON)</button>
                <button class="solution-tab" onclick="exportData('all')">Exportar Backup Completo</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Expor handlers no window para interação direta na UI
window.handleDataImport = async function() {
  const inputEl = document.getElementById('import-data-input');
  if (!inputEl || !inputEl.value.trim()) return alert('Insira dados para importação.');
  try {
    const parsed = JSON.parse(inputEl.value.trim());
    if (Array.isArray(parsed)) {
      await store.importCSVTasks(parsed);
      alert(`${parsed.length} registro(s) normalizados e importados com sucesso!`);
      inputEl.value = '';
    } else {
      alert('O formato deve ser um array JSON de objetos.');
    }
  } catch (err) {
    alert('Erro ao interpretar JSON: ' + err.message);
  }
};

window.exportData = function(type) {
  const state = store.getState();
  const data = type === 'tasks' ? state.tasks : state;
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", jsonStr);
  downloadAnchor.setAttribute("download", `trust_rcc_${type}_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

window.exportFullDataSnapshot = function() {
  const backup = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('trust_rcc_')) {
      backup[key] = localStorage.getItem(key);
    }
  }
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const link = document.createElement('a');
  link.setAttribute("href", jsonStr);
  link.setAttribute("download", `TRUST_COMMAND_CENTER_SNAPSHOT_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

window.importFullDataSnapshot = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(k => {
        localStorage.setItem(k, data[k]);
      });
      alert('Snapshot restaurado com sucesso! Recarregando sistema...');
      location.reload();
    } catch (err) {
      alert('Arquivo de snapshot inválido: ' + err.message);
    }
  };
  reader.readAsText(file);
};
