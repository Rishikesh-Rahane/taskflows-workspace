import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx','**/*.prisma'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [
            '^jsonwebtoken$',    
            '^express$',
            '^@prisma/client$',
            '^bcrypt$',
            '^cookie-parser$',
            '^nodemailer$'
          ]
        }
      ]
    }
  }
];
