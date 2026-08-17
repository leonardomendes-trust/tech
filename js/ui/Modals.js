/**
 * ui/Modals.js — Handlers Globais Unificados de Decisão, Desbloqueio e Transições
 *
 * TRUST Revenue Command Center (Fase 4.1)
 *
 * Separação dos 3 Papéis:
 * - Quem Registra (Usuário autenticado / Operador)
 * - Quem Delibera / Alinha (Diretoria, Diretor Comercial, etc.)
 * - Quem Executa (Comercial, SDR, RevOps, Marketing)
 */

import { store } from '../state/StateManager.js';
import { drawer } from './DrawerManager.js';

export function openDecisionModal(id, code, title) {
  let container = document.getElementById('modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <div class="drawer-backdrop active" onclick="closeModal()">
      <div class="drawer" style="max-width: 540px; margin: auto; height: auto; border-radius: var(--radius-lg);" onclick="event.stopPropagation()">
        <div class="drawer__header">
          <div>
            <span class="badge badge--high mb-1">REGISTRO DE DECISÃO</span>
            <h3 class="text-md fw-semibold text-primary">${code} — ${title}</h3>
          </div>
          <button class="btn-subtle" onclick="closeModal()">✕</button>
        </div>
        <div class="drawer__body">
          <div class="mb-3">
            <label class="text-xs text-muted fw-semibold mb-1 block">OPÇÃO / DELIBERAÇÃO ESCOLHIDA *</label>
            <input id="decision-choice" type="text" class="btn-subtle" style="width:100%; text-align: left;" placeholder="Ex: Aprovada oferta de piloto de 30 dias" />
          </div>

          <label class="text-xs text-muted fw-semibold mb-1 block">JUSTIFICATIVA / TERMOS DA DECISÃO *</label>
          <textarea id="decision-notes" class="btn-subtle mb-3" style="width:100%; height:75px; text-align: left;" placeholder="Descreva o racional estratégico ou termos acordados pela Diretoria..."></textarea>
          
          <div class="grid-3 mb-3" style="gap: var(--sp-3);">
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">QUEM DECIDIU *</label>
              <select id="decision-decider" class="btn-subtle" style="width:100%;">
                <option value="Diretoria">Diretoria</option>
                <option value="Diretor Comercial">Diretor Comercial</option>
                <option value="Comercial">Comercial</option>
                <option value="Marketing">Marketing</option>
                <option value="RevOps">RevOps</option>
                <option value="Jurídico">Jurídico</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">QUEM REGISTRA</label>
              <input id="decision-registrar" type="text" class="btn-subtle" style="width:100%;" value="Leonardo (Ops)" />
            </div>
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">REFERÊNCIA / ATA</label>
              <input id="decision-evidence" type="text" class="btn-subtle" style="width:100%;" placeholder="Ex: Ata D01" />
            </div>
          </div>
        </div>
        <div class="drawer__footer">
          <button class="btn-subtle" onclick="closeModal()">Cancelar</button>
          <button class="btn-prime" onclick="submitDecision('${id}')">
            REGISTRAR DECISÃO NO HISTÓRICO
          </button>
        </div>
      </div>
    </div>
  `;
}

export async function submitDecision(id) {
  const choiceEl = document.getElementById('decision-choice');
  const notesEl = document.getElementById('decision-notes');
  const deciderEl = document.getElementById('decision-decider');
  const registrarEl = document.getElementById('decision-registrar');
  const evEl = document.getElementById('decision-evidence');

  if (!notesEl || !notesEl.value.trim() || !choiceEl || !choiceEl.value.trim()) {
    return alert('Preencha a opção escolhida e a justificativa da decisão.');
  }

  const fullNotes = `[Deliberação: ${choiceEl.value.trim()}] ${notesEl.value.trim()}${evEl?.value.trim() ? ` (Ref: ${evEl.value.trim()})` : ''} — Decidido por: ${deciderEl.value}, Registrado por: ${registrarEl.value}`;
  
  await store.resolveDecision(id, fullNotes, deciderEl.value);
  closeModal();
  drawer.close();
  navigateTo('decisions');
}

/**
 * Modal de Desbloqueio Operacional (Fase 4.1)
 * Permite avançar uma tarefa/frente com status ACTIVE_WITH_VALIDATION_PENDING
 */
export function openOperationalUnblockModal(taskId, code, title, blockReason) {
  let container = document.getElementById('modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <div class="drawer-backdrop active" onclick="closeModal()">
      <div class="drawer" style="max-width: 540px; margin: auto; height: auto; border-radius: var(--radius-lg);" onclick="event.stopPropagation()">
        <div class="drawer__header">
          <div>
            <span class="badge badge--high mb-1">AÇÃO DE DESBLOQUEIO OPERACIONAL</span>
            <h3 class="text-md fw-semibold text-primary">${code} — ${title}</h3>
          </div>
          <button class="btn-subtle" onclick="closeModal()">✕</button>
        </div>
        <div class="drawer__body">
          <div class="p-3 mb-3" style="background: var(--clr-danger-bg); border-radius: var(--radius-sm); border: 1px solid var(--clr-danger-border);">
            <div class="text-xs text-danger fw-semibold">BLOQUEIO ATUAL:</div>
            <div class="text-xs text-primary mt-1">${blockReason || 'Aguardando decisão ou validação externa'}</div>
          </div>

          <div class="mb-3">
            <label class="text-xs text-muted fw-semibold mb-1 block">ESTRATÉGIA DE DESBLOQUEIO OPERACIONAL *</label>
            <select id="unblock-strategy" class="btn-subtle" style="width:100%;">
              <option value="Avançar com hipótese provisória e validar em campo">Avançar com hipótese provisória e validar em campo</option>
              <option value="Assumir premissa técnica padrão">Assumir premissa técnica padrão</option>
              <option value="Avançar em paralelo sem aguardar homologação">Avançar em paralelo sem aguardar homologação</option>
              <option value="Execução parcial liberada pelo Líder">Execução parcial liberada pelo Líder</option>
            </select>
          </div>

          <label class="text-xs text-muted fw-semibold mb-1 block">MOTIVO DO DESBLOQUEIO / TERMOS *</label>
          <textarea id="unblock-reason" class="btn-subtle mb-3" style="width:100%; height:75px; text-align: left;" placeholder="Como a operação seguirá e qual o alinhamento realizado..."></textarea>
          
          <label class="text-xs text-muted fw-semibold mb-1 block">O QUE PERMANECE PENDENTE DE VALIDAÇÃO? *</label>
          <input id="unblock-validation" type="text" class="btn-subtle mb-3" style="width:100%; text-align: left;" value="Validação de mercado com primeiros prospects (N1 ➔ N2)" />

          <div class="grid-2 mb-3">
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">RESPONSÁVEL PELO DESBLOQUEIO</label>
              <select id="unblock-author" class="btn-subtle" style="width:100%;">
                <option value="Comercial">Comercial</option>
                <option value="Diretor Comercial">Diretor Comercial</option>
                <option value="SDR Lead">SDR Lead</option>
                <option value="Marketing Ops">Marketing Ops</option>
                <option value="RevOps">RevOps</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">ALINHADO COM</label>
              <input id="unblock-decider" type="text" class="btn-subtle" style="width:100%;" value="Diretoria / Comercial" />
            </div>
          </div>
        </div>
        <div class="drawer__footer">
          <button class="btn-subtle" onclick="closeModal()">Cancelar</button>
          <button class="btn-prime" onclick="submitOperationalUnblock('${taskId}')">
            CONFIRMAR DESBLOQUEIO OPERACIONAL
          </button>
        </div>
      </div>
    </div>
  `;
}

export async function submitOperationalUnblock(taskId) {
  const strategyEl = document.getElementById('unblock-strategy');
  const reasonEl = document.getElementById('unblock-reason');
  const validationEl = document.getElementById('unblock-validation');
  const authorEl = document.getElementById('unblock-author');
  const deciderEl = document.getElementById('unblock-decider');

  if (!reasonEl || !reasonEl.value.trim()) {
    return alert('Informe o motivo do desbloqueio operacional.');
  }

  await store.operationalUnblockTask(taskId, {
    unblockStrategy: strategyEl.value,
    reason: reasonEl.value.trim(),
    validationPending: validationEl.value.trim(),
    author: authorEl.value,
    decider: deciderEl.value.trim(),
  });

  closeModal();
  drawer.close();
  navigateTo('overview');
}

export function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) container.innerHTML = '';
}

window.openDecisionModal = openDecisionModal;
window.submitDecision = submitDecision;
window.openOperationalUnblockModal = openOperationalUnblockModal;
window.submitOperationalUnblock = submitOperationalUnblock;
window.closeModal = closeModal;
