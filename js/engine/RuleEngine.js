/**
 * RuleEngine — Motor de Diagnóstico, Topologia e Análise de Impacto (Fase 3)
 *
 * TRUST Revenue Command Center
 *
 * RECURSOS:
 * 1. Análise de Causa Raiz & Grafo de Dependências
 * 2. Simulador de Impacto de Decisões (Decision Intelligence)
 * 3. Classificação de Maturidade de ICPs orientada por Evidências
 * 4. Diagnóstico e Next Best Action Determinístico
 * 5. Projeção de Tendência e Aging
 */

export class RuleEngine {
  /**
   * Analisa a árvore de impacto de uma decisão pendente
   */
  analyzeDecisionImpact(decisionId, state) {
    const { decisions, tasks, workstreams } = state;
    const decision = decisions.find(d => d.id === decisionId || d.code === decisionId);
    if (!decision) return null;

    const blockedWorkstreamCodes = (decision.blockedWorkstreams || []).map(wsId => {
      const ws = workstreams.find(w => w.id === wsId);
      return ws ? `${ws.code} (${ws.name})` : wsId;
    });

    // Encontrar tarefas que estão bloqueadas diretamente por causa desta decisão
    const relatedTasks = tasks.filter(t => 
      t.status === 'BLOCKED' && 
      (t.blockReason?.includes(decision.code) || (decision.blockedWorkstreams || []).includes(t.workstreamId))
    );

    // Tarefas subsequentes liberadas
    const downstreamTasks = tasks.filter(t => 
      relatedTasks.some(rt => (t.dependencies || []).includes(rt.id) || (t.dependencies || []).includes(rt.code))
    );

    return {
      decisionCode: decision.code,
      decisionTitle: decision.title,
      owner: decision.owner,
      deadline: decision.deadline,
      blockedWorkstreams: blockedWorkstreamCodes,
      directTasksUnlocked: relatedTasks.map(t => ({ code: t.code, title: t.title, owner: t.owner })),
      downstreamTasksUnlocked: downstreamTasks.map(t => ({ code: t.code, title: t.title })),
      estimatedVelocityGain: `${relatedTasks.length + downstreamTasks.length} tarefas liberadas na cadeia`,
    };
  }

  /**
   * Calcula o nível de maturidade de um ICP baseado em Evidências reais
   * N1: Hipótese (0 evidências)
   * N2: Validado Comercial (E1/E2 - Reuniões, Discovery)
   * N3: Validado Mercado (E3 - Documento, Edital, Piloto)
   */
  calculateICPMaturity(icp, evidences) {
    const icpEvidences = (evidences || []).filter(e => 
      e.relatedEntityId === icp.id || 
      e.relatedEntityId === icp.code || 
      (icp.evidenceIds || []).includes(e.id)
    );

    if (icpEvidences.length === 0) {
      return { level: 'N1', label: 'Hipótese', statusClass: 'badge--neutral', score: 20, evidencesCount: 0 };
    }

    const hasFormalDoc = icpEvidences.some(e => e.type === 'DOCUMENT' || e.type === 'PILOT_RESULT');
    if (hasFormalDoc) {
      return { level: 'N3', label: 'Validado em Mercado', statusClass: 'badge--done', score: 100, evidencesCount: icpEvidences.length };
    }

    return { level: 'N2', label: 'Validado Comercial', statusClass: 'badge--info', score: 60, evidencesCount: icpEvidences.length };
  }

  /**
   * Gera os insights e recomendações baseados no estado da plataforma.
   */
  generateInsights(state) {
    const insights = [];
    const { workstreams, tasks, risks, decisions, icps, evidences, platformConfig } = state;
    const currentDay = platformConfig?.currentDay || 1;

    // 1. ANÁLISE DE CAUSA RAIZ: Frente mais crítica
    const criticalWs = workstreams.find(w => w.healthScore === 'CRITICAL' || w.tasksBlocked >= 2);
    if (criticalWs) {
      const pendingDecForWs = decisions.filter(d => d.status === 'PENDING' && (d.blockedWorkstreams || []).includes(criticalWs.id));
      const causeExplanation = pendingDecForWs.length > 0 
        ? `Gargalo originado na pendência de deliberação: ${pendingDecForWs.map(d => d.code).join(', ')}.`
        : `Gargalo originado em ${criticalWs.tasksBlocked} tarefa(s) bloqueada(s) internamente.`;

      insights.push({
        id: `diag-root-cause-${criticalWs.id}`,
        type: 'ROOT_CAUSE',
        priority: 1,
        title: `Causa Raiz: Bloqueio estrutural em ${criticalWs.code} — ${criticalWs.name}`,
        rationale: `${causeExplanation} Esta frente impacta diretamente o início de Automação (F4) e Aquisição (F5).`,
        impact: 'CRITICAL',
        suggestedAction: pendingDecForWs.length > 0 
          ? `Registrar a decisão ${pendingDecForWs[0].code} (${pendingDecForWs[0].title}) no Cockpit HOJE.`
          : `Desbloquear as tarefas prioritárias de ${criticalWs.code}.`,
        targetWorkstreamId: criticalWs.id,
        deadline: `D0${currentDay}`,
        category: 'Diagnóstico',
        source: 'RuleEngine:RootCauseTopology',
      });
    }

    // 2. NEXT BEST ACTION: Ação número 1 imediata
    const p0Decision = decisions.find(d => d.status === 'PENDING' && (d.priorityTag === 'P0' || d.impact === 'CRITICAL'));
    if (p0Decision) {
      insights.push({
        id: `nba-decision-${p0Decision.id}`,
        type: 'NEXT_BEST_ACTION',
        priority: 1,
        title: `Next Best Action #1: Deliberar ${p0Decision.code} (${p0Decision.title})`,
        rationale: `Decisão de prioridade máxima com deadline para hoje. Bloqueia frentes dependentes: ${(p0Decision.blockedWorkstreams || []).join(', ')}.`,
        impact: 'CRITICAL',
        suggestedAction: `Acessar o Decision Center e registrar a opção escolhida pela Diretoria com respectiva justificativa.`,
        targetDecisionId: p0Decision.id,
        deadline: p0Decision.deadline,
        category: 'Decisão',
        source: 'RuleEngine:NextBestAction',
      });
    }

    // 3. MATURIDADE DE ICPs: Alerta de Aquisição Prematura
    const unvalidatedICPs = icps.filter(i => this.calculateICPMaturity(i, evidences).level === 'N1');
    if (unvalidatedICPs.length > 0) {
      insights.push({
        id: 'diag-icp-unvalidated',
        type: 'LEARNING_LOOP',
        priority: 3,
        title: `${unvalidatedICPs.length} ICP(s) em Nível N1 (Hipótese Sem Evidência)`,
        rationale: `Os ICPs ${unvalidatedICPs.map(i => i.code).join(', ')} ainda não possuem evidências documentadas de mercado.`,
        impact: 'HIGH',
        suggestedAction: `Realizar discoveries e anexar evidências E1/E2 antes de liberar budget de mídia paga.`,
        deadline: 'D05',
        category: 'Estratégia',
        source: 'RuleEngine:EvidenceLoop',
      });
    }

    return insights.sort((a, b) => a.priority - b.priority);
  }
}

export const ruleEngine = new RuleEngine();
