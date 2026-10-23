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

## CI e dependências

- `.github/workflows/ci.yml`: lint → typecheck → unit (+ 3 fusos) → build → e2e → Lighthouse, e depois o deploy.
- `renovate.json`: PRs toda segunda; minor/patch agrupados; patches entram sozinhos com CI verde. Para o auto-merge funcionar, instale o app Renovate no repositório e torne o job `CI` obrigatório na proteção da branch `main`.

## Deploy

Cloudflare Pages, publicado pelo job `deploy` do CI: `main` vai para produção e cada PR ganha um preview com URL própria. HTTPS é automático.

Configuração única:

1. Criar o projeto `repete-habito` no Cloudflare Pages (upload direto, sem integração Git).
2. Criar um API token com a permissão _Cloudflare Pages: Edit_.
3. No GitHub, adicionar os secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.

Sem os secrets, o job de deploy só emite um aviso e não falha.
