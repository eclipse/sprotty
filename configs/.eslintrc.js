module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": [
        "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "eslint-plugin-no-null",
        "@typescript-eslint",
        "header"
    ],
    "rules": {
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/naming-convention": [
            "warn",
                {
                    "selector": 'default',
                    "format": ['camelCase'],
                    "leadingUnderscore": 'allow',
                    "trailingUnderscore": 'allow',
                },
                {
                    "selector": 'variable',
                    "format": ['camelCase', 'UPPER_CASE'],
                    "leadingUnderscore": 'allow',
                    "trailingUnderscore": 'allow',
                },
                {
                    "selector": 'typeLike',
                    "format": ['PascalCase'],
                },                
                {
                    "selector": "classProperty",
                    "format": ["camelCase", "UPPER_CASE"]
                },      
                {
                    "selector": "typeProperty",
                    "format": ["camelCase", "UPPER_CASE"]
                },
                {
                    "selector": "enumMember",
                    "format": ["camelCase", "UPPER_CASE"]
                }
            ],
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-shadow": [
            "warn",
            {
                "hoist": "all"
            }
        ],
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "@typescript-eslint/type-annotation-spacing": "warn",
        "header/header": ["error", "block", [{"pattern": "[\n\r]+ \\* Copyright \\([cC]\\) \\d{4}(-\\d{4})? .*[\n\r]+"}]],
        "brace-style": [
            "warn",
            "1tbs",
            { "allowSingleLine": true }
        ],
        "comma-dangle": ["warn", {
            "arrays": "only-multiline",
            "objects": "only-multiline",
        }],
        "constructor-super": "error",
        "curly": "off",
        "eol-last": "warn",
        "eqeqeq": [
            "warn",
            "smart"
        ],
        "guard-for-in": "warn",
        "id-blacklist": "off",
        "id-match": "off",
        "keyword-spacing": ["warn", { "before": true }],
        "max-len": [
            "warn",
            {
                "code": 180
            }
        ],
        "no-prototype-builtins": "error",
        "no-caller": "error",
        "no-console": "off",
        "no-debugger": "warn",
        "no-eval": "error",
        "no-fallthrough": "warn",
        "no-invalid-this": "warn",
        "no-new-wrappers": "warn",
        "no-null/no-null": "off",
        "no-redeclare": "error",
        "no-restricted-imports": [
            "error",
            "..",
            "../index",
            "../..",
            "../../index"
        ],
        "no-return-await": "warn",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-trailing-spaces": "warn",
        "no-underscore-dangle": "off",
        "no-unsafe-finally": "error",
        "no-var": "error",
        "prefer-const": [
            "warn",
            {
                "destructuring": "all"
            }
        ],
        "prefer-object-spread": "warn",
        "radix": "warn",
        "spaced-comment": [
            "warn",
            "always",
            {
                "markers": [
                    "/"
                ],
                "exceptions": [
                    "*"
                ]
            }
        ],
        "space-infix-ops": "warn",
        "use-isnan": "warn"
    }
};
