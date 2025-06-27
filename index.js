const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Proxy Server is running. Use /get_symbols to fetch data.");
});

app.get("/get_symbols", async (req, res) => {
  const targetUrl = "http://trading-access.infy.uk/get_symbols.php?i=1";

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    // Wait for JS to run and set the cookie + redirect
    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
      await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });
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
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
