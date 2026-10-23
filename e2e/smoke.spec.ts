import { expect, test } from './support/test.ts';
import { expectNoA11yViolations } from './support/a11y.ts';

test('smoke · app abre sem violações de acessibilidade @e2e @axe', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Repete Hábito' })).toBeVisible();
  await expectNoA11yViolations(page);
});
