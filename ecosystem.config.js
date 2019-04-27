module.exports = {
  apps : [
      {
        name: "OEL",
        script: "./bin/www",
        watch: false,
        env: {
            "PORT": 3000,
            "NODE_ENV": "production"
        },
        env_development: {
            "PORT": 8080,
            "NODE_ENV": "development",
        }
      }
  ]
}