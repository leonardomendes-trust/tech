/**
 * TRUST Revenue Command Center
 * Seed Data — MockSeedAdapter Dataset (com suporte a Fase 2)
 *
 * PlatformMode: IMPLANTACAO (D0-D30) | OPERACAO (pós D30) | INTELLIGENCE (RevOps Pleno)
 */

export const PLATFORM_CONFIG = {
  mode: 'AUTONOMOUS',
  projectName: 'TRUST Revenue Command Center',
  implantacaoStart: '2026-08-14', // D0
  implantacaoEnd: '2026-09-13',   // D30
  currentDay: 1, // Dia atual da implantação (D1)
  dataSourceLabel: 'Operação independente',
  version: '0.2.0-phase2',
};

// ============================================================
// WORKSTREAMS (8 FRENTES DE IMPLANTAÇÃO)
// ============================================================
export const WORKSTREAMS = [
  {
    id: 'ws-1', code: 'F1',
    name: 'Estratégia & ICP',
    description: 'Definição dos ICPs por solução, validação comercial e aprovação da Diretoria.',
    owner: 'Estratégia Comercial',
    status: 'IN_PROGRESS',
    progressPct: 25,
    tasksTotal: 7, tasksDone: 1, tasksDelayed: 0, tasksBlocked: 1,
    healthScore: 'MODERATE',
    dependencies: [],
    startDate: '2026-08-14', deadline: '2026-08-20',
    lastUpdate: '2026-08-14T10:00:00Z',
    color: '#3b82f6',
    latestUpdate: {
      timestamp: '2026-08-14T10:00:00Z',
      summary: 'ICP CAPTO-01 validado com mercado. Ofertas de entrada dependem de decisão da Diretoria (DEC-02).',
      health: 'MODERATE',
      blocker: 'Aprovação de ganchos comerciais de entrada.',
      nextMilestone: 'D02 · Fechar Matriz de ICPs.',
      nextAction: 'Reunião de validação de claims e ofertas.',
      author: 'Comercial',
    }
  },
  {
    id: 'ws-2', code: 'F2',
    name: 'Battle Cards',
    description: 'Desenvolvimento dos argumentários de venda e superação de objeções por solução.',
    owner: 'Comercial / Marketing',
    status: 'TODO',
    progressPct: 10,
    tasksTotal: 5, tasksDone: 0, tasksDelayed: 0, tasksBlocked: 1,
    healthScore: 'AT_RISK',
    dependencies: ['ws-1'],
    startDate: '2026-08-17', deadline: '2026-08-24',
    lastUpdate: '2026-08-14T09:00:00Z',
    color: '#8b5cf6',
    latestUpdate: {
      timestamp: '2026-08-14T09:00:00Z',
      summary: 'Estrutura dos cards Capto, Luma e Services pronta em rascunho. Bloqueado em F1-04 (ofertas de entrada).',
      health: 'AT_RISK',
      blocker: 'Aguardando aprovação das ofertas de entrada para formular respostas.',
      nextMilestone: 'D04 · Validar Battle Cards v1.',
      nextAction: 'Coletar evidências auditadas de performance.',
      author: 'Marketing',
    }
  },
  {
    id: 'ws-3', code: 'F3',
    name: 'CRM & Data',
    description: 'Configuração do RD Station CRM, pipelines, campos obrigatórios, lifecycle e governança de dados.',
    owner: 'CRM / Ops',
    status: 'BLOCKED',
    progressPct: 5,
    tasksTotal: 9, tasksDone: 0, tasksDelayed: 0, tasksBlocked: 3,
    healthScore: 'CRITICAL',
    dependencies: ['ws-1'],
    startDate: '2026-08-17', deadline: '2026-08-31',
    lastUpdate: '2026-08-14T08:00:00Z',
    color: '#ef4444',
    latestUpdate: {
      timestamp: '2026-08-14T08:00:00Z',
      summary: 'Frente mais crítica no D1. 3 tarefas travadas por falta de definição de campos obrigatórios (DEC-03).',
      health: 'CRITICAL',
      blocker: 'Campos obrigatórios do CRM não validados.',
      nextMilestone: 'D01 · Aprovar campos obrigatórios.',
      nextAction: 'Concluir definição dos campos no Kickoff.',
      author: 'CRM Lead',
    }
  },
  {
    id: 'ws-4', code: 'F4',
    name: 'Automação',
    description: 'Configuração dos fluxos de automação no RD Marketing: scoring, handoff, nutrição e alertas.',
    owner: 'Marketing Ops',
    status: 'BACKLOG',
    progressPct: 0,
    tasksTotal: 6, tasksDone: 0, tasksDelayed: 0, tasksBlocked: 0,
    healthScore: 'ON_TRACK',
    dependencies: ['ws-3'],
    startDate: '2026-08-24', deadline: '2026-09-06',
    lastUpdate: '2026-08-14T08:00:00Z',
    color: '#f59e0b',
    latestUpdate: {
      timestamp: '2026-08-14T08:00:00Z',
      summary: 'Aguardando avanço de F3 (CRM) para iniciar configuração no RD Marketing.',
      health: 'ON_TRACK',
      blocker: 'Nenhum interno. Dependência de F3.',
      nextMilestone: 'D10 · Iniciar automações.',
      nextAction: 'Mapear critérios de scoring de ICPs.',
      author: 'Marketing Ops',
    }
  },
  {
    id: 'ws-5', code: 'F5',
    name: 'Aquisição',
    description: 'Configuração do Apollo.io (listas, cadências, sequências), Landing Pages e LinkedIn Ads.',
    owner: 'Growth / SDR',
    status: 'BACKLOG',
    progressPct: 0,
    tasksTotal: 8, tasksDone: 0, tasksDelayed: 0, tasksBlocked: 0,
    healthScore: 'ON_TRACK',
    dependencies: ['ws-1', 'ws-2'],
    startDate: '2026-08-24', deadline: '2026-09-06',
    lastUpdate: '2026-08-14T08:00:00Z',
    color: '#10b981',
    latestUpdate: {
      timestamp: '2026-08-14T08:00:00Z',
      summary: 'Contas e personas mapeadas. Aguardando aprovação de budget de LinkedIn Ads (DEC-05).',
      health: 'ON_TRACK',
      blocker: 'Nenhum imediato.',
      nextMilestone: 'D05 · Aprovar budget.',
      nextAction: 'Preparar templates de cadência Apollo.',
      author: 'Growth Lead',
    }
  },
  {
    id: 'ws-6', code: 'F6',
    name: 'KPIs & Baseline',
    description: 'Definição dos KPIs de implantação, registro do Baseline D0 e configuração de dashboards.',
    owner: 'RevOps',
    status: 'IN_PROGRESS',
    progressPct: 20,
    tasksTotal: 4, tasksDone: 0, tasksDelayed: 0, tasksBlocked: 0,
    healthScore: 'ON_TRACK',
    dependencies: ['ws-3'],
    startDate: '2026-08-14', deadline: '2026-09-13',
    lastUpdate: '2026-08-14T08:00:00Z',
    color: '#06b6d4',
    latestUpdate: {
      timestamp: '2026-08-14T08:00:00Z',
      summary: 'Baseline D0 registrado com fotografia dos 9 indicadores iniciais.',
      health: 'ON_TRACK',
      blocker: 'Nenhum.',
      nextMilestone: 'D04 · Metas D30 aprovadas.',
      nextAction: 'Alinhar metas de Nível 1 com líderes de frente.',
      author: 'RevOps Lead',
    }
  },
  {
    id: 'ws-7', code: 'F7',
    name: 'POPs',
    description: 'Documentação e aprovação dos 10 Procedimentos Operacionais Padrão do processo comercial.',
    owner: 'Comercial / Ops',
    status: 'IN_PROGRESS',
    progressPct: 15,
    tasksTotal: 10, tasksDone: 1, tasksDelayed: 0, tasksBlocked: 0,
    healthScore: 'ON_TRACK',
    dependencies: ['ws-1', 'ws-3'],
    startDate: '2026-08-17', deadline: '2026-09-06',
    lastUpdate: '2026-08-14T10:00:00Z',
    color: '#ec4899',
    latestUpdate: {
      timestamp: '2026-08-14T10:00:00Z',
      summary: 'POP-07 (Opportunity/Pipeline) aprovado. POP-01 (ICP & Segmentação) em andamento.',
      health: 'ON_TRACK',
      blocker: 'Nenhum.',
      nextMilestone: 'D04 · POP-01 aprovado.',
      nextAction: 'Completar checklist do POP-01.',
      author: 'Comercial Ops',
    }
  },
  {
    id: 'ws-8', code: 'F8',
    name: 'Revenue Command Center',
    description: 'Construção da própria Torre de Comando: configurações, integrações, KPIs operacionais e IA.',
    owner: 'Tech / RevOps',
    status: 'IN_PROGRESS',
    progressPct: 10,
    tasksTotal: 5, tasksDone: 0, tasksDelayed: 0, tasksBlocked: 0,
    healthScore: 'ON_TRACK',
    dependencies: ['ws-3', 'ws-6'],
    startDate: '2026-08-14', deadline: '2026-09-13',
    lastUpdate: '2026-08-14T08:00:00Z',
    color: '#64748b',
    latestUpdate: {
      timestamp: '2026-08-14T08:00:00Z',
      summary: 'Torre de comando operando em modo AUTONOMOUS · INTERNAL com storage local persistente.',
      health: 'ON_TRACK',
      blocker: 'Nenhum.',
      nextMilestone: 'D05 · Fase 2 Operacional concluída.',
      nextAction: 'Evoluir Cockpit HOJE e Memória Operacional.',
      author: 'Tech Lead',
    }
  },
];

// ============================================================
// TASKS (42 TAREFAS — D0–D30)
// ============================================================
export const TASKS = [
  // --- FRENTE 1: Estratégia & ICP ---
  { id: 't-001', code: 'F1-01', title: 'Kickoff executivo e alinhamento do plano', workstreamId: 'ws-1', owner: 'Diretoria', status: 'IN_PROGRESS', priority: 'CRITICAL', phase: 'S1', startDate: '2026-08-14', dueDate: '2026-08-14', dependencies: [], percentComplete: 80, risk: 'LOW', description: 'Reunião de kickoff com todos os líderes para validar as 6 decisões necessárias.', lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 't-002', code: 'F1-02', title: 'Validar e fechar Matriz de ICPs por solução', workstreamId: 'ws-1', owner: 'Comercial', status: 'IN_PROGRESS', priority: 'CRITICAL', phase: 'S1', startDate: '2026-08-14', dueDate: '2026-08-16', dependencies: ['t-001'], percentComplete: 30, risk: 'HIGH', description: 'Aprovação formal dos ICPs CAPTO, LUMA e SERVICES com status inicial.', lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 't-003', code: 'F1-03', title: 'Definir personas e critérios de desqualificação', workstreamId: 'ws-1', owner: 'Comercial', status: 'TODO', priority: 'HIGH', phase: 'S1', startDate: '2026-08-15', dueDate: '2026-08-18', dependencies: ['t-002'], percentComplete: 0, risk: 'MEDIUM', description: 'Persona principal e critérios de IQL para cada ICP validado.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-004', code: 'F1-04', title: 'Definir ofertas e ganchos comerciais por solução', workstreamId: 'ws-1', owner: 'Diretoria / Comercial', status: 'BLOCKED', priority: 'CRITICAL', phase: 'S1', startDate: '2026-08-15', dueDate: '2026-08-16', dependencies: ['t-001'], percentComplete: 0, risk: 'CRITICAL', description: 'Piloto Anti-Jammer (Capto), Diagnóstico CFTV (Luma), Vistoria Técnica (Services).', blockReason: 'Aguardando decisão executiva DEC-02 da Diretoria.', lastUpdate: '2026-08-14T09:00:00Z' },
  { id: 't-005', code: 'F1-05', title: 'Homologar Claims e evidências técnicas', workstreamId: 'ws-1', owner: 'Comercial / Jurídico', status: 'TODO', priority: 'HIGH', phase: 'S1', startDate: '2026-08-16', dueDate: '2026-08-19', dependencies: ['t-002'], percentComplete: 0, risk: 'HIGH', description: 'Validação jurídica dos claims antes de publicar em LPs e campanhas.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-006', code: 'F1-06', title: 'Definir SLA de atendimento e alçadas de margem', workstreamId: 'ws-1', owner: 'Diretoria', status: 'TODO', priority: 'CRITICAL', phase: 'S1', startDate: '2026-08-14', dueDate: '2026-08-15', dependencies: ['t-001'], percentComplete: 0, risk: 'HIGH', description: 'Regra de resposta < 30min e faixas progressivas de desconto.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-007', code: 'F1-07', title: 'Designar owners por frente (Comercial, SDR, Tech, Mkt)', workstreamId: 'ws-1', owner: 'Diretoria', status: 'DONE', priority: 'CRITICAL', phase: 'S1', startDate: '2026-08-14', dueDate: '2026-08-14', dependencies: [], percentComplete: 100, risk: 'LOW', description: 'Designação formal dos líderes responsáveis por cada frente.', lastUpdate: '2026-08-14T10:30:00Z' },

  // --- FRENTE 2: Battle Cards ---
  { id: 't-011', code: 'F2-01', title: 'Desenvolver Battle Card CAPTO v1', workstreamId: 'ws-2', owner: 'Comercial', status: 'BLOCKED', priority: 'HIGH', phase: 'S1', startDate: '2026-08-15', dueDate: '2026-08-18', dependencies: ['t-002', 't-004'], percentComplete: 0, risk: 'HIGH', description: 'Objeções, respostas, discovery, evidência e próximo passo para Capto.', blockReason: 'Depende de F1-04 (Ofertas de entrada aprovadas).', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-012', code: 'F2-02', title: 'Desenvolver Battle Card LUMA v1', workstreamId: 'ws-2', owner: 'Comercial', status: 'TODO', priority: 'HIGH', phase: 'S1', startDate: '2026-08-15', dueDate: '2026-08-18', dependencies: ['t-002'], percentComplete: 0, risk: 'MEDIUM', description: 'Objeções, respostas, discovery, evidência e próximo passo para Luma.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-013', code: 'F2-03', title: 'Desenvolver Battle Card SERVICES v1', workstreamId: 'ws-2', owner: 'Comercial', status: 'TODO', priority: 'HIGH', phase: 'S1', startDate: '2026-08-15', dueDate: '2026-08-18', dependencies: ['t-002'], percentComplete: 0, risk: 'MEDIUM', description: 'Objeções, respostas, discovery, evidência e próximo passo para Services.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-014', code: 'F2-04', title: 'Validar Battle Cards com time comercial', workstreamId: 'ws-2', owner: 'Comercial', status: 'TODO', priority: 'MEDIUM', phase: 'S2', startDate: '2026-08-19', dueDate: '2026-08-21', dependencies: ['t-011', 't-012', 't-013'], percentComplete: 0, risk: 'LOW', description: 'Sessão de roleplay e refinamento dos argumentários.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-015', code: 'F2-05', title: 'Publicar Battle Cards no Command Center', workstreamId: 'ws-2', owner: 'RevOps', status: 'BACKLOG', priority: 'MEDIUM', phase: 'S2', startDate: '2026-08-22', dueDate: '2026-08-24', dependencies: ['t-014'], percentComplete: 0, risk: 'LOW', description: 'Carregar os Battle Cards aprovados no módulo de estratégia da Torre.', lastUpdate: '2026-08-14T08:00:00Z' },

  // --- FRENTE 3: CRM & Data ---
  { id: 't-021', code: 'F3-01', title: 'Definir campos obrigatórios do RD CRM', workstreamId: 'ws-3', owner: 'CRM / Comercial', status: 'BLOCKED', priority: 'CRITICAL', phase: 'S1', startDate: '2026-08-14', dueDate: '2026-08-15', dependencies: ['t-002'], percentComplete: 0, risk: 'CRITICAL', description: 'CNPJ, e-mail, cargo, segmento, UTM, origem. Bloqueia pipelines e automações.', blockReason: 'Aguardando decisão executiva DEC-03.', lastUpdate: '2026-08-14T09:00:00Z' },
  { id: 't-022', code: 'F3-02', title: 'Configurar os 3 Pipelines no RD CRM', workstreamId: 'ws-3', owner: 'CRM', status: 'BLOCKED', priority: 'CRITICAL', phase: 'S2', startDate: '2026-08-17', dueDate: '2026-08-21', dependencies: ['t-021'], percentComplete: 0, risk: 'CRITICAL', description: 'Pipelines CAPTO, LUMA e SERVICES com etapas e regras de passagem.', blockReason: 'Bloqueado por F3-01 (Campos obrigatórios).', lastUpdate: '2026-08-14T09:00:00Z' },
  { id: 't-023', code: 'F3-03', title: 'Configurar Lifecycle de Marketing no RD', workstreamId: 'ws-3', owner: 'Marketing Ops', status: 'BLOCKED', priority: 'HIGH', phase: 'S2', startDate: '2026-08-17', dueDate: '2026-08-21', dependencies: ['t-022'], percentComplete: 0, risk: 'HIGH', description: 'Separar lifecycle de marketing do CRM; definir fases MQL/SQL.', blockReason: 'Bloqueado por F3-02.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-024', code: 'F3-04', title: 'Configurar regras de passagem MQL → SQL', workstreamId: 'ws-3', owner: 'CRM / SDR', status: 'BACKLOG', priority: 'HIGH', phase: 'S2', startDate: '2026-08-20', dueDate: '2026-08-24', dependencies: ['t-023'], percentComplete: 0, risk: 'MEDIUM', description: 'Critérios de qualificação, pontuação mínima e alerta de SLA.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-025', code: 'F3-05', title: 'Configurar alerta de aging por etapa', workstreamId: 'ws-3', owner: 'CRM', status: 'BACKLOG', priority: 'MEDIUM', phase: 'S3', startDate: '2026-08-24', dueDate: '2026-08-28', dependencies: ['t-022'], percentComplete: 0, risk: 'LOW', description: 'Alertas visuais e notificações quando uma oportunidade não avança.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-026', code: 'F3-06', title: 'Configurar Loss Reason obrigatório', workstreamId: 'ws-3', owner: 'CRM', status: 'BACKLOG', priority: 'MEDIUM', phase: 'S3', startDate: '2026-08-24', dueDate: '2026-08-28', dependencies: ['t-022'], percentComplete: 0, risk: 'LOW', description: 'Campos de motivo de perda para alimentar futuro ICP Intelligence e Battle Card AI.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-027', code: 'F3-07', title: 'Treinar usuários do RD CRM', workstreamId: 'ws-3', owner: 'CRM / SDR', status: 'BACKLOG', priority: 'HIGH', phase: 'S3', startDate: '2026-08-28', dueDate: '2026-09-04', dependencies: ['t-022', 't-024'], percentComplete: 0, risk: 'MEDIUM', description: 'Treinamento do time comercial e SDR no CRM configurado.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-028', code: 'F3-08', title: 'Auditoria de Data Quality (POP-09)', workstreamId: 'ws-3', owner: 'RevOps', status: 'BACKLOG', priority: 'HIGH', phase: 'S4', startDate: '2026-09-04', dueDate: '2026-09-10', dependencies: ['t-027'], percentComplete: 0, risk: 'MEDIUM', description: 'Verificar completude, duplicidade e validade dos registros antes do go-live.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-029', code: 'F3-09', title: 'QA de integração CRM → Command Center', workstreamId: 'ws-3', owner: 'Tech', status: 'BACKLOG', priority: 'HIGH', phase: 'S4', startDate: '2026-09-08', dueDate: '2026-09-12', dependencies: ['t-028'], percentComplete: 0, risk: 'HIGH', description: 'Validar que os dados do RD chegam corretamente na Torre.', lastUpdate: '2026-08-14T08:00:00Z' },

  // --- FRENTE 4: Automação ---
  { id: 't-031', code: 'F4-01', title: 'Configurar Lead Scoring V1 (Fit + Engajamento)', workstreamId: 'ws-4', owner: 'Marketing Ops', status: 'BACKLOG', priority: 'HIGH', phase: 'S3', startDate: '2026-08-24', dueDate: '2026-08-28', dependencies: ['t-023'], percentComplete: 0, risk: 'MEDIUM', description: 'Modelo de scoring baseado em fit de ICP e comportamento.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-032', code: 'F4-02', title: 'Configurar handoff automático MQL → Tarefa SDR', workstreamId: 'ws-4', owner: 'Marketing Ops / SDR', status: 'BACKLOG', priority: 'HIGH', phase: 'S3', startDate: '2026-08-26', dueDate: '2026-09-01', dependencies: ['t-031'], percentComplete: 0, risk: 'MEDIUM', description: 'Notificação + criação de tarefa automática quando MQL é atingido.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-033', code: 'F4-03', title: 'Configurar nutrição segmentada por ICP', workstreamId: 'ws-4', owner: 'Marketing', status: 'BACKLOG', priority: 'MEDIUM', phase: 'S3', startDate: '2026-08-28', dueDate: '2026-09-04', dependencies: ['t-002', 't-031'], percentComplete: 0, risk: 'LOW', description: 'Fluxos de nutrição distintos por solução (Capto, Luma, Services).', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-034', code: 'F4-04', title: 'Configurar alerta de SLA violado', workstreamId: 'ws-4', owner: 'Marketing Ops', status: 'BACKLOG', priority: 'HIGH', phase: 'S3', startDate: '2026-09-01', dueDate: '2026-09-04', dependencies: ['t-032'], percentComplete: 0, risk: 'MEDIUM', description: 'Alerta quando o SDR não responde em 30 minutos após handoff.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-035', code: 'F4-05', title: 'Configurar fluxo de reativação (Lost por timing)', workstreamId: 'ws-4', owner: 'Marketing Ops', status: 'BACKLOG', priority: 'MEDIUM', phase: 'S4', startDate: '2026-09-04', dueDate: '2026-09-10', dependencies: ['t-026'], percentComplete: 0, risk: 'LOW', description: 'Automação para reengajar leads perdidos por timing após 90 dias.', lastUpdate: '2026-08-14T08:00:00Z' },

  // --- FRENTE 5: Aquisição ---
  { id: 't-041', code: 'F5-01', title: 'Configurar conta e workspace no Apollo.io', workstreamId: 'ws-5', owner: 'SDR / Growth', status: 'BACKLOG', priority: 'HIGH', phase: 'S2', startDate: '2026-08-17', dueDate: '2026-08-20', dependencies: ['t-002'], percentComplete: 0, risk: 'MEDIUM', description: 'Setup inicial, integração com RD e configuração de usuários.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-042', code: 'F5-02', title: 'Criar listas de contas por ICP no Apollo', workstreamId: 'ws-5', owner: 'SDR', status: 'BACKLOG', priority: 'HIGH', phase: 'S2', startDate: '2026-08-20', dueDate: '2026-08-24', dependencies: ['t-041', 't-002'], percentComplete: 0, risk: 'MEDIUM', description: 'Listas segmentadas por ICP e solução com enriquecimento.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-043', code: 'F5-03', title: 'Criar cadências de Outbound V1 (21 dias / 8 toques)', workstreamId: 'ws-5', owner: 'SDR', status: 'BACKLOG', priority: 'HIGH', phase: 'S2', startDate: '2026-08-21', dueDate: '2026-08-26', dependencies: ['t-011', 't-012', 't-013', 't-041'], percentComplete: 0, risk: 'HIGH', description: 'D01 Email, D03 LinkedIn, D05 Call, D06 Email, D10 Email, D14 Call, D18 InMail, D21 Break-up.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-044', code: 'F5-04', title: 'Criar Landing Pages por solução', workstreamId: 'ws-5', owner: 'Marketing', status: 'BACKLOG', priority: 'HIGH', phase: 'S3', startDate: '2026-08-24', dueDate: '2026-09-01', dependencies: ['t-005'], percentComplete: 0, risk: 'MEDIUM', description: 'LPs dedicadas para Capto, Luma e Services com UTMs e formulários.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-045', code: 'F5-05', title: 'Configurar UTMs e tracking de origem', workstreamId: 'ws-5', owner: 'Marketing / RevOps', status: 'BACKLOG', priority: 'HIGH', phase: 'S3', startDate: '2026-08-24', dueDate: '2026-08-28', dependencies: ['t-044'], percentComplete: 0, risk: 'MEDIUM', description: 'Padrão de UTMs para todas as campanhas e canais.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-046', code: 'F5-06', title: 'Lançar campanhas LinkedIn Ads (teste D18-D30)', workstreamId: 'ws-5', owner: 'Marketing / Growth', status: 'BACKLOG', priority: 'HIGH', phase: 'S4', startDate: '2026-09-01', dueDate: '2026-09-10', dependencies: ['t-044', 't-045'], percentComplete: 0, risk: 'HIGH', description: 'Teste de tração de LinkedIn Ads com budget aprovado.', lastUpdate: '2026-08-14T08:00:00Z' },

  // --- FRENTE 6: KPIs & Baseline ---
  { id: 't-051', code: 'F6-01', title: 'Registrar Baseline D0 (estado atual)', workstreamId: 'ws-6', owner: 'RevOps', status: 'IN_PROGRESS', priority: 'CRITICAL', phase: 'S1', startDate: '2026-08-14', dueDate: '2026-08-14', dependencies: [], percentComplete: 60, risk: 'LOW', description: 'Fotografar o estado inicial de cada frente antes de qualquer ação.', lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 't-052', code: 'F6-02', title: 'Definir metas de implantação D30', workstreamId: 'ws-6', owner: 'Diretoria / RevOps', status: 'TODO', priority: 'HIGH', phase: 'S1', startDate: '2026-08-15', dueDate: '2026-08-18', dependencies: ['t-001'], percentComplete: 0, risk: 'LOW', description: 'Metas de % tarefas concluídas, usuários treinados, integrações ativas.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-053', code: 'F6-03', title: 'Configurar dashboard de KPIs de implantação', workstreamId: 'ws-6', owner: 'RevOps / Tech', status: 'BACKLOG', priority: 'MEDIUM', phase: 'S2', startDate: '2026-08-20', dueDate: '2026-08-25', dependencies: ['t-051', 't-052'], percentComplete: 0, risk: 'LOW', description: 'Painéis de acompanhamento de progresso por frente no Command Center.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-054', code: 'F6-04', title: 'Avaliação Go-Live Readiness (D28)', workstreamId: 'ws-6', owner: 'RevOps / Diretoria', status: 'BACKLOG', priority: 'CRITICAL', phase: 'S4', startDate: '2026-09-11', dueDate: '2026-09-12', dependencies: ['t-028', 't-029'], percentComplete: 0, risk: 'MEDIUM', description: 'Checklist de prontidão para go-live antes do encerramento do D30.', lastUpdate: '2026-08-14T08:00:00Z' },

  // --- FRENTE 7: POPs ---
  { id: 't-061', code: 'F7-01', title: 'Documentar POP-01 — ICP & Segmentação', workstreamId: 'ws-7', owner: 'Comercial', status: 'IN_PROGRESS', priority: 'HIGH', phase: 'S1', startDate: '2026-08-14', dueDate: '2026-08-17', dependencies: ['t-002'], percentComplete: 40, risk: 'LOW', description: 'Critérios e processo de identificação e classificação de ICPs.', lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 't-062', code: 'F7-02', title: 'Documentar POP-02 — Prospecção & Apollo', workstreamId: 'ws-7', owner: 'SDR', status: 'TODO', priority: 'HIGH', phase: 'S2', startDate: '2026-08-17', dueDate: '2026-08-21', dependencies: ['t-041'], percentComplete: 0, risk: 'LOW', description: 'Processo de enriquecimento, validação e entrada de contas no Apollo.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-063', code: 'F7-03', title: 'Documentar POP-03 — Lead / MQL / SQL', workstreamId: 'ws-7', owner: 'SDR / Marketing', status: 'TODO', priority: 'HIGH', phase: 'S2', startDate: '2026-08-17', dueDate: '2026-08-21', dependencies: ['t-023'], percentComplete: 0, risk: 'MEDIUM', description: 'Critérios de scoring, passagem e handoff com SLA documentado.', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 't-064', code: 'F7-07', title: 'Documentar POP-07 — Opportunity / Pipeline', workstreamId: 'ws-7', owner: 'Comercial', status: 'DONE', priority: 'HIGH', phase: 'S1', startDate: '2026-08-14', dueDate: '2026-08-16', dependencies: [], percentComplete: 100, risk: 'LOW', description: 'Regras de avanço, critérios de qualificação e aging por etapa.', lastUpdate: '2026-08-14T11:00:00Z' },

  // --- FRENTE 8: Revenue Command Center ---
  { id: 't-071', code: 'F8-01', title: 'Configurar MVP da Torre (Executive Overview)', workstreamId: 'ws-8', owner: 'Tech', status: 'IN_PROGRESS', priority: 'HIGH', phase: 'S1', startDate: '2026-08-14', dueDate: '2026-08-18', dependencies: [], percentComplete: 20, risk: 'LOW', description: 'Dashboard executivo funcional com dados de implantação.', lastUpdate: '2026-08-14T13:00:00Z' },
  { id: 't-072', code: 'F8-02', title: 'Integrar Plano D0-D30 na Torre', workstreamId: 'ws-8', owner: 'Tech / RevOps', status: 'BACKLOG', priority: 'HIGH', phase: 'S2', startDate: '2026-08-19', dueDate: '2026-08-25', dependencies: ['t-071'], percentComplete: 0, risk: 'LOW', description: 'Módulo de cronograma com Gantt e filtros por frente e responsável.', lastUpdate: '2026-08-14T08:00:00Z' },
];

// ============================================================
// RISKS (8 RISCOS MAPEADOS)
// ============================================================
export const RISKS = [
  { id: 'r-001', code: 'R-01', title: 'Campos obrigatórios do CRM não definidos', description: 'Sem definição dos campos obrigatórios, não é possível configurar pipelines, automações, scoring ou tracking de origem.', workstreamId: 'ws-3', severity: 'CRITICAL', probability: 4, impact: 4, owner: 'CRM / Comercial', relatedTaskId: 't-021', mitigationPlan: 'Definir campos na sessão de D01. Owner: CRM + Comercial. Deadline: D05.', status: 'OPEN', lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 'r-002', code: 'R-02', title: 'ICPs LUMA-02 e LUMA-03 sem validação comercial', description: 'ICPs com status HIPÓTESE ainda aguardam validação. Impacta configuração de listas Apollo e campanhas de LinkedIn Ads.', workstreamId: 'ws-1', severity: 'HIGH', probability: 3, impact: 3, owner: 'Comercial', relatedTaskId: 't-002', mitigationPlan: 'Agendar sessão de validação com Diretoria até D05.', status: 'OPEN', lastUpdate: '2026-08-14T09:00:00Z' },
  { id: 'r-003', code: 'R-03', title: 'Ofertas de entrada não aprovadas pela Diretoria', description: 'Sem aprovação das ofertas (Piloto Anti-Jammer, Diagnóstico CFTV, Vistoria), não é possível criar Battle Cards, LPs ou cadências.', workstreamId: 'ws-1', severity: 'CRITICAL', probability: 3, impact: 4, owner: 'Diretoria', relatedTaskId: 't-004', mitigationPlan: 'Decisão necessária na reunião de D01. Bloqueia F2, F5 e parte de F3.', status: 'OPEN', lastUpdate: '2026-08-14T09:00:00Z' },
  { id: 'r-004', code: 'R-04', title: 'Claims sem homologação jurídica antes das LPs', description: 'Publicar claims técnicos sem validação jurídica cria risco regulatório e pode comprometer a credibilidade das campanhas.', workstreamId: 'ws-1', severity: 'HIGH', probability: 2, impact: 4, owner: 'Jurídico / Comercial', relatedTaskId: 't-005', mitigationPlan: 'Iniciar processo de homologação em D02. Não publicar LPs antes da aprovação.', status: 'OPEN', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'r-005', code: 'R-05', title: 'Battle Cards sem evidências técnicas auditadas', description: 'Battle Cards sem dados de performance auditados podem ser refutados pelos prospects e prejudicar a credibilidade do comercial.', workstreamId: 'ws-2', severity: 'HIGH', probability: 3, impact: 3, owner: 'Comercial', relatedTaskId: 't-011', mitigationPlan: 'Vincular cada claim a uma evidência verificável antes de usar em campo.', status: 'OPEN', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'r-006', code: 'R-06', title: 'Budget de LinkedIn Ads não aprovado', description: 'Sem orçamento de mídia definido, não é possível planejar campanhas de tração para a fase D18-D30.', workstreamId: 'ws-5', severity: 'HIGH', probability: 2, impact: 3, owner: 'Diretoria', relatedTaskId: null, mitigationPlan: 'Incluir na pauta de D01. Mínimo R$3k para teste de tração.', status: 'OPEN', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'r-007', code: 'R-07', title: 'F3 (CRM) com 3 tarefas bloqueadas simultaneamente', description: 'A Frente 3 é a mais crítica do plano: bloqueia automações, outbound, scoring e go-live.', workstreamId: 'ws-3', severity: 'CRITICAL', probability: 4, impact: 4, owner: 'CRM / RevOps', relatedTaskId: null, mitigationPlan: 'Priorizar desbloqueio de F3-01 como primeira ação da implantação.', status: 'OPEN', lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 'r-008', code: 'R-08', title: 'Apollo sem integração com RD antes do início das cadências', description: 'Sem integração Apollo → RD, leads de outbound não são registrados no CRM e o pipeline fica inconsistente.', workstreamId: 'ws-5', severity: 'MEDIUM', probability: 2, impact: 3, owner: 'Tech / SDR', relatedTaskId: 't-041', mitigationPlan: 'Configurar integração nativa Apollo → RD antes de ativar cadências.', status: 'OPEN', lastUpdate: '2026-08-14T08:00:00Z' },
];

// ============================================================
// DECISIONS (DECISION CENTER)
// ============================================================
export const DECISIONS = [
  { id: 'd-001', code: 'DEC-01', priorityTag: 'P1', title: 'Aprovar ICPs prioritários por solução', description: 'Definir os 2-3 ICPs com maior potencial comercial para cada solução antes de escalar aquisição.', impact: 'CRITICAL', owner: 'Diretoria / Comercial', deadline: 'D02', blockedWorkstreams: ['ws-2', 'ws-5'], status: 'PENDING', lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 'd-002', code: 'DEC-02', priorityTag: 'P0', title: 'Aprovar ofertas de entrada por solução', description: 'Piloto Anti-Jammer (Capto), Diagnóstico CFTV (Luma), Vistoria Técnica (Services).', impact: 'CRITICAL', owner: 'Diretoria', deadline: 'D01', blockedWorkstreams: ['ws-2', 'ws-5', 'ws-3'], status: 'PENDING', lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 'd-003', code: 'DEC-03', priorityTag: 'P0', title: 'Definir campos obrigatórios do CRM', description: 'CNPJ, e-mail corporativo, cargo, segmento, UTM, origem. Bloqueia toda a Frente 3.', impact: 'CRITICAL', owner: 'Comercial / CRM', deadline: 'D01', blockedWorkstreams: ['ws-3', 'ws-4'], status: 'PENDING', lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 'd-004', code: 'DEC-04', priorityTag: 'P1', title: 'Aprovar SLA de atendimento (< 30min)', description: 'Regra de resposta ao lead inbound e alçadas de desconto progressivo.', impact: 'HIGH', owner: 'Comercial / Diretoria', deadline: 'D02', blockedWorkstreams: ['ws-3', 'ws-4'], status: 'PENDING', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'd-005', code: 'DEC-05', priorityTag: 'P1', title: 'Aprovar budget de LinkedIn Ads D18-D30', description: 'Verba necessária para validar tração de inbound antes do go-live.', impact: 'HIGH', owner: 'Diretoria', deadline: 'D05', blockedWorkstreams: ['ws-5'], status: 'PENDING', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'd-006', code: 'DEC-06', priorityTag: 'P1', title: 'Homologar claims técnicos para LPs', description: 'Aprovação jurídica dos dados de performance antes da publicação.', impact: 'HIGH', owner: 'Jurídico / Comercial', deadline: 'D05', blockedWorkstreams: ['ws-2', 'ws-5'], status: 'PENDING', lastUpdate: '2026-08-14T08:00:00Z' },
];

// ============================================================
// ICPs (8 ICPs CADASTRADOS)
// ============================================================
export const ICPS = [
  { id: 'icp-001', code: 'CAPTO-01', solution: 'CAPTO', category: 'B2B Segurança', segment: 'Rastreamento Veicular', name: 'Rastreadoras e Gerenciadoras de Risco', useCase: 'Proteção contra jammers e recuperação de carga roubada', trigger: 'Histórico de incidentes com jammer / perda de sinal', approach: 'Outbound Apollo + Cold Call', status: 'DEFINIDO', priority: 1, persona: 'Diretor de Operações / Gerente de Frota', region: 'Brasil', observations: 'Maior fit comercial. Dor bem mapeada.', evidenceIds: ['ev-001'], lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 'icp-002', code: 'CAPTO-02', solution: 'CAPTO', category: 'B2B Segurança', segment: 'Seguros e Proteção Veicular', name: 'Seguradoras e Associações de Proteção Veicular', useCase: 'Redução de sinistros por roubo de carga / veículos', trigger: 'Aumento de índice de sinistros', approach: 'Outbound + Parceiro', status: 'VALIDAR', priority: 2, persona: 'Diretor de Sinistros / Gerente de Produtos', region: 'SP/RJ', observations: 'Precisa de validação com pelo menos 2 prospects.', evidenceIds: [], lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'icp-003', code: 'CAPTO-03', solution: 'CAPTO', category: 'B2B Logística', segment: 'Transportadores e Operadores', name: 'Transportadoras e Operadores Logísticos', useCase: 'Proteção anti-jammer em rotas de alto risco', trigger: 'Rota crítica sem proteção ativa / incidente recente', approach: 'Outbound Apollo + LinkedIn Ads', status: 'VALIDAR', priority: 3, persona: 'Gerente de Segurança / Diretor de Logística', region: 'Brasil', observations: 'Validação em andamento com parceiro regional.', evidenceIds: [], lastUpdate: '2026-08-14T09:00:00Z' },
  { id: 'icp-004', code: 'CAPTO-04', solution: 'CAPTO', category: 'B2B Logística', segment: 'Embarcadores com Frota', name: 'Embarcadores / Indústria com Frota Própria', useCase: 'Monitoramento e proteção de frota industrial', trigger: 'Expansão de frota / novo contrato logístico', approach: 'Outbound + Parceiro Industrial', status: 'HIPOTESE', priority: 4, persona: 'Gerente de Logística / Supply Chain', region: 'SP/MG/PR', observations: 'Hipótese não validada. Aguarda evidências de mercado.', evidenceIds: [], lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'icp-005', code: 'LUMA-01', solution: 'LUMA', category: 'B2B Varejo e Shoppings', segment: 'Redes Varejistas e Shoppings', name: 'Shoppings e Redes Varejistas', useCase: 'Inteligência sobre fluxo, comportamento e incidentes em tempo real sobre CFTV existente', trigger: 'Incidente de segurança / nova exigência de compliance', approach: 'Outbound + Demo Operacional', status: 'DEFINIDO', priority: 1, persona: 'Gerente de Segurança / Diretor de Operações', region: 'SP/RJ/BH', observations: 'ICP mais maduro da Luma. Dor clara e budget disponível.', evidenceIds: ['ev-002'], lastUpdate: '2026-08-14T10:00:00Z' },
  { id: 'icp-006', code: 'LUMA-02', solution: 'LUMA', category: 'B2B Entretenimento', segment: 'Eventos e Arenas', name: 'Estádios, Arenas e Centros de Convenção', useCase: 'Controle de acesso e segurança em eventos de grande escala', trigger: 'Evento de grande porte / novo contrato de segurança', approach: 'Outbound + Parceiro de Segurança', status: 'HIPOTESE', priority: 2, persona: 'Diretor de Segurança / Gerente de Eventos', region: 'Capitais', observations: 'Hipótese. Aguarda validação com 2 prospects antes de ativar aquisição.', evidenceIds: [], lastUpdate: '2026-08-14T09:00:00Z' },
  { id: 'icp-007', code: 'LUMA-03', solution: 'LUMA', category: 'B2B Infraestrutura', segment: 'Terminais, Aeroportos e Campi', name: 'Terminais, Aeroportos, Campi Universitários e Hospitais', useCase: 'Monitoramento inteligente em infraestrutura crítica com LGPD by design', trigger: 'Exigência de compliance / novo contrato de concessão', approach: 'Outbound + LinkedIn Ads', status: 'HIPOTESE', priority: 3, persona: 'Gerente de Segurança Patrimonial / Infraestrutura', region: 'Brasil', observations: 'Ciclo de venda longo. Hipótese para D30+.', evidenceIds: [], lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'icp-008', code: 'SERVICES-01', solution: 'SERVICES', category: 'B2B Facilities', segment: 'Operações Corporativas', name: 'Indústrias, Galpões, Condomínios e Operações Corporativas', useCase: 'Facilities integrados com vigilância patrimonial e IA Luma como diferencial', trigger: 'Vencimento de contrato de segurança / insatisfação com fornecedor atual', approach: 'Outbound + Vistoria Presencial + Parceiro de Facilities', status: 'DEFINIDO', priority: 1, persona: 'Gerente de Facilities / Diretor Administrativo', region: 'SP/MG/PR/RJ', observations: 'ICP mais maduro de Services. Ticket médio alto.', evidenceIds: ['ev-003'], lastUpdate: '2026-08-14T10:00:00Z' },
];

// ============================================================
// BATTLE CARDS (6 SEED)
// ============================================================
export const BATTLE_CARDS = [
  { id: 'bc-001', solution: 'CAPTO', icpCode: 'CAPTO-01', objection: '"Já pago rastreador em toda a frota."', response: 'Capto é uma camada de software complementar de detecção e bloqueio de jammer. Não substitui o rastreador, ele protege quando o rastreador é silenciado.', discoveryQuestions: ['Qual é o tempo médio de resposta quando há interferência de jammer na sua rota?', 'Você já teve cargas perdidas por jamming?'], evidence: 'Média de 23 min de resposta e acionamento policial integrado. (Evidência ev-001).', differentials: 'Único com software anti-jammer integrado + acionamento automático.', nextBestStep: 'Agendar Piloto Anti-Jammer de 30 dias.', approvalStatus: 'DRAFT', version: 'v1', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'bc-002', solution: 'CAPTO', icpCode: 'CAPTO-03', objection: '"Meu fornecedor atual é suficiente."', response: 'A pergunta não é se ele é suficiente em condições normais, mas se ele funciona quando há jammer. Nenhum rastreador convencional funciona sob bloqueio de RF.', discoveryQuestions: ['O seu fornecedor atual tem protocolo de acionamento quando perde o sinal?', 'Você tem visibilidade em tempo real do que acontece com a carga em rota de alto risco?'], evidence: 'Casos de uso com transportadoras da região Sul.', differentials: 'Protocolo de resposta integrado com acionamento policial.', nextBestStep: 'Demo técnica da camada anti-jammer.', approvalStatus: 'DRAFT', version: 'v1', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'bc-003', solution: 'LUMA', icpCode: 'LUMA-01', objection: '"Não temos orçamento para trocar câmeras."', response: 'Luma utiliza 100% da infraestrutura de CFTV existente. Não há obras, não há troca de hardware. A inteligência é processada sobre o sinal atual.', discoveryQuestions: ['Quantas câmeras estão gravando passivamente sem gerar alertas em tempo real?', 'Qual é o custo atual de revisão manual de imagens após um incidente?'], evidence: 'NIST 92-97% de acurácia. LGPD by design com DPIA disponível.', differentials: 'Instalação não-invasiva, nenhum custo de hardware adicional.', nextBestStep: 'Agendar Diagnóstico Técnico de CFTV (gratuito).', approvalStatus: 'DRAFT', version: 'v1', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'bc-004', solution: 'LUMA', icpCode: 'LUMA-01', objection: '"Temos preocupações com LGPD."', response: 'Luma é construída com LGPD by design. Inclui DPIA completo, anonimização de dados, controle de acesso e auditoria. É o único produto do segmento com DPIA nativo.', discoveryQuestions: ['Vocês já possuem um DPO ou comitê de privacidade ativo?', 'O contrato com o fornecedor atual de CFTV prevê alguma cláusula de LGPD?'], evidence: 'DPIA disponível para análise. Arquitetura de privacidade documentada.', differentials: 'LGPD by design. DPIA nativo. Sem coleta de dados biométricos sem consentimento.', nextBestStep: 'Enviar documentação técnica LGPD para análise do DPO.', approvalStatus: 'DRAFT', version: 'v1', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'bc-005', solution: 'SERVICES', icpCode: 'SERVICES-01', objection: '"O concorrente é mais barato."', response: 'Analisamos o custo total, não a mensalidade. Turnover de vigilância, falhas de controle de acesso, passivos trabalhistas e auditoria têm custo real que raramente aparece na proposta do concorrente.', discoveryQuestions: ['Qual é a taxa de turnover do seu fornecedor atual de vigilância?', 'Você já teve algum incidente de controle de acesso nos últimos 12 meses?'], evidence: 'Matriz de custo total disponível para análise. SLA contratual mensurável.', differentials: 'Vigilância integrada com Luma IA. SLA contratual rígido. Gestão transparente.', nextBestStep: 'Agendar Vistoria Técnica Presencial (sem custo).', approvalStatus: 'DRAFT', version: 'v1', lastUpdate: '2026-08-14T08:00:00Z' },
  { id: 'bc-006', solution: 'SERVICES', icpCode: 'SERVICES-01', objection: '"Não quero trocar um fornecedor que conheço."', response: 'Entendemos. Mas a pergunta é: o seu fornecedor atual consegue integrar inteligência visual de IA à sua operação de vigilância? Nós sim.', discoveryQuestions: ['O seu fornecedor atual gera relatórios de incidentes com análise preditiva?', 'Vocês têm visibilidade em tempo real do que acontece no perímetro?'], evidence: 'Casos de uso de operações integradas Luma + Vigilância.', differentials: 'Único fornecedor que integra IA visual (Luma) com operação de facilities.', nextBestStep: 'Apresentação de case de integração Luma + Vigilância.', approvalStatus: 'DRAFT', version: 'v1', lastUpdate: '2026-08-14T08:00:00Z' },
];

// ============================================================
// POPs VIVOS (10 PROCEDIMENTOS OPERACIONAIS COM CHECKLIST)
// ============================================================
export const POPS = [
  {
    id: 'pop-01', code: 'POP-01', name: 'ICP & Segmentação',
    objective: 'Definir, validar e classificar os perfis de cliente ideal por solução e caso de uso.',
    owner: 'Comercial', status: 'EM_VALIDACAO', progressPct: 50, version: 'v1.0',
    dependencies: ['F1-02', 'F1-03'], evidenceCount: 1, nextStep: 'Validar ICP CAPTO-02 e LUMA-02 com clientes',
    checklist: [
      { id: 'c1', text: 'Definir lista preliminar de ICPs por solução', completed: true },
      { id: 'c2', text: 'Mapear personas e dores prioritárias', completed: true },
      { id: 'c3', text: 'Validar hipóteses comerciais com pelo menos 2 prospects', completed: false },
      { id: 'c4', text: 'Aprovação formal da Matriz de ICPs pela Diretoria', completed: false },
    ],
    lastRevision: '2026-08-14',
  },
  {
    id: 'pop-02', code: 'POP-02', name: 'Prospecção & Apollo',
    objective: 'Processo de enriquecimento, validação e entrada de contas e contatos no Apollo.io.',
    owner: 'SDR', status: 'RASCUNHO', progressPct: 0, version: 'v0.1',
    dependencies: ['POP-01', 'F5-01'], evidenceCount: 0, nextStep: 'Configurar workspace no Apollo',
    checklist: [
      { id: 'c1', text: 'Criar filtros booleanos por segmento no Apollo', completed: false },
      { id: 'c2', text: 'Configurar verificação de e-mails corporativos', completed: false },
      { id: 'c3', text: 'Regra de enriquecimento de decisores (C-Level/Diretoria)', completed: false },
      { id: 'c4', text: 'Fluxo de exportação e entrada no CRM', completed: false },
    ],
    lastRevision: null,
  },
  {
    id: 'pop-03', code: 'POP-03', name: 'Lead / MQL / SQL',
    objective: 'Critérios de scoring, regras de passagem de MQL para SQL e SLA de handoff.',
    owner: 'SDR / Marketing', status: 'RASCUNHO', progressPct: 0, version: 'v0.1',
    dependencies: ['POP-01', 'F3-03'], evidenceCount: 0, nextStep: 'Alinhar critérios de MQL',
    checklist: [
      { id: 'c1', text: 'Definir matriz de Fit (ICP A/B/C/D)', completed: false },
      { id: 'c2', text: 'Definir matriz de Intenção e Engajamento', completed: false },
      { id: 'c3', text: 'Documentar SLA de primeiro contato (< 30 min)', completed: false },
      { id: 'c4', text: 'Critérios de descarte e reciclagem de MQLs', completed: false },
    ],
    lastRevision: null,
  },
  {
    id: 'pop-04', code: 'POP-04', name: 'Discovery',
    objective: 'Registro mínimo, perguntas obrigatórias e critérios para criação de oportunidade no CRM.',
    owner: 'Comercial', status: 'RASCUNHO', progressPct: 0, version: 'v0.1',
    dependencies: ['POP-03'], evidenceCount: 0, nextStep: 'Definir perguntas obrigatórias por produto',
    checklist: [
      { id: 'c1', text: 'Template de anotação de Discovery call', completed: false },
      { id: 'c2', text: 'Perguntas obrigatórias de dor, timing e orçamento', completed: false },
      { id: 'c3', text: 'Critério mínimo para abertura de Deal no CRM', completed: false },
    ],
    lastRevision: null,
  },
  {
    id: 'pop-05', code: 'POP-05', name: 'Outbound',
    objective: 'Listas, cadências, templates, respostas e processo de passagem para o CRM.',
    owner: 'SDR', status: 'RASCUNHO', progressPct: 0, version: 'v0.1',
    dependencies: ['POP-01', 'POP-02'], evidenceCount: 0, nextStep: 'Construir cadência de 8 toques',
    checklist: [
      { id: 'c1', text: 'Cadência de 21 dias (Email, LinkedIn, Call)', completed: false },
      { id: 'c2', text: 'Templates de abordagem por dor de cada ICP', completed: false },
      { id: 'c3', text: 'Protocolo de follow-up e break-up', completed: false },
    ],
    lastRevision: null,
  },
  {
    id: 'pop-06', code: 'POP-06', name: 'LP / Inbound',
    objective: 'Processo de criação de Landing Pages, configuração de formulários, tracking e automação de resposta.',
    owner: 'Marketing', status: 'RASCUNHO', progressPct: 0, version: 'v0.1',
    dependencies: ['POP-01'], evidenceCount: 0, nextStep: 'Definir wireframes de LP',
    checklist: [
      { id: 'c1', text: 'Padronização de parâmetros UTM obrigatórios', completed: false },
      { id: 'c2', text: 'Validação de formulários e campos mínimos', completed: false },
      { id: 'c3', text: 'Automação de email de confirmação e alerta no CRM', completed: false },
    ],
    lastRevision: null,
  },
  {
    id: 'pop-07', code: 'POP-07', name: 'Opportunity / Pipeline',
    objective: 'Avanço por critérios de qualificação, gestão de aging e atualização de forecast.',
    owner: 'Comercial', status: 'APROVADO', progressPct: 100, version: 'v1.0',
    dependencies: ['POP-03', 'POP-04'], evidenceCount: 1, nextStep: 'Treinar equipe comercial',
    checklist: [
      { id: 'c1', text: 'Definir 5 etapas de pipeline com critérios de saída', completed: true },
      { id: 'c2', text: 'Definir aging máximo por etapa (alerta visual)', completed: true },
      { id: 'c3', text: 'Campos obrigatórios para avanço de fase', completed: true },
      { id: 'c4', text: 'Motivos de perda padronizados (Loss Reason)', completed: true },
    ],
    lastRevision: '2026-08-14',
  },
  {
    id: 'pop-08', code: 'POP-08', name: 'Reativação',
    objective: 'Processo de reengajamento de leads e oportunidades perdidas por timing após 90 dias.',
    owner: 'Marketing / SDR', status: 'RASCUNHO', progressPct: 0, version: 'v0.1',
    dependencies: ['POP-03', 'POP-07'], evidenceCount: 0, nextStep: 'Mapear fluxo de 90 dias',
    checklist: [
      { id: 'c1', text: 'Critérios de elegibilidade para reativação', completed: false },
      { id: 'c2', text: 'Sequência de reaquecimento com novidades de produto', completed: false },
    ],
    lastRevision: null,
  },
  {
    id: 'pop-09', code: 'POP-09', name: 'Data Quality',
    objective: 'Auditoria, correção e manutenção da qualidade dos dados no CRM: completude, duplicidade e validade.',
    owner: 'RevOps', status: 'RASCUNHO', progressPct: 0, version: 'v0.1',
    dependencies: ['POP-01', 'POP-06', 'POP-07'], evidenceCount: 0, nextStep: 'Definir rotina de auditoria semanal',
    checklist: [
      { id: 'c1', text: 'Verificação de CNPJs e emails corporativos duplicados', completed: false },
      { id: 'c2', text: 'Auditoria de campos obrigatórios não preenchidos', completed: false },
      { id: 'c3', text: 'Rotina de limpeza de deals estagnados (> 45 dias sem atividade)', completed: false },
    ],
    lastRevision: null,
  },
  {
    id: 'pop-10', code: 'POP-10', name: 'Governança',
    objective: 'Dashboards de monitoramento, rituais de gestão e processo de tomada de decisão executiva.',
    owner: 'Diretoria / RevOps', status: 'RASCUNHO', progressPct: 0, version: 'v0.1',
    dependencies: ['POP-01', 'POP-09'], evidenceCount: 0, nextStep: 'Estruturar rito semanal de RevOps',
    checklist: [
      { id: 'c1', text: 'Definir agenda de ritos (Daily SDR, Weekly Pipeline, Monthly Exec)', completed: false },
      { id: 'c2', text: 'Painéis executivos de visualização no Command Center', completed: false },
      { id: 'c3', text: 'Protocolo de escalonamento de riscos e decisões', completed: false },
    ],
    lastRevision: null,
  },
];

// ============================================================
// EVIDÊNCIAS INICIAIS (TRUSTEvidence)
// ============================================================
export const EVIDENCES = [
  {
    id: 'ev-001',
    title: 'Discovery com Rastreadora Alpha (SP)',
    type: 'DISCOVERY_CALL',
    description: '3 reuniões realizadas. Confirmada dor crítica de perda de carga por jamming em rotas da Rodovia Presidente Dutra. Interesse imediato em Piloto Anti-Jammer.',
    source: 'Registro Interno Comercial',
    author: 'Comercial Lead',
    date: '2026-08-14',
    relatedEntityType: 'ICP',
    relatedEntityId: 'icp-001',
    link: null,
  },
  {
    id: 'ev-002',
    title: 'Benchmarking de CFTV em Shopping Regional',
    type: 'BENCHMARK',
    description: 'Mapeamento de 120 câmeras passivas gravando sem análise analítica. Custo atual de segurança física supera R$ 85k/mês.',
    source: 'Visita Técnica Comercial',
    author: 'Engenheiro de Soluções',
    date: '2026-08-13',
    relatedEntityType: 'ICP',
    relatedEntityId: 'icp-005',
    link: null,
  },
  {
    id: 'ev-003',
    title: 'Edital de Vigilância e Facilities — Indústria Química',
    type: 'DOCUMENT',
    description: 'Edital de renovação contratual com exigência de tecnologia embarcada de monitoramento perimetral.',
    source: 'Documento de Prospect',
    author: 'Comercial Facilities',
    date: '2026-08-12',
    relatedEntityType: 'ICP',
    relatedEntityId: 'icp-008',
    link: null,
  },
  {
    id: 'ev-004',
    title: 'Aprovação Formal do POP-07',
    type: 'APPROVAL_NOTE',
    description: 'Regras de pipeline, aging de 14 dias por etapa e loss reasons obrigatórios validados pelo Diretor Comercial.',
    source: 'Ata de Reunião Executiva',
    author: 'Diretoria Comercial',
    date: '2026-08-14',
    relatedEntityType: 'POP',
    relatedEntityId: 'pop-07',
    link: null,
  }
];

// ============================================================
// EVENT LOG (MEMÓRIA OPERACIONAL)
// ============================================================
export const EVENT_LOG = [
  {
    id: 'evt-001',
    timestamp: '2026-08-14T11:00:00Z',
    entityId: 'pop-07',
    entityType: 'POP',
    eventType: 'POP_APPROVED',
    previousState: 'RASCUNHO',
    newState: 'APROVADO',
    actor: 'Comercial',
    reason: 'Documentação concluída e validada com a diretoria.',
    evidence: 'Evidência ev-004 anexada.',
  },
  {
    id: 'evt-002',
    timestamp: '2026-08-14T10:30:00Z',
    entityId: 't-007',
    entityType: 'TASK',
    eventType: 'TASK_COMPLETED',
    previousState: 'IN_PROGRESS',
    newState: 'DONE',
    actor: 'Diretoria',
    reason: 'Líderes de cada uma das 8 frentes designados formalmente.',
    evidence: null,
  },
  {
    id: 'evt-003',
    timestamp: '2026-08-14T10:00:00Z',
    entityId: 'r-007',
    entityType: 'RISK',
    eventType: 'RISK_DETECTED',
    previousState: null,
    newState: 'CRITICAL',
    actor: 'RuleEngine',
    reason: 'Frente 3 com 3 tarefas bloqueadas simultaneamente.',
    evidence: 'Gargalo em F3-01 bloqueia F4 e F5.',
  },
  {
    id: 'evt-004',
    timestamp: '2026-08-14T09:30:00Z',
    entityId: 't-021',
    entityType: 'TASK',
    eventType: 'TASK_BLOCKED',
    previousState: 'TODO',
    newState: 'BLOCKED',
    actor: 'CRM Lead',
    reason: 'Aguardando aprovação de campos obrigatórios (DEC-03).',
    evidence: null,
  },
  {
    id: 'evt-005',
    timestamp: '2026-08-14T09:00:00Z',
    entityId: 'd-002',
    entityType: 'DECISION',
    eventType: 'DECISION_FLAGGED',
    previousState: null,
    newState: 'PENDING',
    actor: 'Estratégia',
    reason: 'Ofertas de entrada pendentes de homologação da Diretoria.',
    evidence: null,
  },
];

// ============================================================
// KPIS & BASELINE
// ============================================================
export const KPIS = {
  nivel1_implantacao: [
    { id: 'kpi-n1-01', name: '% Tarefas Concluídas no Prazo', currentValue: 4, targetValue: 100, unit: '%', baseline: 0, category: 'Execução' },
    { id: 'kpi-n1-02', name: '% CRM Configurado', currentValue: 5, targetValue: 100, unit: '%', baseline: 0, category: 'CRM' },
    { id: 'kpi-n1-03', name: '% Processos Documentados (POPs)', currentValue: 15, targetValue: 100, unit: '%', baseline: 0, category: 'Processos' },
    { id: 'kpi-n1-04', name: '% Automações Testadas', currentValue: 0, targetValue: 100, unit: '%', baseline: 0, category: 'Automação' },
    { id: 'kpi-n1-05', name: '% Campanhas com Tracking Ativo', currentValue: 0, targetValue: 100, unit: '%', baseline: 0, category: 'Marketing' },
    { id: 'kpi-n1-06', name: 'Usuários Treinados no CRM', currentValue: 0, targetValue: 8, unit: 'pessoas', baseline: 0, category: 'CRM' },
    { id: 'kpi-n1-07', name: 'Integrações Ativas', currentValue: 0, targetValue: 4, unit: 'integrações', baseline: 0, category: 'Tecnologia' },
    { id: 'kpi-n1-08', name: 'ICPs Validados', currentValue: 3, targetValue: 8, unit: 'ICPs', baseline: 0, category: 'Estratégia' },
  ],
  nivel2_operacao: [
    { id: 'kpi-n2-01', name: 'SLA Inbound (< 30min)', currentValue: null, targetValue: 90, unit: '% atendidos', category: 'Atendimento' },
    { id: 'kpi-n2-02', name: 'Reply Rate Outbound', currentValue: null, targetValue: 8, unit: '%', category: 'Outbound' },
    { id: 'kpi-n2-03', name: 'Conversão MQL → SQL', currentValue: null, targetValue: 20, unit: '%', category: 'Funil' },
    { id: 'kpi-n2-04', name: 'Reuniões por Semana', currentValue: null, targetValue: 10, unit: 'reuniões', category: 'Atividade' },
  ],
  nivel3_negocio: [
    { id: 'kpi-n3-01', name: 'Pipeline Coverage', currentValue: null, targetValue: 3, unit: 'x', category: 'Pipeline' },
    { id: 'kpi-n3-02', name: 'Win Rate', currentValue: null, targetValue: 25, unit: '%', category: 'Conversão' },
    { id: 'kpi-n3-03', name: 'CAC por Solução', currentValue: null, targetValue: null, unit: 'R$', category: 'Financeiro' },
    { id: 'kpi-n3-04', name: 'LTV / CAC', currentValue: null, targetValue: 3, unit: 'x', category: 'Financeiro' },
  ],
};

export const BASELINE_D0 = {
  capturedAt: '2026-08-14',
  items: [
    { area: 'CRM', label: 'Configuração', value: 0, unit: '%', note: 'Campos não definidos' },
    { area: 'Automação', label: 'Configuração', value: 0, unit: '%', note: 'Não iniciado' },
    { area: 'Outbound', label: 'Ativo', value: false, unit: null, note: 'Apollo não configurado' },
    { area: 'Landing Pages', label: 'Publicadas', value: 0, unit: 'LPs', note: 'Não iniciado' },
    { area: 'ICPs', label: 'Validados', value: 3, unit: 'ICPs', note: 'CAPTO-01, LUMA-01, SERVICES-01' },
    { area: 'POPs', label: 'Aprovados', value: 1, unit: 'POPs', note: 'POP-07 aprovado' },
    { area: 'Tracking', label: 'Configurado', value: false, unit: null, note: 'UTMs não padronizadas' },
    { area: 'LinkedIn Ads', label: 'Ativo', value: false, unit: null, note: 'Budget pendente' },
    { area: 'Treinamento', label: 'Concluído', value: 0, unit: 'pessoas', note: 'Aguarda CRM' },
  ],
};

export const CHANGELOG = [
  { id: 'cl-001', timestamp: '2026-08-14T11:00:00Z', type: 'POP_APPROVED', icon: '🟢', message: 'POP-07 (Opportunity/Pipeline) aprovado', impact: 'Checklist concluído e evidência anexada.' },
  { id: 'cl-002', timestamp: '2026-08-14T10:30:00Z', type: 'TASK_DONE', icon: '🟢', message: 'Owner de cada frente designado (F1-07 concluída)', impact: 'Líderes operacionais ativos.' },
  { id: 'cl-003', timestamp: '2026-08-14T10:00:00Z', type: 'RISK_OPEN', icon: '🔴', message: 'R-07: F3 com 3 tarefas bloqueadas', impact: 'Risco crítico identificado pelo Rule Engine.' },
  { id: 'cl-004', timestamp: '2026-08-14T09:30:00Z', type: 'TASK_BLOCKED', icon: '🔴', message: 'F3-01 (Campos obrigatórios CRM) bloqueada', impact: 'Bloqueia pipelines, automações e scoring.' },
  { id: 'cl-005', timestamp: '2026-08-14T09:00:00Z', type: 'DECISION_NEEDED', icon: '⚡', message: 'DEC-02 (Ofertas de entrada) aguardando Diretoria', impact: 'Bloqueia Battle Cards e Landing Pages.' },
];

export const AI_INSIGHTS_SEED = [
  { id: 'ai-001', type: 'NEXT_ACTION', priority: 1, title: 'Definir campos obrigatórios do CRM (F3-01)', rationale: 'Esta tarefa bloqueia 3 workstreams: CRM, Automação e Outbound. Sem ela, os pipelines e o scoring não podem ser configurados.', impact: 'CRITICAL', suggestedAction: 'Tomar a decisão DEC-03 no Cockpit HOJE com a lista aprovada.', deadline: 'D01 · Hoje', category: 'CRM' },
  { id: 'ai-002', type: 'NEXT_ACTION', priority: 2, title: 'Aprovar ofertas de entrada por solução (DEC-02)', rationale: 'Sem definir os ganchos comerciais (Piloto Anti-Jammer, Diagnóstico CFTV, Vistoria), não é possível criar Battle Cards ou LPs.', impact: 'CRITICAL', suggestedAction: 'Aprovar ofertas com a Diretoria no Cockpit HOJE.', deadline: 'D01 · Hoje', category: 'Estratégia' },
  { id: 'ai-003', type: 'RISK_ALERT', priority: 3, title: 'Frente 3 (CRM & Data) em situação crítica', rationale: 'F3 tem 3 de 9 tarefas bloqueadas já no D1. É a frente com maior número de dependências downstream.', impact: 'CRITICAL', suggestedAction: 'Desbloquear F3-01 prioritariamente para liberar F4 e F5.', deadline: 'D03', category: 'Risco' },
];
