/**
 * views/strategy.js — ICPs com Evidências, POPs Vivos, Battle Cards & Learning Loop
 *
 * TRUST Revenue Command Center (Fase 4.2)
 */

import { store } from '../state/StateManager.js';
import { renderCadences } from './cadences.js';

export function renderStrategy() {
  const state = store.getState();
  const { icps, battleCards, pops, evidences, selectedStrategySection = 'POPS', selectedICPSolution, selectedBCSolution } = state;

  const filteredICPs = selectedICPSolution === 'ALL' ? icps : icps.filter(i => i.solution === selectedICPSolution);
  const filteredBCs  = selectedBCSolution === 'ALL' ? battleCards : battleCards.filter(b => b.solution === selectedBCSolution);
  const solutions = ['ALL', 'CAPTO', 'LUMA', 'SERVICES'];
  const refutedICPs = icps.filter(i => i.status === 'REFUTADA');

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Estratégia, Disciplina & Aprendizado</div>
        <h1 class="page-header__title">ICPs · Evidências · POPs & Cadências</h1>
        <p class="page-header__subtitle">
          Estratégia comercial ancorada em processos padrão, personas auditáveis e cadências multicanal.
        </p>
      </div>
      <button class="btn-prime" onclick="openEvidenceModal()">
        + Anexar Evidência
      </button>
    </div>

    <!-- SELETOR PRINCIPAL DE SEÇÕES (SEM SCROLL EXCESSIVO) -->
    <div class="op-tabs-wrap mb-6">
      <div class="op-tabs">
        <button class="op-tab-btn ${selectedStrategySection === 'POPS' ? 'active' : ''}" onclick="selectStrategySection('POPS')">
          📋 POPs Vivos (${pops.length})
        </button>
        <button class="op-tab-btn ${selectedStrategySection === 'ICPS' ? 'active' : ''}" onclick="selectStrategySection('ICPS')">
          🎯 Matriz de ICPs (${icps.length})
        </button>
        <button class="op-tab-btn ${selectedStrategySection === 'CADENCES' ? 'active' : ''}" onclick="selectStrategySection('CADENCES')">
          ✉️ Cadências & Scripts (Outbound)
        </button>
        <button class="op-tab-btn ${selectedStrategySection === 'LEARNINGS' ? 'active' : ''}" onclick="selectStrategySection('LEARNINGS')">
          💡 Aprendizados & Refutações (${refutedICPs.length})
        </button>
        <button class="op-tab-btn ${selectedStrategySection === 'BATTLECARDS' ? 'active' : ''}" onclick="selectStrategySection('BATTLECARDS')">
          ⚔️ Battle Cards (${battleCards.length})
        </button>
      </div>
    </div>

    <!-- CONTEÚDO DA SEÇÃO SELECIONADA -->
    ${selectedStrategySection === 'CADENCES' ? renderCadences() : selectedStrategySection === 'POPS' ? `
      <!-- POPs VIVOS -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <div class="text-md fw-semibold text-primary">POPs Vivos (Procedimentos Operacionais)</div>
            <div class="text-xs text-muted">10 Procedimentos ativos · Marque os itens do checklist para evoluir o status</div>
          </div>
        </div>

        <div class="grid-2">
          ${pops.map(pop => renderPOPCard(pop)).join('')}
        </div>
      </div>
    ` : ''}

    ${selectedStrategySection === 'ICPS' ? `
      <!-- MATRIZ DE ICPs COM EVIDÊNCIAS -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <div class="text-md fw-semibold text-primary">Matriz de ICPs & Validações de Mercado</div>
            <div class="text-xs text-muted">${icps.length} ICPs mapeados · Régua de maturidade baseada em evidências</div>
          </div>
          <div class="flex gap-2">
            ${solutions.map(s => `
              <button class="btn-subtle ${selectedICPSolution === s ? 'active' : ''}" style="${selectedICPSolution === s ? 'background: var(--clr-brand-subtle); color: var(--clr-brand); font-weight: var(--fw-semibold);' : ''}"
                      onclick="selectICPSolution('${s}')">
                ${s === 'ALL' ? 'Todos' : s}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid-3">
          ${filteredICPs.map(icp => renderICPCard(icp, evidences)).join('')}
        </div>
      </div>
    ` : ''}

    ${selectedStrategySection === 'LEARNINGS' ? `
      <!-- PAINEL DE APRENDIZADOS & REFUTAÇÕES (LEARNING LOOP) -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <div class="text-md fw-semibold text-primary">Memória de Aprendizados de Campo & Refutações</div>
            <div class="text-xs text-muted">Hipóteses testadas e descartadas na operação com registro de aprendizado e pivô</div>
          </div>
        </div>

        ${refutedICPs.length === 0 ? `
          <div class="card-panel" style="padding: var(--sp-8); text-align: center;">
            <div class="text-sm fw-semibold text-primary mb-1">Nenhuma hipótese refutada até o momento</div>
            <div class="text-xs text-muted">Quando um ICP for testado e não tracionar, clique em "Refutar / Pivotar" na Matriz de ICPs para documentar o aprendizado.</div>
          </div>
        ` : `
          <div class="grid-2">
            ${refutedICPs.map(icp => renderRefutedCard(icp)).join('')}
          </div>
        `}
      </div>
    ` : ''}

    ${selectedStrategySection === 'BATTLECARDS' ? `
      <!-- BATTLE CARDS -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <div class="text-md fw-semibold text-primary">Battle Cards de Vendas</div>
            <div class="text-xs text-muted">Argumentários, objeções e perguntas de discovery</div>
          </div>
          <div class="flex gap-2">
            ${solutions.map(s => `
              <button class="btn-subtle ${selectedBCSolution === s ? 'active' : ''}" style="${selectedBCSolution === s ? 'background: var(--clr-brand-subtle); color: var(--clr-brand); font-weight: var(--fw-semibold);' : ''}"
                      onclick="selectBCSolution('${s}')">
                ${s === 'ALL' ? 'Todos' : s}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="grid-2">
          ${filteredBCs.map(bc => renderBattleCard(bc)).join('')}
        </div>
      </div>
    ` : ''}

    <div id="strategy-modal-container"></div>
  `;
}

function renderPOPCard(pop) {
  return `
    <div class="card-panel" style="border-left: 4px solid ${pop.status === 'APROVADO' ? 'var(--clr-success)' : pop.status === 'PRONTO_PARA_APROVACAO' ? 'var(--clr-warning)' : 'var(--border-strong)'};">
      <div class="card-panel__header">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs text-muted">${pop.code}</span>
          <span class="text-sm fw-semibold text-primary">${pop.name}</span>
        </div>
        <span class="badge ${pop.status === 'APROVADO' ? 'badge--done' : pop.status === 'PRONTO_PARA_APROVACAO' ? 'badge--high' : 'badge--neutral'}">
          ${pop.status} (${pop.progressPct}%)
        </span>
      </div>
      <div class="card-panel__body">
        <div class="text-xs text-secondary mb-3" style="line-height: 1.5;">${pop.objective}</div>

        <div class="text-xs fw-semibold text-primary mb-2">CHECKLIST DE IMPLEMENTAÇÃO:</div>
        <div class="flex flex-col gap-2 mb-4">
          ${(pop.checklist || []).map(item => `
            <label class="flex items-center gap-2 text-xs text-primary" style="cursor: pointer; line-height: 1.5;">
              <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="togglePOPItem('${pop.id}', '${item.id}')" />
              <span style="${item.completed ? 'color: var(--clr-success); font-weight: var(--fw-medium);' : ''}">${item.text}</span>
            </label>
          `).join('')}
        </div>

        <div class="pt-3 flex justify-between items-center" style="border-top: 1px solid var(--border-subtle);">
          <span class="text-xs text-muted">Owner: <strong class="text-primary">${pop.owner}</strong></span>
          <div class="flex items-center gap-2">
            ${pop.status === 'PRONTO_PARA_APROVACAO' ? `
              <button class="btn-prime" style="padding: 4px 10px; font-size: var(--fs-2xs);" onclick="approvePOP('${pop.id}')">
                ✓ Aprovar POP (Diretoria)
              </button>
            ` : ''}
            <span class="text-xs text-brand font-mono">${pop.nextStep || 'Execução'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderICPCard(icp, evidences) {
  const icpEvidences = evidences.filter(e => e.relatedEntityId === icp.id || e.relatedEntityId === icp.code || (icp.evidenceIds || []).includes(e.id));
  const isRefuted = icp.status === 'REFUTADA';
  const hasFormalDoc = icpEvidences.some(e => e.type === 'DOCUMENT' || e.type === 'PILOT_RESULT');
  const maturityLevel = isRefuted ? 'REFUTADA / AJUSTAR' : icpEvidences.length === 0 ? 'N1 (Hipótese)' : hasFormalDoc ? 'N3 (Mercado)' : 'N2 (Comercial)';
  const maturityBadge = isRefuted ? 'badge--critical' : icpEvidences.length === 0 ? 'badge--neutral' : hasFormalDoc ? 'badge--done' : 'badge--info';

  return `
    <div class="card-panel" style="${isRefuted ? 'opacity: 0.85; border-left: 4px solid var(--clr-danger);' : ''}">
      <div class="card-panel__header">
        <span class="font-mono text-xs text-muted">${icp.code}</span>
        <div class="flex gap-2">
          <span class="badge badge--neutral">${icp.solution}</span>
          <span class="badge ${maturityBadge}">
            ${maturityLevel}
          </span>
        </div>
      </div>
      <div class="card-panel__body">
        <div class="text-sm fw-semibold text-primary mb-2">${icp.name}</div>
        <div class="text-xs text-muted mb-1"><strong>Segmento:</strong> ${icp.segment}</div>
        <div class="text-xs text-muted mb-1"><strong>Persona:</strong> ${icp.persona}</div>
        <div class="text-xs text-secondary mb-3" style="line-height: 1.5;"><strong>Caso de Uso:</strong> ${icp.useCase}</div>

        ${isRefuted ? `
          <div class="p-3 mb-3" style="background: var(--clr-danger-bg); border-radius: var(--radius-sm); border: 1px solid var(--clr-danger-border);">
            <div class="text-2xs text-danger fw-bold uppercase">Motivo da Refutação:</div>
            <div class="text-xs text-primary mt-1">${icp.refutedReason}</div>
            <div class="text-2xs text-secondary mt-1"><strong>Aprendizado:</strong> ${icp.keyLearning}</div>
          </div>
        ` : `
          <!-- EVIDÊNCIAS VINCULADAS -->
          <div style="background: var(--bg-elevated); padding: var(--sp-3); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: var(--sp-3);">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs fw-semibold text-primary">EVIDÊNCIAS REAIS (${icpEvidences.length})</span>
              <button class="text-xs text-brand fw-semibold" onclick="openEvidenceModalForICP('${icp.id}', '${icp.code}')">+ Anexar</button>
            </div>
            ${icpEvidences.length === 0 ? `
              <div class="text-xs text-muted italic">Nenhuma evidência registrada.</div>
            ` : icpEvidences.map(e => `
              <div class="text-xs text-primary mt-1">📌 <strong>${e.title}:</strong> ${e.description}</div>
            `).join('')}
          </div>

          <div class="flex justify-end">
            <button class="text-xs text-danger fw-semibold" onclick="openRefuteModal('${icp.id}', '${icp.code}', '${icp.name.replace(/'/g, "\\'")}')">
              Refutar / Pivotar Hipótese ➔
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}

function renderRefutedCard(icp) {
  return `
    <div class="card-panel" style="border-left: 4px solid var(--clr-danger);">
      <div class="card-panel__header" style="background: var(--clr-danger-bg);">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs text-muted">${icp.code}</span>
          <span class="text-sm fw-semibold text-primary">${icp.name}</span>
        </div>
        <span class="badge badge--critical">REFUTADA / PIVOT</span>
      </div>
      <div class="card-panel__body">
        <div class="text-xs text-muted mb-1">MOTIVO DO DESCARTE / INSUCESSO EM CAMPO</div>
        <div class="text-sm text-primary mb-3" style="line-height: 1.5;">${icp.refutedReason}</div>

        <div class="p-3 mb-3" style="background: var(--bg-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div class="text-xs text-brand fw-bold mb-1">💡 APRENDIZADO OPERACIONAL:</div>
          <div class="text-xs text-secondary mb-2">${icp.keyLearning}</div>
          <div class="text-xs text-muted"><strong>Ação Corretiva:</strong> ${icp.correctiveAction}</div>
        </div>

        <div class="flex justify-between items-center text-xs text-muted pt-2" style="border-top: 1px solid var(--border-subtle);">
          <span>Registrado por: <strong class="text-primary">${icp.refutedBy}</strong></span>
          <span>Solução: <strong class="text-primary">${icp.solution}</strong></span>
        </div>
      </div>
    </div>
  `;
}

function renderBattleCard(bc) {
  return `
    <div class="card-panel">
      <div class="card-panel__header">
        <span class="badge badge--neutral">${bc.solution}</span>
        <span class="text-sm fw-semibold text-warning">"${bc.objection}"</span>
      </div>
      <div class="card-panel__body">
        <div class="text-xs text-muted mb-1">RESPOSTA OPERACIONAL</div>
        <div class="text-xs text-primary mb-3" style="line-height: 1.6;">${bc.response}</div>

        <div class="text-xs text-muted mb-1">PERGUNTAS DE DISCOVERY</div>
        <ul class="text-xs text-secondary mb-3" style="padding-left: var(--sp-4); line-height: 1.5;">
          ${bc.discoveryQuestions.map(q => `<li>${q}</li>`).join('')}
        </ul>

        <div class="p-2" style="background: var(--clr-brand-subtle); border-radius: var(--radius-sm);">
          <span class="text-xs text-brand fw-semibold">PRÓXIMO PASSO:</span>
          <span class="text-xs text-primary">${bc.nextBestStep}</span>
        </div>
      </div>
    </div>
  `;
}

// Sub-navegação e Modais
window.selectStrategySection = function(section) {
  store.setSelectedStrategySection(section);
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderStrategy();
};

window.selectICPSolution = function(sol) {
  store.setSelectedICPSolution(sol);
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderStrategy();
};

window.selectBCSolution = function(sol) {
  store.setSelectedBCSolution(sol);
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderStrategy();
};

window.openRefuteModal = function(icpId, code, name) {
  const container = document.getElementById('strategy-modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="drawer-backdrop active" onclick="closeStrategyModal()">
      <div class="drawer" style="max-width: 520px; margin: auto; height: auto; border-radius: var(--radius-lg);" onclick="event.stopPropagation()">
        <div class="drawer__header">
          <div>
            <span class="badge badge--critical mb-1">LEARNING LOOP · REFUTAR HIPÓTESE</span>
            <h3 class="text-md fw-semibold text-primary">${code} — ${name}</h3>
          </div>
          <button class="btn-subtle" onclick="closeStrategyModal()">✕</button>
        </div>
        <div class="drawer__body">
          <label class="text-xs text-muted fw-semibold mb-1 block">MOTIVO DA REFUTAÇÃO EM CAMPO *</label>
          <textarea id="refute-reason" class="btn-subtle mb-3" style="width:100%; height:70px; text-align: left;" placeholder="O que foi observado nas abordagens que invalidou esta hipótese?"></textarea>

          <label class="text-xs text-muted fw-semibold mb-1 block">PRINCIPAL APRENDIZADO ACUMULADO *</label>
          <textarea id="refute-learning" class="btn-subtle mb-3" style="width:100%; height:70px; text-align: left;" placeholder="Ex: Mercado exige homologação prévia ou ticket é incompatível..."></textarea>

          <div class="grid-2 mb-3">
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">AÇÃO CORRETIVA / PIVÔ</label>
              <input id="refute-action" type="text" class="btn-subtle" style="width:100%;" placeholder="Ex: Focar no ICP CAPTO-02" />
            </div>
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">RESPONSÁVEL</label>
              <select id="refute-author" class="btn-subtle" style="width:100%;">
                <option value="Comercial">Comercial</option>
                <option value="Diretor Comercial">Diretor Comercial</option>
                <option value="SDR Lead">SDR Lead</option>
                <option value="Marketing Ops">Marketing Ops</option>
              </select>
            </div>
          </div>
        </div>
        <div class="drawer__footer">
          <button class="btn-subtle" onclick="closeStrategyModal()">Cancelar</button>
          <button class="btn-prime" style="background: var(--clr-danger);" onclick="submitRefutation('${icpId}')">
            Documentar Refutação e Aprendizado
          </button>
        </div>
      </div>
    </div>
  `;
};

window.submitRefutation = async function(icpId) {
  const reasonEl = document.getElementById('refute-reason');
  const learningEl = document.getElementById('refute-learning');
  const actionEl = document.getElementById('refute-action');
  const authorEl = document.getElementById('refute-author');

  if (!reasonEl || !reasonEl.value.trim() || !learningEl || !learningEl.value.trim()) {
    return alert('Preencha o motivo da refutação e o aprendizado acumulado.');
  }

  await store.refuteICPHypothesis(icpId, {
    reason: reasonEl.value.trim(),
    keyLearning: learningEl.value.trim(),
    correctiveAction: actionEl?.value.trim() || 'Ajuste de segmentação',
    author: authorEl?.value || 'Comercial',
  });

  closeStrategyModal();
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderStrategy();
};

window.openEvidenceModal = function() {
  openEvidenceModalForICP('', '');
};

window.openEvidenceModalForICP = function(entityId, entityCode) {
  const container = document.getElementById('strategy-modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="drawer-backdrop active" onclick="closeStrategyModal()">
      <div class="drawer" style="max-width: 500px; margin: auto; height: auto; border-radius: var(--radius-lg);" onclick="event.stopPropagation()">
        <div class="drawer__header">
          <h3 class="text-md fw-semibold text-primary">Anexar Evidência Verificável</h3>
          <button class="btn-subtle" onclick="closeStrategyModal()">✕</button>
        </div>
        <div class="drawer__body">
          <label class="text-xs text-muted fw-semibold mb-1 block">TÍTULO DA EVIDÊNCIA *</label>
          <input id="ev-title" type="text" class="btn-subtle mb-3" style="width:100%; text-align: left;" placeholder="Ex: Discovery com Rastreadora Beta" />

          <div class="grid-2 mb-3">
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">TIPO</label>
              <select id="ev-type" class="btn-subtle" style="width:100%;">
                <option value="DISCOVERY_CALL">Discovery / Reunião Comercial</option>
                <option value="BENCHMARK">Benchmarking de Mercado</option>
                <option value="DOCUMENT">Documento / Proposta / Edital</option>
                <option value="PILOT_RESULT">Resultado de Piloto / Teste</option>
                <option value="NOTE">Nota Interna Auditada</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">ENTIDADE VINCULADA</label>
              <input id="ev-entity" type="text" class="btn-subtle" style="width:100%;" value="${entityCode || 'Geral'}" />
            </div>
          </div>

          <label class="text-xs text-muted fw-semibold mb-1 block">DESCRIÇÃO DOS FATOS VERIFICADOS *</label>
          <textarea id="ev-desc" class="btn-subtle mb-3" style="width:100%; height:70px; text-align: left;" placeholder="Detalhes factuais da comprovação..."></textarea>
        </div>
        <div class="drawer__footer">
          <button class="btn-subtle" onclick="closeStrategyModal()">Cancelar</button>
          <button class="btn-prime" onclick="submitEvidence('${entityId}')">Salvar Evidência</button>
        </div>
      </div>
    </div>
  `;
};

window.submitEvidence = async function(entityId) {
  const titleEl = document.getElementById('ev-title');
  const typeEl = document.getElementById('ev-type');
  const entityEl = document.getElementById('ev-entity');
  const descEl = document.getElementById('ev-desc');

  if (!titleEl || !titleEl.value.trim() || !descEl || !descEl.value.trim()) {
    return alert('Preencha o título e a descrição da evidência.');
  }

  await store.addEvidence({
    title: titleEl.value.trim(),
    type: typeEl.value,
    description: descEl.value.trim(),
    source: 'Registro Interno',
    relatedEntityType: 'ICP',
    relatedEntityId: entityEl.value.trim() || entityId,
  });

  closeStrategyModal();
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderStrategy();
};

window.togglePOPItem = async function(popId, itemId) {
  await store.togglePOPChecklist(popId, itemId);
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderStrategy();
};

window.approvePOP = async function(popId) {
  const actor = prompt('Informe o responsável pela aprovação formal (Ex: Diretor Comercial):', 'Diretoria Comercial');
  if (actor) {
    await store.approvePOP(popId, actor);
    const container = document.getElementById('page-container');
    if (container) container.innerHTML = renderStrategy();
  }
};

window.closeStrategyModal = function() {
  const container = document.getElementById('strategy-modal-container');
  if (container) container.innerHTML = '';
};
