/**
 * State Manager — Gerenciador de Estado Reativo Canônico (Fase 2)
 *
 * TRUST Revenue Command Center
 *
 * Expõe métodos para operações autônomas completas:
 * - resolveDecision()
 * - transitionTaskStatus()
 * - addWorkstreamUpdate()
 * - addEvidence()
 * - togglePOPChecklist()
 */

import { AutonomousStorageAdapter } from '../adapters/AutonomousStorageAdapter.js';
import { SupabaseStorageAdapter } from '../adapters/SupabaseStorageAdapter.js';
import { MockSeedAdapter } from '../adapters/MockSeedAdapter.js';

class StateManager {
  constructor() {
    this._adapter = new SupabaseStorageAdapter();
    this._subscribers = {};

    this._state = {
      initialized: false,
      loading: false,
      error: null,
      platformConfig: null,
      workstreams: [],
      tasks: [],
      risks: [],
      decisions: [],
      icps: [],
      battleCards: [],
      pops: [],
      evidences: [],
      eventLog: [],
      kpis: null,
      funnel: [],
      baselineD0: null,
      changelog: [],
      aiInsights: [],
      integrationHealth: [],

      // UI State
      activePage: 'overview',
      filters: {
        phase: 'ALL',
        workstream: 'ALL',
        solution: 'ALL',
        status: 'ALL',
        priority: 'ALL',
        logEntityType: 'ALL',
      },
      selectedWorkstreamId: null,
      selectedStrategySection: 'POPS', // 'POPS' | 'ICPS' | 'BATTLECARDS'
      selectedICPSolution: 'ALL',
      selectedBCSolution: 'ALL',
    };
  }

  getCurrentDayInfo() {
    const config = this._state.platformConfig;
    if (!config) return { currentDay: 1, formattedDate: 'Sábado, 15 Ago 2026', dayLabel: 'D01' };
    
    // Se houver dia simulado manual no localStorage/config, usar ele
    const simulated = localStorage.getItem('trust_rcc_simulated_day');
    let dayNumber;

    if (simulated !== null && !isNaN(parseInt(simulated, 10))) {
      dayNumber = parseInt(simulated, 10);
    } else {
      // Início D0 = 2026-08-14, D1 = 2026-08-15
      const startDate = new Date(config.implantacaoStart || '2026-08-14T00:00:00');
      const now = new Date();
      const diffTime = now.getTime() - startDate.getTime();
      dayNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    if (isNaN(dayNumber) || dayNumber < 0) dayNumber = 0;
    if (dayNumber > 30) dayNumber = 30;

    const dayLabel = dayNumber < 10 ? `D0${dayNumber}` : `D${dayNumber}`;

    // Calcular data simulada correspondente ao dia
    const baseDate = new Date('2026-08-14T00:00:00');
    const targetDate = new Date(baseDate.getTime() + dayNumber * 24 * 60 * 60 * 1000);

    const formattedDate = targetDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return {
      currentDay: dayNumber,
      dayLabel,
      formattedDate: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
      isSimulated: simulated !== null,
    };
  }

  setSimulatedDay(day) {
    if (day === null || day === 'REAL') {
      localStorage.removeItem('trust_rcc_simulated_day');
    } else {
      localStorage.setItem('trust_rcc_simulated_day', day.toString());
    }
    this._emit(['platformConfig', 'tasks', 'workstreams']);
  }

  setAdapter(adapter) {
    this._adapter = adapter;
    console.info('[StateManager] Adapter ativo:', adapter.constructor.name);
    return this.init();
  }

  setMode(mode) {
    if (mode === 'DEMO') {
      this.setAdapter(new MockSeedAdapter());
    } else {
      this.setAdapter(new AutonomousStorageAdapter());
    }
  }

  getState() {
    return { ...this._state };
  }

  subscribe(key, fn) {
    if (!this._subscribers[key]) this._subscribers[key] = [];
    this._subscribers[key].push(fn);
  }

  unsubscribe(key, fn) {
    if (this._subscribers[key]) {
      this._subscribers[key] = this._subscribers[key].filter(f => f !== fn);
    }
  }

  _emit(keys) {
    const toNotify = Array.isArray(keys) ? keys : [keys];
    toNotify.forEach(key => {
      if (this._subscribers[key]) {
        this._subscribers[key].forEach(fn => fn(this._state));
      }
    });
    if (this._subscribers['*']) {
      this._subscribers['*'].forEach(fn => fn(this._state));
    }
  }

  _setState(partial) {
    this._state = { ...this._state, ...partial };
    this._emit(Object.keys(partial));
  }

  async init() {
    if (this._state.loading) return;
    this._setState({ loading: true, error: null });
    try {
      const [
        platformConfig,
        workstreams,
        tasks,
        risks,
        decisions,
        icps,
        battleCards,
        pops,
        evidences,
        eventLog,
        kpis,
        funnel,
        baselineD0,
        changelog,
        aiInsights,
        integrationHealth,
      ] = await Promise.all([
        this._adapter.getPlatformConfig(),
        this._adapter.getWorkstreams(),
        this._adapter.getTasks(),
        this._adapter.getRisks(),
        this._adapter.getDecisions(),
        this._adapter.getICPs(),
        this._adapter.getBattleCards(),
        this._adapter.getPOPs(),
        this._adapter.getEvidences ? this._adapter.getEvidences() : Promise.resolve([]),
        this._adapter.getEventLog ? this._adapter.getEventLog() : Promise.resolve([]),
        this._adapter.getKPIs(),
        this._adapter.getFunnel ? this._adapter.getFunnel() : Promise.resolve([]),
        this._adapter.getBaselineD0(),
        this._adapter.getChangelog(),
        this._adapter.getAIInsights(),
        this._adapter.getIntegrationHealth ? this._adapter.getIntegrationHealth() : Promise.resolve([]),
      ]);

      this._setState({
        initialized: true,
        loading: false,
        platformConfig,
        workstreams,
        tasks,
        risks,
        decisions,
        icps,
        battleCards,
        pops,
        evidences,
        eventLog,
        kpis,
        funnel,
        baselineD0,
        changelog,
        aiInsights,
        integrationHealth,
      });
    } catch (err) {
      console.error('[StateManager] Erro durante init:', err);
      this._setState({ loading: false, error: err.message });
    }
  }

  // --- Ações Operacionais Autônomas (Fase 2) ---

  async resolveDecision(decisionId, resolutionNotes, actor = 'Diretoria') {
    if (this._adapter.resolveDecision) {
      await this._adapter.resolveDecision(decisionId, { resolutionNotes, actor });
      await this._refreshCore();
    }
  }

  async transitionTaskStatus(taskId, newStatus, reason, actor, blockReason) {
    if (this._adapter.transitionTaskStatus) {
      await this._adapter.transitionTaskStatus(taskId, { newStatus, reason, actor, blockReason });
      await this._refreshCore();
    }
  }

  async operationalUnblockTask(taskId, unblockData) {
    if (this._adapter.operationalUnblockTask) {
      await this._adapter.operationalUnblockTask(taskId, unblockData);
      await this._refreshCore();
    }
  }

  async addWorkstreamUpdate(workstreamId, updateData) {
    if (this._adapter.addWorkstreamUpdate) {
      await this._adapter.addWorkstreamUpdate(workstreamId, updateData);
      await this._refreshCore();
    }
  }

  async addEvidence(evidenceData) {
    if (this._adapter.addEvidence) {
      await this._adapter.addEvidence(evidenceData);
      await this._refreshCore();
    }
  }

  async refuteICPHypothesis(icpId, refutationData) {
    if (this._adapter.refuteICPHypothesis) {
      await this._adapter.refuteICPHypothesis(icpId, refutationData);
      await this._refreshCore();
    }
  }

  async updateFunnelStage(stageId, data) {
    if (this._adapter.updateFunnelStage) {
      await this._adapter.updateFunnelStage(stageId, data);
      const funnel = await this._adapter.getFunnel();
      this._setState({ funnel });
      this._emit(['funnel']);
    }
  }

  async togglePOPChecklist(popId, itemId) {
    if (this._adapter.togglePOPChecklist) {
      await this._adapter.togglePOPChecklist(popId, itemId);
      await this._refreshCore();
    }
  }

  async approvePOP(popId, actor = 'Diretoria Comercial') {
    if (this._adapter.approvePOP) {
      await this._adapter.approvePOP(popId, actor);
      await this._refreshCore();
    }
  }

  async _refreshCore() {
    const [workstreams, tasks, decisions, risks, icps, pops, evidences, eventLog, changelog] = await Promise.all([
      this._adapter.getWorkstreams(),
      this._adapter.getTasks(),
      this._adapter.getDecisions(),
      this._adapter.getRisks(),
      this._adapter.getICPs(),
      this._adapter.getPOPs(),
      this._adapter.getEvidences ? this._adapter.getEvidences() : Promise.resolve([]),
      this._adapter.getEventLog ? this._adapter.getEventLog() : Promise.resolve([]),
      this._adapter.getChangelog(),
    ]);
    this._setState({ workstreams, tasks, decisions, risks, icps, pops, evidences, eventLog, changelog });
  }

  navigateTo(page) {
    this._setState({ activePage: page });
    this._emit(['activePage']);
  }

  setFilter(filterKey, value) {
    this._setState({
      filters: { ...this._state.filters, [filterKey]: value },
    });
    this._emit(['filters']);
  }

  setSelectedWorkstream(id) {
    this._setState({ selectedWorkstreamId: id });
    this._emit(['selectedWorkstreamId']);
  }

  setSelectedStrategySection(section) {
    this._setState({ selectedStrategySection: section });
    this._emit(['selectedStrategySection']);
  }

  setSelectedICPSolution(solution) {
    this._setState({ selectedICPSolution: solution });
    this._emit(['selectedICPSolution']);
  }

  setSelectedBCSolution(solution) {
    this._setState({ selectedBCSolution: solution });
    this._emit(['selectedBCSolution']);
  }

  // ---- Derived data helpers ----

  getFilteredTasks() {
    const { tasks, filters } = this._state;
    return tasks.filter(t => {
      if (filters.phase !== 'ALL' && t.phase !== filters.phase) return false;
      if (filters.workstream !== 'ALL' && t.workstreamId !== filters.workstream) return false;
      if (filters.status !== 'ALL' && t.status !== filters.status) return false;
      if (filters.priority !== 'ALL' && t.priority !== filters.priority) return false;
      return true;
    });
  }

  // ---- Temporal Condition & Derived Health Helpers (Fase 2.2) ----

  getTaskTemporalCondition(task) {
    const { platformConfig } = this._state;
    if (task.status === 'DONE') return 'COMPLETED';

    const currentDay = platformConfig?.currentDay || 1;
    const startStr = platformConfig?.implantacaoStart || '2026-08-14';

    // Se dueDate está em formato YYYY-MM-DD
    if (task.dueDate && task.dueDate.includes('-')) {
      const d = new Date(task.dueDate);
      const s = new Date(startStr);
      const diffDays = Math.floor((d - s) / (1000 * 60 * 60 * 24));
      // diffDays = 0 => D0 (14/08), diffDays = 1 => D1 (15/08)
      if (diffDays < currentDay) return 'OVERDUE';
      if (diffDays === currentDay || diffDays === currentDay + 1) return 'DUE_SOON';
      return 'ON_TIME';
    }

    return 'ON_TIME';
  }

  getDerivedDelayedTasksCount() {
    return this._state.tasks.filter(t => this.getTaskTemporalCondition(t) === 'OVERDUE').length;
  }

  getDerivedWorkstreamHealth(wsId) {
    const wsTasks = this.getTasksByWorkstream(wsId);
    const blockedCount = wsTasks.filter(t => t.status === 'BLOCKED').length;
    const overdueCount = wsTasks.filter(t => this.getTaskTemporalCondition(t) === 'OVERDUE').length;

    if (blockedCount >= 2 || (blockedCount >= 1 && overdueCount >= 1)) return 'CRITICAL';
    if (blockedCount >= 1 || overdueCount >= 1) return 'AT_RISK';
    return 'ON_TRACK';
  }

  getImplantacaoProgress() {
    const { tasks } = this._state;
    if (!tasks.length) return { pct: 0, done: 0, total: 0, blocked: 0, delayed: 0 };
    const done = tasks.filter(t => t.status === 'DONE').length;
    const blocked = tasks.filter(t => t.status === 'BLOCKED').length;
    const delayed = this.getDerivedDelayedTasksCount();
    return { pct: Math.round((done / tasks.length) * 100), done, total: tasks.length, blocked, delayed };
  }

  getCriticalRisks() {
    return this._state.risks.filter(r => r.severity === 'CRITICAL' && r.status === 'OPEN');
  }

  getPendingDecisions() {
    return this._state.decisions.filter(d => d.status === 'PENDING');
  }

  getWorkstreamById(id) {
    return this._state.workstreams.find(w => w.id === id) || null;
  }

  getTasksByWorkstream(wsId) {
    return this._state.tasks.filter(t => t.workstreamId === wsId);
  }
}

export const store = new StateManager();
