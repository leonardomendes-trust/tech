/**
 * adapters/SupabaseStorageAdapter.js — Adapter de Persistência em Nuvem (PostgreSQL)
 *
 * TRUST Revenue Command Center
 */

import { ENV } from '../config/env.js';
import { AutonomousStorageAdapter } from './AutonomousStorageAdapter.js';

export class SupabaseStorageAdapter {
  constructor() {
    this.localFallback = new AutonomousStorageAdapter();
    this.client = null;
    this.diagnosticState = 'LOCAL';
    this.lastError = null;
    this._initClient();
  }

  _initClient() {
    if (ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY) {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        try {
          this.client = window.supabase.createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
          this.diagnosticState = 'CLOUD';
        } catch (err) {
          this.diagnosticState = 'CLOUD_ERROR';
          this.lastError = err.message;
        }
      } else {
        this.diagnosticState = 'CLOUD_ERROR';
        this.lastError = 'SDK do Supabase não carregado no navegador.';
      }
    } else {
      if (ENV.APP_ENV === 'PRODUCTION') {
        this.diagnosticState = 'CLOUD_ERROR';
        this.lastError = 'Credenciais de produção não configuradas.';
      } else {
        this.diagnosticState = 'LOCAL';
      }
    }
  }

  getDiagnosticInfo() {
    return {
      state: this.diagnosticState,
      error: this.lastError,
      isCloud: this.diagnosticState === 'CLOUD',
      isLocal: this.diagnosticState === 'LOCAL',
      isError: this.diagnosticState === 'CLOUD_ERROR',
    };
  }

  async getWorkstreams() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getWorkstreams();
    this._assertCloudReadable();
    const [wsRes, tasksRes] = await Promise.all([
      this.client.from('workstreams').select('*'),
      this.client.from('tasks').select('*')
    ]);
    if (wsRes.error) this._handleCloudError('getWorkstreams', wsRes.error);

    const allTasks = tasksRes.data || [];

    return (wsRes.data || []).map(ws => {
      const wsTasks = allTasks.filter(t => (t.workstream_id || t.workstreamId) === ws.id);
      const tasksDone = wsTasks.filter(t => (t.operational_status || t.status) === 'DONE').length;
      const tasksBlocked = wsTasks.filter(t => (t.operational_status || t.status) === 'BLOCKED').length;

      return {
        ...ws,
        progressPct: ws.progress_pct !== undefined ? ws.progress_pct : ws.progressPct,
        healthScore: ws.health_score || ws.healthScore,
        operationalStatus: ws.operational_status || ws.operationalStatus,
        validationStatus: ws.validation_status || ws.validationStatus,
        tasksTotal: wsTasks.length,
        tasksDone,
        tasksBlocked,
      };
    });
  }

  async getTasks() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getTasks();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('tasks').select('*');
    if (error) this._handleCloudError('getTasks', error);
    return (data || []).map(t => ({
      ...t,
      workstreamId: t.workstream_id || t.workstreamId,
      status: t.operational_status || t.status,
      operationalStatus: t.operational_status || t.status,
      validationStatus: t.validation_status || t.validationStatus,
      blockReason: t.block_reason || t.blockReason,
      dueDate: t.due_date || t.dueDate,
      percentComplete: t.percent_complete !== undefined ? t.percent_complete : t.percentComplete,
    }));
  }

  async getDecisions() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getDecisions();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('decisions').select('*');
    if (error) this._handleCloudError('getDecisions', error);
    return (data || []).map(d => ({
      ...d,
      priorityTag: d.priority_tag || d.priorityTag,
      resolutionNotes: d.resolution_notes || d.resolutionNotes,
      decidedBy: d.decided_by || d.decidedBy,
      recordedBy: d.recorded_by || d.recordedBy,
      minutesRef: d.minutes_reference || d.minutesRef,
    }));
  }

  async getRisks() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getRisks();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('risks').select('*');
    if (error) this._handleCloudError('getRisks', error);
    return (data || []).map(r => ({
      ...r,
      mitigationPlan: r.mitigation_plan || r.mitigationPlan,
    }));
  }

  async getICPs() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getICPs();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('icps').select('*');
    if (error) this._handleCloudError('getICPs', error);
    return (data || []).map(i => ({
      ...i,
      ticketEstimate: i.ticket_estimate || i.ticketEstimate,
      cycleDaysEstimate: i.cycle_days_estimate || i.cycleDaysEstimate,
      operationalStatus: i.operational_status || i.operationalStatus,
      maturityLevel: i.maturity_level || i.maturityLevel,
      validationStatus: i.validation_status || i.validationStatus,
      keyLearning: i.key_learning || i.keyLearning,
      correctiveAction: i.corrective_action || i.correctiveAction,
    }));
  }

  async getPOPs() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getPOPs();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('pops').select('*');
    if (error) this._handleCloudError('getPOPs', error);
    return (data || []).map(p => ({
      ...p,
      triggerEvent: p.trigger_event || p.triggerEvent,
      checklist: p.checklist_items || p.checklist,
    }));
  }

  async getFunnel() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getFunnel();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('funnel_stages').select('*').order('order_index');
    if (error) this._handleCloudError('getFunnel', error);
    return (data || []).map(f => ({
      id: f.id,
      stage: f.stage_name || f.stage,
      real: f.real_count !== undefined ? f.real_count : f.real,
      meta: f.meta_count !== undefined ? f.meta_count : f.meta,
      unit: f.unit,
      color: f.color || 'var(--clr-brand)',
    }));
  }

  async getEventLog() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getEventLog();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('event_log').select('*').order('created_at', { ascending: false });
    if (error) this._handleCloudError('getEventLog', error);
    return data || [];
  }

  async getPlatformConfig() { return this.localFallback.getPlatformConfig(); }
  async getBattleCards() { return this.localFallback.getBattleCards(); }
  async getKPIs() { return this.localFallback.getKPIs(); }
  async getBaselineD0() { return this.localFallback.getBaselineD0(); }
  async getChangelog() { return this.localFallback.getChangelog(); }
  async getAIInsights() { return this.localFallback.getAIInsights(); }
  async getIntegrationHealth() { return this.localFallback.getIntegrationHealth(); }
  async getEvidences() { return this.localFallback.getEvidences(); }

  async resolveDecision(decisionId, resolutionNotes, decidedBy, recordedBy, minutesRef) {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.resolveDecision(decisionId, { resolutionNotes, decidedBy, recordedBy, minutesRef });
    }
    this._assertCloudWritable();
    const { data, error } = await this.client.rpc('rpc_resolve_decision', {
      p_decision_id: decisionId,
      p_resolution_notes: resolutionNotes,
      p_decided_by: decidedBy,
      p_recorded_by: recordedBy,
      p_minutes_ref: minutesRef,
      p_status: 'APPROVED'
    });
    if (error) this._handleCloudError('rpc_resolve_decision', error);
    return data;
  }

  async unblockTaskOperational(taskId, reason, actorName, unblockType = 'OPERATIONAL_CONTINUITY') {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.unblockTask(taskId, reason, actorName, unblockType);
    }
    this._assertCloudWritable();
    const { data, error } = await this.client.rpc('rpc_unblock_task_operational', {
      p_task_id: taskId,
      p_unblock_reason: reason,
      p_actor_name: actorName,
      p_unblock_type: unblockType
    });
    if (error) this._handleCloudError('rpc_unblock_task_operational', error);
    return data;
  }

  async refuteICP(icpId, reason, learning, correctiveAction, actorName) {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.refuteICP(icpId, { reason, learning, correctiveAction, refutedBy: actorName });
    }
    this._assertCloudWritable();
    const { data, error } = await this.client.rpc('rpc_refute_icp', {
      p_icp_id: icpId,
      p_reason: reason,
      p_learning: learning,
      p_corrective_action: correctiveAction,
      p_actor_name: actorName
    });
    if (error) this._handleCloudError('rpc_refute_icp', error);
    return data;
  }

  async updateFunnelStage(id, updates) {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.updateFunnelStage(id, updates);
    }
    this._assertCloudWritable();
    const { data, error } = await this.client.from('funnel_stages').update({
      real_count: updates.real,
      meta_count: updates.meta,
      updated_at: new Date().toISOString()
    }).eq('id', id);
    if (error) this._handleCloudError('updateFunnelStage', error);
    return data;
  }

  _assertCloudReadable() {
    if (this.diagnosticState === 'CLOUD_ERROR') {
      throw new Error(`[FAIL-VISIBLE] Banco Indisponível: ${this.lastError}`);
    }
  }

  _assertCloudWritable() {
    if (this.diagnosticState === 'CLOUD_ERROR') {
      const msg = `[TRAVA DE SEGURANÇA] Gravação bloqueada. O Banco de Dados está indisponível (${this.lastError}).`;
      alert(msg);
      throw new Error(msg);
    }
  }

  _handleCloudError(operation, error) {
    this.diagnosticState = 'CLOUD_ERROR';
    this.lastError = error.message || JSON.stringify(error);
    const msg = `[FAIL-VISIBLE] Falha em '${operation}': ${this.lastError}`;
    console.error(msg);
    alert(`🔴 ALERTA DE PRODUÇÃO: ${msg}`);
    throw new Error(msg);
  }
}
