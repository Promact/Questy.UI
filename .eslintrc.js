module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'jasmine': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:jasmine/recommended'
  ],
  'parser': '@typescript-eslint/parser',  
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'project': './tsconfig.all.json',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
  },
  'overrides': [
    {
      'files': ['*.spec.ts'],
      'plugins': ['jasmine'],
      'rules': {
        '@typescript-eslint/unbound-method': 'off',
        'MicrosoftEdge': 'off',       
        'axe/forms': 'off',
      },
    }
  ],
};
