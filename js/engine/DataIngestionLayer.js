/**
 * DataIngestionLayer — Camada Canônica de Validação e Normalização de Dados
 *
 * TRUST Revenue Command Center
 *
 * Princípio:
 * "External integrations accelerate the Command Center, but never determine whether it can operate."
 *
 * Toda fonte de dados (Manual UI, CSV Import, Mock Seed, ClickUp, RD Station)
 * é normalizada para as entidades canônicas da TRUST.
 */

export const DATA_SOURCES = {
  INTERNAL: 'INTERNAL',
  CLICKUP: 'CLICKUP',
  RD_CRM: 'RD_CRM',
  APOLLO: 'APOLLO',
  CSV_IMPORT: 'CSV_IMPORT',
  DEMO_SEED: 'DEMO_SEED',
};

export const SYNC_STATUS = {
  STANDALONE: 'STANDALONE',
  SYNCED: 'SYNCED',
  OUT_OF_SYNC: 'OUT_OF_SYNC',
  FAILED: 'FAILED',
  READ_ONLY: 'READ_ONLY',
};

export class DataIngestionLayer {
  /**
   * Normaliza e valida uma Tarefa Canônica TRUST
   * @param {Object} raw 
   * @param {string} source 
   * @returns {Object} TRUSTTask
   */
  static normalizeTask(raw, source = DATA_SOURCES.INTERNAL) {
    const now = new Date().toISOString();
    return {
      id: raw.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      code: raw.code || 'TASK',
      title: (raw.title || raw.name || 'Nova Tarefa').trim(),
      description: raw.description || '',
      workstreamId: raw.workstreamId || 'ws-1',
      owner: raw.owner || 'Comercial',
      ownerEmail: raw.ownerEmail || null,
      status: this._normalizeTaskStatus(raw.status),
      priority: this._normalizePriority(raw.priority),
      phase: raw.phase || 'S1',
      startDate: raw.startDate || now.slice(0, 10),
      dueDate: raw.dueDate || now.slice(0, 10),
      percentComplete: typeof raw.percentComplete === 'number' ? Math.min(100, Math.max(0, raw.percentComplete)) : 0,
      risk: raw.risk || 'LOW',
      blockReason: raw.blockReason || null,
      dependencies: Array.isArray(raw.dependencies) ? raw.dependencies : [],
      customFields: raw.customFields || {},
      
      // Metadados de Ingestão e Rastreabilidade
      source: raw.source || source,
      sourceId: raw.sourceId || null,
      sourceUrl: raw.sourceUrl || null,
      syncStatus: raw.syncStatus || (source === DATA_SOURCES.INTERNAL ? SYNC_STATUS.STANDALONE : SYNC_STATUS.SYNCED),
      createdAt: raw.createdAt || now,
      updatedAt: now,
      lastSyncedAt: raw.lastSyncedAt || (source !== DATA_SOURCES.INTERNAL ? now : null),
    };
  }

  /**
   * Normaliza e valida uma Decisão Canônica TRUST
   * @param {Object} raw 
   * @param {string} source 
   * @returns {Object} TRUSTDecision
   */
  static normalizeDecision(raw, source = DATA_SOURCES.INTERNAL) {
    const now = new Date().toISOString();
    return {
      id: raw.id || `dec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      code: raw.code || 'DEC',
      title: (raw.title || 'Nova Decisão').trim(),
      description: raw.description || '',
      impact: this._normalizePriority(raw.impact || raw.priority),
      owner: raw.owner || 'Diretoria',
      deadline: raw.deadline || 'D01',
      blockedWorkstreams: Array.isArray(raw.blockedWorkstreams) ? raw.blockedWorkstreams : [],
      status: raw.status === 'APPROVED' || raw.status === 'DECIDED' ? 'APPROVED' : 'PENDING',
      resolutionNotes: raw.resolutionNotes || null,
      
      source: raw.source || source,
      sourceId: raw.sourceId || null,
      syncStatus: raw.syncStatus || SYNC_STATUS.STANDALONE,
      createdAt: raw.createdAt || now,
      updatedAt: now,
      lastSyncedAt: raw.lastSyncedAt || null,
    };
  }

  /**
   * Normaliza e valida um Risco Canônico TRUST
   * @param {Object} raw 
   * @param {string} source 
   * @returns {Object} TRUSTRisk
   */
  static normalizeRisk(raw, source = DATA_SOURCES.INTERNAL) {
    const now = new Date().toISOString();
    const prob = Number(raw.probability) || 2;
    const imp = Number(raw.impact) || 2;
    return {
      id: raw.id || `risk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      code: raw.code || 'RISK',
      title: (raw.title || 'Novo Risco').trim(),
      description: raw.description || '',
      workstreamId: raw.workstreamId || null,
      severity: this._normalizeSeverity(raw.severity, prob, imp),
      probability: prob,
      impact: imp,
      owner: raw.owner || 'Diretoria / RevOps',
      relatedTaskId: raw.relatedTaskId || null,
      mitigationPlan: raw.mitigationPlan || 'Plano de contingência em definição.',
      status: raw.status === 'MITIGATED' || raw.status === 'CLOSED' ? 'CLOSED' : 'OPEN',
      
      source: raw.source || source,
      sourceId: raw.sourceId || null,
      syncStatus: raw.syncStatus || SYNC_STATUS.STANDALONE,
      createdAt: raw.createdAt || now,
      updatedAt: now,
      lastSyncedAt: raw.lastSyncedAt || null,
    };
  }

  // --- Normalizadores auxiliares ---

  static _normalizeTaskStatus(status) {
    const s = String(status || '').toUpperCase().trim();
    if (['DONE', 'CONCLUIDO', 'CONCLUÍDO', 'FINISHED', 'COMPLETED'].includes(s)) return 'DONE';
    if (['BLOCKED', 'BLOQUEADO', 'IMPEDIDO'].includes(s)) return 'BLOCKED';
    if (['IN_PROGRESS', 'EM ANDAMENTO', 'DOING', 'PROGRESS', 'IN PROGRESS'].includes(s)) return 'IN_PROGRESS';
    if (['TODO', 'A FAZER', 'TO DO', 'PENDING'].includes(s)) return 'TODO';
    if (['DELAYED', 'ATRASADO'].includes(s)) return 'DELAYED';
    return 'BACKLOG';
  }

  static _normalizePriority(priority) {
    const p = String(priority || '').toUpperCase().trim();
    if (['CRITICAL', 'CRÍTICO', 'URGENT', 'URGENTE', '4'].includes(p)) return 'CRITICAL';
    if (['HIGH', 'ALTA', 'ALTO', '3'].includes(p)) return 'HIGH';
    if (['MEDIUM', 'MÉDIA', 'MEDIO', 'MÉDIO', '2'].includes(p)) return 'MEDIUM';
    return 'LOW';
  }

  static _normalizeSeverity(severity, prob, imp) {
    if (severity) {
      const s = String(severity).toUpperCase();
      if (['CRITICAL', 'CRÍTICO'].includes(s)) return 'CRITICAL';
      if (['HIGH', 'ALTA', 'ALTO'].includes(s)) return 'HIGH';
      if (['MEDIUM', 'MÉDIA', 'MEDIO'].includes(s)) return 'MEDIUM';
    }
    const score = prob * imp;
    if (score >= 12) return 'CRITICAL';
    if (score >= 8) return 'HIGH';
    if (score >= 4) return 'MEDIUM';
    return 'LOW';
  }
}
