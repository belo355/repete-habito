# Repete Hábito

PWA offline-first para acompanhar atividades físicas. Somente frontend: React 19 + Vite + TypeScript.

Documentação do produto e do processo em `.claude/skills/`: `product.md` (o quê), `tech-spec.md` (como), `tasks.md` (o que falta), `run.md` (processo) e `qa.md` (validação).

## Requisitos

- Node.js LTS (versão em `.nvmrc`)
- pnpm (versão em `packageManager` do `package.json`)

## Comandos

| Comando                             | O que faz                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm install`                      | Instala as dependências.                                                                                                                         |
| `pnpm dev`                          | Servidor de desenvolvimento.                                                                                                                     |
| `pnpm lint`                         | ESLint, incluindo as fronteiras de arquitetura (tech-spec §3).                                                                                   |
| `pnpm format` / `pnpm format:check` | Prettier.                                                                                                                                        |
| `pnpm typecheck`                    | `tsc --noEmit` do app e dos arquivos de config/teste.                                                                                            |
| `pnpm test`                         | Vitest. Com `--coverage`, aplica o gate de 90% em `src/domain/**`.                                                                               |
| `pnpm test:tz`                      | Vitest nos fusos `America/Sao_Paulo`, `Pacific/Auckland` e `UTC`.                                                                                |
| `pnpm build` / `pnpm preview`       | Build de produção e servidor local do build.                                                                                                     |
| `pnpm e2e`                          | Playwright (chromium-desktop, webkit-mobile, chromium-android) + axe, contra o build. Na 1ª vez: `pnpm exec playwright install chromium webkit`. |
| `pnpm lhci`                         | Lighthouse CI sobre `dist/` (LCP < 2,5 s, JS < 200 KB gzip). Rode `pnpm build` antes.                                                            |

## Estrutura

```
src/
  domain/     regras de negócio puras (sem React, sem I/O)
  data/       persistência (Dexie, repositórios, exportação)
  platform/   adaptadores web/Capacitor (notificações, storage, share)
  features/   telas e fluxos
  ui/         design system
  i18n/       textos pt-BR
  app/        bootstrap, rotas, providers
tests/        unitários de suporte, integração e fixtures
e2e/          Playwright
```

## Acompanhar o QA

O agente de QA (`.claude/agents/qa.md`) registra cada etapa da validação em `reports/qa/progresso.log` (fora do git):

```bash
tail -f reports/qa/progresso.log
```

## CI e dependências

- `.github/workflows/ci.yml`: lint → typecheck → unit (+ 3 fusos) → build → e2e → Lighthouse.
- `renovate.json`: PRs toda segunda; minor/patch agrupados; patches entram sozinhos. O próprio Renovate faz o merge só depois do CI verde, então não é preciso proteção na `main`. Requer o app Renovate instalado no repositório.

## Rodar o build de produção

Não há hospedagem no MVP por enquanto (DV04) nem demo obrigatória (DV09). Para ver o app como ele é publicado:

```bash
pnpm build && pnpm preview
```

e abra http://localhost:4173. É o mesmo build que o E2E e o Lighthouse validam.
