/**
 * views/cadences.js — Central de Cadências Outbound & Scripts de Abordagem Alinhados ao Portfólio Real
 *
 * TRUST Revenue Command Center
 */

import { store } from '../state/StateManager.js';

export function renderCadences() {
  const state = store.getState();
  const activeSolution = state.selectedCadenceSolution || 'CAPTO'; // 'CAPTO' | 'LUMA' | 'SERVICES'

  const cadences = {
    CAPTO: {
      name: 'TRUST CAPTO · Rastreamento Anti-Jammer & Recuperação de Ativos em Média 23 Minutos',
      persona: 'Diretor de Operações / Gerente de Logística & Frotas / Diretor de Riscos / Seguradoras',
      hook: 'Recuperação média em 23 minutos com tecnologia imune a bloqueadores (Anti-Jammer) e integração ativa com forças policiais. Mais de R$ 2,29M em ativos recuperados.',
      steps: [
        { day: 'D01', channel: 'LinkedIn InMail / Conexão', subject: 'Prevenção a roubo e tecnologia imune a jammer na [Empresa]', text: 'Olá [Nome], vejo sua liderança em operações e logística na [Empresa]. Estruturamos o Trust Capto: rastreamento com imunidade a jammer e resposta operacional com tempo médio de recuperação de 23 minutos (integrado às forças policiais). Faz sentido avaliarmos um piloto de 30 dias na sua frota/cargas?' },
        { day: 'D03', channel: 'E-mail 1 (Gancho Principal de Risco)', subject: 'Custo de sinistros vs. Recuperação em 23 min na [Empresa]', text: 'Olá [Nome], com o aumento de bloqueadores de sinal (jammers) no transporte de cargas, os rastreadores convencionais perdem comunicação no momento crítico. O Trust Capto opera com protocolo imune a jammer e já recuperou R$ 2,29M em ativos. Como a [Empresa] tem protegido suas rotas de maior risco hoje?' },
        { day: 'D06', channel: 'Ligação / WhatsApp Executivo', subject: 'Follow-up de Teste Anti-Jammer', text: 'Olá [Nome], Leonardo da TRUST. Enviei uma apresentação sobre nosso sistema de recuperação em 23 min imune a bloqueadores. Você teria 10 min nesta quinta para avaliarmos a instalação de uma unidade de teste sem custo?' },
        { day: 'D10', channel: 'E-mail 2 (Break-up / Relatório de Eficiência)', subject: 'Último contato: Proteção de ativos críticos para a [Empresa]', text: 'Olá [Nome], imagino a correria com as operações logísticas. Caso testes de segurança patrimonial anti-jammer não sejam prioridade agora, fico à total disposição para quando surgir a necessidade.' },
      ]
    },
    LUMA: {
      name: 'TRUST LUMA · Inteligência de Espaço, Reconhecimento Facial NIST & Visão Computacional',
      persona: 'Diretor de Segurança / Gerente de TI / Diretor de Operações / Varejo & Condomínios Corporativos',
      hook: 'Reconhecimento facial com 92–97% de acurácia validado pelo NIST, contagem de pessoas e alertas em tempo real. Implantação cloud ou local aproveitando as câmeras existentes, com LGPD by design.',
      steps: [
        { day: 'D01', channel: 'E-mail 1 (Visão Computacional sem Trocar Câmeras)', subject: 'Inteligência de espaço e reconhecimento facial nas câmeras da [Empresa]', text: 'Olá [Nome], o Trust Luma transforma o CFTV existente da [Empresa] em uma central de inteligência sem necessidade de trocar câmeras: reconhecimento facial NIST (92-97% acurácia), detecção de intrusão, fluxo de pessoas e alertas em tempo real 100% LGPD compliant. Podemos agendar uma demonstração técnica de 15 minutos?' },
        { day: 'D04', channel: 'LinkedIn Mensagem', subject: 'Controle de acesso e analytics em tempo real', text: 'Olá [Nome], tudo bem? Gostaria de compartilhar um caso de aplicação do Trust Luma em controle de acessos críticos e inteligência perimetral sem investimento em novo hardware de CFTV. Quem lidera essa frente com você?' },
        { day: 'D08', channel: 'Cold Call Consultiva', subject: 'Demonstração Prática no CFTV', text: 'Boa tarde [Nome], aqui é da TRUST Tech. Conseguimos rodar uma POC do Trust Luma conectando no fluxo RTSP das suas câmeras atuais para você ver os alertas de reconhecimento facial em tempo real. Podemos agendar para esta semana?' },
      ]
    },
    SERVICES: {
      name: 'TRUST SERVICES · Terceirização Especializada de Facilities, Portaria & Segurança',
      persona: 'Gerente de Facilities / Diretor Administrativo / Compras / Síndicos Profissionais',
      hook: 'SLA garantido em contrato com reposição de postos em até 2 horas, supervisão 24/7 e treinamento operacional contínuo.',
      steps: [
        { day: 'D01', channel: 'E-mail 1 (SLA e Confiabilidade)', subject: 'Facilities com reposição em até 2h para a [Empresa]', text: 'Olá [Nome], sabemos que a principal dor em facilities é a falta de cobertura e reposição rápida de postos. Na TRUST Services garantimos SLA de 2h para substituição e supervisão ativa 24/7. Vamos bater um papo de 15 minutos?' },
        { day: 'D05', channel: 'Follow-up WhatsApp / Ligação', subject: 'Vistoria Técnica de Postos', text: 'Olá [Nome], tudo bem? Podemos realizar uma vistoria técnica sem compromisso nas unidades da [Empresa] para desenhar uma proposta comparativa de custos e SLA?' },
      ]
    }
  };

  const current = cadences[activeSolution];

  return `
    <div class="page-header">
      <div class="page-header__title-group">
        <div class="page-header__eyebrow">Frente 5 · Aquisição Ativa & Outbound</div>
        <h1 class="page-header__title">Central de Cadências & Scripts Comerciais</h1>
        <p class="page-header__subtitle">
          Sequências comerciais alinhadas aos produtos reais da TRUST (Capto Anti-Jammer, Luma NIST & Services).
        </p>
      </div>
      <button class="btn-subtle" onclick="copyActiveCadence()">
        📋 Copiar Cadência Completa
      </button>
    </div>

    <!-- SELETOR DE SOLUÇÃO (CAPTO, LUMA, SERVICES) -->
    <div class="op-tabs-wrap mb-6">
      <div class="op-tabs">
        <button class="op-tab-btn ${activeSolution === 'CAPTO' ? 'active' : ''}" onclick="selectCadenceSolution('CAPTO')">
          🚨 CAPTO (Anti-Jammer & Recuperação)
        </button>
        <button class="op-tab-btn ${activeSolution === 'LUMA' ? 'active' : ''}" onclick="selectCadenceSolution('LUMA')">
          👁️ LUMA (Reconhecimento Facial & Espaço)
        </button>
        <button class="op-tab-btn ${activeSolution === 'SERVICES' ? 'active' : ''}" onclick="selectCadenceSolution('SERVICES')">
          🏢 SERVICES (Facilities & Segurança)
        </button>
      </div>
    </div>

    <!-- HEADER DA CADÊNCIA SELECIONADA -->
    <div class="card-panel mb-6">
      <div class="card-panel__header">
        <span>${current.name}</span>
        <span class="badge badge--on-track">Sequência Validada</span>
      </div>
      <div class="card-panel__body">
        <div class="grid-2 mb-2">
          <div>
            <div class="text-xs text-muted mb-1 uppercase fw-semibold">Persona Alvo:</div>
            <div class="text-sm fw-bold text-primary">${current.persona}</div>
          </div>
          <div>
            <div class="text-xs text-muted mb-1 uppercase fw-semibold">Gancho de Entrada (Value Hook):</div>
            <div class="text-xs text-secondary">${current.hook}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TIMELINE DE PASSOS DA CADÊNCIA -->
    <div class="flex flex-col gap-4 mb-6">
      ${current.steps.map((s, idx) => `
        <div class="card-panel" style="margin-bottom: 0;">
          <div class="card-panel__header">
            <div class="flex items-center gap-3">
              <span class="badge badge--neutral font-mono">${s.day} · Passo ${idx + 1}</span>
              <span class="text-xs text-brand fw-bold">${s.channel}</span>
            </div>
            <button class="text-2xs text-brand fw-semibold" onclick="window.copyTextToClipboard('${s.text.replace(/'/g, "\\'")}')">
              Copiar Script 📋
            </button>
          </div>
          <div class="card-panel__body">
            <div class="text-xs text-muted fw-semibold mb-2">Assunto / Pauta: <strong class="text-primary">${s.subject}</strong></div>
            <div class="p-3 text-xs text-primary" style="background: var(--bg-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); line-height: 1.7; font-family: var(--font-base);">
              "${s.text}"
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.selectCadenceSolution = function(solution) {
  store._setState({ selectedCadenceSolution: solution });
  const container = document.getElementById('page-container');
  if (container) container.innerHTML = renderCadences();
};

window.copyTextToClipboard = function(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Texto copiado com sucesso para a área de transferência!');
    }).catch(err => {
      _fallbackCopyText(text);
    });
  } else {
    _fallbackCopyText(text);
  }
};

function _fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    alert('Texto copiado com sucesso para a área de transferência!');
  } catch (err) {
    prompt('Copie o texto manualmente abaixo (Ctrl + C):', text);
  }
  textArea.remove();
}

window.copyActiveCadence = function() {
  const state = store.getState();
  const sol = state.selectedCadenceSolution || 'CAPTO';
  
  const cadences = {
    CAPTO: `=== CADÊNCIA OUTBOUND: TRUST CAPTO ===
Persona: Diretor de Operações / Gerente de Logística & Frotas / Gerente de Risco
Gancho: Recuperação média em 23 minutos com tecnologia imune a bloqueadores (Anti-Jammer) e forças policiais.

[D01 · LinkedIn InMail]
Assunto: Prevenção a roubo e tecnologia imune a jammer na [Empresa]
Texto: Olá [Nome], vejo sua liderança em operações e logística na [Empresa]. Estruturamos o Trust Capto: rastreamento com imunidade a jammer e resposta operacional com tempo médio de recuperação de 23 minutos (integrado às forças policiais). Faz sentido avaliarmos um piloto de 30 dias na sua frota/cargas?

[D03 · E-mail 1]
Assunto: Custo de sinistros vs. Recuperação em 23 min na [Empresa]
Texto: Olá [Nome], com o aumento de bloqueadores de sinal (jammers) no transporte de cargas, os rastreadores convencionais perdem comunicação no momento crítico. O Trust Capto opera com protocolo imune a jammer e já recuperou R$ 2,29M em ativos. Como a [Empresa] tem protegido suas rotas de maior risco hoje?

[D06 · Ligação / WhatsApp]
Assunto: Follow-up de Teste Anti-Jammer
Texto: Olá [Nome], Leonardo da TRUST. Enviei uma apresentação sobre nosso sistema de recuperação em 23 min imune a bloqueadores. Você teria 10 min nesta quinta para avaliarmos a instalação de uma unidade de teste sem custo?

[D10 · E-mail 2 (Break-up)]
Assunto: Último contato: Proteção de ativos críticos para a [Empresa]
Texto: Olá [Nome], imagino a correria com as operações logísticas. Caso testes de segurança patrimonial anti-jammer não sejam prioridade agora, fico à total disposição para quando surgir a necessidade.`,

    LUMA: `=== CADÊNCIA OUTBOUND: TRUST LUMA ===
Persona: Diretor de Segurança / Gerente de TI / Diretor de Operações
Gancho: Reconhecimento facial NIST (92-97%), contagem de pessoas e alertas em tempo real aproveitando câmeras existentes.

[D01 · E-mail 1]
Assunto: Inteligência de espaço e reconhecimento facial nas câmeras da [Empresa]
Texto: Olá [Nome], o Trust Luma transforma o CFTV existente da [Empresa] em uma central de inteligência sem necessidade de trocar câmeras: reconhecimento facial NIST (92-97% acurácia), detecção de intrusão, fluxo de pessoas e alertas em tempo real 100% LGPD compliant. Podemos agendar uma demonstração técnica de 15 minutos?

[D04 · LinkedIn]
Assunto: Controle de acesso e analytics em tempo real
Texto: Olá [Nome], tudo bem? Gostaria de compartilhar um caso de aplicação do Trust Luma em controle de acessos críticos e inteligência perimetral sem investimento em novo hardware de CFTV. Quem lidera essa frente com você?

[D08 · Cold Call]
Assunto: Demonstração Prática no CFTV
Texto: Boa tarde [Nome], aqui é da TRUST Tech. Conseguimos rodar uma POC do Trust Luma conectando no fluxo RTSP das suas câmeras atuais para você ver os alertas de reconhecimento facial em tempo real. Podemos agendar para esta semana?`,

    SERVICES: `=== CADÊNCIA OUTBOUND: TRUST SERVICES ===
Persona: Gerente de Facilities / Diretor Administrativo / Compras
Gancho: SLA garantido em contrato com reposição de postos em até 2 horas e supervisão 24/7.

[D01 · E-mail 1]
Assunto: Facilities com reposição em até 2h para a [Empresa]
Texto: Olá [Nome], sabemos que a principal dor em facilities é a falta de cobertura e reposição rápida de postos. Na TRUST Services garantimos SLA de 2h para substituição e supervisão ativa 24/7. Vamos bater um papo de 15 minutos?

[D05 · Follow-up WhatsApp / Ligação]
Assunto: Vistoria Técnica de Postos
Texto: Olá [Nome], tudo bem? Podemos realizar uma vistoria técnica sem compromisso nas unidades da [Empresa] para desenhar uma proposta comparativa de custos e SLA?`
  };

  window.copyTextToClipboard(cadences[sol] || cadences.CAPTO);
};
