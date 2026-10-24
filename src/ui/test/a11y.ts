import axe from 'axe-core';
import { expect } from 'vitest';
import { server, userEvent } from 'vitest/browser';

export type Theme = 'light' | 'dark';

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

// Zero violações WCAG 2.1 AA, incluindo color-contrast (qa.md §3.4).
export async function expectNoA11yViolations(root: Element = document.body) {
  const results = await axe.run(root, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
  });
  expect(
    results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`),
  ).toEqual([]);
}

// Todo elemento interativo visível tem caixa ≥ 44×44 px (product 4.7).
export function expectTouchTargets(root: ParentNode = document.body, min = 44) {
  const selector =
    'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="switch"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [tabindex]:not([tabindex="-1"])';
  const small = [...root.querySelectorAll<HTMLElement>(selector)].flatMap((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || getComputedStyle(el).visibility === 'hidden') return [];
    if (r.width >= min && r.height >= min) return [];
    return [`${el.outerHTML.slice(0, 60)} ${Math.round(r.width)}×${Math.round(r.height)}`];
  });
  expect(small).toEqual([]);
}

// Foco visível: contorno não nulo no elemento focado.
export function expectVisibleFocus(el: Element) {
  const s = getComputedStyle(el);
  expect(s.outlineStyle).not.toBe('none');
  expect(parseFloat(s.outlineWidth)).toBeGreaterThanOrEqual(2);
}

// No WebKit do macOS, Tab só passa por botões e links com Option (preferência padrão do sistema).
export async function pressTab() {
  await userEvent.keyboard(server.browser === 'webkit' ? '{Alt>}{Tab}{/Alt}' : '{Tab}');
}
