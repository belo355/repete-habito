import { test as base, expect } from '@playwright/test';

// qa.md §3.3 item 4 e §5 · INV12: nenhuma requisição sai da origem do app.
// Fixture automática: todo spec que importa `test` deste arquivo falha se o navegador
// pedir qualquer recurso fora da origem. Nenhum endpoint de analytics foi aprovado ainda
// (tech-spec §8, decisão 1), então a lista de exceções está vazia.
const allowedExternalOrigins: readonly string[] = [];

type Fixtures = { externalRequests: string[] };

export const test = base.extend<Fixtures>({
  externalRequests: [
    async ({ page, baseURL }, use) => {
      const appOrigin = new URL(baseURL ?? 'http://localhost').origin;
      const external: string[] = [];
      page.on('request', (request) => {
        const url = new URL(request.url());
        if (url.protocol === 'data:' || url.protocol === 'blob:') return;
        if (url.origin === appOrigin) return;
        if (allowedExternalOrigins.includes(url.origin)) return;
        external.push(request.url());
      });
      await use(external);
      expect(external, 'INV12 · requisições fora da origem').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
