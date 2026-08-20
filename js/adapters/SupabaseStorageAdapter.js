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

  // =========================================================================
  // LEITURAS (READ)
  // =========================================================================

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

  // =========================================================================
  // MUTAÇÕES & DELIBERAÇÕES (WRITE)
  // =========================================================================

  async resolveDecision(decisionId, resolutionNotes, decidedBy, recordedBy, minutesRef) {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.resolveDecision(decisionId, {
        resolutionNotes,
        decidedBy,
        recordedBy,
        minutesRef
      });
    }

    this._assertCloudWritable();
    
    // Atualização direta na tabela de decisões
    const { data, error } = await this.client
      .from('decisions')
      .update({
        status: 'APPROVED',
        resolution_notes: resolutionNotes,
        decided_by: decidedBy || 'Diretoria',
        recorded_by: recordedBy || 'Leonardo (Ops)',
        minutes_reference: minutesRef || null,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', decisionId);

    if (error) this._handleCloudError('resolveDecision', error);

    // Registro na trilha de auditoria (event_log)
    await this.client.from('event_log').insert({
      actor_name: recordedBy || 'Leonardo (Ops)',
      entity_type: 'DECISION',
      entity_id: decisionId,
      event_type: 'DECISION_RESOLVED',
      reason: resolutionNotes,
      metadata: { decided_by: decidedBy, minutes_ref: minutesRef, status: 'APPROVED' }
    });

    return data;
  }

  async unblockTaskOperational(taskId, reason, actorName, unblockType = 'OPERATIONAL_CONTINUITY') {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.unblockTask(taskId, reason, actorName, unblockType);
    }

    this._assertCloudWritable();
    const { data, error } = await this.client
      .from('tasks')
      .update({
        operational_status: 'IN_PROGRESS',
        validation_status: 'PENDING',
        is_unblocked_override: true,
        unblock_type: unblockType,
        unblock_reason: reason,
        unblock_actor_name: actorName || 'Leonardo (Ops)',
        unblocked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (error) this._handleCloudError('unblockTaskOperational', error);

    await this.client.from('event_log').insert({
      actor_name: actorName || 'Leonardo (Ops)',
      entity_type: 'TASK',
      entity_id: taskId,
      event_type: 'OPERATIONAL_UNBLOCK',
      reason: reason,
      metadata: { unblock_type: unblockType }
    });

    return data;
  }

  async transitionTaskStatus(taskId, { newStatus, reason, actor, blockReason }) {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.transitionTaskStatus(taskId, { newStatus, reason, actor, blockReason });
    }

    this._assertCloudWritable();
    const updatePayload = {
      operational_status: newStatus,
      updated_at: new Date().toISOString()
    };
    if (newStatus === 'BLOCKED') {
      updatePayload.block_reason = blockReason || reason || 'Bloqueio operacional.';
    } else {
      updatePayload.block_reason = null;
    }
    if (newStatus === 'DONE') {
      updatePayload.percent_complete = 100;
    }

    const { data, error } = await this.client
      .from('tasks')
      .update(updatePayload)
      .eq('id', taskId);

    if (error) this._handleCloudError('transitionTaskStatus', error);

    await this.client.from('event_log').insert({
      actor_name: actor || 'Comercial Lead',
      entity_type: 'TASK',
      entity_id: taskId,
      event_type: 'TASK_STATUS_CHANGED',
      reason: reason || `Status atualizado para ${newStatus}`,
      metadata: { new_status: newStatus }
    });

    return data;
  }

  async operationalUnblockTask(taskId, unblockData) {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.operationalUnblockTask(taskId, unblockData);
    }

    const reason = `[Desbloqueio: ${unblockData.unblockStrategy || 'Operacional'}] ${unblockData.reason || ''} (Alinhado: ${unblockData.decider || 'Comercial'})`;
    return this.unblockTaskOperational(taskId, reason, unblockData.author || 'Leonardo (Ops)');
  }

  async addWorkstreamUpdate(workstreamId, updateData) {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.addWorkstreamUpdate(workstreamId, updateData);
    }

    this._assertCloudWritable();
    const { data, error } = await this.client
      .from('workstreams')
      .update({
        health_score: updateData.health || 'ON_TRACK',
        updated_at: new Date().toISOString()
      })
      .eq('id', workstreamId);

    if (error) this._handleCloudError('addWorkstreamUpdate', error);

    await this.client.from('event_log').insert({
      actor_name: updateData.author || 'Comercial Ops',
      entity_type: 'WORKSTREAM',
      entity_id: workstreamId,
      event_type: 'WORKSTREAM_UPDATE',
      reason: updateData.summary,
      metadata: updateData
    });

    return data;
  }

  async refuteICP(icpId, reason, learning, correctiveAction, actorName) {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.refuteICP(icpId, { reason, learning, correctiveAction, refutedBy: actorName });
    }

    this._assertCloudWritable();
    const { data, error } = await this.client
      .from('icps')
      .update({
        validation_status: 'REFUTED',
        key_learning: learning,
        corrective_action: correctiveAction,
        updated_at: new Date().toISOString()
      })
      .eq('id', icpId);

    if (error) this._handleCloudError('refuteICP', error);

    await this.client.from('event_log').insert({
      actor_name: actorName || 'Comercial',
      entity_type: 'ICP',
      entity_id: icpId,
      event_type: 'ICP_REFUTED',
      reason: reason,
      metadata: { key_learning: learning, corrective_action: correctiveAction }
    });

    return data;
  }

  async refuteICPHypothesis(icpId, refutationData) {
    if (this.diagnosticState === 'LOCAL') {
      return this.localFallback.refuteICPHypothesis(icpId, refutationData);
    }
    return this.refuteICP(
      icpId,
      refutationData.reason,
      refutationData.keyLearning || '',
      refutationData.correctiveAction || '',
      refutationData.author || 'Comercial'
    );
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
