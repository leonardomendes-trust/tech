/**
 * views/overview.js — Cockpit HOJE (Design System 2.0 / Premium Enterprise)
 *
 * TRUST Revenue Command Center
 *
 * Estrutura Refinada:
 * - Nível 1: Resumo executivo despoluído (Progresso, Bloqueios, Riscos, Decisões)
 * - Nível 2: Gargalo Crítico com ação direta e Decisões Prioritárias em formato de lista operacional limpa
 * - Nível 3: Clique em qualquer item abre o Detail Drawer sem poluir a tela principal
 */

import { store } from '../state/StateManager.js';
import { drawer } from '../ui/DrawerManager.js';

export function renderOverview() {
  const state = store.getState();
  const progress = store.getImplantacaoProgress() || { pct: 0, done: 0, total: 0, blocked: 0 };
  const criticalRisks = store.getCriticalRisks() || [];
  const pendingDecisions = store.getPendingDecisions() || [];
  const workstreams = state.workstreams || [];
  const tasks = state.tasks || [];
  const changelog = state.changelog || [];
  const dayInfo = store.getCurrentDayInfo() || { currentDay: 3, dayLabel: 'D03', formattedDate: 'Segunda-feira, 17 de ago. de 2026' };

  // Gargalo crítico com fallback seguro
  const criticalWs = workstreams.find(w => w.healthScore === 'CRITICAL' || w.tasksBlocked > 0) || workstreams[0] || { id: 'ws-1', code: 'F1', name: 'Estratégia & ICP', owner: 'Comercial', tasksBlocked: 0 };
  const criticalWsTasks = criticalWs?.id ? tasks.filter(t => t.workstreamId === criticalWs.id && t.status === 'BLOCKED') : [];

  // Ações prioritárias das próximas 24-48h
  const urgentTasks = tasks
    .filter(t => t.status !== 'DONE' && (t.priority === 'CRITICAL' || t.priority === 'HIGH' || t.phase === 'S1'))
    .slice(0, 5);

  return `
    <!-- HEADER OPERACIONAL DESPOLUÍDO -->
    <div class="op-header">
      <div>
        <div class="op-header__eyebrow">Torre de Comando · Cockpit Diário</div>
        <h1 class="op-header__title">HOJE · ${dayInfo.dayLabel} · ${dayInfo.formattedDate}</h1>
        <p class="op-header__subtitle">
          Acompanhamento operacional em tempo real da implantação comercial TRUST.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-subtle" onclick="navigateTo('war-room')">
          🏛️ Abrir War Room Semanal
        </button>
        <button class="btn-subtle" onclick="navigateTo('activity-log')">
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
                Tarefas afetadas: ${criticalWsTasks.map(t => `<span class="badge badge--neutral" onclick="drawer.openTask('${t.id}')">${t.code}</span>`).join(' ')}
              </div>
            </div>
            <div>
              <div class="text-xs text-muted mb-1">AÇÃO IMEDIATA RECOMENDADA</div>
              <div class="text-sm fw-semibold text-primary mb-1">
                ${criticalWsTasks[0].blockReason ? criticalWsTasks[0].blockReason : 'Aprovar campos obrigatórios e definir regras de qualificação.'}
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
      
      <!-- DECISÕES NECESSÁRIAS (LISTA LIMPA) -->
      <div class="op-list" style="margin-bottom: 0;">
        <div class="op-list__header">
          <span>Decisões Necessárias (Próximas 24–48h)</span>
          <span class="badge badge--high">${pendingDecisions.length} pendentes</span>
        </div>
        <div>
          ${pendingDecisions.length === 0 ? `
            <div style="padding: var(--sp-6); text-align: center;" class="text-muted text-xs">Nenhuma decisão pendente</div>
          ` : pendingDecisions.slice(0, 3).map(d => `
            <div class="op-row justify-between" onclick="drawer.openDecision('${d.id}')">
              <div class="flex items-center gap-3">
                <span class="badge ${d.priorityTag === 'P0' ? 'badge--critical' : 'badge--high'}">${d.priorityTag || 'P0'}</span>
                <div>
                  <div class="text-sm fw-semibold text-primary">${d.code} — ${d.title}</div>
                  <div class="text-xs text-muted">${d.owner} · Prazo: <span class="text-danger font-mono">${d.deadline}</span></div>
                </div>
              </div>
              <span class="text-xs text-brand fw-semibold">Ver Impacto →</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- PRÓXIMAS 24–48H (TABELA OPERACIONAL COMPACTA) -->
      <div class="op-list" style="margin-bottom: 0;">
        <div class="op-list__header">
          <span>Ações Prioritárias (Próximas 24–48h)</span>
          <button class="text-brand text-xs fw-semibold" onclick="store.navigateTo('workstreams')">Ver todas →</button>
        </div>
        <table class="op-table">
          <thead>
            <tr>
              <th style="width: 50px;">PRIO</th>
              <th>TAREFA</th>
              <th>RESPONSÁVEL</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${urgentTasks.map(t => `
              <tr onclick="drawer.openTask('${t.id}')" style="cursor: pointer;">
                <td>
                  <span class="badge ${t.priority === 'CRITICAL' ? 'badge--critical' : 'badge--high'}">
                    ${t.priority === 'CRITICAL' ? 'P0' : 'P1'}
                  </span>
                </td>
                <td>
                  <div class="fw-medium text-xs text-primary">${t.code} — ${t.title}</div>
                </td>
                <td class="text-xs text-muted">${t.owner}</td>
                <td>
                  <span class="badge ${t.status === 'BLOCKED' ? 'badge--critical' : t.status === 'IN_PROGRESS' ? 'badge--info' : 'badge--neutral'}">
                    ${t.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- O QUE MUDOU HOJE (FEED REFINADO) -->
    <div class="op-list">
      <div class="op-list__header">
        <span>O Que Mudou Hoje? (Últimas 24 Horas)</span>
        <button class="text-brand text-xs fw-semibold" onclick="store.navigateTo('activity-log')">Histórico Completo →</button>
      </div>
      <div>
        ${changelog.slice(0, 4).map(cl => `
          <div class="op-row justify-between">
            <div class="flex items-center gap-3">
              <span style="font-size: 14px;">${cl.icon || '📌'}</span>
              <div>
                <div class="text-sm fw-medium text-primary">${cl.message}</div>
                <div class="text-xs text-muted">${cl.impact || ''}</div>
              </div>
            </div>
            <span class="text-xs font-mono text-muted">
              ${cl.timestamp ? new Date(cl.timestamp).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) : 'Hoje'}
            </span>
          </div>
        `).join('')}
      </div>
    </div>

    <div id="modal-container"></div>
  `;
}

// Modal handlers
window.openDesbloqueioModal = function(wsId) {
  store.navigateTo('workstreams');
  store.setSelectedWorkstream(wsId);
};
