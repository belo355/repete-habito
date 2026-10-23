import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
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
  {
    files: ['*.{js,ts}', 'e2e/**/*.ts', 'scripts/**/*.{js,ts}'],
    languageOptions: { globals: globals.node },
  },

  // Fronteiras de arquitetura (tech-spec §3).
  {
    files: ['src/**/*.{ts,tsx}'],
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
