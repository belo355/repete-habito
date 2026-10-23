# Repete Hábito — Especificação Técnica (MVP)

> Versão 0.1 · 22/10/2026 · Status: proposta
> Referência de produto: [product.md](product.md)

## 1. Resumo das decisões

| Tema | Decisão |
|---|---|
| Tipo de app | **Somente frontend**. Sem backend próprio no MVP; todas as regras de negócio e cálculos rodam no cliente. |
| Entrega | **PWA** instalável e offline-first. |
| Lojas (depois) | O mesmo código encapsulado com **Capacitor** para iOS e Android. |
| Linguagem | **TypeScript** em modo `strict`. |
| UI | **React** (19+) com Vite. |
| Dados | **IndexedDB** via **Dexie**, atrás de uma camada de repositório. |
| Regras de negócio | Módulo de domínio em TypeScript puro, sem React e sem I/O, com testes unitários. |

Princípio: **o que for regra de negócio não conhece React, banco ou plataforma.** Isso mantém os cálculos testáveis e permite trocar o armazenamento ou o empacotamento (web → Capacitor) sem reescrever o produto.

## 2. Stack

### 2.1 Base

| Camada | Tecnologia | Motivo |
|---|---|---|
| Runtime de dev | Node.js LTS + **pnpm** | Instalações rápidas e lockfile determinístico. |
| Build | **Vite** | Dev server rápido, build estático, ecossistema de PWA maduro. |
| Framework | **React 19+** | Requisito do projeto. |
| Linguagem | **TypeScript** (`strict`, `noUncheckedIndexedAccess`) | Segurança nos cálculos de data e sequência. |
| Roteamento | **React Router** (modo SPA) | Poucas rotas, sem necessidade de SSR. |
| Estado de UI | **Zustand** | Estado leve (tema, onboarding, preferências). Dados persistidos ficam no IndexedDB, não no store. |
| Leitura reativa de dados | `useLiveQuery` (**dexie-react-hooks**) | A tela "Hoje" atualiza sozinha ao marcar uma atividade. |
| Formulários | **React Hook Form** + **Zod** | O mesmo schema Zod valida formulário, importação e migração. |
| Datas | **date-fns** + **@date-fns/tz** | Funções puras e tree-shakeable. Reavaliar `Temporal` quando o suporte nativo estiver em todos os navegadores-alvo. |
| i18n | **i18next** + **react-i18next** | pt-BR no MVP, preparado para outros idiomas. |
| Estilo | **Tailwind CSS v4** com tokens em variáveis CSS | Tema claro/escuro por variáveis, sem CSS-in-JS em runtime. |
| Componentes acessíveis | **Radix UI Primitives** | Dialog, menus, switches e afins já acessíveis (teclado, ARIA, foco). |
| Ícones | **Lucide** | Leve, tree-shakeable, bom para ícones de atividade. |
| Gráficos / heatmap | **SVG próprio** | O heatmap mensal é simples; evita uma biblioteca pesada. |

### 2.2 PWA

| Item | Tecnologia / decisão |
|---|---|
| Service worker | **vite-plugin-pwa** (Workbox), estratégia `generateSW` com precache do app shell. |
| Atualização | `registerType: 'prompt'`: avisar "Nova versão disponível" e recarregar só com o aceite do usuário, para não perder um registro no meio da marcação. |
| Manifest | Nome, ícones (incluindo maskable), `display: standalone`, `theme_color` para os dois temas, `lang: pt-BR`. |
| Persistência | Chamar `navigator.storage.persist()` após o onboarding para reduzir o risco de o navegador apagar os dados. |
| Instalação | Prompt próprio de "Instalar app" no Android/desktop; instrução visual de "Adicionar à Tela de Início" no iOS. |

### 2.3 Encapsulamento para lojas (pós-MVP)

| Item | Decisão |
|---|---|
| Wrapper | **Capacitor**: reaproveita o build do Vite, roda em iOS e Android e dá acesso a plugins nativos. |
| Por que não TWA | TWA (Bubblewrap) só atende a Play Store. O iOS exige wrapper nativo, e a Apple rejeita apps que são "só um site" (guideline 4.2); plugins nativos (notificações locais, haptics) ajudam a passar na revisão. |
| Plugins previstos | `@capacitor/local-notifications` (lembretes), `@capacitor/haptics`, `@capacitor/share` / `@capacitor/filesystem` (exportação), `@capacitor/app` (ciclo de vida). |
| Armazenamento no app nativo | Começar com IndexedDB no WebView. Se houver perda de dados em testes, trocar o adaptador para SQLite (`@capacitor-community/sqlite`) sem mexer no domínio (ver seção 3). |

## 3. Arquitetura

```
src/
  domain/          # Regras de negócio puras (sem React, sem Dexie, sem window)
    activity/      # Entidades, validação, frequência
    streak/        # Motor de sequência (F07)
    stats/         # Taxa de conclusão, resumo semanal, heatmap (F08, F09)
    date/          # LocalDate, virada de dia, fuso
  data/            # Persistência
    db.ts          # Schema Dexie e migrações versionadas
    repositories/  # ActivityRepository, LogRepository (interfaces + impl. Dexie)
    export/        # Exportar/importar JSON e CSV (F11)
  platform/        # Adaptadores de plataforma (web vs. Capacitor)
    notifications/ # NotificationScheduler: WebScheduler, CapacitorScheduler
    storage/       # persist(), estimativa de quota
    share/
  features/        # Telas e fluxos (today, activities, progress, onboarding, settings)
  ui/              # Componentes de design system, tokens, tema
  i18n/            # Recursos pt-BR
  app/             # Rotas, providers, bootstrap, registro do service worker
```

Regras de dependência (verificadas por lint com `eslint-plugin-boundaries` ou `dependency-cruiser`):

- `domain` não importa nada de fora de `domain`.
- `data` e `platform` importam `domain`, nunca `features`.
- `features` usa `domain`, `data` e `platform` apenas pelas interfaces.

### 3.1 Modelo de dados

```ts
type LocalDate = string; // "AAAA-MM-DD" no fuso do usuário no momento do registro

interface Activity {
  id: string;                 // UUID v7 (ordenável, seguro para merge futuro)
  name: string;
  icon: string;
  color: string;
  kind: 'check' | 'duration' | 'quantity';
  unit?: 'min' | 'reps' | 'km' | 'steps';
  goal?: number;
  schedule: FrequencyRule[];  // Histórico de regras com vigência (validFrom)
  restDaysPerWeek: number;    // Dias de folga que não quebram a sequência
  status: 'active' | 'paused' | 'archived';
  createdOn: LocalDate;
  updatedAt: number;          // epoch ms, para merge futuro
}

type FrequencyRule =
  | { validFrom: LocalDate; type: 'daily' }
  | { validFrom: LocalDate; type: 'weekdays'; days: number[] }   // 0–6
  | { validFrom: LocalDate; type: 'timesPerWeek'; times: number };

interface LogEntry {
  id: string;                 // UUID v7
  activityId: string;
  date: LocalDate;            // Dia a que o registro pertence (não o instante)
  value: number;              // 1 para check; minutos ou quantidade para os demais
  note?: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;         // Desfazer = soft delete (tombstone), nunca apagar
}
```

Decisões que evitam dívida técnica desde o início:

- **Registros usam `LocalDate`, não timestamp.** O dia de um registro é fixado no momento em que ele é feito, então viagem, fuso e horário de verão não movem registros antigos de dia.
- **Frequência versionada (`validFrom`).** Mudar de "todo dia" para "3x por semana" não reescreve o passado (cobre o teste "edição de frequência não recalcula o histórico").
- **Soft delete + `updatedAt` + UUID v7.** Desfazer não perde dado, e os registros já estão prontos para um merge sem conflitos quando houver sync.
- **Valores calculados não são persistidos.** Sequência e taxas são derivadas dos registros a cada leitura (com memoização). Sem cache, não há o que ficar inconsistente.

### 3.2 Domínio: cálculos no frontend

Todos os cálculos são funções puras, determinísticas e com `today: LocalDate` recebido como parâmetro (nunca `new Date()` dentro do domínio):

```ts
computeStreak(activity, logs, today): { current: number; best: number }
completionRate(activities, logs, range): number
weeklySummary(activities, logs, weekOf): { done: number; planned: number }
monthHeatmap(activity, logs, month): Array<{ date: LocalDate; level: 0 | 1 | 2 | 3 }>
isDayComplete(activities, logs, today): boolean   // usado para silenciar o lembrete
```

Performance: com 2 anos de histórico (~3.650 registros para 5 atividades), o cálculo direto é de poucos milissegundos. Se a tela "Hoje" passar de 1 s em aparelhos modestos, mover os cálculos para um **Web Worker** (via Comlink) sem alterar as assinaturas.

### 3.3 Migrações

- Cada versão do schema Dexie tem um `upgrade()` explícito e um teste de migração a partir de um banco "fixture" da versão anterior.
- Antes de migrar, o app guarda um **snapshot JSON automático** do banco anterior (backup local para recuperar uma migração com erro).

### 3.4 Lembretes (ponto de atenção)

Sem backend não há Web Push (que exige servidor). Então, numa PWA pura:

| Ambiente | Comportamento possível |
|---|---|
| PWA com app aberto | Notificação local via service worker no horário (`setTimeout` + `showNotification`). |
| PWA com app fechado | **Não garantido.** Periodic Background Sync só existe no Chrome/Android, sem horário exato. No iOS não existe. |
| App Capacitor | **Confiável** com `@capacitor/local-notifications`, agendado no sistema operacional. |

Decisão: a interface `NotificationScheduler` fica em `platform/` com duas implementações. Na PWA, o lembrete é **best effort** e a UI diz isso ao usuário. Os lembretes confiáveis chegam com o app de loja. Isso confirma o risco já listado no product.md ("Notificações não confiáveis em PWA") e torna o Capacitor o caminho natural para F10.

## 4. Qualidade e testes

| Tipo | Ferramenta | Escopo |
|---|---|---|
| Unitário | **Vitest** | `domain/` com cobertura ≥ 90% (gate no CI). Datas com `vi.setSystemTime` e testes parametrizados por fuso (`TZ=America/Sao_Paulo`, `TZ=Pacific/Auckland`, `TZ=UTC`). |
| Propriedade | **fast-check** | Invariantes do motor de sequência (ex.: adicionar um registro nunca diminui a melhor sequência). |
| Componente / integração | **Vitest** + **Testing Library** + **fake-indexeddb** | Repositórios, migrações, exportação/importação ida e volta. |
| E2E | **Playwright** (Chromium, WebKit, viewport mobile) | Fluxos críticos da seção 7.2 do produto, incluindo modo offline (`context.setOffline`). |
| Acessibilidade | **@axe-core/playwright** + revisão manual (VoiceOver / TalkBack) | WCAG 2.1 AA. |
| PWA / performance | **Lighthouse CI** | Orçamentos: PWA instalável, LCP < 2,5 s em 4G simulado, JS inicial < 200 KB gzip. |
| Lint / formatação | **ESLint** (flat config, typescript-eslint, jsx-a11y, regras de fronteira) + **Prettier** | Bloqueante no CI. |
| Tipos | `tsc --noEmit` | Bloqueante no CI. |

## 5. Infraestrutura

- **Hospedagem:** site estático (Netlify ou Vercel) com HTTPS e preview por PR. Sem provedor definido por enquanto (ver seção 8).
- **CI:** GitHub Actions com lint → typecheck → unit → build → e2e → Lighthouse.
- **Dependências:** Renovate com agrupamento semanal e auto-merge para patches com CI verde.
- **Erros em produção:** Sentry (ou equivalente) **sem dados pessoais e sem conteúdo dos registros**, com opt-in.
- **Métricas de produto (seção 6 do product.md):** analytics sem cookies e sem PII (ex.: Plausible ou Umami), apenas eventos agregados (`activity_created`, `log_marked`). Decisão final pendente (ver seção 7).

## 6. Privacidade e LGPD

- Todos os dados ficam **no dispositivo**. Nada de saúde é enviado a servidor.
- "Excluir meus dados" apaga o banco IndexedDB, caches e o service worker.
- Exportação JSON/CSV disponível a qualquer momento (portabilidade).
- "Criptografia em trânsito" (seção 7.2 do produto) só se aplica quando houver sync. No MVP não há tráfego de dados do usuário.

## 7. Registro de dívida técnica assumida

Itens que a escolha "somente frontend" cria ou que precisam de atenção desde o início. Pontuação: **Prioridade = (Impacto + Risco) × (6 − Esforço)**, cada eixo de 1 a 5.

| # | Item | Categoria | Impacto | Risco | Esforço | Prioridade | Justificativa de negócio |
|---|---|---|---|---|---|---|---|
| D1 | Datas e fuso: usar `LocalDate` e `today` injetado desde o 1º commit | Código | 3 | 5 | 1 | **40** | Erro de virada de dia quebra sequências, o núcleo do produto. Barato de fazer certo agora, caro de corrigir com dados reais. |
| D2 | Navegador apagar o IndexedDB (eviction; iOS limpa sites não instalados após ~7 dias sem uso) | Arquitetura | 2 | 5 | 2 | **28** | Meta de 0 perdas de dados. Mitigar com `storage.persist()`, incentivo à instalação e lembrete de backup. |
| D3 | Migrações de schema sem teste | Teste | 3 | 4 | 2 | **28** | Uma migração com erro apaga histórico de todos os usuários de uma vez. |
| D4 | Lembretes não confiáveis na PWA (sem backend para Web Push) | Arquitetura | 4 | 5 | 3 | **27** | Lembrete é feature Must (F10) e ligada à retenção. Solução definitiva: app Capacitor. |
| D5 | Atualização de dependências sem automação | Dependências | 2 | 3 | 1 | **25** | Evita acumular saltos de versão grandes (React, Vite, Workbox). |
| D6 | Métricas de sucesso sem coleta (sem backend) | Infraestrutura | 2 | 3 | 2 | **20** | Sem dados não dá para validar D7/D30 nem o A/B de sequência tolerante. |
| D7 | Sem sync nem backup em nuvem | Arquitetura | 3 | 5 | 4 | **16** | Troca de celular = perda de histórico se o usuário não exportou. Mitigar com exportar/importar e modelo pronto para merge. |
| D8 | Premium sem validação de compra no servidor | Arquitetura | 2 | 3 | 4 | **10** | Na web, desbloqueio local pode ser burlado. Resolver com compras nativas na loja (StoreKit / Play Billing, ex.: via RevenueCat). |

### 7.1 Plano de tratamento junto às entregas

| Entrega do produto | Tratamento de dívida |
|---|---|
| **Entrega 1** (F01, F02, F03, F05) | D1, D3 e D5: `LocalDate` e relógio injetado; migração versionada com teste; Renovate e CI completos. Iniciar D2 com `storage.persist()`. |
| **Entrega 2** (F07, F04, F10) | D4: `NotificationScheduler` com adaptador web best effort e aviso na UI. Testar cedo no iOS. |
| **Entrega 3** (F12, F08, F09) | D6: escolher e instrumentar analytics sem PII antes do beta fechado. D2: tela de instalação no onboarding. |
| **Entrega 4** (F06, F11) | D7 (parcial): exportar/importar com teste de ida e volta e lembrete periódico de backup. |
| **Pós-MVP** | D4 e D8: app Capacitor com notificações locais e compras nativas. D7: avaliar sync (ex.: backend leve ou serviço gerenciado) usando o merge por `id` + `updatedAt`. |

## 8. Decisões em aberto

1. Ferramenta de analytics (Plausible, Umami ou nenhuma até o beta).
2. Momento de iniciar o app Capacitor: logo após o MVP ou só se os lembretes na PWA se mostrarem bloqueantes no beta.
3. Forma de cobrança do premium na versão web (se houver) antes das lojas.
4. Necessidade de sync entre dispositivos: os testes de sync da seção 7.2 do product.md ficam **fora do MVP** enquanto não houver backend.
5. Provedor de hospedagem e preview por PR. Em 23/10/2026 o deploy no Cloudflare Pages foi retirado do projeto por decisão do responsável; até outra escolha, o CI não publica o app (ver divergência DV04 em run.md §6.2).
