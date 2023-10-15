module.exports = {
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/typescript",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
      },
      plugins: ["prettier"],
      files: ["**/*.ts"],
      rules: {
        "prettier/prettier": [
          "error",
          {
            singleQuote: true,
            printWidth: 150,
            endOfLine: "auto",
            trailingComma: "all",
          },
        ],
        "max-len": [
          "error",
          {
            code: 150,
            ignoreUrls: true,
            ignoreTemplateLiterals: true,
          },
        ],
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/no-unsafe-enum-comparison": "off",
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE", "PascalCase"],
            leadingUnderscore: "allow",
          },
          {
            selector: "typeLike",
            format: ["PascalCase"],
          },
        ],
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports",
          },
        ],
      },
    },
  ],
  rules: {
    "linebreak-style": 0,
    "no-underscore-dangle": "off",
    "no-console": "off",
    "no-prototype-builtins": "off",
    "no-inner-declarations": "off",
    "no-param-reassign": "off",
    // note you must disable the base rule as it can report incorrect errors
    "comma-dangle": "off",
    "import/prefer-default-export": "off",
    "require-await": "off",
  },
};
