import obsidianmd from 'eslint-plugin-obsidianmd'
import tseslint from 'typescript-eslint'

/**
 * Mirrors what the Obsidian community-plugin reviewer runs, so the same
 * findings show up here instead of in the submission report.
 * Run with `pnpm lint`.
 */
export default tseslint.config(
  ...obsidianmd.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: './tsconfig.json' },
    },
  },
  { ignores: ['main.js', 'src/__mocks__/**', 'src/__tests__/**'] },
  {
    rules: {
      'obsidianmd/ui/sentence-case': [
        'warn',
        { brands: ['JSON Toolbox', 'Ko-fi', 'JWT', 'Base64'], enforceCamelCaseLower: false },
      ],
    },
  },
)
