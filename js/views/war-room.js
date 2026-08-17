/**
 * views/war-room.js — Weekly War Room Cockpit (Reuniões de Alinhamento Semanal)
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';
import { drawer } from '../ui/DrawerManager.js';

export function renderWarRoom() {
  const state = store.getState();
  const dayInfo = store.getCurrentDayInfo();
  const progress = store.getImplantacaoProgress();
  const pendingDecisions = store.getPendingDecisions();
  const criticalRisks = store.getCriticalRisks();
  const blockedTasks = (state.tasks || []).filter(t => t.status === 'BLOCKED');

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Diretoria & Alinhamento Semanal</div>
        <h1 class="page-header__title">Weekly War Room · Mesa de Decisão</h1>
        <p class="page-header__subtitle">
          Cockpit otimizado para projeção em reunião de liderança. Pauta executiva gerada a partir dos bloqueios da semana.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-subtle" onclick="window.print()">
          🖨️ Imprimir Pauta
        </button>
        <button class="btn-prime" onclick="exportExecutiveReport('MD')">
          📄 Gerar Ata Final da Sessão
        </button>
      </div>
    </div>

    <!-- SUMÁRIO DA MESA DE REUNIÃO -->
    <div class="stat-summary-bar">
      <div class="stat-item">
        <span class="stat-item__label">Pauta do Dia</span>
        <span class="stat-item__value text-brand">${dayInfo.dayLabel} · S1</span>
      </div>
      <div class="stat-item">
        <span class="stat-item__label">Bloqueios em Pauta</span>
        <span class="stat-item__value ${blockedTasks.length > 0 ? 'text-danger' : ''}">${blockedTasks.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-item__label">Decisões P0 Necessárias</span>
        <span class="stat-item__value ${pendingDecisions.length > 0 ? 'text-warning' : ''}">${pendingDecisions.length}</span>
      </div>
      <div class="stat-item" style="margin-left: auto;">
        <span class="stat-item__label">Presidente da Mesa</span>
        <strong class="text-primary text-sm font-mono" style="margin-top: 4px;">Leonardo (Master)</strong>
      </div>
    </div>

    <!-- PAUTA EXECUTIVA 1: DECISÕES QUE PRECISAM SER TOMADAS AGORA -->
    <div class="card-panel mb-6" style="border-left: 4px solid var(--clr-warning);">
      <div class="card-panel__header" style="background: var(--clr-warning-bg);">
        <span>1. Deliberações da Diretoria (Tempo sugerido: 5 min por item)</span>
        <span class="badge badge--high">${pendingDecisions.length} pendências</span>
      </div>
      <div class="card-panel__body" style="padding: 0;">
        ${pendingDecisions.length === 0 ? `
          <div class="p-6 text-center text-muted text-xs">Nenhuma deliberação pendente para esta sessão.</div>
        ` : pendingDecisions.map(d => `
          <div class="op-row justify-between">
            <div class="flex items-center gap-3">
              <span class="badge badge--critical">${d.priorityTag || 'P0'}</span>
              <div>
                <div class="text-sm fw-bold text-primary">${d.code} — ${d.title}</div>
                <div class="text-xs text-muted">Responsável: ${d.owner} · Prazo Fatal: <span class="text-danger font-mono">${d.deadline}</span></div>
              </div>
            </div>
            <button class="btn-prime" style="padding: 4px 12px; font-size: var(--fs-xs);" onclick="openDecisionModal('${d.id}', '${d.code}', '${d.title.replace(/'/g, "\\'")}')">
              Deliberar na Mesa →
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- PAUTA EXECUTIVA 2: DESTRAVAMENTO DE GARGALOS OPERACIONAIS -->
    <div class="card-panel mb-6" style="border-left: 4px solid var(--clr-danger);">
      <div class="card-panel__header" style="background: var(--clr-danger-bg);">
        <span>2. Gargalos e Bloqueios em Frentes de Trabalho</span>
        <span class="badge badge--critical">${blockedTasks.length} travamentos</span>
      </div>
      <div class="card-panel__body" style="padding: 0;">
        ${blockedTasks.length === 0 ? `
          <div class="p-6 text-center text-muted text-xs">Todas as frentes operando em tração contínua.</div>
        ` : blockedTasks.map(t => `
          <div class="op-row justify-between">
            <div class="flex items-center gap-3">
              <span class="badge badge--critical font-mono">${t.code}</span>
              <div>
                <div class="text-sm fw-bold text-primary">${t.title}</div>
                <div class="text-xs text-muted">Motivo: <span class="text-danger">${t.blockReason || 'Aguardando validação'}</span></div>
              </div>
            </div>
            <button class="btn-subtle" style="padding: 4px 12px; font-size: var(--fs-xs);" onclick="openOperationalUnblockModal('${t.id}', '${t.code}', '${t.title.replace(/'/g, "\\'")}', '${(t.blockReason || '').replace(/'/g, "\\'")}')">
              ⚡ Desbloquear Agora
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
