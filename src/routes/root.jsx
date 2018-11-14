const React = require("react");
const { renderToNodeStream } = require("react-dom/server");
const Html = require("../views/html").default;
const Home = require("../views/home").default;

const root = app => {
  app.get("/", (req, res) => {
    res.type("html");
    res.write("<!DOCTYPE html>");
    renderToNodeStream(
      <Html script="/public/bundle.js" token={req.csrfToken()}>
        <Home />
      </Html>
    ).pipe(res);
  });
};

module.exports = root;
