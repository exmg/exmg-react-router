module.exports = {
    "env": {
        "browser": true,
        "jasmine": true,
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": false
    },
    "extends": [
        "airbnb"
    ],
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
    ],
    "rules": {
        "class-methods-use-this": "off",
        "import/extensions": "off",
        "import/no-extraneous-dependencies": "off",
        // "import/no-unresolved": [2, { commonjs: true, amd: true }],
        "import/prefer-default-export": "off",
        "import/first": "off",
        "indent": ["error", "tab", { "SwitchCase": 1 }],
        "max-len": "off",
        "no-tabs": "off",
        "quotes": [2, "single", { "allowTemplateLiterals": true }],
        "react/jsx-curly-spacing": [1, "always"],
        "react/jsx-indent-props": ["error", "tab"],
        "react/jsx-indent": ["error", "tab"],
        "react/prefer-stateless-function": "off",
        "no-underscore-dangle": [2, { "allowAfterThis": true }],
        "no-use-before-define": "off",
        "no-shadow": "warn",
        "no-plusplus": "off",
        "no-nested-ternary": "off",

        // Tmp fix for eslint
        "jsx-a11y/href-no-hash": "off",
        "jsx-a11y/anchor-is-valid": ["warn", { "aspects": ["invalidHref"] }],
        "jsx-a11y/click-events-have-key-events": "off",
        "function-paren-newline": "off",
        "object-curly-newline": "off",
    },
    "settings": {
        "import/resolver": {
            "babel-module": {},
        }
    },
    "globals": {
        "jest": true,
        "test": true,
    }
};
