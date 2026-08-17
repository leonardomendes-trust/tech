/**
 * IDataSourceAdapter — Contrato base para todas as fontes de dados
 *
 * TRUST Revenue Command Center
 *
 * Toda lógica de UI consome APENAS este contrato.
 * A implementação concreta pode ser:
 * - MockSeedAdapter (MVP / Demo)
 * - RDStationAdapter (RD CRM + Marketing)
 * - ApolloAdapter (Apollo.io)
 * - ClickUpAdapter (ClickUp)
 * - HybridAdapter (agregador multi-fonte)
 */

export class IDataSourceAdapter {
  /** @returns {Promise<import('../data/seed-data.js').PLATFORM_CONFIG>} */
  async getPlatformConfig() { throw new Error('Not implemented'); }

  /** @returns {Promise<Array>} Lista de frentes de trabalho */
  async getWorkstreams() { throw new Error('Not implemented'); }

  /** @returns {Promise<Array>} Lista de tarefas */
  async getTasks(filters = {}) { throw new Error('Not implemented'); }

  /** @returns {Promise<Array>} Lista de riscos */
  async getRisks() { throw new Error('Not implemented'); }

  /** @returns {Promise<Array>} Lista de decisões pendentes */
  async getDecisions() { throw new Error('Not implemented'); }

  /** @returns {Promise<Array>} Lista de ICPs cadastrados */
  async getICPs(filters = {}) { throw new Error('Not implemented'); }

  /** @returns {Promise<Array>} Lista de Battle Cards */
  async getBattleCards(filters = {}) { throw new Error('Not implemented'); }

  /** @returns {Promise<Array>} Lista de POPs */
  async getPOPs() { throw new Error('Not implemented'); }

  /** @returns {Promise<Object>} KPIs por nível */
  async getKPIs() { throw new Error('Not implemented'); }

  /** @returns {Promise<Object>} Baseline D0 */
  async getBaselineD0() { throw new Error('Not implemented'); }

  /** @returns {Promise<Array>} Changelog das últimas 24h */
  async getChangelog() { throw new Error('Not implemented'); }

  /** @returns {Promise<Array>} AI Insights / Next Best Actions */
  async getAIInsights() { throw new Error('Not implemented'); }
}
