import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import boundaries from 'eslint-plugin-boundaries';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage',
      'legacy',
      'node_modules',
      'playwright-report',
      'test-results',
      'src/content/generated',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ['src/**/*.tsx'],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    // Reglas de dependencia entre capas (ver CLAUDE.md y README).
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      // El plugin resuelve imports con eslint-module-utils: sin esto solo busca .js.
      'import/resolver': { node: { extensions: ['.ts', '.tsx', '.js', '.json'] } },
      'boundaries/elements': [
        { type: 'domain', pattern: 'src/domain' },
        { type: 'infra', pattern: 'src/infra' },
        { type: 'feature', pattern: 'src/features/*', capture: ['nombre'] },
        { type: 'shared', pattern: 'src/shared' },
        { type: 'styles', pattern: 'src/styles' },
        { type: 'content', pattern: 'src/content' },
        { type: 'app', pattern: 'src/app' },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // domain: puro, no importa nada del resto del proyecto.
            {
              from: { element: { type: 'domain' } },
              allow: { to: { element: { type: 'domain' } } },
            },
            // infra: implementa interfaces del dominio y valida contenido.
            {
              from: { element: { type: 'infra' } },
              allow: { to: { element: { types: ['infra', 'domain', 'content'] } } },
            },
            // features: dominio y shared; de otra feature, nada. Solo la propia.
            {
              from: { element: { type: 'feature' } },
              allow: { to: { element: { types: ['domain', 'shared'] } } },
            },
            {
              from: { element: { type: 'feature' } },
              allow: {
                to: {
                  element: {
                    type: 'feature',
                    captured: { nombre: '{{ from.element.captured.nombre }}' },
                  },
                },
              },
            },
            // shared: presentacion sin logica de negocio.
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { type: 'shared' } } },
            },
            {
              from: { element: { type: 'content' } },
              allow: { to: { element: { type: 'content' } } },
            },
            // app: unico lugar que conoce todo.
            {
              from: { element: { type: 'app' } },
              allow: {
                to: {
                  element: {
                    types: ['app', 'domain', 'infra', 'feature', 'shared', 'styles', 'content'],
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
  {
    // domain: sin React ni DOM ni Math.random directo.
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react/*', 'react-dom', 'react-dom/*', 'react-router*'],
              message: 'domain/ no puede depender de React.',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'domain/ no puede tocar el DOM.' },
        { name: 'document', message: 'domain/ no puede tocar el DOM.' },
        { name: 'localStorage', message: 'domain/ no puede tocar localStorage.' },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'Usar el Rng inyectado (domain/random.ts).',
        },
      ],
    },
  },
  {
    // La UI nunca toca localStorage: solo infra/ y app/composition.
    files: ['src/features/**/*.{ts,tsx}', 'src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: 'Usar ProgresoRepositorio (infra/).' },
        { name: 'sessionStorage', message: 'Usar ProgresoRepositorio (infra/).' },
      ],
    },
  },
  prettier,
);
