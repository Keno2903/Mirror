const express = require("express");
const app = express();
const cors = require("cors");
fs = require("fs");
var router = express.Router();

// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

app.use("/", router);

app.use(cors());

app.post("/writeFile", async (req, res) => {
  try {
    const { objects } = req.body;

    let config = `
    
DerFelixo
11:37 (vor 24 Minuten)
an mich

/* MagicMirror² Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 */
let config = {
address: "0.0.0.0", // Address to listen on, can be:
// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
// - another specific IPv4/6 to listen on a specific interface
// - "0.0.0.0", "::" to listen on any interface
// Default, when address config is left out or empty, is "localhost"
port: 8080,
basePath: "/", // The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
// you must set the sub path here. basePath must end with a /
ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
// or add a specific IPv4 of 192.168.1.5 :
// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

useHttps: false, // Support HTTPS or not, default "false" will use HTTP
httpsPrivateKey: "", // HTTPS private key path, only require when useHttps is true
httpsCertificate: "", // HTTPS Certificate path, only require when useHttps is true

language: "en",
locale: "en-US",
logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
timeFormat: 24,
units: "metric",
// serverOnly:  true/false/"local" ,
// local for armv6l processors, default
//   starts serveronly and then starts chrome browser
// false, default for all NON-armv6l devices
// true, force serveronly mode, because you want to.. no UI on this device

modules: [
{
module: "mmpm",
},
${objects.map((obj) => {

  switch (obj.value) {
    case "MMM-Jast":
      return `{
        module: "${obj.value}",
        position: "${obj.position}",
        hiddenOnStartup: false,
        disabled: false,
        config:  {
          currencyStyle: "code", // One of ["code", "symbol", "name"]
          fadeSpeedInSeconds: 3.5,
          lastUpdateFormat: "HH:mm",
          maxChangeAge: 1 * 24 * 60 * 60 * 1000,
          maxWidth: "100%",
          numberDecimalsPercentages: 1,
          numberDecimalsValues: 2,
          scroll: "vertical", // One of ["none", "vertical", "horizontal"]
          showColors: true,
          showCurrency: true,
          showChangePercent: true,
          showChangeValue: false,
          showChangeValueCurrency: false,
          showHiddenStocks: false,
          showLastUpdate: false,
          showPortfolioValue: false,
          showPortfolioGrowthPercent: false,
          showPortfolioGrowth: false,
          updateIntervalInSeconds: 300,
          useGrouping: false,
          virtualHorizontalMultiplier: 2,
          stocks: [
          { name: "BASF", symbol: "BAS.DE", quantity: 10 },
          { name: "SAP", symbol: "SAP.DE", quantity: 15 },
          { name: "Henkel", symbol: "HEN3.DE", hidden: true },
          { name: "Alibaba", symbol: "BABA"}
          ]
          },
      }`;
      case "MMM-AirQuality":
        return `{
          module: "${obj.value}",
          position: "${obj.position}",
          hiddenOnStartup: false,
          disabled: false,
          config: {
            location: "Cologne"
      
          },
        }`;
    default:
      return `{
        module: "${obj.value}",
        position: "${obj.position}",
        hiddenOnStartup: false,
        disabled: false,
        config: {
        },
      }`;
  }
})}
]
};


/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
    `;

    if (!objects) next(createError(401));
    fs.truncate("C:/Users/Schüler/Desktop/config.txt", 0, function () {
      fs.writeFile(
        "C:/Users/Schüler/Desktop/config.txt",
        `${config}`,
        function (err) {
          if (err) {
            return console.log("Error writing file: " + err);
          }
        }
      );
    });
    res.status(200).json(name);
  } catch (e) {
    console.log(e);
  }
});

app.get("/readFile", (req, res) => {
  fs.readFile(
    "C:/Users/Schüler/Desktop/config.txt",
    "utf8",
    function (err, data) {
      // Display the file content
      console.log(data);
      res.send(data);
    }
  );
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
