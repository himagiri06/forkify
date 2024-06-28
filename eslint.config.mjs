import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-useless-catch': 'warn',
      'no-unreachable': 'warn',
      'no-unused-vars': 'warn',
      'no-unused-private-class-members': 'warn',
    },
  },
];
