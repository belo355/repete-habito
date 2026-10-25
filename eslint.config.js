import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import i18next from 'eslint-plugin-i18next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Pacotes que o domínio pode usar: funções puras, sem I/O, sem React e sem plataforma (tech-spec §2.1 e §3).
const domainAllowedPackages = '{date-fns,date-fns/*,@date-fns/tz,zod}';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage',
      'node_modules',
      'playwright-report',
      'test-results',
      '.lighthouseci',
      'reports',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['src/**/*.tsx'],
    ...jsxA11y.flatConfigs.strict,
  },
  // INV11 (qa.md §5): nenhum texto visível fixo no código; textos vêm de src/i18n.
  // Modo `all`: qualquer string literal, inclusive em objetos, constantes e template literals,
  // em .ts e .tsx. As exceções são só contextos que nunca são texto para o usuário.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/**/*.d.ts', 'src/ui/test/**'],
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'all',
          'should-validate-template': true,
          'jsx-attributes': {
            exclude: [
              '^(className|style|styleName|type|key|id|width|height|to|href|name|value|role|rel|target|lang|dir|htmlFor|src|method|inputMode|autoComplete|tabIndex|viewBox|d|fill|stroke|xmlns|align|side)$',
              '^aria-(hidden|labelledby|describedby|controls|current|live|expanded|selected|checked|pressed|modal|orientation|haspopup|level|atomic)$',
              '^data-',
            ],
          },
          // Chaves de objeto que guardam rota, chave de i18n ou valor técnico.
          'object-properties': {
            exclude: [
              '^(to|path|value|name|id|type|role|timeZone|year|month|day|weekday|lng|fallbackLng)$',
              '.*Key',
              '[A-Z_-]+',
            ],
          },
          // Chamadas cujo argumento não é texto de interface (padrão do plugin + APIs do navegador).
          callees: {
            exclude: [
              'i18n(ext)?',
              't',
              'require',
              'addEventListener',
              'removeEventListener',
              'postMessage',
              'getElementById',
              'dispatch',
              'commit',
              'includes',
              'indexOf',
              'endsWith',
              'startsWith',
              '(.*)Error',
              'super',
              'matchMedia',
              'querySelector',
              'getPropertyValue',
              'DateTimeFormat',
              'padStart',
              'slice',
              'test',
              'exec',
              'replace',
              'split',
              'join',
            ],
          },
          words: {
            // Como o padrão do plugin (só símbolos/números, só maiúsculas, emoji) + códigos de idioma.
            exclude: [
              '[0-9!-/:-@[-`{-~]+',
              '[A-Z_-]+',
              /^\p{Emoji}+$/u,
              // Códigos de idioma (BCP 47), ex.: pt-BR.
              '[a-z]{2}-[A-Z]{2}',
            ],
          },
        },
      ],
    },
  },
  {
    files: ['*.{js,ts}', 'e2e/**/*.ts', 'scripts/**/*.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  // Playwright identifica os fixtures pela desestruturação; `{}` é obrigatório quando nenhum é usado.
  {
    files: ['e2e/**/*.ts'],
    rules: { 'no-empty-pattern': 'off' },
  },

  // Domínio puro (D1, INV05): sem relógio nem APIs do navegador. A hora entra pela porta Clock
  // (src/domain/date/clock.ts) ou como parâmetro `today: LocalDate`.
  {
    files: ['src/domain/**/*.ts'],
    ignores: ['src/domain/**/*.test.ts'],
    rules: {
      // Date e Temporal como globais cobrem qualquer uso como valor: new Date, Date(), Date.now,
      // Date['now'], desestruturação e apelido. self/globalThis/window fecham o acesso indireto.
      'no-restricted-globals': [
        'error',
        ...['Date', 'Temporal'].map((name) => ({
          name,
          message: 'Domínio não lê o relógio: use LocalDate e receba o instante pela porta Clock.',
        })),
        ...[
          'window',
          'self',
          'globalThis',
          'document',
          'navigator',
          'localStorage',
          'sessionStorage',
          'indexedDB',
          'performance',
        ].map((name) => ({
          name,
          message: 'Domínio não acessa APIs do navegador (tech-spec §3).',
        })),
      ],
      // Intl.DateTimeFormat#format()/formatToParts() sem instante usa a hora atual.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.property.name=/^(format|formatToParts)$/][arguments.length=0]',
          message: 'Passe o instante explicitamente: sem argumento, format() usa a hora atual.',
        },
        {
          selector:
            "CallExpression[callee.property.name=/^(format|formatToParts)$/] > Identifier.arguments[name='undefined']",
          message: 'Passe o instante explicitamente: format(undefined) usa a hora atual.',
        },
        {
          selector:
            "CallExpression[callee.property.name=/^(format|formatToParts)$/] > UnaryExpression.arguments[operator='void']",
          message: 'Passe o instante explicitamente: format(void 0) usa a hora atual.',
        },
        {
          selector:
            'CallExpression[callee.property.name=/^(format|formatToParts)$/] > SpreadElement.arguments',
          message: 'Passe o instante explicitamente, sem espalhar argumentos.',
        },
      ],
    },
  },

  // Fronteiras de arquitetura (tech-spec §3). Testes ficam de fora: não vão para o bundle e
  // usam vitest, fast-check e Testing Library.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'domain', pattern: 'src/domain' },
        { type: 'data', pattern: 'src/data' },
        { type: 'platform', pattern: 'src/platform' },
        { type: 'features', pattern: 'src/features' },
        { type: 'ui', pattern: 'src/ui' },
        { type: 'i18n', pattern: 'src/i18n' },
        { type: 'app', pattern: 'src/app' },
      ],
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          checkAllOrigins: true,
          policies: [
            // domain não importa nada de fora de domain.
            {
              from: { element: { type: 'domain' } },
              allow: { to: { element: { type: 'domain' } } },
            },
            {
              from: { element: { type: 'domain' } },
              allow: { to: { module: { origin: 'external', source: domainAllowedPackages } } },
            },
            // data e platform importam domain, nunca features.
            {
              from: { element: { types: { anyOf: ['data', 'platform'] } } },
              allow: { to: { element: { types: { anyOf: ['domain', 'data', 'platform'] } } } },
            },
            {
              from: { element: { types: { anyOf: ['ui', 'i18n'] } } },
              allow: { to: { element: { types: { anyOf: ['ui', 'i18n'] } } } },
            },
            {
              from: { element: { type: 'features' } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ['domain', 'data', 'platform', 'features', 'ui', 'i18n'] },
                  },
                },
              },
            },
            { from: { element: { type: 'app' } }, allow: { to: { element: { type: '*' } } } },
            // Fora do domínio, qualquer pacote externo ou módulo nativo é permitido.
            {
              from: { element: { type: '!domain' } },
              allow: { to: { module: { origin: 'external' } } },
            },
            {
              from: { element: { type: '!domain' } },
              allow: { to: { module: { origin: 'core' } } },
            },
          ],
        },
      ],
    },
  },

  prettier,
);
