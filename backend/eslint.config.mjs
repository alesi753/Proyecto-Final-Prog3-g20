import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Reglas recomendadas de JavaScript puro
  eslint.configs.recommended,

  // Reglas recomendadas para TypeScript
  ...tseslint.configs.recommended,

  // Apaga las reglas que chocan con Prettier
  eslintConfigPrettier,

  // Tus reglas personalizadas
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  }
);