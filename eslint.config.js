import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.superpowers/**'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.browser },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/prop-types': 'off',
      // Провайдери контексту експортують і свої хуки/константи — це нормально для fast refresh.
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true, allowExportNames: ['languages', 'useLang', 'serviceOptions', 'useBooking', 'useWhatsappLink'] },
      ],
    },
  },
  // Скрипти медіа і конфіги виконуються в Node.
  { files: ['scripts/**', '*.config.js'], languageOptions: { globals: globals.node } },
  prettier,
];
