import js from "@eslint/js"
import globals from "globals"
import pluginReact from "eslint-plugin-react"
import { defineConfig } from "eslint/config"
import stylistic from "@stylistic/eslint-plugin"

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js, "@stylistic": stylistic }, extends: ["js/recommended"], languageOptions: { globals: globals.browser }, rules: {
            "semi": ["error", "never"],
            "@stylistic/quotes": ["error", "double", { "allowTemplateLiterals": "always" }],
            "@stylistic/jsx-quotes": ["error", "prefer-double"],
        }
    },
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"]
])
