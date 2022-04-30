const basePath = process.cwd();
const { generateFromMetadataJson } = require(`${basePath}/src/application.js`);

(() => {
  generateFromMetadataJson();
})();
