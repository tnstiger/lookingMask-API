const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Ddos = require("ddos");
const ddos = new Ddos({
  burst: 10,
  limit: 10,
  errormessage: "系統太多人連線，請稍候操作"
});

const { env, port, SSLCerts } = require("./config");

app.use(ddos.express);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public/dist"));

const router = require("./router");
app.use(router);
app.listen(port);

if (env != "dev") {
  app.all("*", (req, res, next) => {
    if (req.secure) {
      return next();
    }
    res.redirect("https://" + req.host + req.url); // handle port numbers if non 443
  });

  let options = {
    cert: fs.readFileSync(SSLCerts.cert),
    key: fs.readFileSync(SSLCerts.key)
  };

  let server = https.createServer(options, app);

  server.listen(443);
}
