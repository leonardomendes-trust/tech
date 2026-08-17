/**
 * views/guide.js — Guia Operacional Executivo, Estruturado e Despoluído
 *
 * TRUST Revenue Command Center
 */

export function renderGuide() {
  const modules = [
    {
      badge: '01',
      title: 'Cockpit HOJE',
      tagline: 'Visão Diária Executiva & Gargalos Críticos',
      description: 'Ponto de partida da rotina diária. Consolida o progresso global, alertas e prioridades das próximas 24-48 horas.',
      keyActions: [
        { label: 'Gargalo Crítico', desc: 'Identifica a frente que mais impacta o cronograma e permite acionar o desbloqueio imediato.' },
        { label: 'Decisões Prioritárias', desc: 'Lista deliberações pendentes da Diretoria com prazos e impacto em frentes dependentes.' },
        { label: 'O Que Mudou Hoje', desc: 'Feed cronológico com as movimentações e atualizações operacionais das últimas 24 horas.' },
      ]
    },
    {
      badge: '02',
      title: 'Frentes & Tarefas',
      tagline: 'Gestão Operacional de Campo (F1 a F8)',
      description: 'Controle detalhado das 8 frentes de implantação e esteira de execução de cada squad.',
      keyActions: [
        { label: 'Navegação por Frente', desc: 'Alterne entre as abas (F1 a F8) para auditar tarefas, responsáveis e health score.' },
        { label: 'Registrar Update', desc: 'Líderes de frente registram resumos periódicos, próximos marcos e riscos de entrega.' },
        { label: 'Transição com Motivo', desc: 'Mude status de tarefas informando o responsável e o contexto operacional da mudança.' },
      ]
    },
    {
      badge: '03',
      title: 'Gantt Operacional',
      tagline: 'Linha do Tempo D0 a D30',
      description: 'Visualização cronológica contínua da implantação comercial TRUST com marcador temporal dinâmico.',
      keyActions: [
        { label: 'Marcador Temporal', desc: 'Linha visual que aponta o dia de hoje no ciclo (ex: D03) e sinaliza prazos vencidos.' },
        { label: 'Inspeção Rápida', desc: 'Clique em qualquer barra do cronograma para abrir o drawer lateral de detalhes.' },
      ]
    },
    {
      badge: '04',
      title: 'RevOps Funil & KPIs',
      tagline: 'Tração Comercial & Metas de Produção',
      description: 'Mapeamento real das 6 etapas de aquisição de clientes com edição direta em produção.',
      keyActions: [
        { label: 'Edição de Metas e Real', desc: 'Atualize números alcançados na semana em 1 clique com recálculo automático de conversões.' },
        { label: 'Ata Executiva One-Click', desc: 'Visualize o relatório formatado pronto para impressão/PDF ou exporte em arquivo Markdown.' },
      ]
    },
    {
      badge: '05',
      title: 'Decision Center & Riscos',
      tagline: 'Governança Institucional & Matriz P × I',
      description: 'Desbloqueio formal de dependências da Diretoria e gestão quantitativa de riscos.',
      keyActions: [
        { label: 'Registro de Decisão', desc: 'Vincula quem decidiu, quem registrou e a ata formal de aprovação institucional.' },
        { label: 'Matriz de Riscos', desc: 'Cálculo de Probabilidade × Impacto (até 25 pontos) com planos ativos de contingência.' },
      ]
    },
    {
      badge: '06',
      title: 'ICPs, Evidências & POPs',
      tagline: 'Learning Loop & Disciplina de Processos',
      description: 'Maturidade de produto baseada em evidências de campo e procedimentos operacionais padronizados.',
      keyActions: [
        { label: 'POPs Vivos', desc: 'Checklists interativos dos 10 processos padrão com persistência instantânea.' },
        { label: 'Refutação de Hipótese', desc: 'Documente testes de ICPs descartados e arquive o aprendizado sem perda de histórico.' },
      ]
    },
    {
      badge: '07',
      title: 'Time-Travel & Autonomia',
      tagline: 'Simulação Temporal & Governança de Dados',
      description: 'Projeção de cenários futuros e operação independente sem dependência de APIs externas.',
      keyActions: [
        { label: 'Simulador de Ciclo', desc: 'Avance no topo da tela para D05, D10, D15 ou D30 para auditar o comportamento da operação.' },
        { label: 'Menu Superior', desc: 'Acesse seu perfil de operador, modo de aparência e configurações no canto superior direito.' },
      ]
    },
  ];

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Manual Executivo</div>
        <h1 class="page-header__title">Guia Operacional da Torre</h1>
        <p class="page-header__subtitle">
          Instruções claras e estruturadas para operação diária, deliberação de gargalos e governança dos módulos.
        </p>
      </div>
    </div>

    <!-- SEÇÃO 1: PRINCÍPIOS FUNDAMENTAIS -->
    <div class="card-panel mb-6">
      <div class="card-panel__header">
        <span>Princípios de Governança & Operação Independente</span>
        <span class="badge badge--on-track">Autonomia Plena</span>
      </div>
      <div class="card-panel__body">
        <div class="grid-3" style="gap: var(--sp-4);">
          <div class="p-3" style="background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div class="text-xs fw-bold text-primary mb-1">🏛️ Quem Decide</div>
            <div class="text-xs text-muted">Diretoria e Liderança Comercial. Homologam orçamentos, ganchos e contratações P0.</div>
          </div>
          <div class="p-3" style="background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div class="text-xs fw-bold text-primary mb-1">✍️ Quem Registra</div>
            <div class="text-xs text-muted">Operador / Leonardo (Ops). Transcreve deliberações e audita o log da Torre.</div>
          </div>
          <div class="p-3" style="background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div class="text-xs fw-bold text-primary mb-1">⚡ Quem Executa</div>
            <div class="text-xs text-muted">SDRs, Marketing e Vendas. Executam as frentes de tração e validações de mercado.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- SEÇÃO 2: GUIA DOS MÓDULOS (DESIGN LIMPO & ESTRUTURADO) -->
    <div class="flex flex-col gap-4 mb-6">
      ${modules.map(m => `
        <div class="card-panel" style="margin-bottom: 0;">
          <div class="card-panel__header">
            <div class="flex items-center gap-3">
              <span class="badge badge--neutral font-mono">${m.badge}</span>
              <div>
                <span class="fw-bold text-primary text-sm">${m.title}</span>
                <span class="text-xs text-muted" style="margin-left: var(--sp-2);">— ${m.tagline}</span>
              </div>
            </div>
          </div>
          <div class="card-panel__body">
            <p class="text-xs text-secondary mb-3">${m.description}</p>
            <div class="grid-3" style="gap: var(--sp-3);">
              ${m.keyActions.map(a => `
                <div class="p-2" style="background: var(--bg-elevated); border-radius: var(--radius-sm); font-size: var(--fs-xs);">
                  <strong class="text-primary block mb-1">▪ ${a.label}</strong>
                  <span class="text-muted text-2xs leading-relaxed block">${a.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
