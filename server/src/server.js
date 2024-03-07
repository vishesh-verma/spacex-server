require('dotenv').config()
const http = require("http");
const { loadPlanetData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");
const app = require("./app");
const { mongooseConnection }= require("../services/mongo");
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
  await mongooseConnection();
  await loadPlanetData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log("PORT I am here", PORT);
  });
}

startServer();
