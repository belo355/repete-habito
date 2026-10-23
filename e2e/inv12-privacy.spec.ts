import { expect, test } from './support/test.ts';

// qa.md §5 · INV12. A fixture automática de ./support/test.ts já falha o spec em caso de
// requisição externa; este teste deixa a verificação explícita e com o ID no título.
test('INV12 · abrir o app não faz nenhuma requisição fora da origem @e2e', async ({
  page,
  externalRequests,
}) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(externalRequests).toEqual([]);
});
