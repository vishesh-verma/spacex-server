// Load planets and return as JSON.
const base_url = 'http://localhost:8000/v1/'
async function httpGetPlanets() {
  const planets_api =  await fetch(`${base_url}planets`)
  const planets = await planets_api.json()
  return planets
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const launches_api = await fetch(`${base_url}launches`)
  const launches = await launches_api.json()
  console.log(launches,"launches");
  return launches.sort((a,b)=>{
    return a.flightNumber - b.flightNumber
  })
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  const launchSubmitData = await fetch(`${base_url}launches`,{
    method: 'POST',
    body: JSON.stringify(launch),
    mode: "cors", 
    cache: "no-cache", 
    credentials: "same-origin", 
    headers: {
      "Content-Type": "application/json",
    },
  })
  return launchSubmitData
}

async function httpAbortLaunch(id) {
  const abortLaunchResponse =  await fetch(`${base_url}launches/${id}`,{
    method: 'DELETE',
    mode: "cors", 
    cache: "no-cache", 
    credentials: "same-origin", 
    headers: {
      "Content-Type": "application/json",
    },
  })
  console.log(abortLaunchResponse, "abortLaunchResponse");
  return abortLaunchResponse
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};