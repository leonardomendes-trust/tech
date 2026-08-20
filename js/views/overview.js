/**
 * views/overview.js — Cockpit Executivo "HOJE"
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';
import { drawer } from '../ui/DrawerManager.js';

export function renderOverview() {
  const state = store.getState();
  const dayInfo = store.getCurrentDayInfo();
  const progress = store.getAggregateProgress();
  const criticalRisks = store.getCriticalRisks();
  const pendingDecisions = (state.decisions || []).filter(d => d.status === 'PENDING');
  const workstreams = state.workstreams || [];

  // Frente prioritária de foco (com tarefas bloqueadas ou primeiro gargalo)
  const criticalWs = workstreams.find(w => w.tasksBlocked > 0) || workstreams[0] || {};
  const criticalWsTasks = criticalWs.id ? store.getTasksByWorkstream(criticalWs.id).filter(t => t.status === 'BLOCKED') : [];

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Torre de Comando · Cockpit Diário</div>
        <h1 class="page-header__title">HOJE · ${dayInfo.dayLabel} · ${dayInfo.weekday}, ${dayInfo.dateFormatted}</h1>
        <p class="page-header__subtitle">
          Acompanhamento operacional em tempo real da implantação comercial TRUST.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-subtle" onclick="navigateTo('war-room')">
          🏛️ Abrir War Room Semanal
        </button>
        <button class="btn-prime" onclick="navigateTo('activity-log')">
          Ver Memória Operacional
        </button>
      </div>
    </div>

    <!-- BARRA DE KPIS EXECUTIVOS (LINHA ÚNICA) -->
    <div class="stat-summary-bar">
      <div class="stat-item">
        <span class="stat-item__label">Implantação</span>
        <span class="stat-item__value text-brand">${progress.pct}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-item__label">Bloqueios</span>
        <span class="stat-item__value ${progress.blocked > 0 ? 'text-danger' : ''}">${progress.blocked}</span>
      </div>
      <div class="stat-item">
        <span class="stat-item__label">Riscos Críticos</span>
        <span class="stat-item__value ${criticalRisks.length > 0 ? 'text-danger' : ''}">${criticalRisks.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-item__label">Decisões Pendentes</span>
        <span class="stat-item__value ${pendingDecisions.length > 0 ? 'text-warning' : ''}">${pendingDecisions.length}</span>
      </div>
      <div class="stat-item" style="margin-left: auto;">
        <span class="stat-item__label">Núcleo Operacional</span>
        <span class="badge badge--on-track" style="margin-top: 4px;">Operação independente</span>
      </div>
    </div>

    <!-- 🔴 ATENÇÃO AGORA (Gargalo com Ações Operacionais Reais) -->
    ${criticalWsTasks.length > 0 ? `
      <div class="card-panel mb-6" style="border-left: 4px solid var(--clr-danger);">
        <div class="card-panel__header" style="background: var(--clr-danger-bg);">
          <div class="flex items-center gap-2">
            <span class="badge badge--critical">Gargalo Crítico</span>
            <span class="fw-semibold text-primary">${criticalWs.code} — ${criticalWs.name}</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-subtle" style="padding: 4px 10px; font-size: var(--fs-2xs);" onclick="openOperationalUnblockModal('${criticalWsTasks[0].id}', '${criticalWsTasks[0].code}', '${criticalWsTasks[0].title.replace(/'/g, "\\'")}', '${(criticalWsTasks[0].blockReason || '').replace(/'/g, "\\'")}')">
              ⚡ Desbloquear Operacionalmente
            </button>
            <button class="btn-prime" style="padding: 4px 10px; font-size: var(--fs-2xs); background: var(--clr-danger);" onclick="openDesbloqueioModal('${criticalWs.id}')">
              Ver Frente →
            </button>
          </div>
        </div>
        <div class="card-panel__body">
          <div class="grid-2">
            <div>
              <div class="text-xs text-muted mb-1">DIAGNÓSTICO OPERACIONAL</div>
              <div class="text-sm text-primary mb-2">
                ${criticalWs.tasksBlocked} tarefa(s) bloqueada(s) impedindo o avanço de CRM, Automações e Aquisição.
              </div>
              <div class="text-xs text-secondary">
                Tarefas afetadas: <strong class="text-danger font-mono">${criticalWsTasks.map(t => t.code).join(', ')}</strong>
              </div>
            </div>
            <div>
              <div class="text-xs text-muted mb-1">AÇÃO IMEDIATA RECOMENDADA</div>
              <div class="text-sm text-primary mb-2">
                Aguardando deliberação de DEC-02 pela Diretoria ou avanço com hipótese provisória.
              </div>
              <div class="text-xs text-muted">
                Responsável: <strong class="text-primary">${criticalWs.owner}</strong> · Prazo: <strong class="text-danger">Hoje (D01)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    ` : `
      <div class="card-panel mb-6" style="border-left: 4px solid var(--clr-success);">
        <div class="card-panel__header" style="background: var(--clr-success-bg);">
          <div class="flex items-center gap-2">
            <span class="badge badge--done">Operação Estável</span>
            <span class="fw-semibold text-primary">Nenhum gargalo crítico bloqueando a implantação</span>
          </div>
        </div>
        <div class="card-panel__body">
          <div class="text-sm text-secondary">
            Todas as frentes prioritárias estão em execução ou com desbloqueios operacionais registrados.
          </div>
        </div>
      </div>
    `}

    <!-- GRID: DECISÕES PRIORITÁRIAS + PRÓXIMAS 24-48H -->
    <div class="grid-2" style="margin-bottom: var(--sp-8); gap: var(--sp-6);">
      
      <!-- DECISÕES NECESSÁRIAS (LISTA LIMPA COM AÇÃO) -->
      <div class="op-list" style="margin-bottom: 0;">
        <div class="op-list__header">
          <span>Decisões Necessárias (Próximas 24–48h)</span>
          <span class="badge badge--high">${pendingDecisions.length} pendentes</span>
        </div>
        <div>
          ${pendingDecisions.length === 0 ? `
            <div style="padding: var(--sp-6); text-align: center;" class="text-muted text-xs">Nenhuma decisão pendente</div>
          ` : pendingDecisions.slice(0, 3).map(d => `
            <div class="op-row justify-between" style="cursor: pointer;" onclick="drawer.openDecision('${d.id}')">
              <div class="flex items-center gap-3">
                <span class="badge ${d.priorityTag === 'P0' ? 'badge--critical' : 'badge--high'}">${d.priorityTag || 'P0'}</span>
                <div>
                  <div class="text-sm fw-semibold text-primary">${d.code} — ${d.title}</div>
                  <div class="text-xs text-muted">${d.owner} · Prazo: <span class="text-danger font-mono">${d.deadline}</span></div>
                </div>
              </div>
              <button class="btn-subtle" style="padding: 4px 10px; font-size: var(--fs-2xs); color: var(--clr-brand);" onclick="event.stopPropagation(); drawer.openDecision('${d.id}')">
                Ver Impacto →
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- PRÓXIMAS 24-48H (AÇÕES IMEDIATAS) -->
      <div class="op-list" style="margin-bottom: 0;">
        <div class="op-list__header">
          <span>Ações Imediatas (Próximas 24–48h)</span>
          <span class="badge badge--neutral">Prioridades</span>
        </div>
        <div>
          <div class="op-row justify-between" onclick="navigateTo('workstreams')">
            <div class="flex items-center gap-3">
              <span class="badge badge--on-track">F1</span>
              <div>
                <div class="text-sm fw-semibold text-primary">Consolidar ICPs Capto e Luma</div>
                <div class="text-xs text-muted">Avançar com hipótese provisória de campo</div>
              </div>
            </div>
            <span class="text-xs font-mono text-muted">D01</span>
          </div>

          <div class="op-row justify-between" onclick="navigateTo('workstreams')">
            <div class="flex items-center gap-3">
              <span class="badge badge--on-track">F3</span>
              <div>
                <div class="text-sm fw-semibold text-primary">Configuração de campos do RD Station CRM</div>
                <div class="text-xs text-muted">Estruturação de campos obrigatórios de qualificação</div>
              </div>
            </div>
            <span class="text-xs font-mono text-muted">D01</span>
          </div>

          <div class="op-row justify-between" onclick="navigateTo('workstreams')">
            <div class="flex items-center gap-3">
              <span class="badge badge--on-track">F2</span>
              <div>
                <div class="text-sm fw-semibold text-primary">Battle Card Capto vs Concorrência</div>
                <div class="text-xs text-muted">Argumentário anti-jammer e taxa de recuperação 23min</div>
              </div>
            </div>
            <span class="text-xs font-mono text-muted">D02</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.openDesbloqueioModal = function(wsId) {
  store.setSelectedWorkstream(wsId);
  navigateTo('workstreams');
};
