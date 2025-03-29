import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off",
      "no-unused-vars": "off", // Example: Disable unused variables error
      "react/no-unescaped-entities": "off", // Example: Disable unescaped entity warnings
    },
  },
];

export default eslintConfig;
