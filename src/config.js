const basePath = process.cwd();
const {
    ASSETS_PATH,
} = require(`${basePath}/src/constants.js`);

const PROJECT_CONFIG = {
    namePrefix: 'Your Collection',
    description: 'Remember to replace this description',
    baseUri: "ipfs://NewUriToReplace/",
    extraMetadata : {
        author : "Fransjo Leihitu"
    },
    extraAttributes : [],
}

module.exports = {
    PROJECT_CONFIG
};