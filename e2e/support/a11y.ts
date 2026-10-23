import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

// qa.md §3.4: zero violações WCAG 2.1 AA.
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
}
