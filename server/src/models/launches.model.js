const launches = require("./launches.mongo");
const axios = require("axios");
const planets = require("../models/planets.mongo");
const LAUNCH_URL = "https://api.spacexdata.com/v4/launches/query";
const DEFAULT_FLIGHT_NUM = 100;

// Get functions for /launch API
async function getAllLaunches(skip, limit) {
  return await launches.find({}).sort({flightNumber: 1})
  .skip(skip).limit(limit);
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function getLatestFlight() {
  const latestFlight = await launches.findOne().sort("-flightNumber");
  if (!latestFlight) {
    return DEFAULT_FLIGHT_NUM;
  }
  return latestFlight.flightNumber;
}

// Post function for /launch API
async function saveLaunches(launch) {
  return await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function scheduleNewLaunch(launch) {
  const isPlanet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!isPlanet) {
    throw new Error("No matching planet");
  }
  const latestLaunch = await getLatestFlight();
  const launchObject = {
    ...launch,
    flightNumber: latestLaunch + 1,
    customer: ["ZTM", "NASA"],
    upcoming: true,
  };
  saveLaunches(launchObject);
}

async function abortLaunch(launchId) {
  const abort = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return abort.modifiedCount === 1;
}

// Utils for launch model
async function launchExists(launchId) {
  const isLaunch = await findLaunch({ flightNumber: launchId });
  return isLaunch;
}

async function populateLaunchData() {
  const launchResponse = await axios.post(LAUNCH_URL, {
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (launchResponse.status !== 200) {
    console.log("problem loading launching data");
    throw new Error("Data downloading failed");
  }
  const launchData = launchResponse.data.docs;

  for (launch of launchData) {
    const payloads = launch.payloads;
    console.log(launch.date_local, "date");
    const customers = payloads.flatMap((num) => num.customers);
    const launchObject = {
      flightNumber: launch.flight_number,
      launchDate: launch.date_local,
      mission: launch.name,
      rocket: launch.rocket.name,
      success: launch.success,
      upcoming: launch.upcoming,
      customer: customers,
    };
    console.log(launchObject, "launchObject");
    await saveLaunches(launchObject);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    mission: "FalconSat",
    rocket: "Falcon 1",
  });
  console.log(firstLaunch, "firstLaunch");
  if (firstLaunch) {
    console.log("launch Data already loaded");
    return;
  } else {
    await populateLaunchData();
  }
}

module.exports = {
  getAllLaunches,
  launchExists,
  scheduleNewLaunch,
  abortLaunch,
  loadLaunchData,
};
