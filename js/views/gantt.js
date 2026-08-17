/**
 * views/gantt.js — Cronograma & Gantt Operacional D0–D30 (Fase 4.2)
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';
import { drawer } from '../ui/DrawerManager.js';

export function renderGantt() {
  const state = store.getState();
  const workstreams = state.workstreams && state.workstreams.length > 0 ? state.workstreams : [];
  const tasks = state.tasks && state.tasks.length > 0 ? state.tasks : [];
  const dayInfo = store.getCurrentDayInfo();
  const currentDay = dayInfo.currentDay; // Ex: 3 (D03)

  if (workstreams.length === 0) {
    return `<div style="padding: var(--sp-8); text-align: center;" class="text-muted">Carregando cronograma operacional...</div>`;
  }

  // Dias de 0 a 30
  const days = Array.from({ length: 31 }, (_, i) => i);

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Cronograma & Execução Temporal</div>
        <h1 class="page-header__title">Gantt Operacional · Ciclo D0 a D30</h1>
        <p class="page-header__subtitle">
          Linha do tempo visual da implantação comercial TRUST com marcador em <strong>${dayInfo.dayLabel} (${dayInfo.formattedDate})</strong>.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="stat-item" style="padding: 4px 12px; background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-md);">
          <span class="stat-item__label">Dia Atual</span>
          <span class="stat-item__value text-brand" style="font-size: var(--fs-md);">${dayInfo.dayLabel}</span>
        </div>
      </div>
    </div>

    <!-- LEGENDA DO GANTT -->
    <div class="card-panel mb-6" style="padding: var(--sp-3) var(--sp-5);">
      <div class="flex items-center justify-between flex-wrap gap-3 text-xs">
        <span class="fw-semibold text-primary">LEGENDA OPERACIONAL:</span>
        <div class="flex items-center gap-2"><span style="width: 12px; height: 12px; background: var(--clr-success); border-radius: 2px;"></span> <span class="text-secondary">Concluída (DONE)</span></div>
        <div class="flex items-center gap-2"><span style="width: 12px; height: 12px; background: var(--clr-brand); border-radius: 2px;"></span> <span class="text-secondary">Em Andamento (No Prazo)</span></div>
        <div class="flex items-center gap-2"><span style="width: 12px; height: 12px; background: var(--clr-info); border-radius: 2px;"></span> <span class="text-secondary">Validação em Paralelo</span></div>
        <div class="flex items-center gap-2"><span style="width: 12px; height: 12px; background: var(--clr-danger); border-radius: 2px;"></span> <span class="text-secondary">Bloqueada / Atrasada</span></div>
        <div class="flex items-center gap-2"><span style="width: 12px; height: 12px; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 2px;"></span> <span class="text-secondary">A Iniciar (Backlog/TODO)</span></div>
      </div>
    </div>

    <!-- TABELA GANTT HORIZONTAL -->
    <div class="card-panel mb-6" style="overflow-x: auto;">
      <div style="min-width: 980px;">
        
        <!-- HEADER COM OS DIAS (D0 A D30) -->
        <div class="gantt-header-row" style="display: grid; grid-template-columns: 240px repeat(31, 1fr); background: var(--bg-elevated); border-bottom: 1px solid var(--border-subtle); padding: var(--sp-2) 0;">
          <div class="px-3 text-xs fw-bold text-muted uppercase">Frente / Tarefa</div>
          ${days.map(d => `
            <div class="text-center font-mono text-2xs fw-semibold ${d === currentDay ? 'text-brand' : 'text-muted'}" style="${d === currentDay ? 'background: var(--clr-brand-subtle); border-radius: var(--radius-sm); font-weight: var(--fw-bold);' : ''}">
              ${d === 0 ? 'D0' : d < 10 ? `D0${d}` : `D${d}`}
            </div>
          `).join('')}
        </div>

        <!-- LINHAS POR FRENTE E TAREFAS -->
        <div>
          ${workstreams.map(ws => {
            const wsTasks = tasks.filter(t => t.workstreamId === ws.id);
            return `
              <!-- FRENTE HEADER ROW -->
              <div class="gantt-ws-row" style="display: grid; grid-template-columns: 240px repeat(31, 1fr); background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle); align-items: center; padding: 6px 0;">
                <div class="px-3 flex items-center gap-2">
                  <span class="font-mono text-xs text-muted fw-semibold">${ws.code}</span>
                  <span class="text-xs fw-bold text-primary">${ws.name}</span>
                  <span class="badge ${ws.progressPct === 100 ? 'badge--done' : 'badge--neutral'}" style="font-size: 10px; padding: 1px 5px;">${ws.progressPct}%</span>
                </div>
                <!-- Track de fundo com marcador vertical de HOJE -->
                ${days.map(d => `
                  <div style="height: 100%; border-right: 1px dashed ${d === currentDay ? 'var(--clr-brand)' : 'var(--border-subtle)'}; background: ${d === currentDay ? 'var(--clr-brand-subtle)' : 'transparent'};"></div>
                `).join('')}
              </div>

              <!-- TAREFAS DA FRENTE -->
              ${wsTasks.map(t => renderGanttTaskRow(t, currentDay)).join('')}
            `;
          }).join('')}
        </div>

      </div>
    </div>
  `;
}

function renderGanttTaskRow(task, currentDay) {
  // Mapear datas ou fases para intervalos D0-D30 aproximados
  const startDay = task.phase === 'S1' ? 0 : task.phase === 'S2' ? 6 : task.phase === 'S3' ? 14 : 22;
  const duration = task.priority === 'CRITICAL' ? 3 : 5;
  const endDay = Math.min(30, startDay + duration);

  const isCurrentActive = currentDay >= startDay && currentDay <= endDay;
  const isBlocked = task.status === 'BLOCKED';
  const isDone = task.status === 'DONE';
  const isValidationPending = task.operationalStatus === 'ACTIVE_WITH_VALIDATION_PENDING';
  const isOverdue = currentDay > endDay && !isDone;

  const barColor = isDone 
    ? 'var(--clr-success)' 
    : isBlocked 
    ? 'var(--clr-danger)' 
    : isOverdue 
    ? 'var(--clr-danger)' 
    : isValidationPending 
    ? 'var(--clr-info)' 
    : 'var(--clr-brand)';

  return `
    <div class="gantt-task-row" style="display: grid; grid-template-columns: 240px repeat(31, 1fr); border-bottom: 1px solid var(--border-subtle); align-items: center; padding: 4px 0; cursor: pointer; transition: background 120ms ease;" onclick="drawer.openTask('${task.id}')">
      <div class="px-3" style="padding-left: var(--sp-6);">
        <div class="text-2xs fw-medium text-primary text-truncate">
          <span class="font-mono text-muted">${task.code}</span> ${task.title}
        </div>
      </div>

      <!-- Barra visual posicionada na grid de 31 colunas -->
      <div style="grid-column: ${startDay + 2} / ${endDay + 3}; padding: 2px 0;">
        <div style="background: ${barColor}; height: 16px; border-radius: var(--radius-sm); opacity: ${isDone ? '0.8' : '1'}; display: flex; align-items: center; padding: 0 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">
          <span style="font-size: 9px; color: #FFF; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${isValidationPending ? '⚡ Validação' : task.status}
          </span>
        </div>
      </div>
    </div>
  `;
}
