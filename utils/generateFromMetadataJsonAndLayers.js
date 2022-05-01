const basePath = process.cwd();
const { generateFromMetadataJsonAndLayers } = require(`${basePath}/src/application.js`);

(() => {
  generateFromMetadataJsonAndLayers();
})();
