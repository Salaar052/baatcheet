const arcjetPkg = require("@arcjet/node");
const arcjet = arcjetPkg.default;  // <-- use .default for the function
const { shield, detectBot, slidingWindow } = arcjetPkg;

const ENV = require("./ENV");

const aj = arcjet({
  key: ENV.ARCJET_API_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    slidingWindow({
      mode: "LIVE",
      max: 100,
      interval: 60,
    }),
  ],
});

module.exports = aj;
