import request from "supertest";
import app from "../server";

describe("TASK API TESTS", () => {
  it("should return all tasks", async () => {
    const res = await request(app)
      .get("api/tasks")
      .set("Authorization", `Bearer token`);
    expect(res.status).toBe(200);
  });
});
