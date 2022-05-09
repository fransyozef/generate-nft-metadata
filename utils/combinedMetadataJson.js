const basePath = process.cwd();
const { combinedMetadataJson } = require(`${basePath}/src/application.js`);

(() => {
  combinedMetadataJson();
})();
