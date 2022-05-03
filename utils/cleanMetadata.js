const basePath = process.cwd();
const { cleanMetadata } = require(`${basePath}/src/application.js`);

(() => {
  cleanMetadata();
})();
