const {
  getAllLaunches,
  launchExists,
  abortLaunch,
  scheduleNewLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../../services/query");
async function httpGetAllLaunches(req, res) {
  console.log(req.query);
  const query = req.query;
  const { skip, limit } = getPagination(query);
  return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
  const body = req.body;
  if (!body.mission || !body.rocket || !body.launchDate || !body.target) {
    return res.status(400).json({
      error: "parameter is missing!!",
    });
  }
  const launchDate = new Date(body.launchDate);
  console.log(launchDate, "launchDate");
  if (launchDate == "Invalid Date") {
    return res.status(400).json({
      error: "launchDate is not corrent!!",
    });
  }
  await scheduleNewLaunch(body);
  return res.status(200).json(body);
}

async function httpDeleteLaunch(req, res) {
  const launchId = Number(req.params.id);
  if (!launchExists(launchId)) {
    res.status(400).json({
      error: "launch project Does not exists",
    });
  }
  const result = await abortLaunch(launchId);
  if (result) {
    res.status(200).json({
      result,
    });
  } else {
    res.status(400).json({
      error: "Launch Abort Failed",
    });
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch,
};
