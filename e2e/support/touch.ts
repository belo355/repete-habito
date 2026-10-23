import { expect, type Page } from '@playwright/test';

// qa.md §3.4: todo elemento interativo visível tem caixa ≥ 44×44 px.
const INTERACTIVE =
  'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"], [role="menuitem"], [tabindex]:not([tabindex="-1"])';

export async function expectTouchTargets(page: Page, min = 44) {
  const small = await page.locator(INTERACTIVE).evaluateAll((els, minSize) => {
    return els
      .filter((el) => {
        const style = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return (
          style.visibility !== 'hidden' && style.display !== 'none' && r.width > 0 && r.height > 0
        );
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { el: el.outerHTML.slice(0, 80), w: Math.round(r.width), h: Math.round(r.height) };
      })
      .filter(({ w, h }) => w < minSize || h < minSize);
  }, min);
  expect(small, 'alvos de toque menores que 44×44 px').toEqual([]);
}

// qa.md §7 · Responsividade: sem rolagem horizontal.
export async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, 'rolagem horizontal').toBeLessThanOrEqual(clientWidth);
}
