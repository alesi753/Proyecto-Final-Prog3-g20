import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Reglas recomendadas de JavaScript puro
  eslint.configs.recommended,

  // Reglas recomendadas para TypeScript
  ...tseslint.configs.recommended,

  // Apaga las reglas que chocan con Prettier
  eslintConfigPrettier,

  // Tu configuración específica
  {
    languageOptions: {
      // Le decimos a ESLint que reconozca TODAS las variables de Node.js
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off', // Apagamos el error del require()
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'warn' // Interfaces vacías solo tiran warning
    },
  }
);