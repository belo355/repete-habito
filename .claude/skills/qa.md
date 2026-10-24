# Repete Hábito — Agente de QA (testes automatizados e E2E)

> Versão 0.2 · 24/10/2026 (nível de componente em navegador; CA01.6 pela DV05)
> Referências: [product.md](product.md) (critérios de aceite, seção 4.9) · [tech-spec.md](tech-spec.md) (stack de testes, §4) · [run.md](run.md) (ciclo de execução, matriz de rastreabilidade §7) · [tasks.md](tasks.md)

Este arquivo define o **agente de QA**: quais testes automatizados (unitários, integração e end-to-end) precisam existir para cada critério de aceite de `product.md`, como ele **garante a integridade das regras de negócio** e como ele **gera o relatório de sucesso/falha** de uma feature. Vale para pessoas e para agentes de IA.

---

## 1. Missão e limites

**Missão:** provar, com testes automatizados e reproduzíveis, que uma feature cumpre **todos** os seus critérios de aceite (product 4.9.2), a Definição de Pronto (4.9.1) e os princípios do produto (5.2), sem quebrar nada que já estava aprovado.

| O agente **faz** | O agente **não faz** |
|---|---|
| Escreve e mantém testes com o ID do CA no título. | Não altera `product.md`. Critério ambíguo vira divergência (run.md §6). |
| Roda a suíte completa e coleta os resultados. | Não altera código de produção para fazer um teste passar. Falha vira item no relatório para o executor da task. |
| Confere se cada teste verifica de fato o **"então"** do critério. | Não usa `.skip`, `.only`, `test.fixme` ou `retries` para esconder falha. |
| Mantém os testes de invariantes do domínio (seção 5). | Não baixa limites de cobertura, orçamentos de performance ou regras do axe. |
| Gera o relatório da feature (seção 9) e atualiza a matriz de `run.md` §7. | Não marca CA *(manual)* como ✅ sem evidência registrada. |

**Precedência:** `product.md` > `tech-spec.md` > `qa.md` > `tasks.md`. Se um teste e o critério discordam, vale o critério.

**Integração com o ciclo:** `run.md` aciona este agente **ao fim de toda task** (passo 5), em todo fechamento de feature (§4) e de entrega (§5). O veredito daqui define o resultado do passo 5 e o status dos CAs na matriz de `run.md` §7.

---

## 2. Quando o agente é acionado

| Comando | Momento | Escopo |
|---|---|---|
| `qa task <Txx.y>` | Passo 5 do ciclo (run.md §3) | CAs ligados à task + CAs da coluna "Revalidar quando" + invariantes. |
| `qa feature <Fxx>` | Fechamento de feature (run.md §4) | Todos os CAs da feature + Definição de Pronto completa + regressão total. **Gera o relatório.** |
| `qa entrega <N>` | Fechamento de entrega (run.md §5) | Todas as features da entrega + critérios de saída (4.9.3) + regressão de entregas anteriores. **Gera o relatório.** |
| `qa regressao` | Antes de qualquer merge na branch principal | Suíte inteira, 3 fusos, E2E nos 3 projetos, axe e Lighthouse. |

---

## 3. Estratégia e ferramentas

### 3.1 Pirâmide

| Nível | Ferramenta | Onde fica | O que prova |
|---|---|---|---|
| **U** · Unitário | Vitest | `src/domain/**/*.test.ts` | Regras de negócio puras (sequência, taxas, dashboard, fases, desafio, validação). Cobertura ≥ 90% em `domain/`. |
| **P** · Propriedade | Vitest + fast-check | `src/domain/**/*.property.test.ts` | Invariantes que valem para **qualquer** histórico (seção 5). |
| **I** · Integração | Vitest + Testing Library + fake-indexeddb | `tests/integration/**` | Repositórios, soft delete, migrações, snapshot, exportação/importação, agendador de lembretes. |
| **C** · Componente em navegador | Vitest modo navegador (projeto `browser`, `@vitest/browser-playwright`, Chromium e WebKit a 320 px) + axe-core | `src/ui/**/*.browser.test.tsx` | Componentes de `ui/` isolados em navegador real: contraste nos 2 temas, alvos ≥ 44 px, teclado, foco visível, papéis e nomes acessíveis. Roda junto com `pnpm vitest run` (projetos `unit` e `browser`). Cobertura pelo provedor istanbul (o v8 não funciona no WebKit). Não substitui o E2E da tela. |
| **E** · End-to-end | Playwright + @axe-core/playwright | `e2e/**/*.spec.ts` | Fluxos reais no navegador: toques, offline, tema, relógio, fuso, notificações, acessibilidade. |
| **L** · Lighthouse | Lighthouse CI | `lighthouserc.json` | LCP < 2,5 s (4G simulado), JS inicial < 200 KB gzip. "PWA instalável" saiu do Lighthouse 12 e é provado por E2E (DV05, ver CA01.6). |
| **M** · Manual | Registro em `run.md` §9 | `reports/qa/evidencias/` | Só os CAs marcados *(manual)*. O agente cobra a evidência, não a inventa. |

Regra: **toda regra de negócio é provada no nível U/P**; o E2E prova que a tela usa essa regra e que o "então" visível ao usuário acontece. Um CA de regra (ex.: CA07.2) nunca é coberto só por E2E.

### 3.2 Projetos do Playwright

| Projeto | Navegador | Viewport | Uso |
|---|---|---|---|
| `chromium-desktop` | Chromium | 1280×800 | Todos os specs. |
| `webkit-mobile` | WebKit | 320×640, `isMobile`, `hasTouch` | Todos os specs (Definição de Pronto: WebKit + 320px), exceto os que dependem de API exclusiva do Chromium (CDP), excluídos por `testIgnore` no `playwright.config.ts`: hoje só `e2e/f01-installable.spec.ts`. |
| `chromium-android` | Chromium | Pixel 7 | Instalação PWA, notificações, toques. |

Os specs de fuso usam `test.use({ timezoneId })` com `America/Sao_Paulo`, `Pacific/Auckland` e `UTC`.

### 3.3 Convenções obrigatórias

1. **ID no título.** Todo teste que cobre um CA começa com o ID: `it('CA07.2 · 1 folga por semana não quebra a sequência', …)`. Invariantes usam `INVxx`: `it('INV03 · melhor sequência nunca diminui', …)`.
2. **Tags de nível** no título do E2E: `@e2e`, `@axe`, `@offline`, `@perf`, `@tz`. Permite `pnpm e2e --grep @offline`.
3. **Relógio controlado.** No domínio, `today: LocalDate` é parâmetro. Na integração, `vi.setSystemTime`. No E2E, `page.clock.install({ time })`. Nenhum teste depende da hora real.
4. **Sem rede real.** E2E roda contra `vite preview` do build de produção; qualquer requisição para fora da origem falha o teste (ver INV12).
5. **Um "então", uma asserção explícita.** Cada parte do "então" do critério vira um `expect`. Ex.: CA05.4 tem três: volta a pendente, `deletedAt` preenchido, opção de refazer.
6. **Seletores acessíveis.** E2E usa `getByRole`, `getByLabel` e `getByText` com textos do i18n. Não usa classe CSS. Isso também prova o rótulo para leitor de tela.
7. **Determinismo.** Teste que falha intermitente é tratado como falha e listado como *flaky* no relatório. `retries` = 0 local e no máximo 1 no CI, e todo retry aparece no relatório.

### 3.4 Fixtures e utilitários

Ficam em `tests/fixtures/` e são compartilhados entre U, I e E.

| Fixture / utilitário | Conteúdo | Usado em |
|---|---|---|
| `builders.ts` | `anActivity()`, `aLog()`, `aRule()` com valores padrão válidos e sobrescrita parcial. | Todos |
| `history-2y.json` | 5 atividades × 2 anos (~3.650 registros), com pausas, arquivamentos, desfeitos e notas. | CA08.4, CA13.9, NFR |
| `body-59-days.json` | 59 dias ativos com ritmo ≥ 4/semana nas últimas 6 semanas. | CA14.2, fluxo E2E da fase 5 |
| `body-60-low-pace.json` | 60 dias ativos com ritmo < 4/semana. | CA14.3 |
| `body-inactive-14.json` | Fase 4 e último registro há 14 dias. | CA14.5 |
| `db-v{N}.json` | Banco serializado de cada versão anterior do schema. | CA02.2, CA02.3 |
| `export-v{N}.json` / `export-invalid-*.json` | Exportações válidas e inválidas (outra origem, schema quebrado, JSON truncado). | CA11.3 a CA11.5 |
| `seed(page, fixture)` | Grava a fixture no IndexedDB **antes** de o app abrir, via `page.addInitScript`. | E2E |
| `stubNotifications(page)` | Substitui `ServiceWorkerRegistration.prototype.showNotification` e registra as chamadas em `window.__notifications`. | CA10.x |
| `expectNoA11yViolations(page)` | `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()` com zero violações. | Todas as telas |
| `expectTouchTargets(page)` | Todo elemento interativo visível tem caixa ≥ 44×44 px. | Todas as telas |
| `waitForServiceWorker(page)` (`e2e/support/pwa.ts`) | Espera `navigator.serviceWorker.ready` e o SW controlar a página. | CA01.1, CA01.5, CA01.6, INV12 |
| `externalRequests` (`e2e/support/test.ts`) | Fixture automática do INV12; escuta `context.on('request')`, que no Chromium inclui as requisições do service worker. | Todo spec E2E |
| `src/ui/test/a11y.ts` | Versões para o nível **C**: `setTheme(theme)`, `expectNoA11yViolations(root)` (axe-core, WCAG 2.1 AA), `expectTouchTargets(root, 44)`, `expectVisibleFocus(el)`, `pressTab()`. Setup em `src/ui/test/browser-setup.ts`. | `src/ui/**/*.browser.test.tsx` |

O seed **não** pode depender de código exposto só em teste dentro do bundle de produção. Se for preciso um gancho (`window.__TEST__`), ele existe apenas com `import.meta.env.MODE === 'test'` e há um teste que confere que ele não está no build de produção.

---

## 4. Catálogo de testes por critério de aceite

Cada linha é um teste (ou grupo) **obrigatório**. "Asserções" é o que o teste precisa verificar para cobrir o "então". Coluna "Nível" segue a matriz de `run.md` §7.

### F01 · Fundação do app

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA01.1 | E `@offline` | `e2e/f01-offline.spec.ts` | Abrir app, esperar o SW ativar (`navigator.serviceWorker.ready`), `context.setOffline(true)`, recarregar e visitar todas as rotas. | Cada rota responde com o conteúdo esperado (heading da tela); nenhuma página de erro do navegador. |
| CA01.2 | E + M | `e2e/f01-install.spec.ts` | Chromium: disparar `beforeinstallprompt` sintético. WebKit com UA de iPhone. | Chromium: botão "Instalar app" visível e chama `prompt()`. iOS: instrução "Adicionar à Tela de Início" visível. Manual: instalação real no iOS. |
| CA01.3 | E | `e2e/f01-theme.spec.ts` | `emulateMedia({ colorScheme: 'dark' })` sem preferência salva; depois escolher "Claro" em Ajustes e recarregar. | `data-theme="dark"` (ou classe equivalente) na 1ª carga; após escolha e reload, tema claro mantido mesmo com SO escuro. |
| CA01.4 | E `@axe` | `e2e/f01-contrast.spec.ts` | Percorrer todas as rotas nos temas claro e escuro. | Zero violações `color-contrast` do axe em cada rota × tema. |
| CA01.5 | E | `e2e/f01-update.spec.ts` | Servir build A, abrir app; trocar para build B (versão diferente) e chamar `registration.update()`. | Aviso "Nova versão disponível" visível; a página **não** recarrega sozinha (marcador em `window` persiste); ao aceitar, recarrega e mostra a versão B. |
| CA01.6 | L + E | `lighthouserc.json` · `e2e/f01-installable.spec.ts` | `pnpm lhci` sobre o build de produção. Instalável (DV05): E2E `CA01.6 · app instalável` nos projetos Chromium (`chromium-desktop` e `chromium-android`), com `channel: 'chromium'` (o headless shell padrão do Playwright devolve sempre lista vazia). | Lighthouse: LCP < 2.500 ms; `resource-summary:script:size` < 200 KB gzip. E2E: manifest com `name`, `short_name`, `lang: pt-BR`, `start_url`, `display: standalone`, `theme_color`/`background_color` e ícones 192, 512 e maskable 512 servidos como PNG; SW controlando a página; `Page.getInstallabilityErrors` vazio (ignorando só `in-incognito`, artefato do contexto não persistente). |

### F02 · Armazenamento local

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA02.1 | I + E `@offline` | `tests/integration/f02-persistence.test.ts` · `e2e/f02-persistence.spec.ts` | Offline, criar 2 atividades e 3 registros; fechar o contexto e abrir um novo com o mesmo `storageState`/perfil persistente. | Atividades e registros iguais campo a campo antes e depois. |
| CA02.2 | I | `tests/integration/f02-migration.test.ts` | Para cada `db-v{N}.json`, abrir com o schema N+1. | Mesmo número de atividades e registros; cada `id` presente; snapshot JSON da versão N salvo e igual à fixture. |
| CA02.3 | I | `tests/integration/f02-migration-failure.test.ts` | Forçar exceção no `upgrade()`; reabrir o banco; acionar a recuperação. | Dados restaurados do snapshot são idênticos à fixture; nenhum registro perdido. |
| CA02.4 | I | `tests/integration/f02-soft-delete.test.ts` | Criar e desfazer um registro; consultar a tabela e todas as funções de contagem. | Registro existe com `deletedAt` numérico; não entra em sequência, taxa, resumo, dashboard nem Status do Corpo (ver INV02). |
| CA02.5 | I | `tests/integration/f02-persist.test.ts` | Mock de `navigator.storage.persist` resolvendo `true` e `false`; concluir o 1º uso. | `persist()` chamado uma vez; resultado gravado nas preferências. Sem `navigator.storage`: não lança erro. |
| CA02.6 | U + I | `src/domain/activity/validation.test.ts` · `tests/integration/f02-validation.test.ts` | Tabela de valores: `-1`, `0` (onde não pode), `''`, `NaN`, acima do limite, nota com 141 caracteres. | Zod rejeita cada caso; repositório lança erro e a tabela continua com a mesma contagem. |

### F03 · Cadastro de atividades

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA03.1 | E | `e2e/f03-create.spec.ts` | Criar uma atividade de cada tipo (check, duração, quantidade) com frequência e meta. | Aparece na lista; aparece na tela Hoje só nos dias agendados (relógio em dia agendado e em dia não agendado). |
| CA03.2 | E `@axe` | `e2e/f03-validation.spec.ts` | Salvar com nome `''` e `'   '`. | Erro visível ligado ao campo (`aria-describedby` / `aria-invalid="true"`), em região anunciada; nenhuma atividade nova no banco. |
| CA03.3 | U + E | `src/domain/activity/validation.test.ts` · `e2e/f03-validation.spec.ts` | Meta `0`, `-5`, `abc` para duração e quantidade. | Domínio rejeita; formulário mostra erro e não salva. |
| CA03.4 | U | `src/domain/activity/frequency.test.ts` | Regra `weekdays [1,3,5]`; avaliar seg a dom. | `isPlanned` verdadeiro só em seg, qua e sex; terça falso. |
| CA03.5 | U | `src/domain/activity/frequency-versioning.test.ts` | 30 dias "todo dia"; nova regra "3x por semana" com `validFrom = hoje`. | Sequência, taxa e planejados dos 30 dias anteriores **idênticos** antes e depois da edição (ver INV07). |
| CA03.6 | E | `e2e/f03-templates.spec.ts` | Escolher cada modelo pronto; editar um campo; salvar. | Campos pré-preenchidos com os valores do modelo; valor editado é o que fica salvo. |

### F04 · Ciclo de vida da atividade

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA04.1 | E | `e2e/f04-lifecycle.spec.ts` | Atividade com histórico; pausar. | Some da tela Hoje; selo "Pausada" na lista; Dashboard e heatmap continuam mostrando os registros anteriores. |
| CA04.2 | U + E | `src/domain/streak/paused.test.ts` · `e2e/f04-lifecycle.spec.ts` | Sequência de 5, pausa de 3 dias, reativar. | Volta à tela Hoje no mesmo dia; sequência continua 5 (dias pausados não quebram nem somam). |
| CA04.3 | E | `e2e/f04-lifecycle.spec.ts` | Arquivar; abrir "Arquivadas"; reativar. | Aparece em "Arquivadas" com o histórico; após reativar volta à lista ativa e à tela Hoje. |
| CA04.4 | U | `src/domain/stats/completion-rate.test.ts` | Atividade pausada de 10 a 20 do mês; arquivada no dia 25. | Planejados do mês excluem os dias 10–20 e 25–fim. |
| CA04.5 | I | `tests/integration/f04-no-data-loss.test.ts` | Sequência pausar → reativar → arquivar → reativar. | `count(logs)` e `count(activities)` antes = depois; registros iguais campo a campo. |

### F05 · Tela Hoje e marcação

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA05.1 | E `@perf` | `e2e/f05-today.spec.ts` | Abrir `/` com 5 atividades. | Lista da data local visível em < 1.000 ms (`performance.now()` até o heading e o 1º item); só atividades agendadas hoje. |
| CA05.2 | E | `e2e/f05-mark.spec.ts` | Tocar uma vez numa atividade check; recarregar. | Estado "feito" (`aria-pressed`/`aria-checked`) após 1 clique; persiste após reload. |
| CA05.3 | E | `e2e/f05-mark.spec.ts` | Duração com meta 20: tocar e confirmar. | Diálogo abre com `20` preenchido; registro salvo com 2 interações no total (contador de cliques no teste). |
| CA05.4 | I + E | `tests/integration/f05-undo.test.ts` · `e2e/f05-undo.spec.ts` | Marcar e desfazer; depois refazer. | Volta para pendente; registro com `deletedAt`; botão "Refazer" visível e funcional. |
| CA05.5 | U + E `@tz` | `src/domain/date/day-rollover.test.ts` · `e2e/f05-midnight.spec.ts` | `page.clock.install` às 23:59, marcar, `clock.runFor('00:02:00')`. | Lista mostra o novo dia sem `reload` (nenhum evento `load` novo); registro feito às 23:59 tem `date` do dia anterior. |
| CA05.6 | U + E | `src/domain/activity/weekly-remaining.test.ts` · `e2e/f05-today.spec.ts` | "3x por semana" com 1 registro na semana. | Texto "faltam 2 nesta semana". |
| CA05.7 | M | `reports/qa/evidencias/CA05.7.md` | Teste de usabilidade com 5 pessoas. | Evidência com tempos individuais, média < 5 s e 5/5 sem ajuda. |

### F06 · Registro retroativo e notas

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA06.1 | E | `e2e/f06-backfill.spec.ts` | Escolher ontem e 7 dias atrás; marcar, alterar valor, desfazer. | Cada ação salva no `date` escolhido, não em hoje. |
| CA06.2 | U + E | `src/domain/log/backfill-window.test.ts` · `e2e/f06-backfill.spec.ts` | Datas hoje-8, hoje-30 e amanhã. | Seletor não oferece as opções (desabilitadas ou ausentes); domínio rejeita as datas com erro tipado. |
| CA06.3 | U | `src/domain/streak/backfill.test.ts` | Sequência com buraco 3 dias atrás; registrar o dia. | `current` e `best` recalculados com o buraco fechado. |
| CA06.4 | U + E | `src/domain/log/note.test.ts` · `e2e/f06-note.spec.ts` | Nota com 140 e com 141 caracteres. | 140 salva e aparece no detalhe do dia; campo não aceita o 141º (`maxlength`) e mostra aviso; domínio rejeita 141. |

### F07 · Motor de sequência

Todos em `src/domain/streak/`, rodando nos **3 fusos** (`TZ=America/Sao_Paulo`, `Pacific/Auckland`, `UTC`). Cobertura de `domain/streak` ≥ 90% (critério de saída da Entrega 2).

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA07.1 | U | `streak.daily.test.ts` | Diária, feita nos 5 dias anteriores, hoje sem registro. | `current = 5`. Com registro hoje: `6`. |
| CA07.2 | U | `streak.rest-days.test.ts` | `restDaysPerWeek = 1`: falta 1 dia; depois falta 2 dias na mesma semana. | 1 falta: não quebra. 2 faltas: recomeça; `best` preservado. Faltas em semanas diferentes: cada semana consome a própria folga. |
| CA07.3 | U | `streak.weekdays.test.ts` | Seg/qua/sex; terças e quintas sem registro. | Dias não agendados não quebram nem somam. Registro num dia não agendado não soma. |
| CA07.4 | U | `streak.times-per-week.test.ts` | 3x/semana: semanas com 2, 3 e 4 registros; semana atual com 1 registro numa quinta. | Semana com ≥ 3 conta como cumprida; semana com 2 quebra; semana atual com 1 na quinta ainda não quebra (ainda dá para cumprir); no domingo com 1, quebra. |
| CA07.5 | U | `streak.created-on.test.ts` | Atividade criada numa quarta. | Seg e ter da semana não contam como perdidos nem como planejados. |
| CA07.6 | U `@tz` | `streak.timezone.test.ts` | Registros feitos em São Paulo, Auckland e UTC, às 23:30 e 00:30, e na troca de horário de verão. | Cada registro fica no `LocalDate` gravado; trocar `TZ` do processo não muda o resultado. |
| CA07.7 | P | `streak.property.test.ts` | fast-check com históricos aleatórios (≥ 1.000 casos) e adição de um registro qualquer. | `best' ≥ best` e `current' ≤ best'` sempre (INV03). |
| CA07.8 | E | `e2e/f07-restart.spec.ts` | Fixture com sequência que recomeçou. | Texto positivo do i18n (ex.: "Recomeçar também conta"); melhor sequência visível; passa no verificador de tom (INV10). |

### F08 · Estatísticas e calendário

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA08.1 | U + E | `src/domain/stats/completion-rate.test.ts` · `e2e/f08-progress.spec.ts` | Semana com 4 feitos de 5 planejados. | Domínio retorna `0.8`; tela mostra "80%". |
| CA08.2 | U | `src/domain/stats/completion-rate.test.ts` | Atividade pausada na 2ª metade do mês. | Planejados = só dias ativos. |
| CA08.3 | U + E `@axe` | `src/domain/stats/heatmap.test.ts` · `e2e/f08-heatmap.spec.ts` | Valores 0, 25%, 60%, 100% e 150% da meta; atividade check. | Níveis 0 a 3 conforme a regra; cada célula com rótulo acessível (ex.: "12 de outubro: 25 min"); zero violações axe. |
| CA08.4 | E `@perf` | `e2e/f08-perf.spec.ts` | Seed `history-2y.json`; abrir Progresso em `webkit-mobile` com CPU 4× lenta (CDP no Chromium). | Tela utilizável em < 1.000 ms (mediana de 5 execuções). |

### F09 · Resumo semanal

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA09.1 | U + E | `src/domain/stats/weekly-summary.test.ts` · `e2e/f09-summary.spec.ts` | 4 dias feitos de 5 planejados. | `{ done: 4, planned: 5 }`; texto "Você treinou 4 de 5 dias planejados". |
| CA09.2 | E | `e2e/f09-summary.spec.ts` | Semana com 0 dias feitos. | Mensagem de incentivo do i18n; passa no verificador de tom (INV10). |
| CA09.3 | U | `src/domain/stats/summary-dashboard-parity.test.ts` | Mesmas fixtures aleatórias (fast-check) no resumo e no Dashboard. | `done` e `planned` idênticos (INV06); ambos importam a mesma função. |

### F10 · Lembretes

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA10.1 | E | `e2e/f10-reminders.spec.ts` | `grantPermissions(['notifications'])`, `stubNotifications`, lembrete às 08:00, relógio às 07:59, `clock.runFor('00:02:00')`. | 1 chamada a `showNotification` com título do i18n. Vale para lembrete geral e por atividade. |
| CA10.2 | U + E | `src/domain/reminders/is-day-complete.test.ts` · `e2e/f10-reminders.spec.ts` | Todas as atividades feitas às 07:30; chega 08:00. | `isDayComplete = true`; zero chamadas a `showNotification`. |
| CA10.3 | U + E | `src/domain/reminders/one-per-day.test.ts` · `e2e/f10-reminders.spec.ts` | Tentar criar 2º lembrete na mesma atividade. | Domínio rejeita; UI não oferece um 2º horário. |
| CA10.4 | E | `e2e/f10-reminders.spec.ts` | Abrir configuração de lembretes na PWA. | Aviso de "pode não chegar com o app fechado" visível. |
| CA10.5 | E | `e2e/f10-permission-denied.spec.ts` | Contexto com notificação negada; abrir lembretes 3 vezes. | Instrução de como reativar visível; `Notification.requestPermission` chamado no máximo 1 vez no total. |
| CA10.6 | M | `reports/qa/evidencias/CA10.6.md` | 3 dias em iOS (PWA instalada) e Android. | Evidência por plataforma com dia, horário, recebido sim/não. |

### F11 · Exportação de dados

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA11.1 | I | `tests/integration/f11-export-json.test.ts` | Banco com atividades, regras versionadas, registros desfeitos e (após F14) desafios. | JSON valida no schema Zod de exportação; contém todos os itens, inclusive desfeitos; `schemaVersion` presente. Antes de F14: validar sem desafios (DV03). |
| CA11.2 | I | `tests/integration/f11-export-csv.test.ts` | Registros com acentos ("Caminhada leve", "joelho doído") e vírgulas na nota. | Cabeçalho data, atividade, valor, unidade, nota; 1 linha por registro; UTF-8 (com BOM, se for a decisão); acentos e aspas corretos ao parsear. |
| CA11.3 | I | `tests/integration/f11-roundtrip.test.ts` | Exportar `history-2y`, apagar o banco, importar. | Comparação **registro a registro** (`deepEqual` ordenado por `id`) com 100% de igualdade. |
| CA11.4 | I + P | `tests/integration/f11-merge.test.ts` | Banco e JSON com sobreposição parcial e `updatedAt` diferentes. | Merge por `id` + `updatedAt` (vence o mais novo); nenhum `id` existente some (INV13). |
| CA11.5 | I + E | `tests/integration/f11-import-invalid.test.ts` · `e2e/f11-import.spec.ts` | Cada `export-invalid-*.json`. | Erro mostrado ao usuário; banco **byte a byte igual** ao de antes (dump antes = depois). |

### F12 · Onboarding

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA12.1 | E | `e2e/f12-onboarding.spec.ts` | Primeiro acesso com banco vazio. | Exatamente 3 telas na ordem objetivo → atividades → lembrete. |
| CA12.2 | E | `e2e/f12-onboarding.spec.ts` | Selecionar 0 e depois 4 atividades. | Botão "Avançar" desabilitado (`aria-disabled`/`disabled`) com explicação visível e ligada ao botão. Com 1 a 3: habilitado. |
| CA12.3 | E | `e2e/f12-onboarding.spec.ts` | Passar pelo onboarding. | Bloco "grátis × premium" visível antes do último passo. |
| CA12.4 | E `@perf` | `e2e/f12-first-mark.spec.ts` | Concluir onboarding e marcar a 1ª atividade. | Atividades escolhidas na tela Hoje; da chegada na tela até a marcação salva < 5.000 ms. **Este é o E2E de saída da Entrega 3.** |
| CA12.5 | E | `e2e/f12-onboarding.spec.ts` | Concluir e recarregar / abrir nova aba. | Abre direto na tela Hoje. |
| CA12.6 | E | `e2e/f12-skip-reminder.spec.ts` | Pular a etapa de lembrete. | Tela Hoje funciona; lembrete configurável depois em Ajustes. |

### F13 · Dashboard

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA13.1 | E | `e2e/f13-dashboard.spec.ts` | Relógio numa quarta; abrir Dashboard. | Período = segunda a domingo da semana atual; "Semana" selecionado. |
| CA13.2 | U + E | `src/domain/dashboard/counts.test.ts` · `e2e/f13-dashboard.spec.ts` | Semana com 7 registros em 4 dias, 1 desfeito, 2 atividades. | "vezes" = registros não desfeitos; "dias ativos" = dias com ≥ 1; "taxa" = feitos ÷ planejados. |
| CA13.3 | U | `src/domain/dashboard/month-boundary.test.ts` | Semana de 29/09 a 05/10 com registros nos dois meses. | Cada registro conta só no mês da sua `date`; soma dos meses = total da semana. |
| CA13.4 | U + E | `src/domain/dashboard/area-series.test.ts` · `e2e/f13-chart.spec.ts` | Semana atual numa quarta; semana anterior com dados. | Série atual com 3 pontos (seg–qua) e `null` de qui–dom; série anterior completa e com estilo mais claro; eixo Y começa em 0. Mês: 28 a 31 pontos. |
| CA13.5 | E `@axe` | `e2e/f13-chart.spec.ts` | Hover/tap num ponto; ler a tabela acessível. | Tooltip com dia e número; tabela equivalente acessível (ex.: "Terça: 2 vezes") com os mesmos valores da série. |
| CA13.6 | E | `e2e/f13-navigation.spec.ts` | Voltar 3 semanas com ‹; tocar "voltar ao atual". | Volta ao período atual com 1 toque; ‹ › alternam semana e mês corretamente. |
| CA13.7 | E | `e2e/f13-dashboard.spec.ts` | Semana atual com menos vezes que a anterior. | Texto de comparação neutro/positivo; passa no verificador de tom (INV10). |
| CA13.8 | E | `e2e/f13-empty.spec.ts` | Período sem registros. | Estado vazio amigável; atalho leva à tela Hoje. |
| CA13.9 | E `@perf` | `e2e/f13-perf.spec.ts` | Seed `history-2y.json`. | Dashboard utilizável em < 1.000 ms (mediana de 5). Coberto por DV01 até a task existir. |

### F14 · Status do Corpo *(pendente)*

| CA | Nível | Arquivo | Cenário | Asserções |
|---|---|---|---|---|
| CA14.1 | M | `reports/qa/evidencias/CA14.1.md` | Pré-requisito. | Parecer do profissional de educação física registrado **antes** da 1ª task de código. Sem ele, todo o relatório de F14 é ⏸️. |
| CA14.2 | U + E | `src/domain/body/phase.test.ts` · `e2e/f14-phase5.spec.ts` | Seed `body-59-days`; registrar o 60º dia; reabrir a tela Hoje. | Fase muda para "Corpo preparado" exatamente no 60º; celebração aparece 1 vez e não reaparece após reload. Testar 59 → fase 4 e 60 → fase 5 em todos os marcos (1, 7, 21, 28, 60, 120, 180). |
| CA14.3 | U + E | `src/domain/body/phase.test.ts` · `e2e/f14-body.spec.ts` | Seed `body-60-low-pace`. | Fase 5 não atingida; tela mostra o ritmo que falta; passa no verificador de tom. |
| CA14.4 | P | `src/domain/body/phase.property.test.ts` | fast-check: sequências aleatórias de "passar dias", "registrar" e "desfazer registro de outro dia". | Fase nunca diminui (INV04). |
| CA14.5 | U + E | `src/domain/body/resume-mode.test.ts` · `e2e/f14-body.spec.ts` | Seed `body-inactive-14` (e 13 dias como controle). | 14+: mensagem de retomada e nenhuma sugestão de intensidade. 13: comportamento normal. |
| CA14.6 | U + E | `src/domain/body/suggestion.test.ts` · `e2e/f14-phase5.spec.ts` | Fase 5, ritmo ≥ 4; usuário só tem caminhada. | Oferece "atividade nova" com modelo de tipo que ele não tem e "desafio de 4 semanas"; aviso de saúde visível junto da sugestão. |
| CA14.7 | U + E | `src/domain/body/suggestion-cooldown.test.ts` · `e2e/f14-phase5.spec.ts` | Dispensar; avançar 27 e 28 dias. Desligar sugestões em Ajustes. | Dia 27: sem sugestão; dia 28: pode voltar. Desligado: sem sugestão e fases continuam visíveis. |
| CA14.8 | E | `e2e/f14-challenge.spec.ts` | Aceitar desafio; avançar 1 semana; terminar; escolher "voltar à meta anterior". | Tela Hoje mostra "Semana 2 de 4"; ao final, escolha aplicada; registros anteriores ao desafio iguais aos de antes. |
| CA14.9 | U | `src/domain/body/challenge.test.ts` | Desafio de 8 sessões com 6 feitas e prazo vencido. | Mensagem "Você fez 6 de 8 sessões"; tom positivo. |
| CA14.10 | E `@axe` + M | `e2e/f14-body.spec.ts` | Fase 4 com 32 dias faltando. | Região anunciada com "Fase 4 de 7, Hábito começando. Faltam 32 dias ativos para a próxima fase."; zero violações axe. Manual: VoiceOver/TalkBack. |
| CA14.11 | E + M | `e2e/f14-texts.spec.ts` · `src/i18n/body-texts.test.ts` | Percorrer as 7 fases. | Cada texto sobre o corpo tem link de fonte válido (R1–R8) e contém linguagem de possibilidade ("costuma", "em geral", "pode"); nenhuma palavra de promessa (INV10). |

---

## 5. Invariantes das regras de negócio

Estes testes **não pertencem a uma feature**: rodam em toda execução do agente e protegem o núcleo do produto. Se qualquer um falhar, o veredito é ❌ Reprovada, mesmo que todos os CAs passem.

| ID | Invariante | Nível | Como é provado |
|---|---|---|---|
| **INV01** | Nenhuma ação do usuário apaga histórico. | P + I | fast-check gera sequências de marcar, desfazer, editar, pausar, arquivar, reativar e importar sobre fake-indexeddb. `count(logs)` nunca diminui; todo `id` gravado continua existindo. |
| **INV02** | Registro com `deletedAt` não conta em nada. | P | Para qualquer histórico, adicionar `deletedAt` a um registro produz o mesmo resultado que removê-lo, em `computeStreak`, `completionRate`, `weeklySummary`, contagens do Dashboard, `monthHeatmap`, `isDayComplete` e fases do corpo. |
| **INV03** | Sequência: `best` nunca diminui ao adicionar registro e `current ≤ best`. | P | CA07.7. |
| **INV04** | Fase do Status do Corpo nunca regride. | P | CA14.4. |
| **INV05** | O domínio é puro e determinístico. | U + lint | Mesmo input → mesmo output (2 chamadas iguais). Teste que falha se `src/domain` contém `new Date()`, `Date.now`, `window`, `localStorage`, `dexie` ou `react` (busca no código + regra de fronteira do ESLint). |
| **INV06** | Resumo semanal e Dashboard concordam. | P | CA09.3. |
| **INV07** | Mudar a frequência não reescreve o passado. | P | Para qualquer histórico e qualquer nova regra com `validFrom = d`, todo resultado de domínio para datas `< d` é idêntico antes e depois. |
| **INV08** | O `LocalDate` de um registro nunca muda depois de salvo. | U `@tz` | Rodar a suíte com os 3 valores de `TZ`; ler, migrar, exportar e importar não alteram `date`. |
| **INV09** | "Planejado" exclui dias antes de `createdOn`, pausados, arquivados e não agendados. | P | Para qualquer atividade e intervalo, `planned ≤ dias agendados e ativos no intervalo` e `done ≤` registros não desfeitos. Taxa sempre em `[0, 1]` para `planned > 0` e definida (sem `NaN`) para `planned = 0`. |
| **INV10** | Nenhum texto com culpa, punição ou promessa (5.2). | U | `src/i18n/tone.test.ts` varre **todas** as strings pt-BR. Falha se encontrar termos proibidos (lista em `tests/fixtures/forbidden-terms.json`: "falhou", "fracass", "perdeu", "de novo?", "você não", "vergonha", "preguiç", "garant", "com certeza vai", "emagrecer em", entre outros). Textos de sugestão de intensidade exigem a chave do aviso de saúde no mesmo componente. |
| **INV11** | Nenhuma string fixa em componente. | lint + U | Regra `i18next/no-literal-string` bloqueante; teste que confere que toda chave usada existe em pt-BR. |
| **INV12** | Nenhum dado pessoal ou conteúdo de registro sai do dispositivo. | E | Em todo spec E2E, `page.on('request')` registra as requisições. Falha se houver requisição fora da origem, exceto o endpoint de analytics aprovado, e se o corpo dele contiver nome de atividade, nota ou valor de registro. |
| **INV13** | Importação mescla, não sobrescreve. | P | CA11.4 com fast-check: para quaisquer banco A e arquivo B, `ids(A) ∪ ids(B) = ids(resultado)` e, para cada `id`, vence o maior `updatedAt`. |
| **INV14** | Valores calculados não são persistidos. | I | Depois de qualquer fluxo, o banco não contém campos de sequência, taxa ou fase além dos marcos alcançados e celebrações já exibidas. |

---

## 6. Fluxos E2E críticos (product 7.2)

Cada fluxo é um spec próprio, roda nos 3 projetos do Playwright e termina com `expectNoA11yViolations` e `expectTouchTargets` em cada tela visitada.

| Fluxo | Spec | Cobre |
|---|---|---|
| Onboarding completo → primeira atividade → primeira marcação | `e2e/flows/first-run.spec.ts` | CA12.1–CA12.5, CA03.6, CA05.2, critério de saída da Entrega 3 |
| Usuário novo **offline** cria atividade e marca em < 5 s | `e2e/flows/offline-first-run.spec.ts` | CA01.1, CA02.1, CA03.1, CA05.2, critério de saída da Entrega 1 |
| Marcar, desfazer e registrar dia passado | `e2e/flows/mark-undo-backfill.spec.ts` | CA05.2–CA05.4, CA06.1, CA06.3 |
| Configurar lembrete e receber notificação | `e2e/flows/reminder.spec.ts` | CA10.1, CA10.2, CA10.4 |
| Pausar e arquivar mantendo histórico | `e2e/flows/lifecycle.spec.ts` | CA04.1–CA04.5 |
| Marcar e ver o Dashboard refletir semana e mês; navegar entre períodos | `e2e/flows/dashboard.spec.ts` | CA13.1–CA13.6 |
| Atingir a fase 5 (fixture), ver a sugestão, aceitar o desafio e vê-lo na tela Hoje; dispensar | `e2e/flows/body-phase5.spec.ts` | CA14.2, CA14.6–CA14.8 |
| Exportar, apagar os dados e importar | `e2e/flows/export-roundtrip.spec.ts` | CA11.1, CA11.3, CA11.5 |

---

## 7. Não funcionais

| Requisito | Teste | Limite |
|---|---|---|
| Acessibilidade WCAG 2.1 AA | `expectNoA11yViolations` em toda rota × tema × projeto | 0 violações |
| Alvos de toque | `expectTouchTargets` em toda rota no `webkit-mobile` | ≥ 44×44 px |
| Teclado | `e2e/nfr-keyboard.spec.ts`: percorrer cada tela só com `Tab`/`Enter`/`Espaço`/`Esc` e concluir a ação principal | Ação concluída, foco sempre visível, sem armadilha de foco |
| Responsividade | Specs no viewport 320 px | Sem rolagem horizontal (`scrollWidth ≤ clientWidth`) |
| Performance | CA05.1, CA08.4, CA13.9 com `history-2y.json` | < 1 s |
| PWA / bundle | CA01.6 | Lighthouse CI verde (LCP, JS) e E2E de instalabilidade verde (DV05) |
| Cobertura | `pnpm test --coverage` | `domain/` ≥ 90% linhas e ramos; `domain/streak` ≥ 90% |
| Privacidade | INV12 + teste de "Excluir meus dados" (IndexedDB, caches e SW removidos) | Nada sai do dispositivo; nada sobra após excluir |

---

## 8. Procedimento de execução do agente

### 8.1 Passo a passo

1. **Escopo.** A partir do comando (seção 2), listar os CAs na matriz de `run.md` §7, os CAs de "Revalidar quando" e os fluxos E2E da seção 6 que tocam a feature.
2. **Cobertura por ID.** Para cada CA do escopo, confirmar que existe teste com o ID no título:
   ```bash
   for ca in CA13.1 CA13.2 …; do grep -rqs "$ca ·" src tests e2e || echo "SEM TESTE: $ca"; done
   ```
   CA sem teste = ❌ automaticamente.
3. **Revisão do "então".** Ler cada critério e o teste lado a lado e conferir as asserções da seção 4. Teste que só verifica renderização, usa snapshot como única prova ou não tem `expect` para cada parte do "então" = ❌ "cobertura insuficiente".
4. **Higiene.** Falhar se houver `.only`, `.skip`, `test.fixme`, `it.todo` no escopo, ou se limites de cobertura, orçamentos ou regras do axe foram afrouxados no diff:
   ```bash
   grep -rnE '\.(only|skip)\(|test\.fixme|it\.todo' src tests e2e
   ```
5. **Rodar a suíte** com saída em JSON para o relatório:
   ```bash
   mkdir -p reports/qa/raw
   pnpm lint && pnpm typecheck
   pnpm vitest run --coverage --reporter=default --reporter=json --outputFile=reports/qa/raw/unit.json
   for tz in America/Sao_Paulo Pacific/Auckland UTC; do
     TZ=$tz pnpm vitest run --reporter=json --outputFile=reports/qa/raw/unit-$tz.json
   done
   pnpm build
   PLAYWRIGHT_JSON_OUTPUT_NAME=reports/qa/raw/e2e.json pnpm playwright test --reporter=list,json
   pnpm lhci   # quando a feature mexe em PWA, bundle ou performance
   ```
   No escopo `task`, pode filtrar por ID (`-t "CA05"` / `--grep "CA05|INV"`), mas os **invariantes rodam sempre** e o escopo `feature`/`entrega` roda tudo.
6. **Consolidar por CA.** Agrupar os resultados pelo prefixo `CAxx.y` / `INVxx` do título. Um CA só é ✅ se **todos** os seus testes passaram em **todos** os projetos e fusos.
   ```bash
   jq -r '.testResults[].assertionResults[] | "\(.title)\t\(.status)"' reports/qa/raw/unit.json
   jq -r '.. | objects | select(.title? and .tests?) | .title as $t | .tests[] | "\($t)\t\(.projectName)\t\(.results[-1].status)\t\(.results | length)"' reports/qa/raw/e2e.json
   ```
   Teste que passou só no retry entra como **flaky**.
7. **Princípios e Definição de Pronto.** Conferir os blocos C e D de `run.md` §3 Passo 5 com base nos resultados de INV10, INV11, INV12, axe, offline e migração.
8. **Manuais.** Para cada CA *(manual)* do escopo, procurar a evidência em `reports/qa/evidencias/`. Sem evidência = 🟡.
9. **Veredito** (seção 8.2), **relatório** (seção 9) e atualização da matriz em `run.md` §7 e do registro em `run.md` §9.

### 8.2 Regras do veredito

| Veredito | Condição |
|---|---|
| ✅ **Aprovada** | Todos os CAs do escopo ✅ (inclusive manuais com evidência), todos os invariantes verdes, nenhuma regressão, Definição de Pronto completa, nenhum flaky. |
| 🟡 **Aprovada com pendência** | Tudo verde, mas há CA 🟡 só por tasks de outras features ainda abertas, evidência manual pendente ou divergência registrada aguardando decisão de produto. **Não fecha a feature** (run.md §4), mas permite fechar a task. |
| ❌ **Reprovada** | Qualquer CA ❌, qualquer invariante falhando, regressão em CA já ✅, violação de 5.2, cobertura abaixo do limite, axe com violação, `.only`/`.skip` no escopo ou teste flaky em CA de regra de negócio. |
| ⏸️ **Bloqueada** | Pré-requisito não cumprido (ex.: CA14.1) ou ambiente impede a execução (build quebrado, dependência fora do ar). |

A severidade de cada falha no relatório:

| Severidade | Quando |
|---|---|
| **S1 · Crítica** | Perda ou alteração de histórico, sequência ou fase errada, registro no dia errado, dado saindo do dispositivo (INV01–INV09, INV12–INV14). |
| **S2 · Alta** | CA de feature falhando, regressão, violação de 5.2, falha de acessibilidade que bloqueia a tarefa. |
| **S3 · Média** | Performance acima do limite, flaky, cobertura insuficiente de um "então". |
| **S4 · Baixa** | Evidência manual pendente, ajuste de texto sem violar 5.2. |

---

## 9. Relatório de sucesso/falha

Salvo em `reports/qa/<AAAA-MM-DD>-<escopo>.md` (ex.: `reports/qa/2026-10-22-F13.md`) e com resumo de uma linha no registro de `run.md` §9. Os JSON brutos ficam em `reports/qa/raw/` e o relatório HTML do Playwright em `playwright-report/`.

### Modelo

```markdown
# Relatório de QA · <Fxx ou Entrega N> · <nome da feature>

> Data: <AAAA-MM-DD HH:mm> · Commit: <sha curto> · Escopo: <task | feature | entrega | regressão>
> Ambiente: Node <versão> · Chromium <versão> · WebKit <versão> · Fusos: São Paulo, Auckland, UTC

## Veredito: ✅ Aprovada | 🟡 Aprovada com pendência | ❌ Reprovada | ⏸️ Bloqueada

<Uma a três frases: o que foi testado, o resultado e o que impede a aprovação, se houver.>

| Indicador | Resultado |
|---|---|
| Critérios de aceite | <n> ✅ · <n> 🟡 · <n> ❌ de <total> |
| Invariantes de negócio | <n>/14 verdes |
| Testes executados | <n> unitários · <n> integração · <n> E2E (× 3 projetos) |
| Falhas | <n> (S1: <n> · S2: <n> · S3: <n> · S4: <n>) |
| Flaky | <n> |
| Cobertura `domain/` | <xx>% linhas · <xx>% ramos (limite 90%) |
| Regressões | <n> CAs que estavam ✅ |
| Duração | <mm:ss> |

## 1. Pipeline

| Etapa | Resultado | Detalhe |
|---|---|---|
| Lint e fronteiras | ✅ / ❌ | |
| Typecheck | ✅ / ❌ | |
| Unitários + cobertura | ✅ / ❌ | <n> testes, <xx>% |
| Unitários · America/Sao_Paulo | ✅ / ❌ | |
| Unitários · Pacific/Auckland | ✅ / ❌ | |
| Unitários · UTC | ✅ / ❌ | |
| Build | ✅ / ❌ | JS inicial <n> KB gzip |
| E2E · chromium-desktop | ✅ / ❌ | |
| E2E · webkit-mobile (320px) | ✅ / ❌ | |
| E2E · chromium-android | ✅ / ❌ | |
| Axe | ✅ / ❌ | <n> violações |
| Lighthouse | ✅ / ❌ / n/a | PWA · LCP <n> ms |

## 2. Critérios de aceite

| CA | Critério (resumo) | Testes | U | I | E | Resultado | Observação |
|---|---|---|---|---|---|---|---|
| CA13.1 | Abre na semana atual (seg–dom) | 2 | — | — | ✅ | ✅ | |
| CA13.4 | Gráfico para em hoje e sobrepõe anterior | 4 | ✅ | — | ❌ webkit | ❌ | ver F-01 |
| CA13.9 | Dashboard < 1 s com 2 anos | 1 | — | — | 🟡 | 🟡 | DV01 aberta |

## 3. Invariantes de negócio

| ID | Invariante | Casos gerados | Resultado | Contraexemplo |
|---|---|---|---|---|
| INV01 | Nenhuma ação apaga histórico | 1.000 | ✅ | — |
| INV03 | `best` nunca diminui | 1.000 | ✅ | — |

## 4. Falhas

### F-01 · S2 · CA13.4 · Área de quinta aparece em WebKit
- **Teste:** `e2e/f13-chart.spec.ts:42` · projeto `webkit-mobile`
- **Critério:** "nenhuma área de quinta a domingo"
- **Esperado:** série atual `null` após quarta
- **Obtido:** ponto em quinta com valor 0
- **Reproduzir:** `pnpm playwright test e2e/f13-chart.spec.ts --project=webkit-mobile -g "CA13.4"`
- **Evidência:** `playwright-report/…/trace.zip` · screenshot
- **Provável origem:** <arquivo:linha, se identificado> · **Responsável:** task <Txx.y>

## 5. Regressão

| CA | Feature | Estava | Agora | Causa provável |
|---|---|---|---|---|
| — | | | | |

## 6. Princípios do produto (5.2) e Definição de Pronto (4.9.1)

| Item | Resultado | Evidência |
|---|---|---|
| Sem texto de culpa, punição ou promessa (INV10) | ✅ / ❌ | <n> strings varridas |
| Nenhuma ação apaga histórico (INV01) | ✅ / ❌ | |
| Nada sai do dispositivo (INV12) | ✅ / ❌ | <n> requisições externas |
| Textos no i18n pt-BR, temas claro e escuro (INV11, CA01.4) | ✅ / ❌ | |
| Offline em Chromium e WebKit, 320px e desktop | ✅ / ❌ | |
| Axe 0 violações, alvos ≥ 44px, teclado | ✅ / ❌ | |
| Regras em `domain/` com cobertura ≥ 90% | ✅ / ❌ | |
| Schema alterado: migração, snapshot e fixture | ✅ / ❌ / n/a | |
| Demo no preview aprovada pelo produto | ✅ / 🟡 | manual |

## 7. Pendências manuais

| CA | O que falta | Onde registrar |
|---|---|---|
| CA05.7 | Teste com 5 usuários | `reports/qa/evidencias/CA05.7.md` |

## 8. Flaky

| Teste | Projeto | Tentativas | Ação |
|---|---|---|---|
| — | | | |

## 9. Recomendações e próximos passos

- <correções obrigatórias para aprovar, em ordem de severidade>
- <novas tasks ou divergências propostas (run.md §6)>
```

### Linha para o registro de `run.md` §9

```markdown
**QA (qa.md):** ❌ Reprovada · 8/9 CAs ✅ · 14/14 INV · 1 falha S2 (CA13.4 WebKit) · relatório: reports/qa/2026-10-22-F13.md
```

---

## 10. Checklist rápido do agente

- [ ] Todo CA do escopo tem teste com o ID no título.
- [ ] Cada teste verifica todas as partes do "então".
- [ ] Nenhum `.only`, `.skip`, `fixme`, `todo`; nenhum limite afrouxado.
- [ ] Suíte completa verde nos 3 fusos e nos 3 projetos do Playwright.
- [ ] 14/14 invariantes verdes.
- [ ] Axe 0, alvos ≥ 44px, offline, 320px.
- [ ] Nenhuma regressão em CA já ✅.
- [ ] Manuais com evidência ou marcados 🟡.
- [ ] Relatório salvo em `reports/qa/`, matriz de `run.md` §7 e registro §9 atualizados.
