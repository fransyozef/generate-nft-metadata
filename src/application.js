const basePath = process.cwd();
const path = require('path');
const fs1 = require("fs");
const { promises: fs } = require("fs");
const mime = require('mime-types')
const sha1 = require(`${basePath}/node_modules/sha1`);
const {
    ASSETS_PATH,
    BUILD_PATH,
    IMAGES_PATH,
    JSON_PATH
} = require(`${basePath}/src/constants.js`);
const {
    PROJECT_CONFIG
} = require(`${basePath}/src/config.js`);

const metadataList = [];
const filesInput = [];
const generatedJsonList = [];

const buildSetup = () => {
    if (fs1.existsSync(BUILD_PATH)) {
        fs1.rmdirSync(BUILD_PATH, { recursive: true });
    }
    fs1.mkdirSync(BUILD_PATH);
    fs1.mkdirSync(JSON_PATH);
    fs1.mkdirSync(IMAGES_PATH);
};

const saveImage = async (index) => {
    const sourceFile = `${ASSETS_PATH}${filesInput[index]}`;
    const destFile = `${IMAGES_PATH}${index+1}.png`;
    try { 
        await fs.copyFile(sourceFile , destFile);
        const result = await fs.readFile(destFile);
        // if(result) console.log(`[${index}] copied ${sourceFile} to ${destFile}`)
    } catch (e) {
        console.log(e);
    }
}

const buildJson = (index) => {
    const dna = '';
    const _attributes = [];
    const attributes = [..._attributes, ...PROJECT_CONFIG.extraAttributes];
    let baseUri = PROJECT_CONFIG.baseUri;
    const baseUriCheck = baseUri.charAt(baseUri.length-1);
    baseUri = baseUriCheck === '/' ? baseUri : `${baseUri}/`;
    const tempData = {
        "name": `${PROJECT_CONFIG.namePrefix} #${index+1}`,
        "description": `${PROJECT_CONFIG.description}`,
        "image": `${baseUri}${index+1}.png`,
        "dna": sha1(`${PROJECT_CONFIG.namePrefix} #${index+1} ${Date.now()}`),
        "edition": index+1,
        "date": Date.now(),
        "compiler": "Metadata generator NFT by fransyozef",
        "attributes": attributes
    }
    const payload = { ...tempData, ...PROJECT_CONFIG.extraMetadata };
    saveJson(payload);
    metadataList.push(payload);
}

const saveJson = (payload) => {
    let filename = `${JSON_PATH}${payload.edition}.json`;
    fs1.writeFileSync(
        filename,
        JSON.stringify(payload, null, 2)
    );
    // console.log(`[${payload.edition}] metadata saved at ${filename}`);
}

const saveAllJson = () => {
    fs1.writeFileSync(
        `${JSON_PATH}_metadata.json`,
        JSON.stringify(metadataList, null, 2)
    );
}
const getSourceImages = async () => {
    try {
        const filenames = await fs.readdir(ASSETS_PATH);
        filenames.forEach(function (file) {
            const _file = `${ASSETS_PATH}${file}`;
            const _mime = mime.lookup(_file);
            if(_mime === 'image/png') {
                filesInput.push(file);
                console.log(`Found asset: ${file}`);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

const generate = async () => {
    buildSetup();
    await getSourceImages();
    const totalImages = filesInput.length;
    console.log(`Generating ${totalImages} pictures and metadata`);
    for (let i = 0; i < totalImages; i++) {
        await saveImage(i);
        buildJson(i);
        saveAllJson();
    }
    console.log('Done!');
}

const getGeneratedJson = async () => {
    try {
        const filenames = await fs.readdir(JSON_PATH);
        filenames.forEach(function (file) {
            const _file = `${ASSETS_PATH}${file}`;
            const _mime = mime.lookup(_file);
            if(_mime === 'application/json' && file !== '_metadata.json') {
                generatedJsonList.push(file);
                console.log(`Found json: ${file}`);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

const updateImageLocationInJson = async () => {
    const total = generatedJsonList.length;
    generatedJsonList.forEach((file) => {
        const filename = `${JSON_PATH}${file}`;
        let rawdata = fs1.readFileSync(filename);
        let data = JSON.parse(rawdata);
        const _imageSplit = data.image.split('/');
        const _filename = _imageSplit.pop();
        let baseUri = PROJECT_CONFIG.baseUri;
        const baseUriCheck = baseUri.charAt(baseUri.length-1);
        baseUri = baseUriCheck === '/' ? baseUri : `${baseUri}/`;        
        data.image = `${baseUri}${_filename}`;
        saveJson(data);
    });
}

const updateBaseUri = async () => {
    await getGeneratedJson();
    updateImageLocationInJson();
}


module.exports = { generate, saveImage, updateBaseUri };
