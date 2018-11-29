const fs = require("fs");
const map = require("through2-map");
const React = require("react");
const { renderToString } = require("react-dom/server");
const Home = require("../views/home").default;

const root = app => {
  app.get("/", (req, res) => {
    const stream = fs.createReadStream(`${process.cwd()}/dist/index.html`);
    const token = req.csrfToken();
    const writeToken = map({ wantStrings: true }, str =>
      str.replace(
        '<meta name="csrf-token" content="">',
        `<meta name="csrf-token" content="${token}">`
      )
    );
    const renderedStr = renderToString(<Home />);
    const writeRender = map({ wantStrings: true }, str =>
      str.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedStr}</div>`
      )
    );
    res.type("html");
    stream
      .pipe(writeToken)
      .pipe(writeRender)
      .pipe(res);
  });
};

module.exports = root;
