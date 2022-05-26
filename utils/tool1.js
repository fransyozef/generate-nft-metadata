const basePath = process.cwd();
const { tool1 } = require(`${basePath}/src/application.js`);

(() => {
  tool1();
})();
