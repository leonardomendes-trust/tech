/**
 * views/copilot.js — TRUST AI Copilot & Decision Intelligence (Estrutura com Sub-Abas sem Scroll)
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';
import { ruleEngine } from '../engine/RuleEngine.js';

export function renderCopilot() {
  const state = store.getState();
  const activeTab = state.selectedIntelligenceTab || 'SIMULATOR'; // 'SIMULATOR' | 'DIAGNOSTICS' | 'BASELINE'
  const ruleInsights = ruleEngine.generateInsights(state);
  const { kpis, baselineD0, decisions } = state;
  const pendingDecisions = decisions.filter(d => d.status === 'PENDING');

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">TRUST Intelligence & Decision Layer</div>
        <h1 class="page-header__title">Inteligência Operacional & Análise de Impacto</h1>
        <p class="page-header__subtitle">
          Diagnósticos determinísticos de causa raiz, simulador de dependências e evolução versus Baseline D0.
        </p>
      </div>
      <div class="stat-item" style="padding: 4px 12px; background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-md);">
        <span class="stat-item__label text-brand">MOTOR AUDITÁVEL</span>
        <span class="stat-item__value text-brand" style="font-size: var(--fs-sm);">RuleEngine v3.0</span>
      </div>
    </div>

    <!-- SELETOR DE SUB-ABAS (ELIMINA SCROLL EXCESSIVO) -->
    <div class="op-tabs-wrap mb-6">
      <div class="op-tabs">
        <button class="op-tab-btn ${activeTab === 'SIMULATOR' ? 'active' : ''}" onclick="selectIntelligenceTab('SIMULATOR')">
          ⚡ Simulador de Impacto (${pendingDecisions.length} decisões)
        </button>
        <button class="op-tab-btn ${activeTab === 'DIAGNOSTICS' ? 'active' : ''}" onclick="selectIntelligenceTab('DIAGNOSTICS')">
          🔍 Diagnósticos de Causa Raiz (${ruleInsights.length})
        </button>
        <button class="op-tab-btn ${activeTab === 'BASELINE' ? 'active' : ''}" onclick="selectIntelligenceTab('BASELINE')">
          📸 Baseline D0 × Realidade
        </button>
      </div>
    </div>

    <!-- CONTEÚDO DINÂMICO DA ABA ATIVA -->
    ${activeTab === 'SIMULATOR' ? renderSimulatorTab(pendingDecisions, state) : activeTab === 'DIAGNOSTICS' ? renderDiagnosticsTab(ruleInsights) : renderBaselineTab(baselineD0)}
  `;
}

function renderSimulatorTab(pendingDecisions, state) {
  return `
    <div class="grid-2" style="gap: var(--sp-5);">
      ${pendingDecisions.length === 0 ? `
        <div class="card-panel" style="grid-column: 1 / -1; padding: var(--sp-8); text-align: center;">
          <div class="text-xs text-muted">Nenhuma decisão pendente no momento. Todas as frentes operando livres de bloqueios institucionais.</div>
        </div>
      ` : pendingDecisions.map(d => {
        const impactAnalysis = ruleEngine.analyzeDecisionImpact(d.id, state);
        return `
          <div class="card-panel" style="margin-bottom: 0; border-left: 3px solid var(--clr-brand);">
            <div class="card-panel__header">
              <div class="flex items-center gap-2">
                <span class="badge ${d.priorityTag === 'P0' ? 'badge--critical' : 'badge--high'} text-xs">${d.priorityTag || 'P0'}</span>
                <span class="text-xs font-mono text-muted">${d.code}</span>
                <span class="text-sm fw-bold text-primary">${d.title}</span>
              </div>
            </div>
            <div class="card-panel__body">
              <div class="text-xs text-muted mb-2"><strong>Frentes Afetadas:</strong> ${impactAnalysis?.blockedWorkstreams.join(', ') || 'N/A'}</div>
              
              <div class="text-xs text-secondary mb-1 fw-semibold">TAREFAS DIRETAMENTE DESBLOQUEADAS:</div>
              <ul class="text-xs text-primary mb-3" style="padding-left: var(--sp-4);">
                ${impactAnalysis?.directTasksUnlocked.map(t => `<li><strong>${t.code}:</strong> ${t.title} (${t.owner})</li>`).join('') || '<li>Nenhuma tarefa direta</li>'}
              </ul>

              <div class="p-3 mb-3" style="background: var(--clr-success-bg); border: 1px solid var(--clr-success-border); border-radius: var(--radius-sm);">
                <div class="text-2xs text-success fw-bold">GANHO DE VELOCIDADE ESTIMADO:</div>
                <div class="text-xs text-primary fw-medium">${impactAnalysis?.estimatedVelocityGain}</div>
              </div>

              <button class="btn-prime" style="width: 100%; justify-content: center;" onclick="openDecisionModal('${d.id}', '${d.code}', '${d.title.replace(/'/g, "\\'")}')">
                Registrar Deliberação na Mesa →
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderDiagnosticsTab(ruleInsights) {
  return `
    <div class="flex flex-col gap-3">
      ${ruleInsights.map(insight => `
        <div class="card-panel" style="margin-bottom: 0; border-left: 3px solid ${insight.impact === 'CRITICAL' ? 'var(--clr-danger)' : 'var(--clr-brand)'};">
          <div class="card-panel__header">
            <div class="flex items-center gap-2">
              <span class="badge ${insight.type === 'ROOT_CAUSE' ? 'badge--critical' : 'badge--on-track'} text-xs">${insight.type}</span>
              <span class="text-sm fw-bold text-primary">${insight.title}</span>
            </div>
            <span class="text-xs text-muted font-mono">${insight.deadline}</span>
          </div>
          <div class="card-panel__body">
            <div class="text-xs text-secondary mb-2">${insight.rationale}</div>
            <div class="p-2 text-xs text-brand fw-semibold" style="background: var(--clr-brand-subtle); border-radius: var(--radius-sm);">
              <strong>💡 Ação Recomendada:</strong> ${insight.suggestedAction}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderBaselineTab(baselineD0) {
  return `
    <div class="grid-3" style="gap: var(--sp-4);">
      ${(baselineD0?.items || []).map(item => `
        <div class="card-panel" style="margin-bottom: 0;">
          <div class="card-panel__header">
            <span class="text-xs font-mono text-muted">${item.area}</span>
            <span class="badge badge--neutral text-xs">${item.label}</span>
          </div>
          <div class="card-panel__body">
            <div class="text-lg fw-bold text-primary font-mono mb-1">
              ${item.unit === '%' ? `${item.value}%` : item.unit === null ? (item.value ? 'Ativo' : 'Inativo') : `${item.value} ${item.unit}`}
            </div>
            <div class="text-xs text-muted">${item.note}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.selectIntelligenceTab = function(tab) {
  store._setState({ selectedIntelligenceTab: tab });
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderCopilot();
};
