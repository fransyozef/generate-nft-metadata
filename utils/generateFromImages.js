const basePath = process.cwd();
const { generate } = require(`${basePath}/src/application.js`);

(() => {
  generate();
})();
