/**
 * views/forecast-engine.js — Simulador de Receita & Forecast Preditivo (RevOps Financial Engine)
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';

export function renderForecastEngine() {
  const state = store.getState();
  const dayInfo = store.getCurrentDayInfo();

  // Parâmetros de projeção padrão (editáveis)
  const defaultParams = {
    captoTicket: 45000,
    lumaTicket: 85000,
    servicesTicket: 30000,
    discoveryPerMonth: 24,
    convDiscoveryToPilot: 35, // %
    convPilotToDeal: 50,      // %
    cycleDays: 21,
  };

  const params = state.forecastParams || defaultParams;

  // Cálculos de Projeção
  const totalPilotos = Math.round((params.discoveryPerMonth * (params.convDiscoveryToPilot / 100)));
  const totalDeals = Math.max(1, Math.round(totalPilotos * (params.convPilotToDeal / 100)));
  
  const ticketMedioPonderado = Math.round((params.captoTicket * 0.5) + (params.lumaTicket * 0.3) + (params.servicesTicket * 0.2));
  const newARRMensal = totalDeals * ticketMedioPonderado;
  const arrD30 = newARRMensal;
  const arrD60 = newARRMensal * 2.2;
  const arrD90 = newARRMensal * 3.8;

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Financeiro & Forecast Preditivo</div>
        <h1 class="page-header__title">RevOps Financial Engine · Simulação de Receita</h1>
        <p class="page-header__subtitle">
          Projeção determinística de Pipeline, ARR e MRR com base na velocidade de conversão da TRUST.
        </p>
      </div>
      <button class="btn-subtle" onclick="resetForecastDefaults()">
        🔄 Restaurar Parâmetros Base
      </button>
    </div>

    <!-- CARDS DE RESULTADO DO FORECAST -->
    <div class="grid-3 mb-6">
      <div class="card-panel" style="margin-bottom: 0; border-top: 3px solid var(--clr-brand);">
        <div class="card-panel__body">
          <div class="text-xs text-muted mb-1 uppercase fw-semibold">Receita Projetada (D30)</div>
          <div class="text-2xl fw-bold text-brand font-mono">R$ ${arrD30.toLocaleString('pt-BR')}</div>
          <div class="text-xs text-secondary mt-1">Estimativa: ${totalDeals} novo(s) contrato(s) fechado(s)</div>
        </div>
      </div>
      <div class="card-panel" style="margin-bottom: 0; border-top: 3px solid var(--clr-info);">
        <div class="card-panel__body">
          <div class="text-xs text-muted mb-1 uppercase fw-semibold">Receita Projetada (D60)</div>
          <div class="text-2xl fw-bold text-primary font-mono">R$ ${Math.round(arrD60).toLocaleString('pt-BR')}</div>
          <div class="text-xs text-secondary mt-1">Com maturação dos pilotos e expansão de cadência</div>
        </div>
      </div>
      <div class="card-panel" style="margin-bottom: 0; border-top: 3px solid var(--clr-success);">
        <div class="card-panel__body">
          <div class="text-xs text-muted mb-1 uppercase fw-semibold">Projeção de Pipeline D90 (Trimestre)</div>
          <div class="text-2xl fw-bold text-success font-mono">R$ ${Math.round(arrD90).toLocaleString('pt-BR')}</div>
          <div class="text-xs text-secondary mt-1">Operação em tração comercial contínua</div>
        </div>
      </div>
    </div>

    <!-- CONSOLE DE SIMULAÇÃO INTERATIVA -->
    <div class="grid-2 mb-6" style="grid-template-columns: 1fr 1fr; gap: var(--sp-6);">
      
      <!-- CONTROLES DE VARIÁVEIS -->
      <div class="card-panel" style="margin-bottom: 0;">
        <div class="card-panel__header">
          <span>Ajuste de Premissas Operacionais</span>
          <span class="badge badge--on-track">Simulador Interativo</span>
        </div>
        <div class="card-panel__body">
          <div class="flex flex-col gap-4">
            
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="fw-semibold text-primary">Reuniões Discovery / Mês</span>
                <span class="font-mono text-brand fw-bold" id="val-discovery">${params.discoveryPerMonth} reuniões</span>
              </div>
              <input type="range" min="5" max="60" value="${params.discoveryPerMonth}" style="width: 100%;" oninput="updateForecastParam('discoveryPerMonth', this.value)" />
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="fw-semibold text-primary">Conversão Discovery ➔ Piloto (%)</span>
                <span class="font-mono text-brand fw-bold" id="val-conv-pilot">${params.convDiscoveryToPilot}%</span>
              </div>
              <input type="range" min="10" max="60" value="${params.convDiscoveryToPilot}" style="width: 100%;" oninput="updateForecastParam('convDiscoveryToPilot', this.value)" />
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="fw-semibold text-primary">Conversão Piloto ➔ Contrato Fechado (%)</span>
                <span class="font-mono text-brand fw-bold" id="val-conv-deal">${params.convPilotToDeal}%</span>
              </div>
              <input type="range" min="15" max="80" value="${params.convPilotToDeal}" style="width: 100%;" oninput="updateForecastParam('convPilotToDeal', this.value)" />
            </div>

          </div>
        </div>
      </div>

      <!-- TICKETS MÉDIOS POR PRODUTO -->
      <div class="card-panel" style="margin-bottom: 0;">
        <div class="card-panel__header">
          <span>Tickets Médios Estimados por Solução</span>
        </div>
        <div class="card-panel__body">
          <div class="flex flex-col gap-3">
            
            <div class="flex justify-between items-center p-3" style="background: var(--bg-elevated); border-radius: var(--radius-md);">
              <div>
                <strong class="text-xs text-primary block">CAPTO (Rastreamento Anti-Jammer & Recuperação 23min)</strong>
                <span class="text-2xs text-muted">Contrato médio / Fee de implantação</span>
              </div>
              <span class="font-mono fw-bold text-sm text-primary">R$ ${params.captoTicket.toLocaleString('pt-BR')}</span>
            </div>

            <div class="flex justify-between items-center p-3" style="background: var(--bg-elevated); border-radius: var(--radius-md);">
              <div>
                <strong class="text-xs text-primary block">LUMA (Inteligência de Espaço & Reconhecimento Facial NIST)</strong>
                <span class="text-2xs text-muted">Contrato médio / Licenciamento & Setup</span>
              </div>
              <span class="font-mono fw-bold text-sm text-primary">R$ ${params.lumaTicket.toLocaleString('pt-BR')}</span>
            </div>

            <div class="flex justify-between items-center p-3" style="background: var(--bg-elevated); border-radius: var(--radius-md);">
              <div>
                <strong class="text-xs text-primary block">SERVICES (Terceirização & Facilities)</strong>
                <span class="text-2xs text-muted">Contrato médio recorrente</span>
              </div>
              <span class="font-mono fw-bold text-sm text-primary">R$ ${params.servicesTicket.toLocaleString('pt-BR')}</span>
            </div>

            <div class="p-2 text-2xs text-secondary" style="background: var(--clr-brand-subtle); border-radius: var(--radius-sm);">
              💡 <em>Ticket médio ponderado da TRUST calculado em: <strong>R$ ${ticketMedioPonderado.toLocaleString('pt-BR')}</strong> por deal.</em>
            </div>

          </div>
        </div>
      </div>

    </div>
  `;
}

window.updateForecastParam = function(key, value) {
  const state = store.getState();
  const current = state.forecastParams || {
    captoTicket: 45000,
    lumaTicket: 85000,
    servicesTicket: 30000,
    discoveryPerMonth: 24,
    convDiscoveryToPilot: 35,
    convPilotToDeal: 50,
    cycleDays: 21,
  };

  current[key] = Number(value);
  store._setState({ forecastParams: current });
  
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderForecastEngine();
};

window.resetForecastDefaults = function() {
  store._setState({ forecastParams: null });
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderForecastEngine();
};
