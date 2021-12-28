module.exports = {
	apps: [
		{
			name: "HHSB",
			script: "server.js",
			env: {
				"PORT": 8080,
				"NODE_ENV": "development",
				"SECRET": "HHSB",
				"LYRICIST_TOKEN": "UJYTnEMS0QZluVoY_1yooeL3OHXnsv9ShkAVK48GKjCJvvN4zYVrR60FJwnrnLeb",
				"DATABASE_URL": "mongodb://hhsb:superpass@hhsb-dev-env-shard-00-00-e2dry.mongodb.net:27017,hhsb-dev-env-shard-00-01-e2dry.mongodb.net:27017,hhsb-dev-env-shard-00-02-e2dry.mongodb.net:27017/hhsb?ssl=true&replicaSet=HHSB-Dev-Env-shard-0&authSource=admin",
				"SMTP_HOST": "smtp.gmail.com",
				"SMTP_PORT": 465,
				"SMTP_USER": "contact@hiphopscoreboard.com",
				"SMTP_PASS": "g%hrM28P",
				"CLIENT_URL": "http://hiphopscoreboard.com/"
			}
		}
	]
}
