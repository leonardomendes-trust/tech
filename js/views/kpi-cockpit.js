/**
 * views/kpi-cockpit.js — RevOps KPI Cockpit & Forecast de Receita Integrado
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';
import { renderForecastEngine } from './forecast-engine.js';

export function renderKPICockpit() {
  const state = store.getState();
  const dayInfo = store.getCurrentDayInfo();
  const activeTab = state.selectedKPITab || 'FUNNEL'; // 'FUNNEL' | 'FORECAST'
  const funnel = state.funnel || [];

  // Calcular métricas agregadas reais
  const totalLeads = funnel[0]?.real || 0;
  const totalReunioes = funnel[3]?.real || 0;
  const totalPropostas = funnel[5]?.real || 0;

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Performance, Funil & Forecast</div>
        <h1 class="page-header__title">RevOps Cockpit · Tração & Projeções</h1>
        <p class="page-header__subtitle">
          Monitoramento do funil comercial, metas de implantação e simulador financeiro no ciclo <strong>${dayInfo.dayLabel} / D30</strong>.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-subtle" onclick="exportExecutiveReport('MD')">
          📄 Exportar Ata (.MD)
        </button>
        <button class="btn-prime" onclick="viewExecutiveReportModal()">
          👁️ Ver Relatório Formatado
        </button>
      </div>
    </div>

    <!-- SUB-ABAS DO MÓDULO REVOPS -->
    <div class="op-tabs-wrap mb-6">
      <div class="op-tabs">
        <button class="op-tab-btn ${activeTab === 'FUNNEL' ? 'active' : ''}" onclick="selectKPITab('FUNNEL')">
          📊 Funil de Receita & Conversões
        </button>
        <button class="op-tab-btn ${activeTab === 'FORECAST' ? 'active' : ''}" onclick="selectKPITab('FORECAST')">
          💰 Forecast Financeiro & Projeção
        </button>
      </div>
    </div>

    ${activeTab === 'FORECAST' ? renderForecastEngine() : `
      <!-- SUMÁRIO DE RECEITA & VELOCIDADE -->
      <div class="grid-3 mb-6">
        <div class="card-panel" style="margin-bottom: 0;">
          <div class="card-panel__body">
            <div class="text-xs text-muted mb-1 uppercase fw-semibold">Pipeline Ativo Estimado</div>
            <div class="text-2xl fw-bold text-brand font-mono">R$ ${(totalPropostas * 75000).toLocaleString('pt-BR')}</div>
            <div class="text-xs text-secondary mt-1">${totalPropostas} deal(s) em negociação direta</div>
          </div>
        </div>
        <div class="card-panel" style="margin-bottom: 0;">
          <div class="card-panel__body">
            <div class="text-xs text-muted mb-1 uppercase fw-semibold">Taxa de Conversão Discovery ➔ Proposta</div>
            <div class="text-2xl fw-bold text-success font-mono">${totalReunioes > 0 ? ((totalPropostas / totalReunioes) * 100).toFixed(1) : '0.0'}%</div>
            <div class="text-xs text-secondary mt-1">${totalPropostas} proposta(s) gerada(s) de ${totalReunioes} reuniões</div>
          </div>
        </div>
        <div class="card-panel" style="margin-bottom: 0;">
          <div class="card-panel__body">
            <div class="text-xs text-muted mb-1 uppercase fw-semibold">Ciclo Médio de Venda Atual</div>
            <div class="text-2xl fw-bold text-primary font-mono">18 dias</div>
            <div class="text-xs text-secondary mt-1">Soluções: CAPTO (14d) · LUMA (21d)</div>
          </div>
        </div>
      </div>

      <!-- FUNIL DE CONVERSÃO REVOPS (OPERACIONAL E EDITÁVEL) -->
      <div class="card-panel mb-6">
        <div class="card-panel__header">
          <span>Funil de Receita em Produção (Real vs. Meta)</span>
          <span class="badge badge--on-track">Dados Operacionais</span>
        </div>
        <div class="card-panel__body">
          <div class="flex flex-col gap-4">
            ${funnel.map(f => {
              const pct = f.meta > 0 ? Math.min(100, Math.round((f.real / f.meta) * 100)) : 0;
              return `
                <div>
                  <div class="flex justify-between items-center mb-1 text-xs">
                    <div class="flex items-center gap-2">
                      <span class="fw-semibold text-primary">${f.stage}</span>
                      <button class="text-2xs text-brand fw-semibold" style="padding: 1px 6px; background: var(--clr-brand-subtle); border-radius: var(--radius-sm);" onclick="openEditFunnelModal('${f.id}', '${f.stage.replace(/'/g, "\\'")}', ${f.real}, ${f.meta})">
                        ✏️ Atualizar
                      </button>
                    </div>
                    <span class="font-mono text-muted">
                      <strong>${f.real}</strong> / ${f.meta} ${f.unit} (<strong class="text-primary">${pct}%</strong>)
                    </span>
                  </div>
                  <div style="height: 10px; background: var(--bg-elevated); border-radius: var(--radius-full); overflow: hidden; border: 1px solid var(--border-subtle);">
                    <div style="height: 100%; width: ${pct}%; background: ${f.color || 'var(--clr-brand)'}; border-radius: var(--radius-full); transition: width 300ms ease;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `}

    <div id="kpi-modal-container"></div>
  `;
}

window.selectKPITab = function(tab) {
  store._setState({ selectedKPITab: tab });
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderKPICockpit();
};

// Modal de edição do funil
window.openEditFunnelModal = function(id, stage, currentReal, currentMeta) {
  const container = document.getElementById('kpi-modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="drawer-backdrop active" onclick="closeKpiModal()">
      <div class="drawer" style="max-width: 440px; margin: auto; height: auto; border-radius: var(--radius-lg);" onclick="event.stopPropagation()">
        <div class="drawer__header">
          <div>
            <span class="badge badge--neutral mb-1">ATUALIZAR FUNIL</span>
            <h3 class="text-md fw-semibold text-primary">${stage}</h3>
          </div>
          <button class="btn-subtle" onclick="closeKpiModal()">✕</button>
        </div>
        <div class="drawer__body">
          <div class="grid-2 mb-3">
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">VALOR REAL ATUAL *</label>
              <input id="funnel-real" type="number" class="btn-subtle" style="width:100%;" value="${currentReal}" />
            </div>
            <div>
              <label class="text-xs text-muted fw-semibold mb-1 block">META DEFINIDA *</label>
              <input id="funnel-meta" type="number" class="btn-subtle" style="width:100%;" value="${currentMeta}" />
            </div>
          </div>
        </div>
        <div class="drawer__footer">
          <button class="btn-subtle" onclick="closeKpiModal()">Cancelar</button>
          <button class="btn-prime" onclick="submitFunnelUpdate('${id}')">Salvar Indicador</button>
        </div>
      </div>
    </div>
  `;
};

window.submitFunnelUpdate = async function(id) {
  const realEl = document.getElementById('funnel-real');
  const metaEl = document.getElementById('funnel-meta');

  if (!realEl || !metaEl) return;

  await store.updateFunnelStage(id, {
    real: Number(realEl.value),
    meta: Number(metaEl.value),
  });

  closeKpiModal();
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderKPICockpit();
};

window.closeKpiModal = function() {
  const container = document.getElementById('kpi-modal-container');
  if (container) container.innerHTML = '';
};

// Visualização do Relatório Executivo dentro do Sistema
window.viewExecutiveReportModal = function() {
  const state = store.getState();
  const dayInfo = store.getCurrentDayInfo();
  const progress = store.getImplantacaoProgress();
  const pendingDecisions = store.getPendingDecisions();

  const container = document.getElementById('kpi-modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="drawer-backdrop active" onclick="closeKpiModal()">
      <div class="drawer" style="max-width: 680px; margin: auto; height: 85vh; border-radius: var(--radius-lg);" onclick="event.stopPropagation()">
        <div class="drawer__header">
          <div>
            <span class="badge badge--on-track mb-1">RELATÓRIO EXECUTIVO</span>
            <h3 class="text-md fw-semibold text-primary">Ata Operacional · ${dayInfo.dayLabel} (${dayInfo.formattedDate})</h3>
          </div>
          <button class="btn-subtle" onclick="closeKpiModal()">✕</button>
        </div>
        <div class="drawer__body" style="line-height: 1.7; font-size: var(--fs-sm);">
          <div class="p-3 mb-4" style="background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div class="text-xs text-muted fw-semibold">RESUMO DA IMPLANTAÇÃO:</div>
            <div class="text-primary mt-1">
              Progresso global de <strong>${progress.pct}%</strong> (${progress.done} de ${progress.total} tarefas concluídas).<br/>
              Bloqueios críticos ativos: <strong class="${progress.blocked > 0 ? 'text-danger' : 'text-success'}">${progress.blocked}</strong> | Decisões pendentes da Diretoria: <strong class="text-warning">${pendingDecisions.length}</strong>.
            </div>
          </div>

          <div class="text-xs text-muted fw-bold uppercase mb-2">Decisões Prioritárias Aguardando Deliberação:</div>
          <ul class="mb-4" style="padding-left: var(--sp-4);">
            ${pendingDecisions.length === 0 ? '<li>Nenhuma decisão pendente.</li>' : pendingDecisions.map(d => `<li><strong>[${d.priorityTag || 'P0'}] ${d.code}:</strong> ${d.title} (Prazo: ${d.deadline}, Responsável: ${d.owner})</li>`).join('')}
          </ul>

          <div class="text-xs text-muted fw-bold uppercase mb-2">Saúde das 8 Frentes de Trabalho:</div>
          <div class="grid-2 mb-4" style="gap: var(--sp-2);">
            ${state.workstreams.map(ws => `
              <div class="p-2" style="background: var(--bg-elevated); border-radius: var(--radius-sm); font-size: var(--fs-xs);">
                <strong>${ws.code} — ${ws.name}:</strong> ${ws.progressPct}% (<span class="${ws.healthScore === 'CRITICAL' ? 'text-danger' : 'text-success'}">${ws.healthScore}</span>)
              </div>
            `).join('')}
          </div>

          <div class="text-xs text-muted fw-bold uppercase mb-2">Aprendizados de Campo Registrados:</div>
          <ul style="padding-left: var(--sp-4);">
            ${state.icps.filter(i => i.status === 'REFUTADA').map(i => `<li><strong>${i.code}:</strong> ${i.keyLearning} (Pivô: ${i.correctiveAction})</li>`).join('') || '<li>Nenhuma refutação de hipótese até o momento.</li>'}
          </ul>
        </div>
        <div class="drawer__footer">
          <button class="btn-subtle" onclick="window.print()">🖨️ Imprimir</button>
          <button class="btn-prime" onclick="exportExecutiveReport('MD')">Baixar Arquivo .MD</button>
        </div>
      </div>
    </div>
  `;
};

window.exportExecutiveReport = function(format = 'MD') {
  const state = store.getState();
  const dayInfo = store.getCurrentDayInfo();
  const progress = store.getImplantacaoProgress();
  const pendingDecisions = store.getPendingDecisions();

  const report = `# RELATÓRIO EXECUTIVO OPERACIONAL — TRUST REVENUE COMMAND CENTER
Data de Emissão: ${dayInfo.formattedDate} (${dayInfo.dayLabel} / D30)
Fonte: Operação independente

## 1. STATUS GERAL DA IMPLANTAÇÃO
- Progresso Global: ${progress.pct}%
- Tarefas Concluídas: ${progress.done} / ${progress.total}
- Bloqueios Ativos: ${progress.blocked}
- Decisões Pendentes de Diretoria: ${pendingDecisions.length}

## 2. DECISÕES PRIORITÁRIAS PENDENTES
${pendingDecisions.map(d => `- [${d.priorityTag || 'P0'}] ${d.code} — ${d.title} (Prazo: ${d.deadline}, Responsável: ${d.owner})`).join('\n')}

## 3. FRENTES DE TRABALHO
${state.workstreams.map(ws => `- ${ws.code} — ${ws.name}: ${ws.progressPct}% [${ws.healthScore}] (Owner: ${ws.owner})`).join('\n')}

## 4. APRENDIZADOS DE CAMPO REGISTRADOS
${state.icps.filter(i => i.status === 'REFUTADA').map(i => `- ${i.code} (${i.name}): ${i.keyLearning}`).join('\n') || '- Nenhum descarte de hipótese.'}

---
Gerado automaticamente pelo TRUST Revenue Command Center.`;

  const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `TRUST_Relatorio_Executivo_${dayInfo.dayLabel}_${Date.now()}.md`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
