/**
 * views/activity-log.js — Memória Operacional da Torre (Fase 2)
 *
 * TRUST Revenue Command Center
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
    <div class="card-panel">
      <div class="card-panel__header">
        <span>Registros Cronológicos (${filteredEvents.length})</span>
        <span class="text-xs text-muted">Histórico persistente e auditável</span>
      </div>
      <div class="card-panel__body" style="padding: 0;">
        ${filteredEvents.length === 0 ? `
          <div style="padding: var(--sp-12); text-align: center;" class="text-muted text-xs">
            Nenhum evento registrado com os filtros atuais
          </div>
        ` : filteredEvents.map(evt => {
          let cleanReason = evt.reason || 'Alteração operacional';
          if (typeof cleanReason === 'string' && cleanReason.startsWith('{')) {
            try {
              const parsed = JSON.parse(cleanReason);
              cleanReason = parsed.resolutionNotes || parsed.summary || cleanReason;
            } catch(e) {}
          }

          const eventDate = evt.timestamp ? new Date(evt.timestamp) : new Date();
          const formattedDate = !isNaN(eventDate) ? eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Hoje';

          return `
            <div class="op-row justify-between" style="padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--border-subtle); flex-direction: column; align-items: flex-start; gap: var(--sp-2);">
              <div class="flex justify-between items-start" style="width: 100%;">
                <div class="flex items-center gap-3">
                  <span class="badge ${getEventBadgeClass(evt.eventType)}">${evt.eventType}</span>
                  <span class="font-mono text-xs text-muted fw-bold">${evt.entityId || 'SYS'}</span>
                  <span class="text-sm fw-semibold text-primary">${cleanReason}</span>
                </div>
                <span class="text-xs font-mono text-muted" style="white-space: nowrap;">
                  ${formattedDate}
                </span>
              </div>

              <div class="flex items-center gap-6 text-xs text-muted mt-1" style="flex-wrap: wrap;">
                <div>
                  <span class="text-secondary">Responsável:</span> <strong class="text-primary">${evt.actor || 'Leonardo (Ops)'}</strong>
                </div>
                <div>
                  ${evt.previousState && evt.previousState !== 'N/A' ? `<span class="text-secondary">Transição:</span> <span class="badge badge--neutral">${evt.previousState}</span> ➔ <span class="badge badge--on-track">${evt.newState}</span>` : `<span class="text-secondary">Estado:</span> <strong class="text-brand">${evt.newState || 'REGISTRADO'}</strong>`}
                </div>
                ${evt.evidence ? `
                  <div>
                    <span class="text-secondary">Ref / Ata:</span> <strong class="text-primary">${evt.evidence}</strong>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
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
