// @ts-check
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { FlatCompat } from '@eslint/eslintrc';
import parser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // 공통 ignore
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/*.d.ts',
    ],
  },

  // 공통: JS 기본 + Prettier
  js.configs.recommended,
  prettierRecommended,

  // -------- apps/web (Next.js) 전용 규칙 --------
  // Next 코어 규칙을 FlatCompat로 로드하고, 대상 파일만 지정
  ...compat.extends('next/core-web-vitals', 'next/typescript').map((cfg) => ({
    ...cfg,
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ...(cfg.languageOptions || {}),
      globals: { ...globals.browser },
      parserOptions: {
        // Next 빌드용 tsconfig 경로
        project: path.join(__dirname, 'apps/web/tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
  })),

  // -------- apps/api (NestJS) 전용 규칙 --------
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ['apps/api/**/*.ts'],
    languageOptions: {
      parser,
      globals: { ...globals.node, ...globals.jest },
      parserOptions: {
        project: path.join(__dirname, 'apps/api/tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
          legacyDecorators: true,
        },
      },
    },
  })),

  // 공통/추가 규칙
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
];
