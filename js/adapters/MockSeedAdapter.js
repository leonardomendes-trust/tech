/**
 * MockSeedAdapter — Implementação do IDataSourceAdapter para o MVP
 *
 * TRUST Revenue Command Center
 *
 * Usa o dataset de seed como fonte de dados.
 * Simula latência de API para que a substituição por adapters reais seja
 * transparente para a camada de UI.
 *
 * ARQUITETURA FUTURA:
 * - RDStationAdapter: consumir RD CRM via OAuth2 + API REST
 * - ApolloAdapter: consumir Apollo.io via API key + webhooks
 * - ClickUpAdapter: consumir ClickUp API para atualização de tarefas
 * - HybridAdapter: agregar múltiplas fontes com fallback
 */

import { IDataSourceAdapter } from './IDataSourceAdapter.js';
import {
  PLATFORM_CONFIG,
  WORKSTREAMS,
  TASKS,
  RISKS,
  DECISIONS,
  ICPS,
  BATTLE_CARDS,
  POPS,
  KPIS,
  BASELINE_D0,
  CHANGELOG,
  AI_INSIGHTS_SEED,
} from '../data/seed-data.js';

export class MockSeedAdapter extends IDataSourceAdapter {
  constructor() {
    super();
    this._latencyMs = 0; // 0 em modo demo; pode ser 400 para simular API
  }

  _delay() {
    return this._latencyMs > 0
      ? new Promise(resolve => setTimeout(resolve, this._latencyMs))
      : Promise.resolve();
  }

  async getPlatformConfig() {
    await this._delay();
    return { ...PLATFORM_CONFIG };
  }

  async getWorkstreams() {
    await this._delay();
    return [...WORKSTREAMS];
  }

  async getTasks(filters = {}) {
    await this._delay();
    let tasks = [...TASKS];
    if (filters.workstreamId) tasks = tasks.filter(t => t.workstreamId === filters.workstreamId);
    if (filters.status) tasks = tasks.filter(t => filters.status.includes(t.status));
    if (filters.phase) tasks = tasks.filter(t => t.phase === filters.phase);
    if (filters.priority) tasks = tasks.filter(t => t.priority === filters.priority);
    return tasks;
  }

  async getRisks() {
    await this._delay();
    return [...RISKS];
  }

  async getDecisions() {
    await this._delay();
    return [...DECISIONS];
  }

  async getICPs(filters = {}) {
    await this._delay();
    let icps = [...ICPS];
    if (filters.solution) icps = icps.filter(i => i.solution === filters.solution);
    if (filters.status) icps = icps.filter(i => i.status === filters.status);
    return icps;
  }

  async getBattleCards(filters = {}) {
    await this._delay();
    let cards = [...BATTLE_CARDS];
    if (filters.solution) cards = cards.filter(c => c.solution === filters.solution);
    return cards;
  }

  async getPOPs() {
    await this._delay();
    return [...POPS];
  }

  async getKPIs() {
    await this._delay();
    return {
      nivel1_implantacao: [...KPIS.nivel1_implantacao],
      nivel2_operacao: [...KPIS.nivel2_operacao],
      nivel3_negocio: [...KPIS.nivel3_negocio],
    };
  }

  async getBaselineD0() {
    await this._delay();
    return { ...BASELINE_D0, items: [...BASELINE_D0.items] };
  }

  async getChangelog() {
    await this._delay();
    return [...CHANGELOG].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getAIInsights() {
    await this._delay();
    return [...AI_INSIGHTS_SEED].sort((a, b) => a.priority - b.priority);
  }
}
