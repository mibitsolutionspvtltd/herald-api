module.exports = {
  "apps": [
    {
      "name": "student-herald-api",
      "script": "./server.js",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "development",
        "PORT": 3001
      },
      "env_production": {
        "NODE_ENV": "production",
        "PORT": 3001
      },
      "error_file": "./logs/pm2-error.log",
      "out_file": "./logs/pm2-out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
      "merge_logs": true,
      "max_memory_restart": "1G",
      "autorestart": true,
      "watch": false,
      "ignore_watch": [
        "node_modules",
        "logs"
      ]
    }
  ]
};