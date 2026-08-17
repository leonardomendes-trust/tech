/**
 * views/activity-log.js — Memória Operacional da Torre (Fase 2)
 *
 * TRUST Revenue Command Center
 *
 * Linha do tempo auditável de todos os eventos da implantação e operação:
 * - Transições de status de tarefas
 * - Decisões tomadas com justificativa
 * - Updates operacionais de frentes
 * - Evidências anexadas
 * - POPs atualizados
 */

import { store } from '../state/StateManager.js';

export function renderActivityLog() {
  const state = store.getState();
  const { eventLog, filters } = state;

  const filteredEvents = (eventLog || []).filter(e => {
    if (filters.logEntityType && filters.logEntityType !== 'ALL' && e.entityType !== filters.logEntityType) {
      return false;
    }
    return true;
  });

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Auditoria & Governança</div>
        <h1 class="page-header__title">Event Log Persistente & Memória Operacional</h1>
        <p class="page-header__subtitle">
          Linha do tempo cronológica auditável. Cada mudança de estado, decisão registrada e evidência rastreada.
        </p>
      </div>
      <div class="flex gap-2">
        <select class="filter-select" onchange="store.setFilter('logEntityType', this.value)">
          <option value="ALL">Todos os Tipos</option>
          <option value="TASK" ${filters.logEntityType === 'TASK' ? 'selected' : ''}>Tarefas</option>
          <option value="DECISION" ${filters.logEntityType === 'DECISION' ? 'selected' : ''}>Decisões</option>
          <option value="WORKSTREAM" ${filters.logEntityType === 'WORKSTREAM' ? 'selected' : ''}>Updates de Frente</option>
          <option value="EVIDENCE" ${filters.logEntityType === 'EVIDENCE' ? 'selected' : ''}>Evidências</option>
          <option value="POP" ${filters.logEntityType === 'POP' ? 'selected' : ''}>POPs</option>
        </select>
      </div>
    </div>

    <!-- TIMELINE PRINCIPAL -->
    <div class="console-panel">
      <div class="console-panel__header">
        <span class="text-xs fw-bold text-primary">REGISTROS CRONOLÓGICOS (${filteredEvents.length})</span>
        <span class="text-xs text-muted">Histórico persistente e imutável</span>
      </div>
      <div class="console-panel__body" style="padding: 0;">
        ${filteredEvents.length === 0 ? `
          <div class="empty-state" style="padding: var(--sp-12);">
            <div class="empty-state__icon">📜</div>
            <div class="empty-state__title">Nenhum evento registrado com os filtros atuais</div>
          </div>
        ` : filteredEvents.map(evt => `
          <div class="console-row" style="padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--clr-border-subtle);">
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center gap-3">
                <span class="badge ${getEventBadgeClass(evt.eventType)} text-xs">${evt.eventType}</span>
                <span class="text-xs font-mono fw-bold text-muted">${evt.entityId || 'SYS'}</span>
                <span class="text-xs text-primary fw-semibold">${evt.reason || 'Alteração operacional'}</span>
              </div>
              <span class="text-xs font-mono text-muted">
                ${evt.timestamp ? new Date(evt.timestamp).toLocaleString('pt-BR') : 'Hoje'}
              </span>
            </div>

            <div class="grid-3 text-xs text-muted mt-2" style="gap: var(--sp-4);">
              <div>
                <span class="text-secondary">Responsável:</span> <strong class="text-primary">${evt.actor || 'Sistema'}</strong>
              </div>
              <div>
                ${evt.previousState ? `<span class="text-secondary">Transição:</span> ${evt.previousState} ➔ <strong class="text-brand">${evt.newState}</strong>` : `<span class="text-secondary">Estado:</span> <strong class="text-brand">${evt.newState || 'N/A'}</strong>`}
              </div>
              <div>
                ${evt.evidence ? `<span class="text-secondary">Evidência:</span> ${evt.evidence}` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getEventBadgeClass(type) {
  if (type?.includes('DECISION')) return 'badge--high';
  if (type?.includes('BLOCKED') || type?.includes('CRITICAL')) return 'badge--critical';
  if (type?.includes('DONE') || type?.includes('APPROVED')) return 'badge--on-track';
  if (type?.includes('EVIDENCE')) return 'badge--info';
  return 'badge--neutral';
}
