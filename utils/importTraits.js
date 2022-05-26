const basePath = process.cwd();
const { importTraits } = require(`${basePath}/src/application.js`);

(() => {
  importTraits();
})();
