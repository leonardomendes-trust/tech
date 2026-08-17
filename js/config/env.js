/**
 * config/env.js — Configuração de Ambiente e Conexão da Torre
 *
 * Suporta três modos de operação diagnósticos:
 * - 'LOCAL'       : Armazenamento local (localStorage) em ambiente de desenvolvimento.
 * - 'CLOUD'       : Conexão ativa e autenticada com o Supabase / PostgreSQL.
 * - 'CLOUD_ERROR' : Falha na nuvem em produção (trava de escrita e aviso visível).
 */

export const ENV = {
  // Define o ambiente alvo: 'LOCAL' | 'PRODUCTION'
  APP_ENV: 'PRODUCTION',

  // Credenciais do Supabase
  SUPABASE_URL: 'https://iizlfagvqdumptcibqby.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpemxmYWd2cWR1bXB0Y2licWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODk2ODYsImV4cCI6MjEwMjU2NTY4Nn0.12AfuM6Xn6t5fFG5Fumol9xrdPkbQYc08QVPPieAiqk',

  // Modo de diagnóstico atual (calculado em tempo de execução)
  DIAGNOSTIC_STATE: 'CLOUD',
  LAST_ERROR: null,
};
