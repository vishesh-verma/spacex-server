const { parse } = require("csv-parse");
const planets = require("./planets.mongo");
const path = require("path");
const fs = require("fs");

function Ishabitate(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "../../data/kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data",async (data) => {
        if (Ishabitate(data)) {
          savePlanet(data)
        }
      })
      .on("end", async() => {
        // // console.log(habitatePlanet);
        // console.log(habitatePlanet.length);
        // console.log(habitatePlanet.map((values) => values["kepler_name"]));
        // habitatePlanet.push(
        //   ...habitatePlanet.map((values) => values["kepler_name"])
        // );
        console.log("the files gets read");
        const AllPlanets = await (await getAllPlanets()).length
        console.log(AllPlanets, "found the number of planets");
        resolve();
      })
      .on("error", (error) => {
        console.log(`some error ${error}`);
        reject(error);
      });
  });
}

async function getAllPlanets() {
  return await planets.find({},{
    "_id":0, '__v':0});
}

async function savePlanet(planet) {
  try{
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      { keplerName: planet.kepler_name },
      {
        upsert: true
      }
    );
  }catch(error){
    console.log(error,"error accour in saving planets")
  }
  
}

module.exports = {
  loadPlanetData,
  getAllPlanets,
};
