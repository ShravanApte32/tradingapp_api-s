/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 193:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__(252);
const symbolController = __webpack_require__(244);
const router = express.Router();
router.route('/').get(symbolController.getSymbols);
module.exports = router;

/***/ }),

/***/ 244:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  default: puppeteer
} = __webpack_require__(758);
const getSymbols = async (req, res) => {
  try {
    const targetUrl = "http://trading-access.infy.uk/get_symbols.php?i=1";
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
      await page.waitForNavigation({
        waitUntil: "networkidle2",
        timeout: 10000
      });
    } catch (_) {
      // It's okay if redirect didn't happen in time
    }
    const content = await page.content();
    await browser.close();
    res.send(content);
  } catch (error) {
    console.error("❌ Puppeteer Error:", error.message);
    res.status(500).send(`Error fetching symbols: ${error.message}`);
  }
};
module.exports = {
  getSymbols
};

/***/ }),

/***/ 252:
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ 577:
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ 758:
/***/ ((module) => {

"use strict";
module.exports = require("puppeteer");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
const express = __webpack_require__(252);
const puppeteer = __webpack_require__(758);
const cors = __webpack_require__(577);
const symbolRouter = __webpack_require__(193);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.get("/", (req, res) => {
  res.send("✅ Proxy server is running. Use /get_symbols");
});
app.use('/get_symbols', symbolRouter);
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
/******/ })()
;