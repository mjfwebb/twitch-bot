module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["react", "prettier", "import", "jsx-a11y", "simple-import-sort"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
    ecmaVersion: "latest",
  },
  settings: {
    react: {
      version: "17",
    },
  },
  globals: {
    document: "readonly",
  },
  rules: {
    "jsx-a11y/no-autofocus": "off",
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        printWidth: 150,
        endOfLine: "auto",
      },
    ],
    "react/display-name": "off",
    "linebreak-style": 0,
    "no-underscore-dangle": "off",
    "react/destructuring-assignment": 0,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-wrap-multilines": [
      "error",
      {
        declaration: "parens-new-line",
        assignment: "parens-new-line",
        return: "parens-new-line",
        arrow: "parens-new-line",
        condition: "parens-new-line",
        logical: "ignore",
        prop: "ignore",
      },
    ],
    "template-curly-spacing": ["error", "never"],
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
      "LabeledStatement",
      "WithStatement",
    ],
    "max-len": ["warn", { code: 150, ignoreUrls: true, ignoreStrings: true }],
    "prefer-promise-reject-errors": 0,
    "react/jsx-filename-extension": [
      2,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Matches any import statement that ends with 'react'
          ["react$"],

          // Matches any import statement that starts with '@' followed by any word character
          ["^@?\\w"],

          [
            "^@components?\\w",
            "^@constants?\\w",
            "^@util?\\w",
            "^@hooks?\\w",
            "^@validators?\\w",
            "^@store?\\w",
          ],

          // Matches any import statement that starts with a dot, but not when it is followed by a forward slash (i.e., not a relative import), and not when it is followed by nothing (i.e., not an absolute import). Also matches import statements that start with two dots, followed by either nothing or a forward slash (i.e., a relative parent import).
          ["^\\.(?!/?$)", "^\\.\\./?$"],

          // Side effect imports.
          ["^\\u0000"],
        ],
      },
    ],
    "spaced-comment": ["error", "always", { markers: ["/"] }],
    "no-undef": "off",
    // Explicitly disable as it is covered by React 17's JSX transform
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "consistent-return": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],
  },
};
