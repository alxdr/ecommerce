require = require("esm")(module); // eslint-disable-line no-global-assign

const https = require("https");
const fs = require("fs");
const config = require("dotenv").config();
const app = require("./lib/app");

if (config.error) {
  throw config.error;
}

const certOptions = {
  key: fs.readFileSync(process.env.KEY_PATH),
  cert: fs.readFileSync(process.env.CERT_PATH)
};

const server = https
  .createServer(certOptions, app)
  .listen(process.env.PORT, () => {
    const { port } = server.address();
    console.log("listening on port %s", port); // eslint-disable-line no-console
  });

module.exports = server;
