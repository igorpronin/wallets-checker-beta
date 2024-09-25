module.exports = {
  apps : [{
    name: 'wallets-checker-beta',
    script: './index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    max_restarts: 10, // Maximum number of restarts before stopping
  }]
};
