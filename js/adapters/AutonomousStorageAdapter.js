/**
 * AutonomousStorageAdapter — Adapter de Armazenamento Local e Autônomo (Fase 2)
 *
 * TRUST Revenue Command Center
 *
 * Suporta:
 * - Persistência integral de Tarefas, Decisões, Riscos, ICPs, POPs
 * - Updates Operacionais por frente
 * - Evidências auditáveis (TRUSTEvidence)
 * - Memória Operacional / Linha do Tempo (EventLog)
 * - Checklists interativos de POPs
 */

import { IDataSourceAdapter } from './IDataSourceAdapter.js';
import { DataIngestionLayer, DATA_SOURCES, SYNC_STATUS } from '../engine/DataIngestionLayer.js';
import {
  PLATFORM_CONFIG,
  WORKSTREAMS,
  TASKS,
  RISKS,
  DECISIONS,
  ICPS,
  BATTLE_CARDS,
  POPS,
  EVIDENCES,
  EVENT_LOG,
  KPIS,
  BASELINE_D0,
  CHANGELOG,
  AI_INSIGHTS_SEED,
} from '../data/seed-data.js';

const STORAGE_KEYS = {
  CONFIG: 'trust_rcc_config_v2',
  WORKSTREAMS: 'trust_rcc_workstreams_v2',
  TASKS: 'trust_rcc_tasks_v2',
  RISKS: 'trust_rcc_risks_v2',
  DECISIONS: 'trust_rcc_decisions_v2',
  ICPS: 'trust_rcc_icps_v2',
  BATTLE_CARDS: 'trust_rcc_bc_v2',
  POPS: 'trust_rcc_pops_v2',
  EVIDENCES: 'trust_rcc_evidences_v2',
  EVENT_LOG: 'trust_rcc_event_log_v2',
  KPIS: 'trust_rcc_kpis_v2',
  FUNNEL: 'trust_rcc_funnel_v2',
  BASELINE: 'trust_rcc_baseline_v2',
  CHANGELOG: 'trust_rcc_changelog_v2',
};

export class AutonomousStorageAdapter extends IDataSourceAdapter {
  constructor() {
    super();
    this._initStorage();
  }

  _initStorage() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(PLATFORM_CONFIG));
      }
      if (!localStorage.getItem(STORAGE_KEYS.WORKSTREAMS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKSTREAMS) || '[]').length === 0) {
        localStorage.setItem(STORAGE_KEYS.WORKSTREAMS, JSON.stringify(WORKSTREAMS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.TASKS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]').length === 0) {
        const normalizedTasks = TASKS.map(t => DataIngestionLayer.normalizeTask(t, DATA_SOURCES.INTERNAL));
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(normalizedTasks));
      }
      if (!localStorage.getItem(STORAGE_KEYS.DECISIONS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.DECISIONS) || '[]').length === 0) {
        const normalizedDec = DECISIONS.map(d => DataIngestionLayer.normalizeDecision(d, DATA_SOURCES.INTERNAL));
        localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(normalizedDec));
      }
      if (!localStorage.getItem(STORAGE_KEYS.RISKS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.RISKS) || '[]').length === 0) {
        const normalizedRisks = RISKS.map(r => DataIngestionLayer.normalizeRisk(r, DATA_SOURCES.INTERNAL));
        localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(normalizedRisks));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ICPS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.ICPS) || '[]').length === 0) {
        localStorage.setItem(STORAGE_KEYS.ICPS, JSON.stringify(ICPS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.BATTLE_CARDS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.BATTLE_CARDS) || '[]').length === 0) {
        localStorage.setItem(STORAGE_KEYS.BATTLE_CARDS, JSON.stringify(BATTLE_CARDS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.POPS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.POPS) || '[]').length === 0) {
        localStorage.setItem(STORAGE_KEYS.POPS, JSON.stringify(POPS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.EVIDENCES)) {
        localStorage.setItem(STORAGE_KEYS.EVIDENCES, JSON.stringify(EVIDENCES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.EVENT_LOG)) {
        localStorage.setItem(STORAGE_KEYS.EVENT_LOG, JSON.stringify(EVENT_LOG));
      }
      if (!localStorage.getItem(STORAGE_KEYS.KPIS)) {
        localStorage.setItem(STORAGE_KEYS.KPIS, JSON.stringify(KPIS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.FUNNEL)) {
        const defaultFunnel = [
          { id: 'f-1', stage: '1. Contas ICP Mapeadas', real: 320, meta: 500, unit: 'contas', color: 'var(--clr-brand)' },
          { id: 'f-2', stage: '2. Contatos Qualificados (Apollo)', real: 640, meta: 1000, unit: 'decisores', color: 'var(--clr-info)' },
          { id: 'f-3', stage: '3. Abordagens Ativas (Outbound)', real: 210, meta: 450, unit: 'envios', color: 'var(--clr-brand)' },
          { id: 'f-4', stage: '4. Reuniões Discovery Realizadas', real: 14, meta: 30, unit: 'reuniões', color: 'var(--clr-warning)' },
          { id: 'f-5', stage: '5. Pilotos & Vistorias Ativas', real: 4, meta: 10, unit: 'pilotos', color: 'var(--clr-warning)' },
          { id: 'f-6', stage: '6. Propostas em Negociação', real: 2, meta: 6, unit: 'deals', color: 'var(--clr-success)' },
        ];
        localStorage.setItem(STORAGE_KEYS.FUNNEL, JSON.stringify(defaultFunnel));
      }
      if (!localStorage.getItem(STORAGE_KEYS.BASELINE)) {
        localStorage.setItem(STORAGE_KEYS.BASELINE, JSON.stringify(BASELINE_D0));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CHANGELOG)) {
        localStorage.setItem(STORAGE_KEYS.CHANGELOG, JSON.stringify(CHANGELOG));
      }
    } catch (e) {
      console.error('[AutonomousStorageAdapter] Erro na inicialização:', e);
    }
  }

  // --- Leituras ---

  async getFunnel() {
    const raw = localStorage.getItem(STORAGE_KEYS.FUNNEL);
    return raw ? JSON.parse(raw) : [];
  }

  async updateFunnelStage(stageId, { real, meta }) {
    const funnel = await this.getFunnel();
    const item = funnel.find(f => f.id === stageId);
    if (!item) return;
    if (real !== undefined && real !== null) item.real = Number(real);
    if (meta !== undefined && meta !== null) item.meta = Number(meta);
    localStorage.setItem(STORAGE_KEYS.FUNNEL, JSON.stringify(funnel));
    return funnel;
  }

  async getPlatformConfig() {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return raw ? JSON.parse(raw) : { ...PLATFORM_CONFIG };
  }

  async getWorkstreams() {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKSTREAMS);
    return raw ? JSON.parse(raw) : [...WORKSTREAMS];
  }

  async getTasks(filters = {}) {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    let tasks = raw ? JSON.parse(raw) : [];
    if (filters.workstreamId) tasks = tasks.filter(t => t.workstreamId === filters.workstreamId);
    if (filters.status) tasks = tasks.filter(t => filters.status.includes(t.status));
    if (filters.phase) tasks = tasks.filter(t => t.phase === filters.phase);
    if (filters.priority) tasks = tasks.filter(t => t.priority === filters.priority);
    return tasks;
  }

  async getRisks() {
    const raw = localStorage.getItem(STORAGE_KEYS.RISKS);
    return raw ? JSON.parse(raw) : [];
  }

  async getDecisions() {
    const raw = localStorage.getItem(STORAGE_KEYS.DECISIONS);
    return raw ? JSON.parse(raw) : [];
  }

  async getICPs(filters = {}) {
    const raw = localStorage.getItem(STORAGE_KEYS.ICPS);
    let icps = raw ? JSON.parse(raw) : [];
    if (filters.solution && filters.solution !== 'ALL') icps = icps.filter(i => i.solution === filters.solution);
    if (filters.status && filters.status !== 'ALL') icps = icps.filter(i => i.status === filters.status);
    return icps;
  }

  async getBattleCards(filters = {}) {
    const raw = localStorage.getItem(STORAGE_KEYS.BATTLE_CARDS);
    let cards = raw ? JSON.parse(raw) : [];
    if (filters.solution && filters.solution !== 'ALL') cards = cards.filter(c => c.solution === filters.solution);
    return cards;
  }

  async getPOPs() {
    const raw = localStorage.getItem(STORAGE_KEYS.POPS);
    return raw ? JSON.parse(raw) : [];
  }

  async getEvidences() {
    const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCES);
    return raw ? JSON.parse(raw) : [];
  }

  async getEventLog() {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENT_LOG);
    const list = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getKPIs() {
    const raw = localStorage.getItem(STORAGE_KEYS.KPIS);
    return raw ? JSON.parse(raw) : { ...KPIS };
  }

  async getBaselineD0() {
    const raw = localStorage.getItem(STORAGE_KEYS.BASELINE);
    return raw ? JSON.parse(raw) : { ...BASELINE_D0 };
  }

  async getChangelog() {
    const raw = localStorage.getItem(STORAGE_KEYS.CHANGELOG);
    const list = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getAIInsights() {
    return [...AI_INSIGHTS_SEED];
  }

  async getIntegrationHealth() {
    return [
      { id: 'int-clickup', name: 'ClickUp', type: 'Tasks & Ops', status: 'STANDALONE', isOptional: true, lastSyncedAt: null, message: 'Integração opcional — sem sincronização ativa.' },
      { id: 'int-rd-crm', name: 'RD Station CRM', type: 'Pipelines & Negócios', status: 'STANDALONE', isOptional: true, lastSyncedAt: null, message: 'Integração opcional — sem sincronização ativa.' },
      { id: 'int-apollo', name: 'Apollo.io', type: 'Outbound & Contas', status: 'STANDALONE', isOptional: true, lastSyncedAt: null, message: 'Integração opcional — sem sincronização ativa.' },
      { id: 'int-csv', name: 'Carga Manual CSV / JSON', type: 'Data Ingestion', status: 'READY', isOptional: false, lastSyncedAt: new Date().toISOString(), message: 'Pronto para ingestão autônoma.' },
    ];
  }

  // --- Operações de Mutação e Eventos Operacionais (Fase 2) ---

  async resolveDecision(decisionId, { resolutionNotes, actor }) {
    const decisions = await this.getDecisions();
    const dec = decisions.find(d => d.id === decisionId);
    if (!dec) return;

    dec.status = 'APPROVED';
    dec.resolutionNotes = resolutionNotes;
    dec.decidedAt = new Date().toISOString();
    dec.decidedBy = actor || 'Diretoria';
    localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));

    // Registrar Evento na Memória Operacional
    await this.addEvent({
      entityId: dec.id,
      entityType: 'DECISION',
      eventType: 'DECISION_APPROVED',
      previousState: 'PENDING',
      newState: 'APPROVED',
      actor: dec.decidedBy,
      reason: resolutionNotes,
      evidence: `Decisão ${dec.code} aprovada formalmente.`,
    });

    this._addChangelogEntry({
      type: 'DECISION_APPROVED',
      icon: '🟢',
      message: `${dec.code} aprovada: ${dec.title}`,
      impact: `Justificativa: ${resolutionNotes}`,
    });

    return dec;
  }

  async transitionTaskStatus(taskId, { newStatus, reason, actor, blockReason }) {
    const tasks = await this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const oldStatus = task.status;
    task.status = newStatus;
    task.lastUpdate = new Date().toISOString();
    if (newStatus === 'BLOCKED') {
      task.blockReason = blockReason || reason || 'Bloqueio operacional.';
    } else {
      task.blockReason = null;
    }
    if (newStatus === 'DONE') {
      task.percentComplete = 100;
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    // Atualizar métricas do workstream
    await this._recalculateWorkstream(task.workstreamId);

    // Registrar Evento
    await this.addEvent({
      entityId: task.id,
      entityType: 'TASK',
      eventType: 'TASK_STATUS_CHANGED',
      previousState: oldStatus,
      newState: newStatus,
      actor: actor || task.owner,
      reason: reason || (newStatus === 'BLOCKED' ? task.blockReason : 'Transição operacional de status.'),
      evidence: null,
    });

    this._addChangelogEntry({
      type: 'TASK_UPDATED',
      icon: newStatus === 'DONE' ? '🟢' : newStatus === 'BLOCKED' ? '🔴' : '🟡',
      message: `${task.code}: ${oldStatus} ➔ ${newStatus}`,
      impact: reason || `Status atualizado para ${newStatus}`,
    });

    return task;
  }

  async operationalUnblockTask(taskId, { unblockStrategy, reason, author, validationPending, decider }) {
    const tasks = await this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const previousState = task.status;
    task.status = 'IN_PROGRESS';
    task.operationalStatus = 'ACTIVE_WITH_VALIDATION_PENDING';
    task.blockReason = null;
    task.validationPending = validationPending || 'Validação de mercado em paralelo';
    task.unblockNote = `[Desbloqueio Operacional: ${unblockStrategy}] ${reason} (Decisor/Alinhado: ${decider || 'Comercial'})`;
    task.lastUpdate = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    await this.addEvent({
      entityId: task.id,
      entityType: 'TASK',
      eventType: 'OPERATIONAL_UNBLOCK',
      previousState: previousState,
      newState: 'IN_PROGRESS (VALIDATION_PENDING)',
      actor: author || 'Comercial Ops',
      reason: `Desbloqueio Operacional: ${unblockStrategy} — ${reason}`,
      evidence: `Pendente de validação: ${task.validationPending}`,
    });

    this._addChangelogEntry({
      type: 'TASK_UNBLOCKED_OPERATIONAL',
      icon: '⚡',
      message: `${task.code} DESBLOQUEADA OPERACIONALMENTE: ${unblockStrategy}`,
      impact: `Avanço liberado por ${author}. Pendência: ${task.validationPending}`,
    });

    return task;
  }

  async refuteICPHypothesis(icpId, { reason, evidenceRef, author, correctiveAction, keyLearning }) {
    const icps = await this.getICPs();
    const icp = icps.find(i => i.id === icpId);
    if (!icp) return;

    const previousMaturity = icp.maturityLevel || 'N1 (Hipótese)';
    icp.status = 'REFUTADA';
    icp.refutedReason = reason;
    icp.keyLearning = keyLearning || 'Hipótese testada e descartada/revisada na operação.';
    icp.correctiveAction = correctiveAction || 'Redirecionar esforço para ICPs adjacentes.';
    icp.refutedAt = new Date().toISOString();
    icp.refutedBy = author || 'Comercial Ops';

    localStorage.setItem(STORAGE_KEYS.ICPS, JSON.stringify(icps));

    await this.addEvent({
      entityId: icp.id,
      entityType: 'ICP',
      eventType: 'HYPOTHESIS_REFUTED',
      previousState: previousMaturity,
      newState: 'REFUTADA / AJUSTAR',
      actor: author || 'Comercial',
      reason: `Hipótese Refutada: ${reason}`,
      evidence: `Aprendizado: ${keyLearning} | Ação: ${correctiveAction} (Ref: ${evidenceRef || 'Campo'})`,
    });

    this._addChangelogEntry({
      type: 'ICP_REFUTED',
      icon: '💡',
      message: `${icp.code} REFUTADA / AJUSTAR: ${icp.name}`,
      impact: `Aprendizado: ${keyLearning}`,
    });

    return icp;
  }

  async addWorkstreamUpdate(workstreamId, { summary, health, blocker, nextMilestone, nextAction, author }) {
    const workstreams = await this.getWorkstreams();
    const ws = workstreams.find(w => w.id === workstreamId);
    if (!ws) return;

    const newUpdate = {
      timestamp: new Date().toISOString(),
      summary,
      health: health || ws.healthScore,
      blocker: blocker || null,
      nextMilestone: nextMilestone || null,
      nextAction: nextAction || null,
      author: author || ws.owner,
    };

    ws.latestUpdate = newUpdate;
    if (health) ws.healthScore = health;
    localStorage.setItem(STORAGE_KEYS.WORKSTREAMS, JSON.stringify(workstreams));

    await this.addEvent({
      entityId: ws.id,
      entityType: 'WORKSTREAM',
      eventType: 'UPDATE_LOGGED',
      previousState: null,
      newState: ws.healthScore,
      actor: newUpdate.author,
      reason: summary,
      evidence: nextAction ? `Próxima ação: ${nextAction}` : null,
    });

    this._addChangelogEntry({
      type: 'WORKSTREAM_UPDATE',
      icon: '📢',
      message: `Update em ${ws.code} — ${ws.name}`,
      impact: summary,
    });

    return ws;
  }

  async addEvidence({ title, type, description, source, author, relatedEntityType, relatedEntityId, link }) {
    const evidences = await this.getEvidences();
    const newEvidence = {
      id: `ev-${Date.now()}`,
      title,
      type: type || 'NOTE',
      description,
      source: source || 'Registro Interno',
      author: author || 'Comercial',
      date: new Date().toISOString().slice(0, 10),
      relatedEntityType: relatedEntityType || 'OTHER',
      relatedEntityId: relatedEntityId || null,
      link: link || null,
    };
    evidences.unshift(newEvidence);
    localStorage.setItem(STORAGE_KEYS.EVIDENCES, JSON.stringify(evidences));

    // Se vinculada a um ICP, atualizar ICP
    if (relatedEntityType === 'ICP' && relatedEntityId) {
      const icps = await this.getICPs();
      const icp = icps.find(i => i.id === relatedEntityId || i.code === relatedEntityId);
      if (icp) {
        if (!icp.evidenceIds) icp.evidenceIds = [];
        icp.evidenceIds.push(newEvidence.id);
        if (icp.status === 'HIPOTESE') icp.status = 'VALIDAR';
        localStorage.setItem(STORAGE_KEYS.ICPS, JSON.stringify(icps));
      }
    }

    await this.addEvent({
      entityId: newEvidence.id,
      entityType: 'EVIDENCE',
      eventType: 'EVIDENCE_ATTACHED',
      previousState: null,
      newState: newEvidence.type,
      actor: newEvidence.author,
      reason: title,
      evidence: description,
    });

    this._addChangelogEntry({
      type: 'EVIDENCE_ADDED',
      icon: '📎',
      message: `Nova evidência: ${title}`,
      impact: `Vinculada a ${relatedEntityType} (${relatedEntityId || 'Geral'})`,
    });

    return newEvidence;
  }

  async togglePOPChecklist(popId, checklistItemId) {
    const pops = await this.getPOPs();
    const pop = pops.find(p => p.id === popId);
    if (!pop || !pop.checklist) return;

    const item = pop.checklist.find(c => c.id === checklistItemId);
    if (!item) return;

    item.completed = !item.completed;
    const completedCount = pop.checklist.filter(c => c.completed).length;
    pop.progressPct = Math.round((completedCount / pop.checklist.length) * 100);

    if (pop.progressPct === 100 && pop.status !== 'APROVADO') {
      pop.status = 'PRONTO_PARA_APROVACAO';
    } else if (pop.progressPct > 0 && pop.status !== 'APROVADO') {
      pop.status = 'EM_VALIDACAO';
    } else if (pop.progressPct === 0) {
      pop.status = 'RASCUNHO';
    }
    pop.lastRevision = new Date().toISOString().slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.POPS, JSON.stringify(pops));

    await this.addEvent({
      entityId: pop.id,
      entityType: 'POP',
      eventType: 'POP_CHECKLIST_TOGGLE',
      previousState: null,
      newState: `${pop.progressPct}% (${pop.status})`,
      actor: pop.owner,
      reason: `Item de checklist "${item.text}" marcado como ${item.completed ? 'concluído' : 'pendente'}.`,
      evidence: `Status: ${pop.status}`,
    });

    this._addChangelogEntry({
      type: 'POP_UPDATED',
      icon: pop.status === 'PRONTO_PARA_APROVACAO' ? '⚡' : '📋',
      message: `${pop.code}: checklist atualizado (${pop.progressPct}%)`,
      impact: pop.status === 'PRONTO_PARA_APROVACAO' ? 'Checklist completo. Aguardando aprovação explícita da Diretoria.' : `${completedCount}/${pop.checklist.length} itens concluídos.`,
    });

    return pop;
  }

  async approvePOP(popId, actor = 'Diretoria Comercial') {
    const pops = await this.getPOPs();
    const pop = pops.find(p => p.id === popId);
    if (!pop) return;

    pop.status = 'APROVADO';
    pop.approvalDate = new Date().toISOString().slice(0, 10);
    pop.approvedBy = actor;
    localStorage.setItem(STORAGE_KEYS.POPS, JSON.stringify(pops));

    await this.addEvent({
      entityId: pop.id,
      entityType: 'POP',
      eventType: 'POP_APPROVED',
      previousState: 'PRONTO_PARA_APROVACAO',
      newState: 'APROVADO',
      actor: actor,
      reason: `Aprovação formal e executiva do ${pop.code} — ${pop.name}.`,
      evidence: `Homologado para operação comercial.`,
    });

    this._addChangelogEntry({
      type: 'POP_APPROVED',
      icon: '🟢',
      message: `${pop.code} APROVADO: ${pop.name}`,
      impact: `Aprovado por ${actor}. Processo oficializado.`,
    });

    return pop;
  }

  async addEvent(eventData) {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENT_LOG);
    const list = raw ? JSON.parse(raw) : [];
    const newEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...eventData,
    };
    list.unshift(newEvent);
    localStorage.setItem(STORAGE_KEYS.EVENT_LOG, JSON.stringify(list.slice(0, 200)));
    return newEvent;
  }

  _addChangelogEntry(entry) {
    const raw = localStorage.getItem(STORAGE_KEYS.CHANGELOG);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({
      id: `cl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    });
    localStorage.setItem(STORAGE_KEYS.CHANGELOG, JSON.stringify(list.slice(0, 50)));
  }

  async _recalculateWorkstream(wsId) {
    const workstreams = await this.getWorkstreams();
    const tasks = await this.getTasks({ workstreamId: wsId });
    const ws = workstreams.find(w => w.id === wsId);
    if (!ws || !tasks.length) return;

    ws.tasksTotal = tasks.length;
    ws.tasksDone = tasks.filter(t => t.status === 'DONE').length;
    ws.tasksBlocked = tasks.filter(t => t.status === 'BLOCKED').length;
    ws.progressPct = Math.round((ws.tasksDone / ws.tasksTotal) * 100);

    if (ws.tasksBlocked > 0) {
      ws.healthScore = 'CRITICAL';
      ws.status = 'BLOCKED';
    } else if (ws.progressPct === 100) {
      ws.healthScore = 'ON_TRACK';
      ws.status = 'DONE';
    } else if (ws.progressPct > 0) {
      ws.healthScore = 'ON_TRACK';
      ws.status = 'IN_PROGRESS';
    }
    localStorage.setItem(STORAGE_KEYS.WORKSTREAMS, JSON.stringify(workstreams));
  }

  async saveTask(taskData) {
    const normalized = DataIngestionLayer.normalizeTask(taskData, DATA_SOURCES.INTERNAL);
    const tasks = await this.getTasks();
    const idx = tasks.findIndex(t => t.id === normalized.id);
    if (idx >= 0) {
      tasks[idx] = normalized;
    } else {
      tasks.push(normalized);
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    await this._recalculateWorkstream(normalized.workstreamId);
    return normalized;
  }

  async saveDecision(decisionData) {
    const normalized = DataIngestionLayer.normalizeDecision(decisionData, DATA_SOURCES.INTERNAL);
    const decisions = await this.getDecisions();
    const idx = decisions.findIndex(d => d.id === normalized.id);
    if (idx >= 0) {
      decisions[idx] = normalized;
    } else {
      decisions.push(normalized);
    }
    localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));
    return normalized;
  }

  async saveRisk(riskData) {
    const normalized = DataIngestionLayer.normalizeRisk(riskData, DATA_SOURCES.INTERNAL);
    const risks = await this.getRisks();
    const idx = risks.findIndex(r => r.id === normalized.id);
    if (idx >= 0) {
      risks[idx] = normalized;
    } else {
      risks.push(normalized);
    }
    localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(risks));
    return normalized;
  }

  async importBatch(rows, entityType) {
    if (entityType === 'TASKS') {
      const currentTasks = await this.getTasks();
      const newTasks = rows.map(r => DataIngestionLayer.normalizeTask(r, DATA_SOURCES.CSV_IMPORT));
      const combined = [...currentTasks, ...newTasks];
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(combined));
      this._addChangelogEntry({
        type: 'IMPORT_SUCCESS',
        icon: '📥',
        message: `Importadas ${newTasks.length} tarefas via arquivo`,
        impact: 'Base de tarefas atualizada via carga em lote.',
      });
      return newTasks.length;
    }
    return 0;
  }

  resetToDemo() {
    localStorage.clear();
    this._initStorage();
  }
}
