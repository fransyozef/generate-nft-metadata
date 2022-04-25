const basePath = process.cwd();
const { updateBaseUri } = require(`${basePath}/src/application.js`);

(() => {
  updateBaseUri();
})();
