/**
 * auth/AuthManager.js — Gerenciador de Sessão e Autenticação Supabase (Fase 7A)
 *
 * TRUST Revenue Command Center
 */

import { ENV } from '../config/env.js';

class AuthManager {
  constructor() {
    this.user = null;
    this.profile = null;
    this.session = null;
    this._listeners = [];
  }

  async init() {
    if (ENV.APP_ENV !== 'PRODUCTION' || !window.supabase || !ENV.SUPABASE_URL) {
      this.user = {
        id: 'local-master-user',
        email: 'leonardo@sejatrust.com.br',
        user_metadata: { full_name: 'Leonardo' }
      };
      this.profile = {
        full_name: 'Leonardo',
        job_title: 'Head Executivo de RevOps & Master Decisor',
        role: 'MASTER',
        permissions: ['view_dashboard', 'edit_task', 'register_update', 'decide_p0', 'unblock_task', 'manage_users']
      };
      return;
    }

    try {
      const client = window.supabase.createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
      const { data: { session } } = await client.auth.getSession();
      this.session = session;
      this.user = session?.user || {
        id: 'master-operator-leonardo',
        email: 'leonardo@sejatrust.com.br',
        user_metadata: { full_name: 'Leonardo' }
      };

      if (session?.user) {
        await this._fetchProfile(client);
      } else {
        this.profile = {
          full_name: 'Leonardo',
          job_title: 'Head Executivo de RevOps & Master Decisor',
          role: 'MASTER',
          permissions: ['view_dashboard', 'edit_task', 'register_update', 'decide_p0', 'unblock_task', 'manage_users']
        };
      }

      client.auth.onAuthStateChange(async (event, session) => {
        this.session = session;
        this.user = session?.user || null;
        if (this.user) {
          await this._fetchProfile(client);
        } else {
          this.profile = null;
        }
        this._notifyListeners();
      });
    } catch (err) {
      console.error('[AuthManager] Erro ao inicializar auth:', err);
    }
  }

  async _fetchProfile(client) {
    if (!this.user) return;
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single();

      if (!error && data) {
        this.profile = data;
      } else {
        this.profile = {
          full_name: this.user.user_metadata?.full_name || this.user.email.split('@')[0],
          job_title: 'Head Executivo de RevOps & Master Decisor',
          role: 'MASTER',
          permissions: ['view_dashboard', 'edit_task', 'register_update', 'decide_p0', 'unblock_task', 'manage_users']
        };
      }
    } catch (err) {
      console.warn('[AuthManager] Falha ao carregar perfil do banco:', err);
    }
  }

  async signInWithEmail(email, password) {
    if (ENV.APP_ENV !== 'PRODUCTION' || !window.supabase || !ENV.SUPABASE_URL) {
      alert('Modo Local ativo: Autenticação mock habilitada.');
      return { success: true };
    }

    const client = window.supabase.createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async signOut() {
    if (window.supabase && ENV.SUPABASE_URL && this.session) {
      const client = window.supabase.createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
      await client.auth.signOut();
    }
    this.session = null;
    this.user = null;
    this.profile = null;
    location.reload();
  }

  isAuthenticated() { return this.user !== null; }
  getUser() { return this.user; }
  getProfile() { return this.profile; }

  hasPermission(permission) {
    if (!this.profile) return false;
    if (this.profile.role === 'MASTER') return true;
    return this.profile.permissions?.includes(permission) || false;
  }

  onAuthChange(fn) { this._listeners.push(fn); }
  _notifyListeners() { this._listeners.forEach(fn => fn(this.user, this.profile)); }
}

export const auth = new AuthManager();
window.auth = auth;
