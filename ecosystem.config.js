module.exports = {
    apps: [
      {
        name: 'aasc-be-round-2',
        script: 'dist/index.js',
        watch: true,
        env: {
          NODE_ENV: 'development',
          APP_PORT: 10000,
          APP_HOST: '0.0.0.0'
        },
        env_production: {
          NODE_ENV: 'production',
          APP_PORT: 10000,
          APP_HOST: '0.0.0.0'
        }
      }
    ]
  };
  