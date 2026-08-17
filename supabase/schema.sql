-- ============================================================================
-- TRUST REVENUE COMMAND CENTER — SCHEMA DEFINITIVO (FASE 6A)
-- PostgreSQL / Supabase
-- ============================================================================

-- 0. EXTENSÕES & CONFIGURAÇÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PERFIS DE USUÁRIOS & GOVERNANÇA (RBAC)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    job_title TEXT NOT NULL, -- ex: 'Head de RevOps', 'Diretor Comercial'
    role TEXT NOT NULL DEFAULT 'OPERATOR', -- 'MASTER' | 'DECIDER' | 'OPERATOR' | 'VIEWER'
    permissions TEXT[] DEFAULT ARRAY['view_dashboard', 'edit_task', 'register_update'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. FRENTES DE TRABALHO (WORKSTREAMS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workstreams (
    id TEXT PRIMARY KEY, -- 'F1', 'F2', ..., 'F8'
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    owner TEXT NOT NULL,
    category TEXT NOT NULL,
    progress_pct INTEGER DEFAULT 0,
    health_score TEXT NOT NULL DEFAULT 'ON_TRACK', -- 'ON_TRACK' | 'WARNING' | 'CRITICAL'
    operational_status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    validation_status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. DECISÕES INSTITUCIONAIS DA DIRETORIA (DECISIONS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.decisions (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE, -- 'DEC-01', 'DEC-02'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority_tag TEXT NOT NULL DEFAULT 'P0', -- 'P0' | 'P1' | 'P2'
    impact_level TEXT NOT NULL DEFAULT 'CRITICAL',
    owner TEXT NOT NULL,
    deadline TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'APPROVED' | 'REJECTED'
    
    -- Resolução Formal
    decided_by TEXT,
    recorded_by TEXT,
    resolution_notes TEXT,
    minutes_reference TEXT,
    resolved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. TAREFAS OPERACIONAIS & DESBLOQUEIOS PROVISÓRIOS (TASKS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    workstream_id TEXT NOT NULL REFERENCES public.workstreams(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    owner TEXT NOT NULL,
    priority TEXT NOT NULL, -- 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    
    -- Tríade de Estado: Operacional vs Validação
    operational_status TEXT NOT NULL DEFAULT 'TODO', -- 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'
    validation_status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'UNDER_VALIDATION' | 'VALIDATED' | 'REJECTED'
    
    -- Desbloqueio Operacional Provisório
    is_unblocked_override BOOLEAN DEFAULT FALSE,
    unblock_type TEXT, -- 'DECISION_RESOLUTION' | 'OPERATIONAL_CONTINUITY' | 'PARALLEL_HYPOTHESIS'
    unblock_reason TEXT,
    unblock_actor_name TEXT,
    unblocked_at TIMESTAMPTZ,
    
    -- Bloqueios & Dependências
    block_reason TEXT,
    dependencies TEXT[] DEFAULT ARRAY[]::TEXT[],
    decision_id TEXT REFERENCES public.decisions(id),
    
    due_date TEXT,
    phase TEXT DEFAULT 'S1',
    percent_complete INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. MATRIZ DE RISCOS (P × I)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.risks (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    probability INTEGER NOT NULL CHECK (probability BETWEEN 1 AND 5),
    impact INTEGER NOT NULL CHECK (impact BETWEEN 1 AND 5),
    severity TEXT NOT NULL, -- 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    mitigation_plan TEXT NOT NULL,
    owner TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN', -- 'OPEN' | 'MITIGATED' | 'CLOSED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. MATRIZ DE ICPS & LEARNING LOOP (MATURIDADE N1/N2/N3)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.icps (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    solution TEXT NOT NULL, -- 'CAPTO' | 'LUMA' | 'SERVICES'
    name TEXT NOT NULL,
    segment TEXT NOT NULL,
    ticket_estimate NUMERIC NOT NULL,
    cycle_days_estimate INTEGER NOT NULL,
    
    -- Tríade de Maturidade
    operational_status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'PAUSED' | 'REFUTADA'
    maturity_level TEXT NOT NULL DEFAULT 'N1_HYPOTHESIS', -- 'N1_HYPOTHESIS' | 'N2_COMMERCIAL_VALIDATION' | 'N3_MARKET_PROVEN'
    validation_status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    evidence_count INTEGER DEFAULT 0,
    next_validation_milestone TEXT,
    
    -- Aprendizados & Refutação
    refuted_reason TEXT,
    key_learning TEXT,
    corrective_action TEXT,
    refuted_by TEXT,
    refuted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. PROCEDIMENTOS OPERACIONAIS PADRÃO (POPS) & CHECKLISTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pops (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    category TEXT NOT NULL,
    sla TEXT NOT NULL,
    trigger_event TEXT NOT NULL,
    checklist_items JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. REVOPS FUNIL & BASELINE OPERACIONAL
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.funnel_stages (
    id TEXT PRIMARY KEY,
    order_index INTEGER NOT NULL,
    stage_name TEXT NOT NULL,
    real_count INTEGER NOT NULL DEFAULT 0,
    meta_count INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'contas',
    color TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. EVENT LOG CENTRALIZADO & AUDITORIA (APPEND-ONLY)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    actor_id UUID REFERENCES auth.users(id),
    actor_name TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- 'TASK' | 'WORKSTREAM' | 'DECISION' | 'RISK' | 'ICP' | 'POP' | 'FUNNEL'
    entity_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'STATUS_CHANGE' | 'OPERATIONAL_UNBLOCK' | 'DECISION_RESOLVED' | 'ICP_REFUTED' | 'FUNNEL_UPDATE'
    previous_state JSONB,
    new_state JSONB,
    reason TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- ============================================================================
-- 10. FUNÇÕES ATÔMICAS RPC (TRANSAÇÕES SEGURAS NO BANCO)
-- ============================================================================

-- 10.1 Deliberação Atômica de Decisão P0 + Event Log
CREATE OR REPLACE FUNCTION rpc_resolve_decision(
    p_decision_id TEXT,
    p_resolution_notes TEXT,
    p_decided_by TEXT,
    p_recorded_by TEXT,
    p_minutes_ref TEXT,
    p_status TEXT DEFAULT 'APPROVED'
) RETURNS VOID AS $$
DECLARE
    v_prev_state JSONB;
    v_new_state JSONB;
BEGIN
    SELECT row_to_json(d)::JSONB INTO v_prev_state FROM public.decisions d WHERE id = p_decision_id;
    
    UPDATE public.decisions
    SET status = p_status,
        resolution_notes = p_resolution_notes,
        decided_by = p_decided_by,
        recorded_by = p_recorded_by,
        minutes_reference = p_minutes_ref,
        resolved_at = NOW(),
        updated_at = NOW()
    WHERE id = p_decision_id;
    
    SELECT row_to_json(d)::JSONB INTO v_new_state FROM public.decisions d WHERE id = p_decision_id;
    
    INSERT INTO public.event_log (actor_name, entity_type, entity_id, event_type, previous_state, new_state, reason, metadata)
    VALUES (p_recorded_by, 'DECISION', p_decision_id, 'DECISION_RESOLVED', v_prev_state, v_new_state, p_resolution_notes, jsonb_build_object('decided_by', p_decided_by, 'minutes_ref', p_minutes_ref));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10.2 Desbloqueio Operacional Provisório + Event Log
CREATE OR REPLACE FUNCTION rpc_unblock_task_operational(
    p_task_id TEXT,
    p_unblock_reason TEXT,
    p_actor_name TEXT,
    p_unblock_type TEXT DEFAULT 'OPERATIONAL_CONTINUITY'
) RETURNS VOID AS $$
DECLARE
    v_prev_state JSONB;
    v_new_state JSONB;
BEGIN
    SELECT row_to_json(t)::JSONB INTO v_prev_state FROM public.tasks t WHERE id = p_task_id;
    
    UPDATE public.tasks
    SET operational_status = 'IN_PROGRESS',
        validation_status = 'PENDING',
        is_unblocked_override = TRUE,
        unblock_type = p_unblock_type,
        unblock_reason = p_unblock_reason,
        unblock_actor_name = p_actor_name,
        unblocked_at = NOW(),
        updated_at = NOW()
    WHERE id = p_task_id;
    
    SELECT row_to_json(t)::JSONB INTO v_new_state FROM public.tasks t WHERE id = p_task_id;
    
    INSERT INTO public.event_log (actor_name, entity_type, entity_id, event_type, previous_state, new_state, reason, metadata)
    VALUES (p_actor_name, 'TASK', p_task_id, 'OPERATIONAL_UNBLOCK', v_prev_state, v_new_state, p_unblock_reason, jsonb_build_object('unblock_type', p_unblock_type));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10.3 Refutação de Hipótese de ICP + Learning Loop Atômico
CREATE OR REPLACE FUNCTION rpc_refute_icp(
    p_icp_id TEXT,
    p_reason TEXT,
    p_learning TEXT,
    p_corrective_action TEXT,
    p_actor_name TEXT
) RETURNS VOID AS $$
DECLARE
    v_prev_state JSONB;
    v_new_state JSONB;
BEGIN
    SELECT row_to_json(i)::JSONB INTO v_prev_state FROM public.icps i WHERE id = p_icp_id;
    
    UPDATE public.icps
    SET operational_status = 'REFUTADA',
        validation_status = 'REJECTED',
        refuted_reason = p_reason,
        key_learning = p_learning,
        corrective_action = p_corrective_action,
        refuted_by = p_actor_name,
        refuted_at = NOW(),
        updated_at = NOW()
    WHERE id = p_icp_id;
    
    SELECT row_to_json(i)::JSONB INTO v_new_state FROM public.icps i WHERE id = p_icp_id;
    
    INSERT INTO public.event_log (actor_name, entity_type, entity_id, event_type, previous_state, new_state, reason, metadata)
    VALUES (p_actor_name, 'ICP', p_icp_id, 'ICP_REFUTED', v_prev_state, v_new_state, p_reason, jsonb_build_object('key_learning', p_learning, 'corrective_action', p_corrective_action));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 11. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workstreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura irrestrita para usuários autenticados" ON public.workstreams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura irrestrita de tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura irrestrita de decisions" ON public.decisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura irrestrita de risks" ON public.risks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura irrestrita de icps" ON public.icps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura irrestrita de pops" ON public.pops FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura irrestrita de funnel" ON public.funnel_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura irrestrita de event_log" ON public.event_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Inserção de auditoria autenticada" ON public.event_log FOR INSERT TO authenticated WITH CHECK (true);
