const basePath = process.cwd();
const { generateFixedMedia } = require(`${basePath}/src/application.js`);

(() => {
  generateFixedMedia();
})();
