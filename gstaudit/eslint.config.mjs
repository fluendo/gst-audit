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
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Generated GStreamer bindings - skip linting
      "lib/Gst/**",
      "lib/GstBase/**",
      "lib/GstVideo/**",
      "lib/GObject/**",
      "lib/GLib/**",
      "lib/GModule/**",
      "lib/_shared.ts",
      "lib/gst.ts",
      "lib/gstvideo.ts",
    ],
  },
  // Allow require() in .js files (CommonJS)
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/prefer-as-const": "off",
    },
  },
];

export default eslintConfig;
