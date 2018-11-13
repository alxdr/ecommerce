const request = require("supertest");

let server;

beforeEach(() => {
  jest.resetModules();
  server = require("./server"); // eslint-disable-line global-require
});

afterEach(done => {
  server.close(done);
});

describe("/", () => {
  it("200 get /", done => {
    request(server)
      .get("/")
      .expect(200, done);
  });

  it("404 post /", done => {
    request(server)
      .post("/")
      .expect(404, done);
  });

  it("404 put /", done => {
    request(server)
      .put("/")
      .expect(404, done);
  });
});

describe("/search", () => {
  it("200 post /search", done => {
    request(server)
      .get("/search")
      .type("form")
      .send({ search: "3" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toBe("3");
        return done();
      });
  });
});
