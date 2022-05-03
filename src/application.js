const basePath = process.cwd();
const path = require('path');
const fs1 = require("fs");
const { promises: fs } = require("fs");
const mime = require('mime-types')
const sha1 = require(`${basePath}/node_modules/sha1`);
const { createCanvas, Image } = require(`${basePath}/node_modules/canvas`);
const {
    ASSETS_PATH,
    BUILD_PATH,
    IMAGES_PATH,
    JSON_PATH,
    LAYERS_PATH
} = require(`${basePath}/src/constants.js`);
const {
    PROJECT_CONFIG
} = require(`${basePath}/src/config.js`);

const metadataList = [];
const filesInput = [];
const generatedJsonList = [];

let canvas, ctx;
const initCanvas = () => {
    canvas = createCanvas(PROJECT_CONFIG.format.width, PROJECT_CONFIG.format.height);
    ctx = canvas.getContext("2d");
    imageSmoothingEnabled = PROJECT_CONFIG.format.smoothing;
}

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
    const destFile = `${IMAGES_PATH}${index + 1}.png`;
    try {
        await fs.copyFile(sourceFile, destFile);
        const result = await fs.readFile(destFile);
        // if(result) console.log(`[${index}] copied ${sourceFile} to ${destFile}`)
    } catch (e) {
        console.log(e);
    }
}

const buildJson = (index, _media) => {
    const dna = '';
    const _attributes = [];
    let attributes = [];
    if (PROJECT_CONFIG.extraAttributes) {
        attributes = [..._attributes, ...PROJECT_CONFIG.extraAttributes];
    } else {
        attributes = _attributes;
    }
    let baseUri = PROJECT_CONFIG.baseUri;
    const baseUriCheck = baseUri.charAt(baseUri.length - 1);
    baseUri = baseUriCheck === '/' ? baseUri : `${baseUri}/`;
    const media = _media ? `${baseUri}${_media}` : `${baseUri}${index + 1}.png`;
    const tempData = {
        "name": `${PROJECT_CONFIG.namePrefix} #${index + 1}`,
        "description": `${PROJECT_CONFIG.description}`,
        "image": `${media}`,
        "dna": sha1(`${PROJECT_CONFIG.namePrefix} #${index + 1} ${Date.now()}`),
        "edition": index + 1,
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
            if (_mime === 'image/png') {
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
    showSupport();
}

const getGeneratedJson = async () => {
    try {
        const filenames = await fs.readdir(JSON_PATH);
        filenames.forEach(function (file) {
            const _file = `${ASSETS_PATH}${file}`;
            const _mime = mime.lookup(_file);
            if (_mime === 'application/json' && file !== '_metadata.json') {
                generatedJsonList.push(file);
                console.log(`Found json: ${file}`);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

const cleanupMetadata = async () => {
    generatedJsonList.forEach((file) => {
        const filename = `${JSON_PATH}${file}`;
        let rawdata = fs1.readFileSync(filename);
        let data = JSON.parse(rawdata);
        const edition = data?.edition;
        delete data?.edition;
        delete data?.dna;
        delete data?.date;
        delete data?.compiler;
        delete data?.author;
        fs1.writeFileSync(
            filename,
            JSON.stringify(data, null, 2)
        );        
        console.log(`Wrote new metadata in ${filename}`);
    });
}

const cleanMetadata = async () => {
    await getGeneratedJson();
    cleanupMetadata();
    showSupport();
}

const showSupport = () => {
    console.log('');
    console.log('Done!');
    console.log('');
    console.log(`
        Like this tool? Want to support me? Please donate some crypto to me (so I can support my 4 wives and 11 kids and 3 dogs) 

        ** ETH : 0xb0e73af58a9fdece76ba74a0cfb09265ae7e45d0
        
        ** Polygon : 0x70a0D3c75853f706B17970727A25113a63bCAf1f
    `);
}

const updateImageLocationInJson = async () => {
    generatedJsonList.forEach((file) => {
        const filename = `${JSON_PATH}${file}`;
        let rawdata = fs1.readFileSync(filename);
        let data = JSON.parse(rawdata);
        const _imageSplit = data.image.split('/');
        const _filename = _imageSplit.pop();
        let baseUri = PROJECT_CONFIG.baseUri;
        const baseUriCheck = baseUri.charAt(baseUri.length - 1);
        baseUri = baseUriCheck === '/' ? baseUri : `${baseUri}/`;
        data.image = `${baseUri}${_filename}`;
        saveJson(data);
    });
}

const updateBaseUri = async () => {
    await getGeneratedJson();
    updateImageLocationInJson();
    showSupport();
}

const generateFixedMedia = () => {
    buildSetup();
    // await getSourceImages();
    const totalMetadata = PROJECT_CONFIG.fixedMedia.editions;
    console.log(`Generating ${totalMetadata} metadata with fixed media : ${PROJECT_CONFIG.fixedMedia.filename}`);
    for (let i = 0; i < totalMetadata; i++) {
        // await saveImage(i);
        buildJson(i, PROJECT_CONFIG.fixedMedia.filename);
        // saveAllJson();
    }
    showSupport();
}

const generateFromMetadataJson = () => {
    buildSetup();
    const metadataJson = `${ASSETS_PATH}_metadata.json`;
    console.log(`Reading ${metadataJson}`);
    let rawdata = fs1.readFileSync(metadataJson);
    let data = JSON.parse(rawdata);
    if (data && data.length > 0) {
        data.forEach((element) => {
            // console.log(element);
            console.log(`Exporting to ${element.edition}.json`);
            saveJson(element);
        });
    }
    showSupport();
}

const generateFromMetadataJsonAndLayers = async () => {
    buildSetup();
    initCanvas();
    const metadataJson = `${ASSETS_PATH}_metadata.json`;
    console.log(`Reading ${metadataJson}`);
    console.log('');
    let rawdata = fs1.readFileSync(metadataJson);
    let data = JSON.parse(rawdata);
    let fileStack = [];
    if (data && data.length > 0) {
        for (x = 0; x < data.length; x++) {
            const element = data[x];
            if (element?.attributes) {
                fileStack = [];
                for (i = 0; i < element.attributes.length; i++) {
                    const attribute = element.attributes[i];
                    let layer = `${LAYERS_PATH}${attribute.trait_type}/`;
                    let filename = attribute.value;
                    const filenames = await fs.readdir(layer);
                    filenames.forEach(function (file) {
                        let _file = file.replace('.png', '');
                        let fileParts = _file.split('#');
                        if (fileParts[0] === filename) {
                            fileStack.push(`${layer}${file}`);
                        }
                    });
                }
                if (fileStack.length > 0) {
                    for (i = 0; i < fileStack.length; i++) {
                        const image = fileStack[i];
                        const img = new Image();
                        img.onload = () => ctx.drawImage(img, 0, 0);
                        img.onerror = err => { throw err }
                        img.src = image;
                    }
                    const filename = `${IMAGES_PATH}${element.edition}.png`;
                    fs1.writeFileSync(
                        filename,
                        canvas.toBuffer("image/png")
                    );
                    console.log(`png saved at ${filename}`);
                    console.log(`metadata saved`);
                    console.log(` `);
                    saveJson(element);
                }

                let filename = `${JSON_PATH}_metadata.json`;
                fs1.writeFileSync(
                    filename,
                    JSON.stringify(data, null, 2)
                );

                initCanvas();
            }
        }
    }
    showSupport();
}

module.exports = {
    generate,
    saveImage,
    updateBaseUri,
    generateFixedMedia,
    generateFromMetadataJson,
    generateFromMetadataJsonAndLayers,
    cleanMetadata,
    showSupport
};
