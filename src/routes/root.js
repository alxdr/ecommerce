const fs = require("fs");
const map = require("through2-map");

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
    res.type("html");
    stream.pipe(writeToken).pipe(res);
  });
};

module.exports = root;
