/**
 * ui/DrawerManager.js — Gerenciador Unificado de Painel Lateral (Drawer)
 *
 * TRUST Revenue Command Center (Design System 2.0)
 *
 * Renderiza detalhes contextuais (Nível 2 & Nível 3) sob demanda para:
 * - Tarefas
 * - Decisões
 * - Riscos
 * - Frentes
 * - POPs
 * - ICPs
 */

import { store } from '../state/StateManager.js';
import { ruleEngine } from '../engine/RuleEngine.js';

class DrawerManager {
  constructor() {
    this._container = null;
  }

  _getContainer() {
    if (!this._container) {
      let el = document.getElementById('drawer-container');
      if (!el) {
        el = document.createElement('div');
        el.id = 'drawer-container';
        document.body.appendChild(el);
      }
      this._container = el;
    }
    return this._container;
  }

  close() {
    const el = document.getElementById('drawer-backdrop');
    if (el) el.classList.remove('active');
  }

  openTask(taskId) {
    const state = store.getState();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const ws = state.workstreams.find(w => w.id === task.workstreamId);
    const tempCond = store.getTaskTemporalCondition(task);

    this._render(`
      <div class="drawer__header">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="badge ${task.priority === 'CRITICAL' ? 'badge--critical' : 'badge--high'}">${task.priority}</span>
            <span class="font-mono text-muted text-xs">${task.code}</span>
            <span class="text-xs text-secondary">${ws ? ws.name : ''}</span>
          </div>
          <h2 style="font-size: var(--fs-md); font-weight: var(--fw-semibold);">${task.title}</h2>
        </div>
        <button class="btn-subtle" onclick="drawer.close()" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="drawer__body">
        <div class="drawer-section">
          <div class="drawer-section__title">Status Operacional & Prazo</div>
          <div class="grid-2">
            <div>
              <div class="text-xs text-muted">Status</div>
              <div class="fw-semibold text-sm">${task.status}</div>
            </div>
            <div>
              <div class="text-xs text-muted">Prazo</div>
              <div class="font-mono text-sm fw-semibold">
                ${task.dueDate}
                ${tempCond === 'OVERDUE' ? '<span class="text-danger"> (Atrasada)</span>' : ''}
              </div>
            </div>
            <div>
              <div class="text-xs text-muted">Responsável</div>
              <div class="text-sm fw-semibold">${task.owner}</div>
            </div>
            <div>
              <div class="text-xs text-muted">Progresso</div>
              <div class="text-sm font-mono">${task.percentComplete}%</div>
            </div>
          </div>
        </div>

        <div class="drawer-section">
          <div class="drawer-section__title">Descrição Operacional</div>
          <p class="text-sm text-secondary" style="line-height: 1.6;">${task.description}</p>
          ${task.blockReason ? `
            <div class="p-3 mt-3" style="background: var(--clr-danger-bg); border-radius: var(--radius-sm); border: 1px solid var(--clr-danger-border);">
              <span class="text-danger fw-semibold text-xs">🔴 MOTIVO DO BLOQUEIO:</span>
              <div class="text-xs text-primary mt-1">${task.blockReason}</div>
            </div>
          ` : ''}
        </div>

        <div class="drawer-section">
          <div class="drawer-section__title">Dependências & Encadeamento</div>
          <div class="text-xs text-muted">
            ${(task.dependencies && task.dependencies.length > 0) ? `
              Depende de: ${task.dependencies.map(d => `<span class="badge badge--neutral">${d}</span>`).join(' ')}
            ` : 'Nenhuma dependência técnica pendente.'}
          </div>
        </div>
      </div>

      <div class="drawer__footer">
        <button class="btn-subtle" onclick="drawer.close()">Fechar</button>
        <button class="btn-prime" onclick="drawer.close(); openTaskTransitionModal('${task.id}', '${task.code}', '${task.title.replace(/'/g, "\\'")}', '${task.status}')">
          Alterar Status da Tarefa
        </button>
      </div>
    `);
  }

  openDecision(decisionId) {
    const state = store.getState();
    const d = state.decisions.find(item => item.id === decisionId || item.code === decisionId);
    if (!d) return;

    const impact = ruleEngine.analyzeDecisionImpact(d.id, state);

    this._render(`
      <div class="drawer__header">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="badge ${d.priorityTag === 'P0' ? 'badge--critical' : 'badge--high'}">${d.priorityTag || 'P0'}</span>
            <span class="font-mono text-muted text-xs">${d.code}</span>
            <span class="badge badge--neutral">${d.status}</span>
          </div>
          <h2 style="font-size: var(--fs-md); font-weight: var(--fw-semibold);">${d.title}</h2>
        </div>
        <button class="btn-subtle" onclick="drawer.close()" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="drawer__body">
        <div class="drawer-section">
          <div class="drawer-section__title">Contexto & Responsabilidade</div>
          <div class="grid-2 mb-3">
            <div>
              <div class="text-xs text-muted">Responsável</div>
              <div class="fw-semibold text-sm">${d.owner}</div>
            </div>
            <div>
              <div class="text-xs text-muted">Prazo de Resolução</div>
              <div class="font-mono text-sm fw-semibold text-danger">${d.deadline}</div>
            </div>
          </div>
          <p class="text-sm text-secondary">${d.description}</p>
        </div>

        <div class="drawer-section">
          <div class="drawer-section__title">Simulação de Impacto na Operação</div>
          <div class="text-xs text-muted mb-2">Frentes desbloqueadas: <strong class="text-primary">${impact?.blockedWorkstreams.join(', ') || 'Geral'}</strong></div>
          <div class="p-3 mb-3" style="background: var(--clr-success-bg); border-radius: var(--radius-sm); border: 1px solid var(--clr-success-border);">
            <div class="text-xs text-success fw-semibold">GANHO DE VELOCIDADE ESTIMADO:</div>
            <div class="text-xs text-primary mt-1">${impact?.estimatedVelocityGain}</div>
          </div>
          <div class="text-xs text-secondary fw-semibold mb-1">TAREFAS LIBERADAS IMEDIATAMENTE:</div>
          <ul class="text-xs text-primary" style="padding-left: var(--sp-4);">
            ${impact?.directTasksUnlocked.map(t => `<li><strong>${t.code}:</strong> ${t.title}</li>`).join('') || '<li>Nenhuma</li>'}
          </ul>
        </div>

        ${d.resolutionNotes ? `
          <div class="drawer-section">
            <div class="drawer-section__title">Registro de Resolução (Histórico)</div>
            <div class="text-xs text-primary p-3" style="background: var(--bg-elevated); border-radius: var(--radius-sm);">
              ${d.resolutionNotes}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="drawer__footer">
        <button class="btn-subtle" onclick="drawer.close()">Fechar</button>
        ${d.status === 'PENDING' ? `
          <button class="btn-prime" onclick="drawer.close(); openDecisionModal('${d.id}', '${d.code}', '${d.title.replace(/'/g, "\\'")}')">
            REGISTRAR DECISÃO AGORA →
          </button>
        ` : ''}
      </div>
    `);
  }

  openRisk(riskId) {
    const state = store.getState();
    const r = (state.risks || []).find(item => item.id === riskId || item.code === riskId);
    if (!r) return;

    this._render(`
      <div class="drawer__header">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="badge ${r.severity === 'CRITICAL' ? 'badge--critical' : 'badge--high'}">${r.severity}</span>
            <span class="font-mono text-muted text-xs">${r.code}</span>
            <span class="badge badge--neutral">${r.status || 'OPEN'}</span>
          </div>
          <h2 style="font-size: var(--fs-md); font-weight: var(--fw-semibold);">${r.title}</h2>
        </div>
        <button class="btn-subtle" onclick="drawer.close()" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="drawer__body">
        <div class="drawer-section">
          <div class="drawer-section__title">Avaliação Quantitativa de Risco (P × I)</div>
          <div class="grid-3 mb-3">
            <div>
              <div class="text-xs text-muted">Probabilidade</div>
              <div class="fw-bold text-sm font-mono">${r.probability} / 5</div>
            </div>
            <div>
              <div class="text-xs text-muted">Impacto</div>
              <div class="fw-bold text-sm font-mono">${r.impact} / 5</div>
            </div>
            <div>
              <div class="text-xs text-muted">Severidade Final</div>
              <div class="fw-bold text-sm font-mono text-danger">${r.probability * r.impact} / 25</div>
            </div>
          </div>
        </div>

        <div class="drawer-section">
          <div class="drawer-section__title">Diagnóstico & Causa Raiz</div>
          <p class="text-sm text-secondary mb-3" style="line-height: 1.6;">${r.description}</p>
          <div class="text-xs text-muted">Frente de Origem / Responsável: <strong class="text-primary">${r.owner || 'Comercial / Ops'}</strong></div>
        </div>

        <div class="drawer-section">
          <div class="drawer-section__title">Plano de Mitigação & Ação Preventiva</div>
          <div class="p-3" style="background: var(--bg-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); line-height: 1.6;">
            <span class="text-brand fw-semibold text-xs block mb-1">PLANO ATIVO:</span>
            <div class="text-xs text-primary">${r.mitigationPlan}</div>
          </div>
        </div>
      </div>

      <div class="drawer__footer">
        <button class="btn-subtle" onclick="drawer.close()">Fechar</button>
      </div>
    `);
  }

  _render(html) {
    const container = this._getContainer();
    container.innerHTML = `
      <div id="drawer-backdrop" class="drawer-backdrop" onclick="drawer.close()">
        <div class="drawer" onclick="event.stopPropagation()">
          ${html}
        </div>
      </div>
    `;
    setTimeout(() => {
      const el = document.getElementById('drawer-backdrop');
      if (el) el.classList.add('active');
    }, 10);
  }
}

export const drawer = new DrawerManager();
window.drawer = drawer;
