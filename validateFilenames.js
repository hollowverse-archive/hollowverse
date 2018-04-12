module.exports = {
  rules: [
    {
      validation: 'camelCase',
      patterns: ['*/**'],
    },
    {
      validation: 'PascalCase',
      patterns: [
        'src/app/components/**',
        'src/app/pages/**',
        'src/app/hocs/**',
      ],
    },
    {
      validation: 'ignore',
      patterns: [
        '*/**/typings/*',
        'src/app/pages/NotablePerson/warningIcon.tsx',
        'src/app/__tests__/**/*',
        '__tests__/**/*',
        '_*.scss',
        'Dockerfile*',
        'docker-compose.yml',
        '**/LICENSE.md',
        '**/README.md',
        'src/app/assets/algolia/*',
      ],
    },
  ],
};
