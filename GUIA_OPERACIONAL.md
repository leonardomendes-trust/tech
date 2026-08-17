# GUIA OPERACIONAL — TRUST REVENUE COMMAND CENTER
**Sistema Operacional Autônomo de RevOps · TRUST Holding**

> *"External integrations accelerate the Command Center, but never determine whether it can operate."*

---

## 🏛️ 1. Princípios Arquiteturais

1. **Autonomia Plena (Operação Independente):**
   * A Torre não depende de ClickUp, RD Station, Apollo ou APIs externas para operar.
   * Toda a persistência, árvore de decisões, tarefas, evidências e aprendizados são armazenados localmente e de forma auditável.

2. **Separação Estruturada de Papéis:**
   * **Quem Delibera / Decide:** Diretoria, Diretor Comercial, RevOps.
   * **Quem Registra:** Operador ou analista responsável pela transcrição.
   * **Quem Executa:** SDR, Marketing, Vendas, CS.

3. **Validação Contínua ≠ Tarefa Concluída:**
   * Concluir uma tarefa de criação de ICP não significa que ele foi validado comercialmente.
   * A esteira de maturidade avança por evidências de campo:
     $$\text{N1 (Hipótese)} \longrightarrow \text{N2 (Comercial)} \longrightarrow \text{N3 (Mercado)}$$

---

## 🧭 2. Navegação dos Módulos

| Módulo | Objetivo Operacional | Frequência de Uso |
|---|---|:---:|
| **Cockpit HOJE** | Visão diária de gargalos, decisões P0 e prioridades das próximas 24-48h. | Diária (Manhã) |
| **Frentes & Tarefas** | Status das 8 frentes de implantação, transição de tarefas e updates operacionais. | Contínua |
| **Gantt Operacional** | Linha do tempo visual D0 a D30 com marcador do dia corrente. | Semanal |
| **Decision Center** | Registro de decisões com justificativa e histórico auditável. | Sob Demanda |
| **Matriz de Riscos** | Acompanhamento da matriz $P \times I$ e planos de mitigação ativos. | Semanal |
| **ICPs · Evidências · POPs** | Checklists de POPs, maturidade de ICPs e Learning Loop de refutações. | Contínua |
| **RevOps KPI Cockpit** | Funil de receita (contas ➔ reuniões ➔ propostas) e exportação de ata executiva. | Semanal / Reunião |
| **Memória Operacional** | Log de auditoria cronológico e imutável de todas as ações. | Auditoria |

---

## ⚡ 3. Como Realizar um Desbloqueio Operacional

Quando uma tarefa estiver bloqueada aguardando uma dependência externa, mas a operação puder seguir com hipótese provisória:
1. No **Cockpit HOJE** ou no card da tarefa, clique em **`⚡ Desbloquear Operacionalmente`**.
2. Selecione a estratégia (ex: *Avançar com hipótese provisória e validar em campo*).
3. Informe o motivo e o que permanece pendente de validação.
4. O sistema transita a tarefa para **`IN_PROGRESS (VALIDATION_PENDING)`** e grava o evento no log.

---

## 💡 4. Como Registrar um Aprendizado / Refutação de ICP

1. Acesse **`ICPs · Evidências · POPs`** e abra a aba **`🎯 Matriz de ICPs`**.
2. No card do ICP que não performou, clique em **`Refutar / Pivotar Hipótese ➔`**.
3. Registre os fatos observados, o aprendizado chave e a ação de pivô.
4. O histórico é gravado na aba **`💡 Aprendizados & Refutações`** sem apagar os dados anteriores.

---

## 📦 5. Exportação e Backup dos Dados
* Vá em **`Fontes & Autonomia`** para exportar o JSON completo de backup ou importar dados canônicos adicionais.
