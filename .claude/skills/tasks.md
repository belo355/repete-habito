# Repete Hábito — Tasks de Desenvolvimento (MVP)

> Versão 0.2 · 22/10/2026 · 0.2 adiciona F14 (Status do Corpo)
> Referências: [product.md](product.md) (features F01–F14) · [tech-spec.md](tech-spec.md) (stack, arquitetura, dívidas D1–D8)

## Como usar este arquivo

- Cada task tem um checkbox. **`- [ ]` = pendente**, **`- [x]` = concluída**. Para marcar como em andamento, adicione `🚧` antes do ID (ex.: `- [ ] 🚧 T05.2`).
- Ao concluir todas as tasks de uma feature, atualize o status dela no **Painel de progresso** abaixo.
- Esforço estimado: **P** (≤ 0,5 dia), **M** (1–2 dias), **G** (3–5 dias).
- `Dx` indica a dívida técnica da tech-spec (seção 7) que a task trata. Prioridade da dívida = (Impacto + Risco) × (6 − Esforço).
- Contar pendentes no terminal: `grep -c '^- \[ \]' tasks.md` · concluídas: `grep -c '^- \[x\]' tasks.md`

Status possíveis: ⬜ Pendente · 🚧 Em andamento · ✅ Concluída · ⏸️ Bloqueada

## Painel de progresso

| Entrega | Feature | Descrição | Prioridade | Depende de | Tasks | Status |
|---|---|---|---|---|---|---|
| 0 | F00 | Setup do repositório, qualidade e CI | Must | — | 10 | 🚧 Em andamento |
| 1 | F01 | Fundação do app (PWA, rotas, tema, i18n, a11y) | Must | F00 | 10 | 🚧 Em andamento |
| 1 | F02 | Armazenamento local (Dexie, repositórios, migração) | Must | F01 | 11 | ⬜ Pendente |
| 1 | F03 | Cadastro de atividades | Must | F02 | 9 | ⬜ Pendente |
| 1 | F05 | Tela Hoje e marcação | Must | F03 | 9 | ⬜ Pendente |
| 2 | F07 | Motor de sequência | Must | F05 | 10 | ⬜ Pendente |
| 2 | F04 | Ciclo de vida da atividade | Must | F03 | 6 | ⬜ Pendente |
| 2 | F10 | Lembretes | Must | F05 | 9 | ⬜ Pendente |
| 3 | F12 | Onboarding | Must | F03, F10 | 8 | ⬜ Pendente |
| 3 | F13 | Dashboard | Must | F05 | 13 | ⬜ Pendente |
| 3 | F08 | Estatísticas e calendário | Should | F07 | 6 | ⬜ Pendente |
| 3 | F09 | Resumo semanal | Should | F07 | 4 | ⬜ Pendente |
| 3 | OBS | Analytics sem PII e monitoramento de erros | Should | F01 | 5 | ⬜ Pendente |
| 4 | F06 | Registro retroativo e notas | Should | F05 | 6 | ⬜ Pendente |
| 4 | F11 | Exportação/importação de dados | Should | F02 | 8 | ⬜ Pendente |
| 4 | NFR | Requisitos não funcionais e privacidade | Must | todas | 9 | ⬜ Pendente |
| 5 | F14 | Status do Corpo (fases, retomada, desafios) | Should | F03, F13 | 22 | ⬜ Pendente |
| Pós | POS | Capacitor, compras nativas e sync | — | MVP | 6 | ⬜ Pendente |

### Dívidas técnicas (tech-spec §7)

| # | Item | Prioridade | Tratada em | Status |
|---|---|---|---|---|
| D1 | `LocalDate` e relógio injetado desde o 1º commit | **40** | T01.8, T02.1, T07.x | 🚧 Em andamento |
| D2 | Eviction do IndexedDB | **28** | T02.10, T12.6, T11.7 | ⬜ Pendente |
| D3 | Migrações de schema sem teste | **28** | T02.6, T02.7, T02.8, T14.9 | ⬜ Pendente |
| D4 | Lembretes não confiáveis na PWA | **27** | T10.2–T10.6, POS.1–POS.2 | ⬜ Pendente |
| D5 | Atualização de dependências sem automação | **25** | T00.9 | 🚧 Em andamento |
| D6 | Métricas de sucesso sem coleta | **20** | OBS.1–OBS.3 | ⬜ Pendente |
| D7 | Sem sync nem backup em nuvem | **16** | T11.x (parcial), POS.5–POS.6 | ⬜ Pendente |
| D8 | Premium sem validação de compra no servidor | **10** | POS.3–POS.4 | ⬜ Pendente |

---

## Entrega 0 — Setup do repositório

### F00 · Setup, qualidade e CI · Must · Dívidas: D5

- [x] **T00.1** Criar projeto Vite + React 19 + TypeScript com pnpm e Node LTS fixado (`.nvmrc`, `packageManager`). — P
- [x] **T00.2** Configurar `tsconfig` com `strict` e `noUncheckedIndexedAccess`; script `typecheck` (`tsc --noEmit`). — P
- [x] **T00.3** Criar estrutura de pastas da tech-spec §3 (`domain/`, `data/`, `platform/`, `features/`, `ui/`, `i18n/`, `app/`). — P
- [x] **T00.4** ESLint flat config (typescript-eslint, jsx-a11y, react-hooks) + Prettier. — P
- [x] **T00.5** Regras de fronteira (`eslint-plugin-boundaries` ou `dependency-cruiser`): `domain` não importa nada externo; `data`/`platform` não importam `features`. — M
- [x] **T00.6** Vitest com cobertura e gate ≥ 90% em `src/domain/**`; matriz de fuso (`TZ=America/Sao_Paulo`, `Pacific/Auckland`, `UTC`). — M
- [x] **T00.7** Playwright (Chromium, WebKit, viewport mobile) + `@axe-core/playwright`, com um teste smoke. — M
- [x] **T00.8** GitHub Actions: lint → typecheck → unit → build → e2e → Lighthouse CI (orçamentos: PWA instalável, LCP < 2,5 s, JS inicial < 200 KB gzip). — M
- [x] **T00.9** Renovate com agrupamento semanal e auto-merge de patches com CI verde. **(D5)** — P
- [ ] **T00.10** Demo local do build de produção (`pnpm build && pnpm preview`) documentada, no lugar de hospedagem e preview por PR (decisão DV04, 24/10/2026). — P

---

## Entrega 1 — Núcleo usável

### F01 · Fundação do app · Must · Cobre product 4.7 · Dívidas: D1

- [x] **T01.1** Roteamento SPA com React Router: rotas `/hoje`, `/atividades`, `/dashboard`, `/progresso`, `/onboarding`, `/ajustes`; navegação principal. — P
- [x] **T01.2** Tailwind v4 com tokens em variáveis CSS (cores, espaçamento, raio), contraste AA nos dois temas. — M
- [x] **T01.3** Tema claro/escuro: segue `prefers-color-scheme` com override manual persistido (Zustand). — P
- [x] **T01.4** i18next + react-i18next com recursos pt-BR; nenhuma string fixa em componentes (regra de lint ou revisão). — P
- [x] **T01.5** Base de componentes acessíveis (Radix): Button, Dialog, Switch, Menu, alvos de toque ≥ 44px, foco visível. — M
- [x] **T01.6** vite-plugin-pwa (`generateSW`, precache do app shell), manifest pt-BR com ícones maskable e `theme_color` dos dois temas. — M
- [x] **T01.7** Atualização com `registerType: 'prompt'`: aviso "Nova versão disponível" e recarga só com aceite. — P
- [x] **T01.8** `domain/date`: tipo `LocalDate`, helpers (início/fim de semana seg–dom, mês, soma de dias) e porta `Clock` injetável; proibir `new Date()` em `domain/` via lint. **(D1)** — M
- [x] **T01.9** Testes do `domain/date`: virada de dia, horário de verão, registros perto da meia-noite, semanas que atravessam dois meses, nos três fusos. **(D1)** — M
- [ ] **T01.10** Prompt de instalação (Android/desktop) e instrução visual "Adicionar à Tela de Início" (iOS). — M

### F02 · Armazenamento local · Must · Cobre product 4.5 · Dívidas: D1, D2, D3

- [ ] **T02.1** Tipos de domínio `Activity`, `FrequencyRule` (versionada por `validFrom`), `LogEntry` (soft delete) conforme tech-spec §3.1. **(D1)** — P
- [ ] **T02.2** Schemas Zod das entidades (reutilizados em formulário, importação e migração) + testes de validação (negativos, vazios, limites). — M
- [ ] **T02.3** Gerador de IDs UUID v7. — P
- [ ] **T02.4** `data/db.ts`: schema Dexie v1 com índices (`logs: [activityId+date]`, `date`, `activities: status`). — P
- [ ] **T02.5** Interfaces `ActivityRepository` e `LogRepository` + implementação Dexie (desfazer = `deletedAt`, nunca apagar; `updatedAt` em toda escrita). — M
- [ ] **T02.6** Infra de migração: cada versão com `upgrade()` explícito. **(D3)** — P
- [ ] **T02.7** Snapshot JSON automático do banco antes de qualquer migração, com recuperação. **(D3)** — M
- [ ] **T02.8** Testes de migração a partir de banco fixture da versão anterior (fake-indexeddb). **(D3)** — M
- [ ] **T02.9** Testes de integração dos repositórios: salvar, ler, soft delete, consultas por intervalo de datas. — M
- [ ] **T02.10** `platform/storage`: `navigator.storage.persist()` e estimativa de quota. **(D2)** — P
- [ ] **T02.11** Hooks de leitura reativa com `useLiveQuery` (atividades ativas, logs do dia/intervalo). — P

### F03 · Cadastro de atividades · Must · Cobre product 4.1

- [ ] **T03.1** Formulário (React Hook Form + Zod): nome, ícone (Lucide), cor, tipo (`check`/`duration`/`quantity`), unidade. — M
- [ ] **T03.2** Seletor de frequência: todo dia, dias específicos, X vezes por semana. — M
- [ ] **T03.3** Meta opcional por atividade (validação de valores positivos e limites). — P
- [ ] **T03.4** Dias de folga por semana (`restDaysPerWeek`). — P
- [ ] **T03.5** Edição: mudar frequência cria nova `FrequencyRule` com `validFrom = hoje`, sem reescrever o passado. — M
- [ ] **T03.6** Catálogo de modelos prontos (caminhada, alongamento, flexões, abdominais, mobilidade, corrida) em `domain/activity`. — P
- [ ] **T03.7** `domain/activity`: `isScheduledOn(activity, date)` respeitando a regra vigente e `createdOn`. — M
- [ ] **T03.8** Testes unitários de frequência: atividade criada no meio da semana, troca de regra, dias específicos. — M
- [ ] **T03.9** Tela de lista de atividades. — P

### F05 · Tela Hoje e marcação · Must · Cobre product 4.2

- [ ] **T05.1** Tela "Hoje" como rota inicial, listando atividades agendadas para o dia (via `Clock`). — M
- [ ] **T05.2** Marcar `check` com 1 toque. — P
- [ ] **T05.3** Marcar `duration`/`quantity` com 2 toques (entrada de valor rápida, meta pré-preenchida). — M
- [ ] **T05.4** Desfazer marcação (soft delete) com feedback e opção de refazer. — P
- [ ] **T05.5** Atualização reativa da lista e virada de dia com o app aberto. — P
- [ ] **T05.6** Atividades "X por semana" aparecem todo dia com indicação do quanto falta na semana. — P
- [ ] **T05.7** Leitor de tela: estado de cada atividade anunciado (feito/pendente, valor). — P
- [ ] **T05.8** E2E: criar atividade → marcar → desfazer. — M
- [ ] **T05.9** Medir tempo de marcação (< 5 s, < 2 toques) em teste de usabilidade interno. — P

---

## Entrega 2 — Motivação

### F07 · Motor de sequência · Must · Cobre product 4.3 · Dívidas: D1

> Regra de negócio mais crítica. Módulo isolado em `domain/streak`, cobertura ≥ 90%.

- [ ] **T07.1** Especificar regras por escrito (doc curto em `domain/streak/README.md`): o que é "dia cumprido" para cada tipo de frequência. — P
- [ ] **T07.2** `computeStreak(activity, logs, today)` para frequência diária. — M
- [ ] **T07.3** Dias específicos da semana: dias não agendados não quebram nem somam. — M
- [ ] **T07.4** "X vezes por semana": sequência medida em semanas cumpridas; semana atual não quebra enquanto ainda é possível cumprir. — M
- [ ] **T07.5** Dias de folga (`restDaysPerWeek`) que não quebram a sequência. — M
- [ ] **T07.6** Respeitar `validFrom` (troca de frequência) e `createdOn` (não penalizar antes da criação). — M
- [ ] **T07.7** Atividades pausadas/arquivadas: período pausado não quebra a sequência. — P
- [ ] **T07.8** Testes parametrizados: dia feito, perdido, folga, fuso, horário de verão, meia-noite. **(D1)** — M
- [ ] **T07.9** Testes de propriedade (fast-check): adicionar registro nunca diminui a melhor sequência; `current ≤ best`. — M
- [ ] **T07.10** UI: sequência atual e melhor por atividade (Hoje e detalhe), mensagem sempre positiva quando zera. — P

### F04 · Ciclo de vida da atividade · Must · Cobre product 4.1

- [ ] **T04.1** Pausar atividade (sai da tela Hoje, mantém histórico). — P
- [ ] **T04.2** Arquivar atividade (some das listas principais, histórico preservado). — P
- [ ] **T04.3** Reativar atividade pausada ou arquivada. — P
- [ ] **T04.4** Registrar intervalos de pausa/arquivamento para que estatísticas não contem como "planejado" nesses períodos. — M
- [ ] **T04.5** Seção "Arquivadas" na lista de atividades. — P
- [ ] **T04.6** E2E: pausar e arquivar mantendo histórico. — P

### F10 · Lembretes · Must · Cobre product 4.4 · Dívidas: D4

- [ ] **T10.1** Configuração: horário geral ou por atividade; no máximo 1 lembrete por atividade por dia. — M
- [ ] **T10.2** Interface `NotificationScheduler` em `platform/notifications`. **(D4)** — P
- [ ] **T10.3** `WebScheduler` best effort (service worker + `showNotification`, Periodic Background Sync onde houver). **(D4)** — G
- [ ] **T10.4** Pedido de permissão de notificação no momento certo (não na abertura). — P
- [ ] **T10.5** Aviso na UI de que lembretes na PWA não são garantidos com o app fechado. **(D4)** — P
- [ ] **T10.6** Teste manual cedo no iOS (PWA instalada) e Android; registrar resultado para decidir o momento do Capacitor. **(D4)** — M
- [ ] **T10.7** `isDayComplete(activities, logs, today)` em `domain/` + testes. — P
- [ ] **T10.8** Silenciar lembrete do dia quando todas as atividades foram feitas. — P
- [ ] **T10.9** E2E: configurar lembrete e receber notificação (com app aberto). — M

---

## Entrega 3 — Primeira experiência e progresso

### F12 · Onboarding · Must · Cobre product 4.1 (modelos), 4.6 · Dívidas: D2

- [ ] **T12.1** Tela 1: objetivo. — P
- [ ] **T12.2** Tela 2: escolher 1 a 3 atividades a partir dos modelos prontos. — M
- [ ] **T12.3** Tela 3: horário do lembrete (com permissão de notificação). — P
- [ ] **T12.4** Explicação clara do que é grátis e premium dentro do onboarding. — P
- [ ] **T12.5** Chamar `storage.persist()` ao concluir. **(D2)** — P
- [ ] **T12.6** Incentivo à instalação do app ao final (reduz eviction no iOS). **(D2)** — P
- [ ] **T12.7** Estado de onboarding concluído persistido; não repetir. — P
- [ ] **T12.8** E2E: onboarding → primeira atividade → primeira marcação. — M

### F13 · Dashboard · Must · Cobre product 4.3.1

- [ ] **T13.1** `domain/stats/dashboard`: contagens do período (vezes, dias ativos, feitos ÷ planejados). — M
- [ ] **T13.2** Série diária (7 pontos semana, 28–31 mês) e série do período anterior alinhada por posição. — M
- [ ] **T13.3** Regras: registros desfeitos não contam; pausadas/arquivadas contam como feitas, não como planejadas no período inativo. — M
- [ ] **T13.4** Testes: limites seg–dom e de mês, semanas que atravessam meses, desfeitos, atividade criada no meio do período, fusos. — M
- [ ] **T13.5** Tela com alternância Semana/Mês (padrão: semana atual). — P
- [ ] **T13.6** Navegação ‹ › entre períodos e "voltar ao atual" com um toque. — P
- [ ] **T13.7** Cards de indicadores: vezes, dias ativos ("5 de 7 dias"), taxa de conclusão. — P
- [ ] **T13.8** Gráfico de área em SVG próprio: atual em destaque, anterior sobreposto mais claro, Y começando em 0, linha para no dia de hoje. — G
- [ ] **T13.9** Tooltip por toque/hover com dia e número de vezes. — M
- [ ] **T13.10** Tabela equivalente acessível ao leitor de tela ("Terça: 2 vezes"). — P
- [ ] **T13.11** Detalhamento por atividade ("Caminhada: 4 vezes · 120 min"). — P
- [ ] **T13.12** Comparação com período anterior em tom positivo/neutro (nunca culpa) e estado vazio com atalho para "Hoje". — P
- [ ] **T13.13** E2E: marcar atividades e ver o dashboard refletir semana/mês; navegar entre períodos. — M

### F08 · Estatísticas e calendário · Should · Cobre product 4.3

- [ ] **T08.1** `completionRate(activities, logs, range)` semanal e mensal. — M
- [ ] **T08.2** Testes de taxa com atividades pausadas e arquivadas. — P
- [ ] **T08.3** `monthHeatmap(activity, logs, month)` com níveis 0–3 + testes. — M
- [ ] **T08.4** Componente heatmap mensal em SVG por atividade, acessível (rótulo por dia). — M
- [ ] **T08.5** Tela de progresso por atividade (sequência, taxa, heatmap). — M
- [ ] **T08.6** Memoização dos cálculos; medir com 2 anos de histórico. — P

### F09 · Resumo semanal · Should · Cobre product 4.3

- [ ] **T09.1** `weeklySummary(activities, logs, weekOf)` → `{ done, planned }` + testes. — P
- [ ] **T09.2** Card "Você treinou X de Y dias planejados" na tela Hoje/Progresso. — P
- [ ] **T09.3** Copy positiva para semanas fracas (sem culpa). — P
- [ ] **T09.4** Reaproveitar a mesma base de cálculo do F13 (evitar duplicação de regra). — P

### OBS · Analytics e erros · Should · Dívidas: D6

- [ ] **OBS.1** Decidir ferramenta de analytics (Plausible, Umami ou nenhuma) — decisão em aberto nº 1 da tech-spec. **(D6)** — P
- [ ] **OBS.2** Instrumentar eventos agregados sem PII (`activity_created`, `log_marked`, `onboarding_completed`). **(D6)** — M
- [ ] **OBS.3** Painel com métricas da seção 6 do product (ativação, D7, D30) antes do beta fechado. **(D6)** — M
- [ ] **OBS.4** Sentry (ou equivalente) com opt-in, sem dados pessoais e sem conteúdo de registros. — M
- [ ] **OBS.5** Flag de experimento para A/B sequência rígida vs. tolerante (P3). — M

---

## Entrega 4 — Complementos

### F06 · Registro retroativo e notas · Should · Cobre product 4.2

- [ ] **T06.1** Seletor de dia na tela Hoje limitado a 7 dias atrás. — M
- [ ] **T06.2** Validação no domínio: rejeitar datas futuras e > 7 dias. — P
- [ ] **T06.3** Nota curta opcional por registro (limite de caracteres). — P
- [ ] **T06.4** Sequência e estatísticas recalculam ao registrar dia passado. — P
- [ ] **T06.5** Testes unitários do limite de 7 dias (incluindo virada de dia/fuso). — P
- [ ] **T06.6** E2E: registrar dia passado com nota. — P

### F11 · Exportação/importação de dados · Should · Cobre product 4.5 · Dívidas: D7 (parcial), D2

- [ ] **T11.1** Exportar JSON completo (atividades, regras, logs incluindo tombstones, versão do schema). — M
- [ ] **T11.2** Exportar CSV (logs legíveis). — P
- [ ] **T11.3** Importar JSON validando com Zod e migrando versões antigas. — M
- [ ] **T11.4** Merge na importação por `id` + `updatedAt`, nunca sobrescrever histórico. **(D7)** — M
- [ ] **T11.5** Teste de ida e volta: exportar → apagar → importar recupera 100% do histórico. **(D7)** — M
- [ ] **T11.6** `platform/share`: download no navegador (Web Share API quando disponível). — P
- [ ] **T11.7** Lembrete periódico de backup (ex.: mensal). **(D2, D7)** — P
- [ ] **T11.8** Teste de funcionamento offline completo (Playwright `context.setOffline`). — P

### NFR · Não funcionais e privacidade · Must · Cobre product 7.2 (não funcionais), tech-spec §6

- [ ] **NFR.1** Auditoria axe automatizada em todas as telas no CI. — P
- [ ] **NFR.2** Revisão manual com VoiceOver e TalkBack. — M
- [ ] **NFR.3** Responsividade de 320px até desktop (testes visuais Playwright). — M
- [ ] **NFR.4** Performance: Hoje e Dashboard < 1 s com fixture de 2 anos de histórico; se falhar, mover cálculos para Web Worker (Comlink). — M
- [ ] **NFR.5** "Excluir meus dados": apaga IndexedDB, caches e service worker. — P
- [ ] **NFR.6** Política de privacidade (LGPD) e texto de dados locais. — P
- [ ] **NFR.7** Revisar copy do app contra princípios 5.2 (sem culpa, sem paywall surpresa, sem marketing). — P
- [ ] **NFR.8** Orçamentos do Lighthouse CI verdes no build de release. — P
- [ ] **NFR.9** Preparar beta fechado (20–50 usuários): canal de feedback e checklist de release. — M

---

## Entrega 5 — Evolução

### F14 · Status do Corpo · Should · Cobre product 4.3.2 · Dívidas: D1, D3

> Feature pendente de validação (premissa P8). As fases 1 a 3 (T14.1–T14.8 e T14.11–T14.13) podem sair junto com o Dashboard; sugestões e desafios (T14.9 em diante) precisam estar prontos antes de os usuários do beta chegarem a ~60 dias ativos.

**Conteúdo e validação**
- [ ] **T14.1** Revisar com um profissional de educação física as fases, os marcos e os textos de 4.3.2 (e confirmar a referência R4 com literatura primária). — M
- [ ] **T14.2** Escrever os textos de cada fase, do modo retomada e do aviso de saúde no i18n pt-BR, com linguagem de possibilidade e link para a fonte. — M
- [ ] **T14.3** Teste de compreensão dos textos com 5 usuários (product 7.1). — M

**Domínio (`domain/body-status`)**
- [ ] **T14.4** Tabela de fases como dado puro (id, marco em dias ativos, condição de ritmo, chave de texto, referência). — P
- [ ] **T14.5** `activeDaysTotal(logs)`: dias com ≥ 1 registro não desfeito; reaproveitar a base de contagem do F13. **(D1)** — P
- [ ] **T14.6** `recentPace(logs, today)`: média de dias ativos por semana nas últimas 6 semanas (seg–dom). **(D1)** — P
- [ ] **T14.7** `bodyStatus(logs, today, prefs)` → `{ phase, nextMilestone, remaining, pace, mode: 'normal' | 'comeback', suggestion? }`; modo retomada após 14 dias sem atividade. — M
- [ ] **T14.8** Testes unitários: fase muda exatamente no marco, marcos nunca regridem, condição de ritmo das fases 4 e 5, retomada, desfeitos não contam, fusos e virada de dia. Propriedade (fast-check): adicionar registro nunca diminui a fase. — M

**Dados**
- [ ] **T14.9** Schema Dexie v2: tabela `challenges` (`id`, `kind: 'intensity' | 'newActivity'`, `activityId`, `rule`, `startedOn`, `endsOn`, `status`, `updatedAt`) e preferências (`intensitySuggestions`, `dismissedUntil`, `celebratedPhases`). Migração com snapshot e teste a partir de fixture v1. **(D3)** — M
- [ ] **T14.10** Incluir `challenges` e preferências na exportação/importação JSON (F11), com merge por `id` + `updatedAt`. — P

**UI**
- [ ] **T14.11** Tela/rota `/status-corpo` (ou seção do Dashboard): fase atual, "o que está acontecendo no seu corpo", fonte, barra até o próximo marco. — M
- [ ] **T14.12** Celebração discreta na tela Hoje ao atingir um marco (uma vez por fase), com link para o Status do Corpo. — P
- [ ] **T14.13** Leitor de tela: "Fase 4 de 7, Hábito começando. Faltam 32 dias ativos para a próxima fase." Contraste AA e alvos ≥ 44px. — P

**Sugestões e desafios**
- [ ] **T14.14** `suggestNewActivity(activities, templates)`: modelo pronto de tipo diferente dos que o usuário já tem; criar a atividade com 1 toque. — M
- [ ] **T14.15** Catálogo de desafios de intensidade de 4 semanas (meta +10%, 1 sessão intervalada por semana) como dado puro. — P
- [ ] **T14.16** Fluxo aceitar / adiar / dispensar; dispensar bloqueia novas sugestões por 4 semanas. — M
- [ ] **T14.17** Desafio ativo na tela Hoje ("Semana 2 de 4"); ao terminar, escolher entre manter a nova meta ou voltar à anterior (nova `FrequencyRule`/meta com `validFrom`, sem reescrever o histórico). — M
- [ ] **T14.18** `challengeProgress(challenge, logs, today)` + testes: início, término, progresso parcial, mensagem final sempre positiva. — M
- [ ] **T14.19** Aviso de saúde sempre visível com sugestão de intensidade; ajuste em `/ajustes` para desligar as sugestões de intensidade. — P

**Qualidade e métricas**
- [ ] **T14.20** E2E: fixture com 60 dias ativos → sugestão → aceitar desafio → aparece em Hoje; dispensar → não reaparece. — M
- [ ] **T14.21** Eventos sem PII (`body_phase_reached`, `suggestion_accepted`, `suggestion_dismissed`, `challenge_completed`) e retenção D60 no painel (OBS). — P
- [ ] **T14.22** Flag de experimento para o A/B com e sem Status do Corpo (product 7.1). — P

---

## Pós-MVP

### POS · App de loja e sync · Dívidas: D4, D7, D8

- [ ] **POS.1** Encapsular com Capacitor (iOS e Android) reaproveitando o build do Vite. **(D4)** — G
- [ ] **POS.2** `CapacitorScheduler` com `@capacitor/local-notifications`. **(D4)** — M
- [ ] **POS.3** Compras nativas (StoreKit / Play Billing, ex.: RevenueCat). **(D8)** — G
- [ ] **POS.4** Desbloqueio de premium validado pela loja, não localmente. **(D8)** — M
- [ ] **POS.5** Avaliar sync (backend leve ou serviço gerenciado) com merge por `id` + `updatedAt`. **(D7)** — G
- [ ] **POS.6** Testes de sync: conflito entre dois dispositivos não perde registros; offline → online. **(D7)** — G
