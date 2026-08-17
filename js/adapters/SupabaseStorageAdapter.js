/**
 * adapters/SupabaseStorageAdapter.js — Adapter de Persistência em Nuvem (PostgreSQL)
 *
 * TRUST Revenue Command Center (Fase 6B)
 *
 * Diretrizes Fundamentais:
 * 1. Diagnóstico Explícito: 'LOCAL' | 'CLOUD' | 'CLOUD_ERROR'
 * 2. Fail-Visible em Produção: Se o banco estiver indisponível, bloqueia escritas e alerta a interface (NUNCA fallback silencioso).
 * 3. Atomicidade via RPC: Mutações críticas são enviadas via chamadas RPC PostgreSQL.
 */

import { ENV } from '../config/env.js';
import { AutonomousStorageAdapter } from './AutonomousStorageAdapter.js';

export class SupabaseStorageAdapter {
  constructor() {
    this.localFallback = new AutonomousStorageAdapter();
    this.client = null;
    this.diagnosticState = 'LOCAL'; // 'LOCAL' | 'CLOUD' | 'CLOUD_ERROR'
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
      // Se não há chaves configuradas e está em DEV, opera em LOCAL
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
      state: this.diagnosticState, // 'LOCAL' | 'CLOUD' | 'CLOUD_ERROR'
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
    const { data, error } = await this.client.from('workstreams').select('*');
    if (error) this._handleCloudError('getWorkstreams', error);
    return data || [];
  }

  async getTasks() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getTasks();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('tasks').select('*');
    if (error) this._handleCloudError('getTasks', error);
    return data || [];
  }

  async getDecisions() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getDecisions();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('decisions').select('*');
    if (error) this._handleCloudError('getDecisions', error);
    return data || [];
  }

  async getRisks() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getRisks();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('risks').select('*');
    if (error) this._handleCloudError('getRisks', error);
    return data || [];
  }

  async getICPs() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getICPs();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('icps').select('*');
    if (error) this._handleCloudError('getICPs', error);
    return data || [];
  }

  async getPOPs() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getPOPs();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('pops').select('*');
    if (error) this._handleCloudError('getPOPs', error);
    return data || [];
  }

  async getFunnel() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getFunnel();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('funnel_stages').select('*').order('order_index');
    if (error) this._handleCloudError('getFunnel', error);
    return data || [];
  }

  async getEventLog() {
    if (this.diagnosticState === 'LOCAL') return this.localFallback.getEventLog();
    this._assertCloudReadable();
    const { data, error } = await this.client.from('event_log').select('*').order('created_at', { ascending: false });
    if (error) this._handleCloudError('getEventLog', error);
    return data || [];
  }

  // =========================================================================
  // MUTAÇÕES CRÍTICAS VIA RPC ATÔMICO (WRITE)
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
      return this.localFallback.refuteICP(icpId, {
        reason,
        learning,
        correctiveAction,
        refutedBy: actorName
      });
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

  // =========================================================================
  // GUARDIÕES DE FALHA VISÍVEL (FAIL-VISIBLE POLICY)
  // =========================================================================

  _assertCloudReadable() {
    if (this.diagnosticState === 'CLOUD_ERROR') {
      throw new Error(`[FAIL-VISIBLE] Banco de Dados em Nuvem Indisponível: ${this.lastError}`);
    }
  }

  _assertCloudWritable() {
    if (this.diagnosticState === 'CLOUD_ERROR') {
      const msg = `[TRAVA DE SEGURANÇA] Gravação bloqueada. O Banco de Dados em Nuvem está indisponível (${this.lastError}). Nenhuma operação foi salva localmente para evitar inconsistência com a Diretoria.`;
      alert(msg);
      throw new Error(msg);
    }
  }

  _handleCloudError(operation, error) {
    this.diagnosticState = 'CLOUD_ERROR';
    this.lastError = error.message || JSON.stringify(error);
    const msg = `[FAIL-VISIBLE] Falha na operação '${operation}' com o Supabase: ${this.lastError}`;
    console.error(msg);
    alert(`🔴 ALERTA DE PRODUÇÃO: ${msg}\nA Torre entrou em modo de segurança.`);
    throw new Error(msg);
  }
}
