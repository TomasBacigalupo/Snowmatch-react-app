module.exports = {
  source: "build",
  destination: "build",
  include: [
    "/",
    "/cerro-catedral",
    "/cerro-catedral/esqui",
    "/cerro-catedral/snowboard",
    "/cerro-catedral/esqui/clases-privadas",
    "/cerro-catedral/snowboard/clases-privadas",
    "/cerro-bayo",
    "/cerro-bayo/esqui",
    "/cerro-bayo/snowboard",
    "/cerro-bayo/esqui/clases-privadas",
    "/cerro-bayo/snowboard/clases-privadas",
    "/perito-moreno",
    "/perito-moreno/esqui",
    "/perito-moreno/snowboard",
    "/perito-moreno/esqui/clases-privadas",
    "/perito-moreno/snowboard/clases-privadas",
    "/las-pendientes",
    "/las-pendientes/esqui",
    "/las-pendientes/snowboard",
    "/las-pendientes/esqui/clases-privadas",
    "/las-pendientes/snowboard/clases-privadas",
    "/lago-hermoso",
    "/lago-hermoso/esqui",
    "/lago-hermoso/snowboard",
    "/lago-hermoso/esqui/clases-privadas",
    "/lago-hermoso/snowboard/clases-privadas",
    "/cerro-chapelco",
    "/cerro-chapelco/esqui",
    "/cerro-chapelco/snowboard",
    "/cerro-chapelco/esqui/clases-privadas",
    "/cerro-chapelco/snowboard/clases-privadas",
    "/la-hoya",
    "/la-hoya/esqui",
    "/la-hoya/snowboard",
    "/la-hoya/esqui/clases-privadas",
    "/la-hoya/snowboard/clases-privadas",
    "/cerro-castor",
    "/cerro-castor/esqui",
    "/cerro-castor/snowboard",
    "/cerro-castor/esqui/clases-privadas",
    "/cerro-castor/snowboard/clases-privadas",
    "/resort/*/*",
    "/resort/*/*/*"
  ],
  puppeteerArgs: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--disable-gpu"
  ],
  puppeteerExecutablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  minifyHtml: {
    collapseWhitespace: false,
    removeComments: false
  },
  waitUntil: ["networkidle0", "load", "domcontentloaded"],
  puppeteerIgnoreHTTPSErrors: true,
  fixWebpackChunksIssue: false,
  removeBlobs: true,
  inlineCss: true,
  preloadImages: true,
  cacheAjaxRequests: true,
  removeScriptTags: false,
  async: true,
  timeout: 300000,
  waitFor: 2000,
  headless: true,
  crawl: false,
  skipThirdPartyRequests: true,
  skipEnabled: true,
  skip: ["/404.html", "/500.html"],
  puppeteerEvaluate: async (page) => {
    // Mock fbq function to prevent errors during pre-rendering
    await page.evaluateOnNewDocument(() => {
      window.fbq = function() {};
    });
  },
  puppeteerPageOptions: {
    waitUntil: ["networkidle0", "load", "domcontentloaded"],
    timeout: 300000
  },
  puppeteerPageErrorHandler: async (error, page) => {
    console.log(`Error on page ${page.url()}: ${error.message}`);
    return true; // Continue with other pages
  }
}; 