import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignores globais
  {
    ignores: [
      "node_modules/**",
      ".next/**", 
      "out/**",
      "build/**",
      "dist/**",
      ".vercel/**",
      "next-env.d.ts",
      "coverage/**"
    ]
  },

  // Configuração base do Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Configuração principal
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      // === TypeScript ===
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // === Estilo Básico ===
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "prefer-const": "error",
      "no-var": "error",

      // === Boas Práticas ===
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-expressions": "error",
      "eqeqeq": ["error", "always"],

      // === React/JSX ===
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-key": "error",
      "react/self-closing-comp": "error",

      // === React Hooks ===
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  },

  // Configuração para testes
  {
    files: ["**/__tests__/**/*", "**/*.{test,spec}.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off"
    }
  }
];

export default eslintConfig;