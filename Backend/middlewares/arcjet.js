const { isSpoofedBot } = require("@arcjet/inspect");
const aj = require("../utils/arcjet");  // no destructuring!

async function arcjetProtection(req, res, next) {
  try {
    const result = await aj.inspect(req); // must await

    if (result.isDenied()) {
      if (result.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit exceeded, please try again later." });
      } else if (result.reason.isBot()) {
        return res.status(403).json({ message: "Access denied for bots." });
      } else {
        return res.status(403).json({ message: "Request denied due to security reasons" });
      }
    }

    if (result.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "spoofed bot detected",
        message: "Access denied for malicious activity.",
      });
    }

    console.log("Arcjet inspection passed:", result);
    next();
  } catch (error) {
    console.log("Arcjet inspection error:", error);
    next(); // allow requests if inspection fails
  }
}

module.exports = { arcjetProtection };
