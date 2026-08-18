/**
 * views/workstreams.js — Frentes & Tarefas
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';
import { drawer } from '../ui/DrawerManager.js';

export function renderWorkstreams() {
  const state = store.getState();
  const workstreams = state.workstreams && state.workstreams.length > 0 ? state.workstreams : [];
  if (workstreams.length === 0) {
    return `<div style="padding: var(--sp-8); text-align: center;" class="text-muted">Carregando frentes operacionais...</div>`;
  }

  const selectedId = state.selectedWorkstreamId || workstreams[0].id;
  const selectedWs = store.getWorkstreamById(selectedId) || workstreams[0];
  const wsTasks = store.getTasksByWorkstream(selectedId);
  const derivedHealth = store.getDerivedWorkstreamHealth(selectedWs.id);

  return `
    <div class="op-header">
      <div>
        <div class="op-header__eyebrow">Frentes de Implantação & Execução</div>
        <h1 class="op-header__title">Frentes, Tarefas & Updates</h1>
        <p class="op-header__subtitle">
          Acompanhe o status operacional de cada frente de trabalho e registre atualizações de campo.
        </p>
      </div>
      <button class="btn-prime" onclick="openUpdateModal('${selectedWs.id}', '${selectedWs.code}')">
        + Registrar Update na Frente
      </button>
    </div>

    <!-- TABS DE FRENTES -->
    <div class="op-tabs-wrap">
      <div class="op-tabs no-scrollbar">
        ${workstreams.map(ws => {
          const health = store.getDerivedWorkstreamHealth(ws.id);
          return `
            <button class="op-tab-btn ${selectedId === ws.id ? 'active' : ''}"
                    onclick="selectWorkstream('${ws.id}')">
              <span class="font-mono text-xs" style="margin-right: 4px;">${ws.code}</span>
              ${ws.name}
              <span class="badge ${health === 'CRITICAL' ? 'badge--critical' : health === 'AT_RISK' ? 'badge--high' : 'badge--on-track'}" style="margin-left: 6px;">
                ${ws.progressPct}%
              </span>
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- CONSOLE DA FRENTE SELECIONADA -->
    <div class="grid-2" style="grid-template-columns: 1fr 340px; gap: var(--sp-6);">
      
      <!-- LISTA DE TAREFAS DA FRENTE -->
      <div class="op-list" style="margin-bottom: 0;">
        <div class="op-list__header">
          <div>
            <span class="font-mono text-xs text-muted">${selectedWs.code} · ${selectedWs.owner}</span>
            <div class="text-sm fw-semibold text-primary">${selectedWs.name}</div>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge ${derivedHealth === 'CRITICAL' ? 'badge--critical' : 'badge--on-track'}">
              ${derivedHealth}
            </span>
            <span class="text-xs font-mono text-muted">${selectedWs.tasksDone}/${selectedWs.tasksTotal} tarefas</span>
          </div>
        </div>

        <table class="op-table">
          <thead>
            <tr>
              <th style="width: 70px;">CÓDIGO</th>
              <th>TAREFA</th>
              <th>RESPONSÁVEL</th>
              <th>PRAZO</th>
              <th>STATUS</th>
              <th style="text-align: right;">AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            ${wsTasks.map(t => {
              const tempCond = store.getTaskTemporalCondition(t);
              return `
                <tr style="cursor: pointer;" onclick="drawer.openTask('${t.id}')">
                  <td class="font-mono text-xs text-muted fw-semibold">${t.code}</td>
                  <td>
                    <div class="text-xs fw-medium text-primary">${t.title}</div>
                    ${t.blockReason ? `<div class="text-2xs text-danger mt-1">🔴 ${t.blockReason}</div>` : ''}
                  </td>
                  <td class="text-xs text-muted">${t.owner}</td>
                  <td class="text-xs font-mono text-secondary">
                    ${t.dueDate}
                    ${tempCond === 'OVERDUE' ? '<span class="text-danger"> (Atrasada)</span>' : ''}
                  </td>
                  <td>
                    <span class="badge ${t.status === 'BLOCKED' ? 'badge--critical' : t.status === 'DONE' ? 'badge--done' : t.status === 'IN_PROGRESS' ? 'badge--info' : 'badge--neutral'}">
                      ${t.status}
                    </span>
                  </td>
                  <td style="text-align: right;" onclick="event.stopPropagation()">
                    <button class="btn-subtle" style="padding: 3px 8px; font-size: var(--fs-2xs);" onclick="openTaskTransitionModal('${t.id}', '${t.code}', '${t.title.replace(/'/g, "\\'")}', '${t.status}')">
                      Alterar
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- PAINEL LATERAL: ÚLTIMO UPDATE DA FRENTE -->
      <div class="op-list" style="margin-bottom: 0;">
        <div class="op-list__header">
          <span>Último Update Operacional</span>
          <span class="text-xs font-mono text-muted">
            ${selectedWs.latestUpdate?.timestamp ? new Date(selectedWs.latestUpdate.timestamp).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) : 'Hoje'}
          </span>
        </div>
        <div style="padding: var(--sp-5);">
          <div class="text-xs text-muted mb-1">RESUMO DA FRENTE</div>
          <div class="text-sm text-primary mb-4" style="line-height: 1.6;">
            ${selectedWs.latestUpdate?.summary || 'Nenhum update registrado.'}
          </div>

          ${selectedWs.latestUpdate?.blocker ? `
            <div class="text-xs text-danger mb-1 fw-semibold">BLOQUEIO ATUAL</div>
            <div class="text-xs text-secondary mb-4 p-3" style="background: var(--clr-danger-bg); border-radius: var(--radius-sm); border: 1px solid var(--clr-danger-border);">
              ${selectedWs.latestUpdate.blocker}
            </div>
          ` : ''}

          <div class="text-xs text-muted mb-1">PRÓXIMO MARCO</div>
          <div class="text-xs font-mono fw-semibold text-primary mb-3">
            ${selectedWs.latestUpdate?.nextMilestone || 'D05 · Validação Geral'}
          </div>

          <div class="text-xs text-muted mb-1">PRÓXIMA AÇÃO</div>
          <div class="text-xs text-secondary mb-4">
            ${selectedWs.latestUpdate?.nextAction || '→ Acompanhamento rotineiro.'}
          </div>

          <div class="flex justify-between items-center pt-3" style="border-top: 1px solid var(--border-subtle);">
            <span class="text-xs text-muted">Autor: <strong class="text-primary">${selectedWs.latestUpdate?.author || selectedWs.owner}</strong></span>
            <button class="text-brand text-xs fw-semibold" onclick="openUpdateModal('${selectedWs.id}', '${selectedWs.code}')">+ Novo Relato</button>
          </div>
        </div>
      </div>
    </div>

    <div id="ws-modal-container"></div>
  `;
}

window.openUpdateModal = function(wsId, wsCode) {
  const container = document.getElementById('ws-modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="drawer-backdrop active" onclick="closeWsModal()">
      <div class="drawer" style="max-width: 500px; margin: auto; height: auto; border-radius: var(--radius-lg);" onclick="event.stopPropagation()">
        <div class="drawer__header">
          <div>
            <span class="badge badge--neutral text-xs mb-1">${wsCode}</span>
            <h3 class="text-md fw-semibold text-primary">Registrar Update Operacional</h3>
          </div>
          <button class="btn-subtle" onclick="closeWsModal()">✕</button>
        </div>
        <div class="drawer__body">
          <label class="text-xs text-muted fw-semibold mb-1 block">RESUMO DO STATUS ATUAL *</label>
          <textarea id="update-summary" class="btn-subtle mb-3" style="width:100%; height:70px; text-align: left;" placeholder="O que avançou desde o último relato?"></textarea>

          <div class="grid-2 mb-3">
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">SAÚDE DA FRENTE</label>
              <select id="update-health" class="btn-subtle" style="width:100%;">
                <option value="ON_TRACK">Normal (On Track)</option>
                <option value="MODERATE">Moderado</option>
                <option value="AT_RISK">Em Risco</option>
                <option value="CRITICAL">Crítico</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">AUTOR</label>
              <input id="update-author" type="text" class="btn-subtle" style="width:100%;" value="Comercial Ops" />
            </div>
          </div>

          <label class="text-xs text-muted fw-semibold mb-1 block">BLOQUEIO RELATADO (SE HOUVER)</label>
          <input id="update-blocker" type="text" class="btn-subtle mb-3" style="width:100%;" placeholder="O que está impedindo o avanço..." />

          <div class="grid-2">
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">PRÓXIMO MARCO</label>
              <input id="update-milestone" type="text" class="btn-subtle" style="width:100%;" placeholder="Ex: D03 · Kickoff" />
            </div>
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">PRÓXIMA AÇÃO</label>
              <input id="update-action" type="text" class="btn-subtle" style="width:100%;" placeholder="Ex: Alinhamento com Diretoria" />
            </div>
          </div>
        </div>
        <div class="drawer__footer">
          <button class="btn-subtle" onclick="closeWsModal()">Cancelar</button>
          <button class="btn-prime" onclick="submitWsUpdate('${wsId}')">Salvar Update</button>
        </div>
      </div>
    </div>
  `;
};

window.submitWsUpdate = async function(wsId) {
  const summaryEl = document.getElementById('update-summary');
  const healthEl = document.getElementById('update-health');
  const authorEl = document.getElementById('update-author');
  const blockerEl = document.getElementById('update-blocker');
  const milestoneEl = document.getElementById('update-milestone');
  const actionEl = document.getElementById('update-action');

  if (!summaryEl || !summaryEl.value.trim()) return alert('Preencha o resumo do update.');

  await store.addWorkstreamUpdate(wsId, {
    summary: summaryEl.value.trim(),
    health: healthEl?.value || 'ON_TRACK',
    author: authorEl?.value || 'Ops',
    blocker: blockerEl?.value.trim() || null,
    nextMilestone: milestoneEl?.value.trim() || null,
    nextAction: actionEl?.value.trim() || null,
  });

  closeWsModal();
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderWorkstreams();
};

window.openTaskTransitionModal = function(taskId, code, title, currentStatus) {
  const container = document.getElementById('ws-modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="drawer-backdrop active" onclick="closeWsModal()">
      <div class="drawer" style="max-width: 480px; margin: auto; height: auto; border-radius: var(--radius-lg);" onclick="event.stopPropagation()">
        <div class="drawer__header">
          <div>
            <span class="badge badge--neutral text-xs mb-1">${code}</span>
            <h3 class="text-md fw-semibold text-primary">${title}</h3>
          </div>
          <button class="btn-subtle" onclick="closeWsModal()">✕</button>
        </div>
        <div class="drawer__body">
          <div class="grid-2 mb-3">
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">NOVO STATUS</label>
              <select id="task-new-status" class="btn-subtle" style="width:100%;">
                <option value="IN_PROGRESS" ${currentStatus === 'IN_PROGRESS' ? 'selected' : ''}>Em Andamento</option>
                <option value="DONE" ${currentStatus === 'DONE' ? 'selected' : ''}>Concluído (DONE)</option>
                <option value="BLOCKED" ${currentStatus === 'BLOCKED' ? 'selected' : ''}>Bloqueado (BLOCKED)</option>
                <option value="TODO" ${currentStatus === 'TODO' ? 'selected' : ''}>A Fazer (TODO)</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">RESPONSÁVEL</label>
              <input id="task-actor" type="text" class="btn-subtle" style="width:100%;" value="Comercial Lead" />
            </div>
          </div>

          <label class="text-xs text-muted fw-semibold mb-1 block">MOTIVO DA ALTERAÇÃO / AUDITORIA *</label>
          <textarea id="task-reason" class="btn-subtle mb-3" style="width:100%; height:70px; text-align: left;" placeholder="Descreva o motivo da mudança de estado..."></textarea>
        </div>
        <div class="drawer__footer">
          <button class="btn-subtle" onclick="closeWsModal()">Cancelar</button>
          <button class="btn-prime" onclick="submitTaskTransition('${taskId}')">Confirmar Mudança</button>
        </div>
      </div>
    </div>
  `;
};

window.submitTaskTransition = async function(taskId) {
  const statusEl = document.getElementById('task-new-status');
  const actorEl = document.getElementById('task-actor');
  const reasonEl = document.getElementById('task-reason');

  if (!reasonEl || !reasonEl.value.trim()) return alert('Informe o motivo da alteração.');

  await store.transitionTaskStatus(
    taskId,
    statusEl.value,
    reasonEl.value.trim(),
    actorEl.value || 'Comercial'
  );

  closeWsModal();
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderWorkstreams();
};

window.selectWorkstream = function(wsId) {
  store.setSelectedWorkstream(wsId);
  const container = document.getElementById('page-container');
  if (container) {
    container.innerHTML = renderWorkstreams();
  }
};

window.closeWsModal = function() {
  const container = document.getElementById('ws-modal-container');
  if (container) container.innerHTML = '';
};
