/**
 * views/profile.js — Visão de Perfil Master / Diretor Executivo & Head de RevOps
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';
import { auth } from '../auth/AuthManager.js';

export function renderProfile() {
  const dayInfo = store.getCurrentDayInfo();
  const profile = auth.getProfile() || {
    full_name: 'Leonardo',
    job_title: 'Head Executivo de RevOps',
    role: 'MASTER',
    permissions: ['all']
  };
  const user = auth.getUser();
  const isMaster = profile.role === 'MASTER';

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Identidade & Nível de Autoridade</div>
        <h1 class="page-header__title">Perfil do Operador (${profile.role})</h1>
        <p class="page-header__subtitle">
          Credencial com autoridade institucional para homologar decisões, aplicar desbloqueios e auditar a Torre.
        </p>
      </div>
      <button class="btn-subtle" onclick="auth.signOut()">
        🚪 Encerrar Sessão (Logout)
      </button>
    </div>

    <div class="grid-2 mb-6" style="grid-template-columns: 320px 1fr; gap: var(--sp-6);">
      
      <!-- CARD DE IDENTIDADE MASTER -->
      <div class="card-panel" style="margin-bottom: 0;">
        <div class="card-panel__body text-center" style="padding: var(--sp-6);">
          <div style="width: 72px; height: 72px; border-radius: var(--radius-full); background: var(--clr-brand-subtle); color: var(--clr-brand); font-weight: bold; font-size: var(--fs-2xl); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--sp-4);">
            ${profile.full_name.substring(0, 2).toUpperCase()}
          </div>
          <h2 class="text-md fw-bold text-primary">${profile.full_name}</h2>
          <div class="text-xs text-brand fw-semibold mb-2">${profile.job_title}</div>
          <span class="badge ${isMaster ? 'badge--on-track' : 'badge--neutral'}">Role: ${profile.role}</span>

          <div class="user-dropdown-divider" style="margin: var(--sp-4) 0;"></div>

          <div class="text-left text-xs text-secondary flex flex-col gap-2">
            <div><strong>E-mail:</strong> ${user?.email || 'leonardo@sejatrust.com.br'}</div>
            <div><strong>Organização:</strong> TRUST Holding</div>
            <div><strong>Ciclo Corrente:</strong> ${dayInfo.dayLabel} (${dayInfo.formattedDate})</div>
          </div>
        </div>
      </div>

      <!-- MATRIZ DE PERMISSÕES PLENAS -->
      <div class="card-panel" style="margin-bottom: 0;">
        <div class="card-panel__header">
          <span>Matriz de Autorizações e Privilégios Concedidos</span>
          <span class="badge badge--done">100% Homologado</span>
        </div>
        <div class="card-panel__body">
          <div class="flex flex-col gap-3">
            <div class="p-3" style="background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div class="flex justify-between items-center mb-1">
                <strong class="text-primary text-xs">🏛️ Poder de Deliberação Institucional (Decisões P0)</strong>
                <span class="badge badge--done">Permissão Plena</span>
              </div>
              <p class="text-2xs text-muted">Autorização para deliberar e aprovar propostas de valor, contratações de ferramentas, ganchos comerciais de entrada e orçamentos de mídia.</p>
            </div>

            <div class="p-3" style="background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div class="flex justify-between items-center mb-1">
                <strong class="text-primary text-xs">⚡ Executor de Desbloqueios Operacionais</strong>
                <span class="badge badge--done">Permissão Plena</span>
              </div>
              <p class="text-2xs text-muted">Capacidade de emitir ordens de continuidade (<code>VALIDATION_PENDING</code>) para manter frentes em tração sem esperar travas burocráticas.</p>
            </div>

            <div class="p-3" style="background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div class="flex justify-between items-center mb-1">
                <strong class="text-primary text-xs">🎯 Governança de Metas, Funil e Refutações de ICP</strong>
                <span class="badge badge--done">Permissão Plena</span>
              </div>
              <p class="text-2xs text-muted">Ajuste de metas reais do funil comercial, homologação de procedimentos padrão (POPs) e registro de aprendizados de campo.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}
