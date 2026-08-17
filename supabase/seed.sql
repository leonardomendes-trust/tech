-- ============================================================================
-- TRUST REVENUE COMMAND CENTER — SEED INICIAL & BASELINE OPERACIONAL (FASE 6C)
-- PostgreSQL / Supabase
--
-- ATENÇÃO: Este script carrega o Baseline Operacional Oficial da Implantação (D0-D30).
-- Não representa "dados finais de mercado", mas sim o estado de partida estrutural
-- com a separação formal entre:
-- 1. Estado Operacional (TODO, IN_PROGRESS, BLOCKED, DONE)
-- 2. Estado de Validação (PENDING, UNDER_VALIDATION, VALIDATED, REJECTED)
-- 3. Maturidade da Hipótese (N1_HYPOTHESIS, N2_COMMERCIAL_VALIDATION, N3_MARKET_PROVEN)
-- ============================================================================

-- 1. FRENTES DE TRABALHO (8 WORKSTREAMS)
INSERT INTO public.workstreams (id, code, name, description, owner, category, progress_pct, health_score, operational_status, validation_status)
VALUES
('ws-1', 'F1', 'Estratégia & ICP', 'Definição dos ICPs por solução (Capto, Luma, Services), validação comercial e aprovação institucional.', 'Estratégia Comercial', 'STRATEGY', 25, 'MODERATE', 'IN_PROGRESS', 'PENDING'),
('ws-2', 'F2', 'Battle Cards & Argumentários', 'Desenvolvimento dos argumentários de venda, matriz de objeções e ganchos por solução.', 'Comercial / Marketing', 'ENABLEMENT', 10, 'AT_RISK', 'IN_PROGRESS', 'PENDING'),
('ws-3', 'F3', 'CRM & Pipeline', 'Estruturação do funil de 6 etapas, campos obrigatórios, regras de avanço e SLA de atendimento.', 'Comercial / CRM', 'SYSTEMS', 15, 'CRITICAL', 'IN_PROGRESS', 'PENDING'),
('ws-4', 'F4', 'Automação & Enriquecimento', 'Configuração de cadências outbound no Apollo, integração de dados e enriquecimento de decisores.', 'RevOps / Ops', 'AUTOMATION', 5, 'AT_RISK', 'IN_PROGRESS', 'PENDING'),
('ws-5', 'F5', 'Aquisição Ativa & Outbound', 'Execução de prospecção fria multicanal (LinkedIn, E-mail, Cold Call) para Capto, Luma e Services.', 'SDRs / Outbound', 'ACQUISITION', 0, 'ON_TRACK', 'TODO', 'PENDING'),
('ws-6', 'F6', 'KPIs, Metas & Governança', 'Acompanhamento do funil em produção, relatórios executivos e projeção de receita.', 'RevOps / Liderança', 'ANALYTICS', 20, 'ON_TRACK', 'IN_PROGRESS', 'PENDING'),
('ws-7', 'F7', 'POPs & Processos Padrão', 'Implementação e validação em campo dos 10 Procedimentos Operacionais Padrão da TRUST.', 'Qualidade & Operações', 'PROCESS', 15, 'ON_TRACK', 'IN_PROGRESS', 'PENDING'),
('ws-8', 'F8', 'Rollout & Go-Live Pleno', 'Consolidação da operação, expansão de canais e encerramento do ciclo D30.', 'Diretoria / RevOps', 'MANAGEMENT', 0, 'ON_TRACK', 'TODO', 'PENDING')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    progress_pct = EXCLUDED.progress_pct,
    health_score = EXCLUDED.health_score;

-- 2. DECISÕES INSTITUCIONAIS DA DIRETORIA (DECISIONS)
INSERT INTO public.decisions (id, code, title, description, priority_tag, impact_level, owner, deadline, status)
VALUES
('dec-1', 'DEC-01', 'Aprovar ICPs prioritários por solução', 'Definir os 2-3 ICPs com maior potencial comercial para Capto, Luma e Services antes de escalar prospecção.', 'P0', 'CRITICAL', 'Diretoria / Comercial', 'D02', 'PENDING'),
('dec-2', 'DEC-02', 'Aprovar ofertas de entrada e modelos de piloto', 'Homologar o Piloto Anti-Jammer (Capto), Diagnóstico CFTV (Luma) e Vistoria Técnica (Services).', 'P0', 'CRITICAL', 'Diretoria', 'D01', 'PENDING'),
('dec-3', 'DEC-03', 'Definir campos obrigatórios e regras de CRM', 'CNPJ, e-mail corporativo, cargo, segmento e UTM de origem para qualificação de leads.', 'P0', 'CRITICAL', 'Comercial / CRM', 'D01', 'PENDING'),
('dec-4', 'DEC-04', 'Aprovar SLA de atendimento (< 30min)', 'Regra formal de resposta rápida ao lead inbound e alçadas progressivas de desconto.', 'P0', 'HIGH', 'Comercial / Diretoria', 'D02', 'PENDING'),
('dec-5', 'DEC-05', 'Aprovar budget de ferramentas Outbound', 'Definição de orçamento para licenças de Apollo e automação RevOps.', 'P0', 'HIGH', 'Diretoria / Financeiro', 'D03', 'PENDING'),
('dec-6', 'DEC-06', 'Homologar 10 POPs Comerciais', 'Validação institucional dos procedimentos operacionais padrão de prospecção e atendimento.', 'P0', 'HIGH', 'Diretoria / Ops', 'D05', 'PENDING')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    priority_tag = EXCLUDED.priority_tag;

-- 3. TAREFAS CRÍTICAS DE BASELINE (TASKS)
INSERT INTO public.tasks (id, workstream_id, code, title, description, owner, priority, operational_status, validation_status, is_unblocked_override, block_reason, due_date, phase, percent_complete)
VALUES
('t-101', 'ws-1', 'F1-01', 'Mapeamento de ICPs Capto (Anti-Jammer)', 'Segmentação de transportadoras, frotas e seguradoras com risco de roubo.', 'Estratégia Comercial', 'CRITICAL', 'DONE', 'VALIDATED', FALSE, NULL, 'D01', 'S1', 100),
('t-102', 'ws-1', 'F1-02', 'Mapeamento de ICPs Luma (Visão Computacional NIST)', 'Segmentação de condomínios corporativos, indústrias e varejo para CFTV inteligente.', 'Estratégia Comercial', 'CRITICAL', 'IN_PROGRESS', 'PENDING', FALSE, NULL, 'D02', 'S1', 50),
('t-103', 'ws-1', 'F1-03', 'Mapeamento de ICPs Services (Facilities & Portaria)', 'Segmentação de administradoras de condomínio e facilities industriais.', 'Estratégia Comercial', 'HIGH', 'IN_PROGRESS', 'PENDING', FALSE, NULL, 'D02', 'S1', 40),
('t-104', 'ws-1', 'F1-04', 'Validação dos Ganchos de Entrada (Value Hooks)', 'Aprovação dos modelos de teste de 30 dias com a Diretoria.', 'Comercial', 'CRITICAL', 'BLOCKED', 'PENDING', FALSE, 'Aguardando deliberação de DEC-02 pela Diretoria.', 'D01', 'S1', 0),
('t-301', 'ws-3', 'F3-01', 'Definição de Campos Obrigatórios do Pipeline', 'Configuração das propriedades de qualificação e fontes de origem no CRM.', 'Comercial / CRM', 'CRITICAL', 'BLOCKED', 'PENDING', FALSE, 'Aguardando aprovação de DEC-03.', 'D01', 'S1', 0),
('t-302', 'ws-3', 'F3-02', 'Mapeamento das 6 Etapas do Funil TRUST', 'Configuração das etapas: Mapeamento -> Decisores -> Abordagens -> Discovery -> Piloto -> Proposta.', 'Comercial / CRM', 'HIGH', 'IN_PROGRESS', 'PENDING', FALSE, NULL, 'D03', 'S1', 30),
('t-401', 'ws-4', 'F4-01', 'Configuração de Listas & Filtros no Apollo', 'Criação de listas de contas e contatos por CNAE e cargo de decisor.', 'RevOps / Ops', 'HIGH', 'BLOCKED', 'PENDING', FALSE, 'Bloqueado por F3-01 e DEC-03.', 'D03', 'S1', 0),
('t-501', 'ws-5', 'F5-01', 'Disparo de Cadência Piloto Capto (Anti-Jammer)', 'Execução dos 4 passos de prospecção fria para 50 decisores de frota.', 'SDRs / Outbound', 'CRITICAL', 'TODO', 'PENDING', FALSE, NULL, 'D04', 'S1', 0),
('t-701', 'ws-7', 'F7-01', 'Aplicação de Checklists de POP-01 a POP-05', 'Validação prática dos procedimentos de prospecção e qualificação com os operadores.', 'Qualidade & Operações', 'HIGH', 'IN_PROGRESS', 'UNDER_VALIDATION', FALSE, NULL, 'D05', 'S1', 20)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    operational_status = EXCLUDED.operational_status,
    validation_status = EXCLUDED.validation_status,
    percent_complete = EXCLUDED.percent_complete;

-- 4. MATRIZ DE RISCOS (P × I)
INSERT INTO public.risks (id, code, title, description, probability, impact, severity, mitigation_plan, owner, status)
VALUES
('r-1', 'R-01', 'Campos obrigatórios do CRM não definidos', 'Sem campos estruturados, o pipeline e as integrações de outbound perdem rastreabilidade.', 4, 4, 'CRITICAL', 'Definir campos mínimos na sessão de D01. Owner: CRM + Comercial.', 'Comercial / CRM', 'OPEN'),
('r-2', 'R-02', 'ICPs LUMA sem validação de mercado em campo', 'Hipóteses de condomínios corporativos aguardam reuniões discovery.', 3, 3, 'HIGH', 'Priorizar 10 abordagens focadas em segurança de condomínio nesta semana.', 'Estratégia Comercial', 'OPEN'),
('r-3', 'R-03', 'Ofertas de entrada não homologadas formalmente', 'Sem aprovação de DEC-02, a equipe de SDRs fica hesitante na abordagem fria.', 3, 4, 'CRITICAL', 'Deliberar DEC-02 na War Room ou aplicar desbloqueio operacional provisório.', 'Diretoria', 'OPEN')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    mitigation_plan = EXCLUDED.mitigation_plan,
    status = EXCLUDED.status;

-- 5. MATRIZ DE ICPS COM TRÍADE DE MATURIDADE (N1 -> N2 -> N3)
INSERT INTO public.icps (id, code, solution, name, segment, ticket_estimate, cycle_days_estimate, operational_status, maturity_level, validation_status, next_validation_milestone)
VALUES
('icp-capto-1', 'CAPTO-01', 'CAPTO', 'Transportadoras de Carga Pesada & Logística Crítica', 'Logística / Transportes', 45000, 18, 'ACTIVE', 'N2_COMMERCIAL_VALIDATION', 'IN_PROGRESS', 'Fechar 2 pilotos de 30 dias em frotas com alto índice de sinistro.'),
('icp-capto-2', 'CAPTO-02', 'CAPTO', 'Seguradoras & Gerenciadoras de Risco', 'Seguros / Riscos', 90000, 30, 'ACTIVE', 'N1_HYPOTHESIS', 'IN_PROGRESS', 'Apresentar relatório técnico de recuperação em 23 min para 3 gerentes de sinistro.'),
('icp-luma-1', 'LUMA-01', 'LUMA', 'Condomínios Comerciais & Edifícios Corporativos Triple A', 'Facilities / Segurança Corporativa', 75000, 21, 'ACTIVE', 'N1_HYPOTHESIS', 'IN_PROGRESS', 'Realizar demonstração virtual de reconhecimento facial NIST em CFTV existente.'),
('icp-services-1', 'SERVICES-01', 'SERVICES', 'Plantas Industriais & Centros de Distribuição', 'Indústria / Armazenagem', 35000, 15, 'ACTIVE', 'N2_COMMERCIAL_VALIDATION', 'IN_PROGRESS', 'Realizar vistoria técnica de postos com SLA de reposição de 2h garantido.')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    maturity_level = EXCLUDED.maturity_level,
    validation_status = EXCLUDED.validation_status;

-- 6. PROCEDIMENTOS OPERACIONAIS PADRÃO (POPS)
INSERT INTO public.pops (id, code, name, owner, category, sla, trigger_event, checklist_items)
VALUES
('pop-01', 'POP-01', 'Qualificação Outbound & Mapeamento de Decisores', 'SDR Outbound', 'ACQUISITION', '4 horas', 'Novo lead mapeado via Apollo ou LinkedIn', '[
  {"id": "c1", "text": "Validar CNPJ ativo e segmento compatível com ICP", "done": true},
  {"id": "c2", "text": "Identificar 2 decisores (ex: Diretor de Operações / Frota / Facilities)", "done": true},
  {"id": "c3", "text": "Enriquecer e-mail corporativo verificado e telefone direto", "done": false},
  {"id": "c4", "text": "Cadastrar conta no CRM vinculando ao ICP correspondente", "done": false}
]'::JSONB),
('pop-02', 'POP-02', 'Reunião Discovery & Apresentação de Gancho', 'Executivo Comercial', 'COMMERCIAL', '24 horas pós-reunião', 'Reunião de Discovery realizada', '[
  {"id": "c1", "text": "Diagnosticar volume atual de ativos/câmeras/postos", "done": true},
  {"id": "c2", "text": "Identificar custo de sinistro ou dor de turnover atual", "done": false},
  {"id": "c3", "text": "Propor modelo de Piloto Anti-Jammer ou Demonstração NIST", "done": false},
  {"id": "c4", "text": "Registrar ata resumida e próximo marco de validação", "done": false}
]'::JSONB)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    checklist_items = EXCLUDED.checklist_items;

-- 7. REVOPS FUNIL (ETAPAS BASELINE)
INSERT INTO public.funnel_stages (id, order_index, stage_name, real_count, meta_count, unit, color)
VALUES
('f1', 1, 'Contas Mapeadas', 120, 200, 'contas', '#3b82f6'),
('f2', 2, 'Decisores Qualificados', 65, 120, 'contatos', '#6366f1'),
('f3', 3, 'Abordagens Ativas (Outbound)', 35, 80, 'empresas', '#8b5cf6'),
('f4', 4, 'Reuniões Discovery Realizadas', 8, 24, 'reuniões', '#ec4899'),
('f5', 5, 'Pilotos & POCs em Andamento', 3, 8, 'pilotos', '#f59e0b'),
('f6', 6, 'Propostas na Mesa / Negociação', 2, 4, 'propostas', '#10b981')
ON CONFLICT (id) DO UPDATE SET
    real_count = EXCLUDED.real_count,
    meta_count = EXCLUDED.meta_count;

-- 8. EVENT LOG DE AUDITORIA INICIAL
INSERT INTO public.event_log (actor_name, entity_type, entity_id, event_type, reason, metadata)
VALUES
('Sistema / Leonardo (Ops)', 'WORKSTREAM', 'F1', 'STATUS_CHANGE', 'Carga inicial do Baseline Operacional D0-D30 da TRUST.', '{"phase": "FASE_6C_BASELINE", "source": "INITIAL_SEED"}'::JSONB);
