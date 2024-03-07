const request = require("supertest");
const app = require("../../app");
const {
  mongooseConnection,
  closeMongooseConnection,
} = require("../../../services/mongo");
const { loadPlanetData } = require("../../models/planets.model");
describe("API launch", () => {
  beforeAll(async () => {
    await mongooseConnection();
    await loadPlanetData();
    await closeMongooseConnection()
  });

  describe("POST api test for /launches", () => {
    const launchDate = new Date();

    const launchMock = {
      mission: "keplers mission",
      rocket: "Exploror ISo1",
      launchDate: launchDate,
      target: "Kepler-442 b",
    };
    const launchMockWithoutDate = {
      mission: "keplers mission",
      rocket: "Exploror ISo1",
      target: "Kepler-442 b",
    };
    const launchMockWithWrongDate = {
      mission: "keplers mission",
      rocket: "Exploror ISo1",
      launchDate: "2323211",
      target: "Kepler-442 b",
    };

    test("POST Api Test For Adding New Launch Success", async () => {
      const response = await request(app).post("/v1/launches").send(launchMock);
      const data = await response.body;
      console.log(data);
      const requestDate = new Date(launchMock.launchDate).valueOf();
      const responsetDate = new Date(data.launchDate).valueOf();
      expect(requestDate).toBe(responsetDate);
      expect(data).toMatchObject(launchMockWithoutDate);
    });

    test("POST Api Test For Adding New Launch Parameter Missing Failure ", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchMockWithoutDate);
      console.log(response.error.message);
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        error: "parameter is missing!!",
      });
    });
    test("POST Api Test For Adding New Launch with launchDate is incorrect Failure ", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchMockWithWrongDate);
      console.log(response.body);
      expect(response.body).toStrictEqual({
        error: "launchDate is not corrent!!",
      });
    });
  });

  describe("GET api test for /launches", () => {
    test("GET api test for getting All launches", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });
});
