# Repete Hábito — Dinâmica de Execução das Tasks

> Versão 0.2 · 22/10/2026 · 0.2 integra o agente de QA ([qa.md](qa.md)) ao fim de toda task, feature e entrega
> Referências: [tasks.md](tasks.md) (o que fazer e progresso) · [product.md](product.md) (critérios de aceite, seção 4.9) · [tech-spec.md](tech-spec.md) (como fazer) · [qa.md](qa.md) (testes obrigatórios, invariantes e relatório)

Este arquivo define **como executar as tasks** de `tasks.md`, uma de cada vez, e **como checar, depois de cada execução, se o produto continua consistente com os critérios de aceite** de `product.md` (seção 4.9). Essa checagem é feita **sempre** pelo agente de QA definido em `qa.md`. Vale para pessoas e para agentes de IA.

---

## 1. Fontes de verdade

| Arquivo | Responde | Quem pode alterar durante a execução |
|---|---|---|
| `product.md` | **O quê** e **quando está pronto** (requisitos, critérios de aceite, Definição de Pronto) | Ninguém. Divergências viram registro (seção 6) para o responsável de produto decidir. |
| `tech-spec.md` | **Como** (stack, arquitetura, modelo de dados) | Só com uma decisão registrada (ADR ou nota na seção 8 da spec). |
| `tasks.md` | **O que falta** e o progresso | O executor, a cada task (checkbox, 🚧, painel). |
| `run.md` | **Processo** e **estado de cada critério de aceite** (matriz, seção 7) e registro de execuções (seção 9) | O executor, a cada task. O status dos CAs na matriz só muda com base no veredito do QA. |
| `qa.md` | **Como provar** cada critério: testes obrigatórios por CA (§4), invariantes de negócio (§5), procedimento (§8) e modelo de relatório (§9) | Só o agente de QA, ao adicionar testes ou fixtures. Mudança de regra de veredito exige decisão do responsável de produto. |

**Precedência em caso de conflito:** `product.md` > `tech-spec.md` > `qa.md` > `tasks.md`. Se uma task pede algo que contradiz um critério de aceite, vale o critério e a task é sinalizada (seção 6).

**Separação de papéis:** quem executa a task (executor) não aprova o próprio trabalho. A validação é feita pelo **agente de QA**, com `qa.md` carregado como contexto, de preferência numa sessão ou subagente separado. O QA não corrige código de produção: devolve as falhas ao executor, que volta ao passo 3.

---

## 2. Visão geral do ciclo

```
┌──────────────┐   ┌───────────┐   ┌────────────┐   ┌─────────────┐   ┌──────────────────┐   ┌─────────────┐
│ 1. Selecionar│ → │2. Preparar│ → │3. Executar │ → │4. Verificar │ → │5. Validação QA   │ → │6. Registrar │
│    task      │   │  contexto │   │ (código +  │   │  técnica    │   │  (qa task) +     │   │ e fechar    │
│              │   │ (+ qa.md) │   │  testes)   │   │ (CI local)  │   │  consistência    │   │             │
└──────────────┘   └───────────┘   └────────────┘   └─────────────┘   └──────────────────┘   └──────┬──────┘
       ▲                                                   │ falhou            │ ❌ Reprovada         │
       │                                                   └──────► volta ao 3 ◄┘                     │
       └──────────────────────────────────────────────────────────────────────────────────────────────┘
                    Se a feature ficou completa → qa feature <Fxx> → Fechamento de feature (4.9.1)
                    Se a entrega ficou completa → qa entrega <N>  → Fechamento de entrega (4.9.3)
```

Regra de ouro: **uma task só vira `[x]` depois que o agente de QA (`qa.md`) der o veredito ✅ Aprovada ou 🟡 Aprovada com pendência no passo 5.** Código pronto com critério de aceite quebrado ou invariante de negócio falhando não é task concluída.

| Momento | Comando do QA (`qa.md` §2) | Saída obrigatória |
|---|---|---|
| Fim de **toda** task | `qa task <Txx.y>` | Veredito + linha no registro (seção 9) |
| Última task de uma feature | `qa feature <Fxx>` | Relatório em `reports/qa/<data>-<Fxx>.md` |
| Última feature de uma entrega | `qa entrega <N>` | Relatório em `reports/qa/<data>-entrega-<N>.md` |
| Antes de merge na branch principal | `qa regressao` | Veredito da suíte inteira |

---

## 3. Passo a passo

### Passo 1 · Selecionar a próxima task

1. Seguir a ordem das entregas em `tasks.md`: **0 → 1 → 2 → 3 → 4 → 5 → Pós**.
2. Dentro da entrega, seguir a ordem das features no painel e, dentro da feature, a ordem dos IDs.
3. A task só pode começar se:
   - a feature de que ela depende (coluna "Depende de" do painel) estiver ✅, **ou** as tasks específicas de que ela precisa estiverem `[x]`;
   - não houver outra task `🚧` aberta pelo mesmo executor (**uma task por vez**);
   - ela não estiver ⏸️ Bloqueada.
4. Exceções permitidas: tasks com marca *(manual)* ou de validação (ex.: T14.1, T14.3, T10.6) podem rodar em paralelo, porque não mexem em código.
5. Tasks de pré-requisito explícito vêm antes de tudo da feature: **T14.1** (revisão profissional) antes de qualquer task de F14.

### Passo 2 · Preparar o contexto

Antes de escrever código:

1. Ler a linha da task em `tasks.md` (descrição, esforço, dívida `Dx`).
2. Abrir a **matriz de rastreabilidade** (seção 7) e listar:
   - os **critérios de aceite (CAs) ligados à task**;
   - os CAs na coluna **"Revalidar quando"** que citam esta task.
3. Ler esses CAs em `product.md` 4.9.2 e o requisito original (4.1 a 4.7, 4.3.1, 4.3.2).
4. Ler as seções da `tech-spec.md` que a task usa (arquitetura §3, modelo de dados §3.1, domínio §3.2, migrações §3.3, testes §4).
5. Se a task trata uma dívida (`Dx`), ler a linha dela na tech-spec §7.
6. **Carregar `qa.md` como contexto** e ler, para cada CA listado no item 2:
   - a linha do CA no catálogo (`qa.md` §4): nível, arquivo, cenário e asserções obrigatórias;
   - os invariantes (`qa.md` §5) que a task pode afetar (ex.: task de sequência → INV03, INV07, INV08; task que grava dados → INV01, INV02, INV14);
   - os fluxos E2E críticos (`qa.md` §6) que passam pela tela ou regra alterada;
   - as fixtures e utilitários necessários (`qa.md` §3.4). Se faltar uma fixture, ela entra no plano.
7. Escrever, no topo do registro de execução (seção 9), o **plano curto**: o que vai mudar, quais CAs vão ser cobertos, quais testes do catálogo de `qa.md` vão ser criados e quais invariantes vão ser revalidados.

### Passo 3 · Executar

1. Marcar a task como em andamento em `tasks.md`: `- [ ] 🚧 **T05.2** ...`. Atualizar o painel da feature para 🚧, se ainda estiver ⬜.
2. Começar pelo teste: **escrever primeiro o teste do critério de aceite** (falhando) e depois o código. O teste segue o **nível, o arquivo e as asserções** definidos para o CA em `qa.md` §4. Cada parte do "então" vira um `expect`.
3. **Convenção obrigatória de nome** (`qa.md` §3.3): todo teste que cobre um critério de aceite leva o ID dele no título; invariantes levam `INVxx`; E2E levam as tags de nível.
   ```ts
   it('CA05.2 · marca atividade check com 1 toque', ...)
   test('CA13.4 · gráfico para no dia de hoje e sobrepõe a semana anterior @e2e', ...)
   it('INV03 · melhor sequência nunca diminui', ...)
   ```
   Assim a consistência pode ser checada por busca (seção 8).
4. Seguir as demais convenções de `qa.md` §3.3: relógio controlado, sem rede real, seletores acessíveis, sem `.only`/`.skip`, sem afrouxar limites.
5. Respeitar as regras de arquitetura: regra de negócio em `domain/` (sem React, sem Dexie, sem `new Date()`), datas como `LocalDate`, desfazer como soft delete.
6. Mudança de schema? Seguir a Definição de Pronto: migração versionada, snapshot e teste a partir de fixture da versão anterior (`db-v{N}.json`, `qa.md` §3.4).
7. Manter o escopo da task. Algo fora dela vira **nova task** proposta no registro (seção 9), não código extra.

### Passo 4 · Verificação técnica

Rodar, nesta ordem, e só seguir se tudo passar:

| # | Verificação | Comando (após F00) |
|---|---|---|
| 1 | Lint e fronteiras de arquitetura | `pnpm lint` |
| 2 | Tipos | `pnpm typecheck` |
| 3 | Unitários + cobertura do domínio ≥ 90% | `pnpm test --coverage` |
| 4 | Unitários nos 3 fusos | `TZ=America/Sao_Paulo pnpm test` · `TZ=Pacific/Auckland pnpm test` · `TZ=UTC pnpm test` |
| 5 | Build de produção | `pnpm build` |
| 6 | E2E + axe (se a task mexe em tela ou fluxo) | `pnpm e2e` |
| 7 | Lighthouse (se a task mexe em PWA, bundle ou performance) | `pnpm lhci` |

Antes de F00 estar pronta, as verificações que ainda não existem são registradas como "n/a" no registro de execução.

O passo 4 é a checagem rápida do executor. Ele **não substitui** o passo 5: o QA roda a suíte de novo, com saída em JSON, nos 3 fusos e nos 3 projetos do Playwright (`qa.md` §8.1, item 5).

### Passo 5 · Validação de QA e consistência com os critérios de aceite

Este é o passo central. Ele responde: **"depois desta task, o produto continua de acordo com `product.md`?"** É executado **sempre**, ao fim de toda task, pelo agente de QA.

**5.0 Acionar o agente de QA**

1. Carregar `skills/qa.md` como contexto (sessão ou subagente de QA, separado do executor sempre que possível).
2. Executar `qa task <Txx.y>`, seguindo o procedimento de `qa.md` §8.1 inteiro:
   escopo → cobertura por ID → revisão do "então" → higiene (`.only`/`.skip`/limites) → suíte completa em JSON → consolidação por CA → princípios e Definição de Pronto → manuais → veredito.
3. Escopo mínimo da execução: CAs ligados à task, CAs da coluna "Revalidar quando" que citam a task, **todos os 14 invariantes** (`qa.md` §5) e os fluxos E2E de `qa.md` §6 que passam pelo que foi alterado.
4. O QA devolve: o **veredito** (`qa.md` §8.2), o status de cada CA do escopo, as falhas com severidade S1–S4 e a linha de resumo para o registro (seção 9).
5. Os blocos A a E abaixo são preenchidos **com base no resultado do QA**, não por inspeção do executor.

**A. CAs da task (avanço)**
Para cada CA ligado à task na matriz (itens 1 a 3 verificados pelo QA, `qa.md` §8.1 itens 2, 3 e 6):
1. Existe pelo menos um teste com o ID do CA no título, no nível exigido por `qa.md` §4? (busca da seção 8)
2. O teste passa em todos os fusos e projetos do Playwright, sem depender de retry?
3. O teste realmente verifica o **"então"** do critério, com as asserções de `qa.md` §4? Um teste que só confere se a tela renderiza não cobre "salva em no máximo 2 toques".
4. Todas as tasks listadas para esse CA estão `[x]` (contando esta)?
   - **Sim e os itens 1 a 3 ok** → CA vira ✅ na matriz.
   - **Não** → CA fica 🟡 Parcial, com nota do que falta.
   - **Teste falha ou não cobre o "então"** → CA fica ❌ e a task volta ao passo 3.

**B. Regressão (nada que já estava aprovado quebrou)**
1. Todo CA já ✅ na matriz continua com teste verde (o passo 4 cobre isso se a convenção de nome foi seguida).
2. Para os CAs da coluna **"Revalidar quando"** que citam esta task: rodar de novo e reler o critério. Ex.: ao concluir T07.6, revalidar CA03.5 (mudar a frequência não altera as sequências passadas).
3. Se um CA ✅ quebrar: ele vira ❌, a task atual **não** é concluída e a correção entra antes de seguir.
4. **Invariantes de negócio** (`qa.md` §5): os 14 precisam estar verdes. Um invariante falhando é falha **S1** e reprova a task mesmo com todos os CAs ✅.

**C. Princípios do produto (5.2), em todo texto e comportamento novo** (provados por INV10, INV01 e INV12 de `qa.md`)
- [ ] Nenhum texto de culpa, punição ou cobrança ("você falhou", "perdeu", "de novo?").
- [ ] Nada zera progresso ou apaga histórico.
- [ ] Nenhum limite escondido, paywall surpresa ou notificação de marketing.
- [ ] Nenhum conselho médico. Sugestões de intensidade vêm com o aviso de saúde.
- [ ] Nenhum dado pessoal ou conteúdo de registro sai do dispositivo (analytics e erros só agregados).

**D. Definição de Pronto (4.9.1), itens que a task tocou**
- [ ] Textos novos no i18n pt-BR, nos dois temas.
- [ ] Tela nova ou alterada: zero violações axe, alvos ≥ 44px, teclado, leitor de tela.
- [ ] Funciona offline.
- [ ] Regra nova em `domain/`, com cobertura ≥ 90%.
- [ ] Schema alterado: migração, snapshot e teste de fixture.

**E. Consistência entre documentos**
- [ ] A implementação seguiu a tech-spec. Se precisou desviar, o desvio está registrado.
- [ ] Não surgiu comportamento que `product.md` não descreve. Se surgiu, abrir uma divergência (seção 6), sem mudar `product.md`.
- [ ] Algum critério se mostrou ambíguo, impossível ou contraditório? Abrir divergência.

**Resultado do passo 5** (o veredito do QA define o resultado; o executor não pode promover um veredito):

| Veredito do QA (`qa.md` §8.2) | Resultado | Condição | Próximo passo |
|---|---|---|---|
| ✅ Aprovada | ✅ **Consistente** | A a E sem problema, 14/14 invariantes | Passo 6 e task `[x]` |
| 🟡 Aprovada com pendência | 🟡 **Consistente com pendência** | A tem CAs 🟡 só porque faltam outras tasks ou evidência manual; B a E ok | Passo 6 e task `[x]`; CAs ficam 🟡 |
| ❌ Reprovada | ❌ **Inconsistente** | Teste falhando, invariante falhando, regressão, flaky em regra de negócio, violação de 5.2 ou da Definição de Pronto | Voltar ao passo 3 com a lista de falhas do QA. A task continua 🚧. Depois da correção, repetir os passos 4 e 5 |
| ⏸️ Bloqueada | ⏸️ **Bloqueada** | Divergência que só o responsável de produto resolve, ou pré-requisito não cumprido (ex.: CA14.1) | Task ⏸️, registrar divergência, seguir para outra task permitida |

### Passo 6 · Registrar e fechar

Só entra neste passo com veredito do QA ✅ ou 🟡.

1. Em `tasks.md`: trocar `- [ ] 🚧` por `- [x]`.
2. Em `run.md`, seção 7: atualizar o status dos CAs afetados (✅ / 🟡 / ❌) **exatamente como o QA reportou**.
3. Em `run.md`, seção 9: adicionar a entrada do registro de execução (modelo na seção 9), incluindo a linha **QA (qa.md)**.
4. Se a task tratava uma dívida (`Dx`) e era a última dela, atualizar a tabela de dívidas em `tasks.md`.
5. Se houver git: um commit por task, com mensagem `T05.2: marca check com 1 toque (CA05.2)`.
6. Conferir se a feature ou a entrega ficou completa (seções 4 e 5).

---

## 4. Fechamento de feature

Quando a última task de uma feature for `[x]`:

0. Rodar **`qa feature <Fxx>`** (`qa.md` §2 e §8). Ele roda a suíte inteira e a Definição de Pronto completa e gera o relatório `reports/qa/<AAAA-MM-DD>-<Fxx>.md` no modelo de `qa.md` §9. **A feature só fecha com veredito ✅ Aprovada.** 🟡 mantém a feature 🚧 até a pendência ser resolvida.
1. **Todos** os CAs da feature estão ✅ na matriz. Nenhum 🟡 ou ❌.
2. Os CAs *(manual)* têm a evidência registrada (ex.: planilha do teste com 5 usuários, resultado do teste no iOS).
3. Rodar a **Definição de Pronto completa** (product 4.9.1), não só os itens tocados:
   - [ ] Todos os CAs passam e estão cobertos por testes.
   - [ ] CI verde: lint, typecheck, unitários, build, E2E e Lighthouse.
   - [ ] Regras em `domain/` com cobertura ≥ 90%.
   - [ ] Offline em Chromium e WebKit, 320px e desktop.
   - [ ] Zero violações axe, alvos ≥ 44px, teclado, leitor de tela.
   - [ ] Textos no i18n pt-BR, temas claro e escuro.
   - [ ] Nenhum texto de culpa, punição ou promessa (5.2).
   - [ ] Nenhuma ação apaga histórico.
   - [ ] Schema alterado: migração, snapshot e teste de fixture.
   - [ ] Demonstrada no preview e aprovada pelo responsável de produto.
4. Atualizar o painel em `tasks.md` para ✅ Concluída.
5. Registrar o fechamento na seção 9 com o resultado de cada item e o link do relatório do QA.

Se algum item falhar, a feature fica 🚧 e a correção vira uma task nova (`T05.10`, por exemplo) adicionada em `tasks.md`.

Grupos sem CAs próprios (**F00, OBS, NFR, POS**) fecham quando suas tasks estão `[x]` e os itens da Definição de Pronto e dos critérios de saída que eles sustentam estão verdes (ver seção 5).

---

## 5. Fechamento de entrega

Quando todas as features de uma entrega estiverem ✅, conferir os critérios de saída de `product.md` 4.9.3:

| Entrega | Checagem de saída | Evidência exigida |
|---|---|---|
| **0** | CI completo rodando; preview por PR; Renovate ativo | Link de um PR com o pipeline verde |
| **1** | Todos os CAs de F01, F02, F03 e F05 ✅; usuário novo, offline, cria e marca em < 5 s; CA02.2 e CA02.3 verdes | E2E verde + demo gravada ou registrada |
| **2** | Cobertura ≥ 90% em `domain/streak` com testes de fuso e de propriedade; CA10.6 registrado; decisão sobre o Capacitor tomada | Relatório de cobertura + nota da decisão (tech-spec §8) |
| **3** | E2E onboarding → atividade → marcação verde; Dashboard e progresso < 1 s com 2 anos de histórico; analytics sem PII | Relatório de performance + evento recebido no painel. **Libera o beta.** |
| **4** | CA11.3 verde; revisão com VoiceOver e TalkBack sem bloqueios; LGPD publicada; "Excluir meus dados" funcionando | Checklist da revisão manual + link da política |
| **5** | CA14.1 cumprido **antes** do desenvolvimento; teste de compreensão com 100%; no ar antes de algum usuário chegar a 60 dias ativos | Parecer do profissional + resultado do teste |

Além disso, em todo fechamento de entrega:

1. Rodar **`qa entrega <N>`** (`qa.md` §2): **toda** a suíte (unitários nos 3 fusos, E2E nos 3 projetos, axe, Lighthouse) e os 14 invariantes, não só a da entrega. Relatório em `reports/qa/<AAAA-MM-DD>-entrega-<N>.md`.
2. Conferir que **nenhum CA de entregas anteriores** está ❌ ou voltou a 🟡 (seção "Regressão" do relatório).
3. Revisar as divergências abertas (seção 6). Nenhuma divergência da entrega pode ficar aberta.
4. A entrega só é liberada com veredito ✅ Aprovada.
5. Registrar o fechamento na seção 9 com o link do relatório.

---

## 6. Divergências e falhas

### 6.1 O que fazer em cada situação

| Situação | Ação |
|---|---|
| Teste de CA falha | Task continua 🚧. Corrigir e repetir os passos 4 e 5. |
| CA já ✅ quebrou (regressão) | CA vira ❌. Corrigir antes de concluir a task atual. Se a causa estiver fora do escopo, criar uma task de correção com prioridade máxima e marcar a atual ⏸️. |
| Critério ambíguo ou contraditório | Abrir divergência (6.2). Implementar a interpretação mais conservadora (a que preserva dados e evita culpa) e marcar o CA 🟡 até a decisão. |
| Task pede algo contra `product.md` | Vale o `product.md`. Abrir divergência e ajustar a descrição da task em `tasks.md`. |
| CA sem nenhuma task que o cubra | Abrir divergência do tipo "lacuna" e propor nova task em `tasks.md`. |
| Requisito técnico impossível como descrito na spec | Registrar o desvio (ADR curto) e abrir divergência se afetar algum CA. |
| Tarefa *(manual)* sem evidência | CA fica 🟡. A feature não fecha. Evidência vai em `reports/qa/evidencias/<CA>.md`. |
| QA reprova (❌) | Task continua 🚧. O executor corrige a partir da seção "Falhas" do relatório, começando pelas S1, e repete os passos 4 e 5. |
| Invariante de negócio falha (`qa.md` §5) | Falha S1. Nenhuma task é concluída até corrigir, mesmo que a causa seja de task anterior. |
| Teste flaky | Tratado como falha. Corrigir o teste ou a causa; não aumentar `retries`. |
| CA sem linha no catálogo de `qa.md` §4 | Abrir divergência do tipo "lacuna" e adicionar a linha em `qa.md` antes de concluir a task. |
| Executor discorda do veredito do QA | Registrar divergência. Vale o veredito até o responsável de produto decidir. |

### 6.2 Registro de divergências

| ID | Data | Origem (task/CA) | Tipo | Descrição | Proposta | Decisão | Status |
|---|---|---|---|---|---|---|---|
| DV01 | 22/10/2026 | CA13.9 | Lacuna | Entrega 3 exige Dashboard < 1 s com 2 anos de histórico, mas a única task de medição é NFR.4, da Entrega 4. | Criar task em F13: "Fixture de 2 anos e medição de performance do Dashboard". | — | ⬜ Aberta |
| DV02 | 22/10/2026 | CA12.6 | Lacuna | Nenhuma task cobre explicitamente "pular a etapa de lembrete" no onboarding. | Ampliar T12.3: "com opção de pular". | — | ⬜ Aberta |
| DV03 | 22/10/2026 | CA11.1 | Dependência | CA11.1 exige desafios na exportação, mas desafios só existem em F14 (Entrega 5). | Na Entrega 4, validar CA11.1 sem desafios; revalidar em T14.10. | — | ⬜ Aberta |

Tipos: **Lacuna** (CA sem task) · **Conflito** (task × produto) · **Ambiguidade** (CA com mais de uma leitura) · **Dependência** (CA depende de feature futura) · **Desvio técnico** (spec não seguida).

---

## 7. Matriz de rastreabilidade (CA → tasks)

Status: ⬜ Não verificado · 🟡 Parcial · ✅ Aprovado · ❌ Falhando

- **Tasks:** todas precisam estar `[x]` para o CA poder ficar ✅.
- **Revalidar quando:** tasks posteriores que podem quebrar ou completar o CA. Ao concluir uma delas, revalidar o CA (passo 5, bloco B).
- **Teste:** nível mínimo esperado (U = unitário, I = integração, E = E2E, M = manual).

### F01 · Fundação do app
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA01.1 | T01.1, T01.6 | T11.8 | E | ⬜ |
| CA01.2 | T01.10 | T12.6 | E + M (iOS) | ⬜ |
| CA01.3 | T01.3 | — | E | ⬜ |
| CA01.4 | T01.2, T01.5 | NFR.1 | E (axe) | ⬜ |
| CA01.5 | T01.7 | — | E | ⬜ |
| CA01.6 | T00.8, T01.6 | NFR.8 | Lighthouse | ⬜ |

### F02 · Armazenamento local
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA02.1 | T02.4, T02.5, T02.9 | T11.8 | I + E | ⬜ |
| CA02.2 | T02.6, T02.7, T02.8 | T14.9 | I | ⬜ |
| CA02.3 | T02.7, T02.8 | T14.9 | I | ⬜ |
| CA02.4 | T02.5, T02.9 | T13.3, T14.5 | I | ⬜ |
| CA02.5 | T02.10 | T12.5 | I | ⬜ |
| CA02.6 | T02.2, T02.5 | — | U + I | ⬜ |

### F03 · Cadastro de atividades
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA03.1 | T03.1, T03.2, T03.7, T03.9, T05.1 | — | E | ⬜ |
| CA03.2 | T03.1 | — | E (axe) | ⬜ |
| CA03.3 | T02.2, T03.3 | — | U + E | ⬜ |
| CA03.4 | T03.2, T03.7, T03.8 | T07.3 | U | ⬜ |
| CA03.5 | T03.5, T03.8 | T07.6, T08.1, T13.1 | U | ⬜ |
| CA03.6 | T03.1, T03.6 | T12.2 | E | ⬜ |

### F04 · Ciclo de vida da atividade
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA04.1 | T04.1, T04.6 | T08.4, T13.11 | E | ⬜ |
| CA04.2 | T04.3, T07.7 | — | U + E | ⬜ |
| CA04.3 | T04.2, T04.3, T04.5 | — | E | ⬜ |
| CA04.4 | T04.4 | T08.2, T13.3 | U | ⬜ |
| CA04.5 | T04.1, T04.2, T04.3, T04.6 | — | I | ⬜ |

### F05 · Tela Hoje e marcação
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA05.1 | T05.1 | NFR.4 | E | ⬜ |
| CA05.2 | T05.2, T05.8 | — | E | ⬜ |
| CA05.3 | T05.3 | — | E | ⬜ |
| CA05.4 | T05.4, T05.8 | — | I + E | ⬜ |
| CA05.5 | T01.9, T05.5 | — | U + E | ⬜ |
| CA05.6 | T05.6 | — | U + E | ⬜ |
| CA05.7 | T05.9 | — | M | ⬜ |

### F06 · Registro retroativo e notas
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA06.1 | T06.1, T06.6 | — | E | ⬜ |
| CA06.2 | T06.1, T06.2, T06.5 | — | U + E | ⬜ |
| CA06.3 | T06.4 | — | U | ⬜ |
| CA06.4 | T06.3, T06.6 | — | U + E | ⬜ |

### F07 · Motor de sequência
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA07.1 | T07.2 | T06.4 | U | ⬜ |
| CA07.2 | T07.5, T07.8 | — | U | ⬜ |
| CA07.3 | T07.3 | — | U | ⬜ |
| CA07.4 | T07.4 | — | U | ⬜ |
| CA07.5 | T07.6 | — | U | ⬜ |
| CA07.6 | T01.9, T07.8 | — | U (3 fusos) | ⬜ |
| CA07.7 | T07.9 | — | U (propriedade) | ⬜ |
| CA07.8 | T07.10 | NFR.7 | E | ⬜ |

### F08 · Estatísticas e calendário
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA08.1 | T08.1, T08.5 | — | U + E | ⬜ |
| CA08.2 | T04.4, T08.1, T08.2 | — | U | ⬜ |
| CA08.3 | T08.3, T08.4 | — | U + E (axe) | ⬜ |
| CA08.4 | T08.6 | NFR.4 | Performance | ⬜ |

### F09 · Resumo semanal
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA09.1 | T09.1, T09.2 | — | U + E | ⬜ |
| CA09.2 | T09.3 | NFR.7 | E | ⬜ |
| CA09.3 | T09.4, T13.1 | — | U | ⬜ |

### F10 · Lembretes
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA10.1 | T10.1, T10.2, T10.3, T10.9 | POS.2 | E | ⬜ |
| CA10.2 | T10.7, T10.8 | — | U + E | ⬜ |
| CA10.3 | T10.1 | — | U + E | ⬜ |
| CA10.4 | T10.5 | — | E | ⬜ |
| CA10.5 | T10.4 | — | E | ⬜ |
| CA10.6 | T10.6 | — | M | ⬜ |

### F11 · Exportação de dados
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA11.1 | T11.1 | T14.10 (DV03) | I | ⬜ |
| CA11.2 | T11.2 | — | I | ⬜ |
| CA11.3 | T11.3, T11.5 | T14.10 | I | ⬜ |
| CA11.4 | T11.4 | — | I | ⬜ |
| CA11.5 | T11.3 | — | I + E | ⬜ |

### F12 · Onboarding
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA12.1 | T12.1, T12.2, T12.3 | — | E | ⬜ |
| CA12.2 | T12.2 | — | E | ⬜ |
| CA12.3 | T12.4 | — | E | ⬜ |
| CA12.4 | T12.8 | — | E | ⬜ |
| CA12.5 | T12.7 | — | E | ⬜ |
| CA12.6 | T12.3 (DV02) | — | E | ⬜ |

### F13 · Dashboard
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA13.1 | T13.5 | — | E | ⬜ |
| CA13.2 | T13.1, T13.3, T13.7 | — | U + E | ⬜ |
| CA13.3 | T13.1, T13.4 | — | U | ⬜ |
| CA13.4 | T13.2, T13.8 | — | U + E | ⬜ |
| CA13.5 | T13.9, T13.10 | — | E (axe) | ⬜ |
| CA13.6 | T13.6 | — | E | ⬜ |
| CA13.7 | T13.12 | NFR.7 | E | ⬜ |
| CA13.8 | T13.12 | — | E | ⬜ |
| CA13.9 | T13.13 (DV01) | NFR.4 | Performance | ⬜ |

### F14 · Status do Corpo
| CA | Tasks | Revalidar quando | Teste | Status |
|---|---|---|---|---|
| CA14.1 | T14.1 | — | M (pré-requisito) | ⬜ |
| CA14.2 | T14.4, T14.5, T14.6, T14.7, T14.8, T14.12 | — | U + E | ⬜ |
| CA14.3 | T14.7, T14.11 | — | U + E | ⬜ |
| CA14.4 | T14.5, T14.8 | T06.4 | U (propriedade) | ⬜ |
| CA14.5 | T14.7, T14.8 | — | U + E | ⬜ |
| CA14.6 | T14.14, T14.15, T14.19 | — | U + E | ⬜ |
| CA14.7 | T14.16, T14.19 | — | U + E | ⬜ |
| CA14.8 | T14.17, T14.20 | — | E | ⬜ |
| CA14.9 | T14.18 | — | U | ⬜ |
| CA14.10 | T14.13 | — | E (axe) + M | ⬜ |
| CA14.11 | T14.2, T14.11 | T14.3 | E + M | ⬜ |

### Resumo da matriz

| Feature | CAs | ✅ | 🟡 | ❌ | ⬜ |
|---|---|---|---|---|---|
| F01 | 6 | 0 | 0 | 0 | 6 |
| F02 | 6 | 0 | 0 | 0 | 6 |
| F03 | 6 | 0 | 0 | 0 | 6 |
| F04 | 5 | 0 | 0 | 0 | 5 |
| F05 | 7 | 0 | 0 | 0 | 7 |
| F06 | 4 | 0 | 0 | 0 | 4 |
| F07 | 8 | 0 | 0 | 0 | 8 |
| F08 | 4 | 0 | 0 | 0 | 4 |
| F09 | 3 | 0 | 0 | 0 | 3 |
| F10 | 6 | 0 | 0 | 0 | 6 |
| F11 | 5 | 0 | 0 | 0 | 5 |
| F12 | 6 | 0 | 0 | 0 | 6 |
| F13 | 9 | 0 | 0 | 0 | 9 |
| F14 | 11 | 0 | 0 | 0 | 11 |
| **Total** | **86** | **0** | **0** | **0** | **86** |

---

## 8. Comandos de apoio

Rodar a partir da raiz do projeto.

```bash
# Progresso das tasks
grep -c '^- \[ \]' skills/tasks.md            # pendentes (inclui 🚧)
grep -c '^- \[x\]' skills/tasks.md            # concluídas
grep -n '🚧' skills/tasks.md                  # em andamento

# Testes que cobrem um CA específico
grep -rn "CA05.2" src tests e2e 2>/dev/null

# CAs de product.md sem nenhum teste com o ID no título
for ca in $(grep -o 'CA[0-9]\{2\}\.[0-9]\+' skills/product.md | sort -u); do
  grep -rqs "$ca" src tests e2e || echo "sem teste: $ca"
done

# Status dos CAs na matriz
grep -c '| ✅ |' skills/run.md                # aprovados
grep -n '| ❌ |' skills/run.md                # falhando
grep -n '| 🟡 |' skills/run.md                # parciais

# Rodar só os testes de um CA
pnpm test -t "CA05.2"
pnpm e2e --grep "CA05.2"

# Invariantes de negócio (rodam em toda validação do QA)
pnpm test -t "INV"
pnpm e2e --grep "INV12"

# Higiene exigida pelo QA (deve voltar vazio)
grep -rnE '\.(only|skip)\(|test\.fixme|it\.todo' src tests e2e

# Relatórios do QA
ls reports/qa/*.md                            # relatórios de feature e entrega
grep -l 'Veredito: ❌' reports/qa/*.md         # relatórios reprovados
```

A suíte completa com saída em JSON, usada pelo QA, está em `qa.md` §8.1, item 5.

---

## 9. Registro de execuções

Adicionar uma entrada **por task executada**, da mais recente para a mais antiga. Fechamentos de feature e de entrega também entram aqui, com o link do relatório do QA. Entrada sem a linha **QA (qa.md)** não é válida.

### Modelo

```markdown
### <AAAA-MM-DD> · <ID da task> · <título curto>

**Plano:** o que vai mudar, quais CAs vão ser cobertos, quais testes do catálogo de `qa.md` §4 vão ser criados e quais invariantes vão ser revalidados.

**Verificação técnica (passo 4):** lint ✅ · typecheck ✅ · unit ✅ (cobertura domain 94%) · 3 fusos ✅ · build ✅ · e2e ✅ · lighthouse n/a

**QA (qa.md):** ✅ Aprovada · 1/2 CAs ✅ · 1 🟡 · 14/14 INV · 0 falhas · 0 flaky

**Consistência (passo 5):**
- A. CAs da task: CA05.2 ✅ · CA05.4 🟡 (falta T05.8)
- B. Regressão: nenhum CA ✅ quebrou · revalidados: — · invariantes 14/14
- C. Princípios 5.2: ok
- D. Definição de Pronto (itens tocados): i18n ✅ · axe ✅ · offline ✅
- E. Documentos: sem divergência

**Resultado:** ✅ Consistente | 🟡 Consistente com pendência | ❌ Inconsistente | ⏸️ Bloqueada

**Novas tasks ou divergências:** —
```

### Execuções

_Nenhuma execução registrada ainda._

---

## 10. Modo autônomo

O ciclo deste arquivo pode rodar sem intervenção, com os mesmos passos e as mesmas regras.

| Peça | Arquivo | Papel |
|---|---|---|
| Parâmetros | `skills/autorun.config.json` | Escopo (task, feature, entrega, tudo), limites, condições de parada, git e modelos. |
| Orquestrador | `.claude/skills/autorun/SKILL.md` | Laço: seleciona a task (passo 1), delega, aplica o veredito do QA e as condições de parada. |
| Executor | `.claude/agents/executor.md` | Passos 2, 3, 4 e 6. |
| QA | `.claude/agents/qa.md` | Passo 5 e fechamentos, conforme `qa.md`, em contexto separado. |
| Trava de QA | `.claude/hooks/guard-qa.sh` (Stop) | Impede encerrar com task 🚧 sem a linha **QA (qa.md)** no registro. |
| Trava de produto | `.claude/hooks/guard-product.sh` (PreToolUse) | Bloqueia alterações em `product.md`. |
| Laço headless | `scripts/autorun.sh` | Uma sessão nova do Claude Code por task; log em `reports/autorun/`. |

As travas só ficam ativas durante o autorun (`AUTORUN=1` ou arquivo `.claude/autorun.active`). Fora dele, o uso interativo não é afetado.

```bash
/autorun F05                     # interativo, dentro do Claude Code
/autorun T05.2 --uma-task        # uma task só
scripts/autorun.sh "entrega 1"   # headless, contexto novo por task
```

O modo autônomo **para e devolve o controle** em: veredito ⏸️, falha S1, ❌ após o máximo de tentativas, divergência aberta, task *(manual)*, árvore git suja ou fim do escopo. Decisões de produto nunca são tomadas por ele.
