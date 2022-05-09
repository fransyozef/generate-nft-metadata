const basePath = process.cwd();
const {
    ASSETS_PATH,
} = require(`${basePath}/src/constants.js`);

const PROJECT_CONFIG = {
    namePrefix: 'Your Collection',
    description: 'Remember to replace this description',
    baseUri: "ipfs://NewUriToReplace/",
    extraMetadata: {
        author: "Fransjo Leihitu"
    },
    extraAttributes: [
        {
            "trait_type": "color",
            "value": "black"
        }
    ],
    fixedMedia: {
        filename: 'test.png',
        editions: 10
    },
    format: {
        width: 512,
        height: 512,
        smoothing: false,
    },
    removeMetaData : [
        "edition",
        "dna",
        "date",
        "compiler",
        "author"
    ]
}

module.exports = {
    PROJECT_CONFIG
};