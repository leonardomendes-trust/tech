/**
 * views/risks-decisions.js — Decision Center & Matriz de Riscos Integrada com Sub-Abas
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';
import { drawer } from '../ui/DrawerManager.js';
import { auth } from '../auth/AuthManager.js';

export function renderDecisionsAndRisks() {
  const state = store.getState();
  const activeTab = state.selectedGovernanceTab || 'DECISIONS'; // 'DECISIONS' | 'RISKS'
  const { decisions, risks } = state;

  const pendingDecisions = (decisions || []).filter(d => d.status === 'PENDING');
  const approvedDecisions = (decisions || []).filter(d => d.status === 'APPROVED');

  const criticalRisks = (risks || []).filter(r => r.severity === 'CRITICAL' && r.status === 'OPEN');
  const highRisks = (risks || []).filter(r => r.severity === 'HIGH' && r.status === 'OPEN');
  const mediumRisks = (risks || []).filter(r => r.severity === 'MEDIUM' && r.status === 'OPEN');

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Governança, Decisões & Continuidade</div>
        <h1 class="page-header__title">Decision Center & Matriz de Riscos</h1>
        <p class="page-header__subtitle">
          Deliberações formais da Diretoria e gestão quantitativa de riscos operacionais (P × I).
        </p>
      </div>
      <div class="flex gap-2">
        <div class="stat-item" style="padding: 4px 12px; background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-md);">
          <span class="stat-item__label text-warning">DECISÕES P0</span>
          <span class="stat-item__value text-warning" style="font-size: var(--fs-md);">${pendingDecisions.length}</span>
        </div>
        <div class="stat-item" style="padding: 4px 12px; background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-md);">
          <span class="stat-item__label text-danger">RISCOS CRÍTICOS</span>
          <span class="stat-item__value text-danger" style="font-size: var(--fs-md);">${criticalRisks.length}</span>
        </div>
      </div>
    </div>

    <!-- SUB-ABAS INTEGRADAS: DECISÕES E RISCOS -->
    <div class="op-tabs-wrap mb-6">
      <div class="op-tabs">
        <button class="op-tab-btn ${activeTab === 'DECISIONS' ? 'active' : ''}" onclick="selectGovernanceTab('DECISIONS')">
          ⚖️ Central de Decisões (${pendingDecisions.length} pendentes)
        </button>
        <button class="op-tab-btn ${activeTab === 'RISKS' ? 'active' : ''}" onclick="selectGovernanceTab('RISKS')">
          ⚠️ Matriz de Riscos Operacionais (${risks.filter(r=>r.status==='OPEN').length} abertos)
        </button>
      </div>
    </div>

    <!-- CONTEÚDO DA ABA ATIVA -->
    ${activeTab === 'DECISIONS' ? renderDecisionsContent(pendingDecisions, approvedDecisions) : renderRisksContent(criticalRisks, highRisks, mediumRisks)}

    <div id="modal-container"></div>
  `;
}

function renderDecisionsContent(pending, approved) {
  return `
    <!-- DECISÕES PENDENTES -->
    <div class="card-panel mb-6">
      <div class="card-panel__header">
        <span>Decisões Pendentes (${pending.length})</span>
        <span class="badge badge--high">Aguardando Diretoria</span>
      </div>
      <div>
        ${pending.length === 0 ? `
          <div style="padding: var(--sp-6); text-align: center;" class="text-muted text-xs">Nenhuma decisão pendente</div>
        ` : pending.map(d => `
          <div class="op-row justify-between" onclick="drawer.openDecision('${d.id}')">
            <div class="flex items-center gap-3">
              <span class="badge ${d.impact === 'CRITICAL' ? 'badge--critical' : 'badge--high'}">${d.priorityTag || 'P0'}</span>
              <div>
                <div class="text-sm fw-semibold text-primary">
                  <span class="font-mono text-muted text-xs" style="margin-right: 4px;">${d.code}</span>
                  ${d.title}
                </div>
                <div class="text-xs text-muted mt-1">${d.description}</div>
                <div class="text-xs text-secondary mt-1">Responsável: <strong class="text-primary">${d.owner}</strong> · Prazo: <strong class="text-danger font-mono">${d.deadline}</strong></div>
              </div>
            </div>
            <div class="flex items-center gap-2" onclick="event.stopPropagation()">
              <button class="btn-prime" onclick="openDecisionModal('${d.id}', '${d.code}', '${d.title.replace(/'/g, "\\'")}')">
                Deliberar Decisão P0 →
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- DECISÕES APROVADAS (HISTÓRICO) -->
    ${approved.length > 0 ? `
      <div class="card-panel">
        <div class="card-panel__header">
          <span>Histórico de Decisões Aprovadas (${approved.length})</span>
          <span class="badge badge--done">Aprovadas</span>
        </div>
        <div>
          ${approved.map(d => `
            <div class="op-row justify-between" onclick="drawer.openDecision('${d.id}')">
              <div class="flex items-center gap-3">
                <span class="badge badge--done">Aprovada</span>
                <div>
                  <div class="text-sm fw-semibold text-primary">
                    <span class="font-mono text-muted text-xs">${d.code}</span> ${d.title}
                  </div>
                  ${d.resolutionNotes ? `<div class="text-xs text-muted mt-1"><strong>Deliberação:</strong> ${d.resolutionNotes}</div>` : ''}
                </div>
              </div>
              <span class="text-xs font-mono text-muted">Aprovado por ${d.decidedBy || d.owner}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function renderRisksContent(critical, high, medium) {
  return `
    ${critical.length > 0 ? renderRiskGroup('🔴 Riscos Críticos (Ação Imediata)', critical, 'var(--clr-danger)') : ''}
    ${high.length > 0 ? renderRiskGroup('🟠 Riscos Altos', high, 'var(--clr-warning)') : ''}
    ${medium.length > 0 ? renderRiskGroup('🟡 Riscos Moderados', medium, 'var(--clr-brand)') : ''}
  `;
}

function renderRiskGroup(title, list, color) {
  return `
    <div class="card-panel mb-6" style="border-left: 4px solid ${color};">
      <div class="card-panel__header">
        <span>${title}</span>
      </div>
      <div>
        ${list.map(r => `
          <div class="op-row justify-between flex-col items-start" style="gap: var(--sp-2);">
            <div class="flex justify-between items-center" style="width: 100%;">
              <div class="flex items-center gap-3">
                <span class="badge ${r.severity === 'CRITICAL' ? 'badge--critical' : 'badge--high'}">${r.severity}</span>
                <span class="font-mono text-xs text-muted">${r.code}</span>
                <span class="text-sm fw-semibold text-primary">${r.title}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted font-mono">PROBABILIDADE × IMPACTO: <strong>P:${r.probability} × I:${r.impact} = ${r.probability * r.impact} / 25</strong></span>
                <button class="btn-subtle text-xs" style="padding: 2px 8px;" onclick="drawer.openRisk('${r.id}')">Ver Detalhes</button>
              </div>
            </div>
            <div class="text-xs text-secondary mb-1">${r.description}</div>
            <div class="p-3 text-xs text-primary" style="background: var(--bg-elevated); border-radius: var(--radius-sm); width: 100%; border: 1px solid var(--border-subtle);">
              <strong class="text-brand">Plano de Mitigação:</strong> ${r.mitigationPlan}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.selectGovernanceTab = function(tab) {
  store._setState({ selectedGovernanceTab: tab });
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderDecisionsAndRisks();
};

export const renderDecisions = renderDecisionsAndRisks;
export const renderRisks = renderDecisionsAndRisks;
