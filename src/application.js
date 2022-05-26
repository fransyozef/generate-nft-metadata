const basePath = process.cwd();
const path = require('path');
const fs1 = require("fs");
const { promises: fs } = require("fs");
const mime = require('mime-types')
const sha1 = require(`${basePath}/node_modules/sha1`);
const { createCanvas, Image } = require(`${basePath}/node_modules/canvas`);
const { parse } = require('csv-parse');
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

const copyImage = async (sourceFile, destFile) => {
    console.log(sourceFile, destFile);
    // const sourceFile = `${ASSETS_PATH}${_prePath}${filesInput[index]}`;
    // const destFile = `${IMAGES_PATH}${index + 1}.png`;
    try {
        await fs.copyFile(sourceFile, destFile);
        const result = await fs.readFile(destFile);
        // if(result) console.log(`[${index}] copied ${sourceFile} to ${destFile}`)
    } catch (e) {
        console.log(e);
    }
}

const buildJson = (index, _media, _jsonFilename) => {
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
    saveJson(payload, _jsonFilename);
    metadataList.push(payload);
}

const saveJson = (payload, _filename) => {
    fs1.writeFileSync(
        _filename,
        JSON.stringify(payload, null, 2)
    );
}

const saveAllJson = (_metadataList) => {
    const __metadataList = _metadataList ? _metadataList : metadataList;
    fs1.writeFileSync(
        `${JSON_PATH}_metadata.json`,
        JSON.stringify(__metadataList, null, 2)
    );
}
const getSourceImages = async () => {
    const tool1Path = `${ASSETS_PATH}tool1/`;
    try {
        const filenames = await fs.readdir(tool1Path);
        filenames.forEach(function (file) {
            const _file = `${tool1Path}${file}`;
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

const tool1 = async () => {
    buildSetup();
    await getSourceImages();
    const totalImages = filesInput.length;
    console.log(`Generating ${totalImages} pictures and metadata`);
    for (let i = 0; i < totalImages; i++) {
        const sourceFile = `${ASSETS_PATH}tool1/${filesInput[i]}`;
        const destFile = `${IMAGES_PATH}${i + 1}.png`;
        await copyImage(sourceFile, destFile);
        buildJson(i, null, `${JSON_PATH}${i + 1}.json`);
        saveAllJson();
    }
    showSupport();
}

const getGeneratedJson = async (_path) => {
    const generatedJsonList = [];
    try {
        const filenames = await fs.readdir(_path);
        filenames.forEach(function (file) {
            const _file = `${_path}${file}`;
            const _mime = mime.lookup(_file);
            if (_mime === 'application/json' && file !== '_metadata.json') {
                generatedJsonList.push(`${_path}${file}`);
                console.log(`Found json: ${file}`);
            }
        });
        return generatedJsonList;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const cleanupMetadata = async (_files) => {
    _files.forEach((file) => {
        const _exportFilename = getFilename(file);
        if (_exportFilename) {
            const exportFilename = `${JSON_PATH}${_exportFilename}`;
            let rawdata = fs1.readFileSync(file);
            let data = JSON.parse(rawdata);
            PROJECT_CONFIG.removeMetaData.forEach((metadata) => {
                if (data[metadata]) {
                    delete data[metadata];
                }
            });
            fs1.writeFileSync(
                exportFilename,
                JSON.stringify(data, null, 2)
            );
            console.log(`Wrote new metadata in ${exportFilename}`);
        } else {
            console.log('[ERROR] Could not get filename!');
        }
    });
}

const tool6 = async () => {
    buildSetup();
    const files = await getGeneratedJson(`${ASSETS_PATH}tool6/`);
    cleanupMetadata(files);
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

const updateImageLocationInJson = async (files) => {
    files.forEach((file) => {
        let rawdata = fs1.readFileSync(file);
        let data = JSON.parse(rawdata);
        const _imageSplit = data.image.split('/');
        const _filename = _imageSplit.pop();
        let baseUri = PROJECT_CONFIG.baseUri;
        const baseUriCheck = baseUri.charAt(baseUri.length - 1);
        baseUri = baseUriCheck === '/' ? baseUri : `${baseUri}/`;
        data.image = `${baseUri}${_filename}`;
        const exportfileName = getFilename(file);
        if (exportfileName) {
            saveJson(data, `${JSON_PATH}${exportfileName}`);
        } else {
            console.log('[ERROR] Could not create export filename!');
        }
    });
}

const getFilename = (_filename) => {
    if (!_filename) return null;
    try {
        const parts = _filename.split('/');
        const filename = parts.pop();
        return filename;
    } catch (e) {
        return _filename;
    }
}

const tool4 = async () => {
    buildSetup();
    const files = await getGeneratedJson(`${ASSETS_PATH}tool4/`);
    if (files && files.length > 0) {
        updateImageLocationInJson(files);
    } else {
        console.log('[ERROR] No files found!')
    }
    showSupport();
}

const tool2 = () => {
    buildSetup();
    const totalMetadata = PROJECT_CONFIG.fixedMedia.editions;
    console.log(`Generating ${totalMetadata} metadata with fixed media : ${PROJECT_CONFIG.fixedMedia.filename}`);
    for (let i = 0; i < totalMetadata; i++) {
        buildJson(i, PROJECT_CONFIG.fixedMedia.filename, `${JSON_PATH}${i + 1}.json`);
        saveAllJson();
    }
    showSupport();
}

const tool3 = () => {
    buildSetup();
    const metadataJson = `${ASSETS_PATH}tool3/_metadata.json`;
    console.log(`Reading ${metadataJson}`);
    let rawdata = fs1.readFileSync(metadataJson);
    let data = JSON.parse(rawdata);
    if (data && data.length > 0) {
        data.forEach((element) => {
            const _filename = `${element.edition}.json`;
            console.log(`Exporting to ${_filename}`);
            const filename = `${JSON_PATH}${_filename}`;
            saveJson(element, filename);
        });
    }
    showSupport();
}

const tool5 = async () => {
    buildSetup();
    initCanvas();
    const metadataJson = `${ASSETS_PATH}tool5/_metadata.json`;
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
                    let layer = `${ASSETS_PATH}tool5/layers/${attribute.trait_type}/`;
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
                    const exportJson = `${JSON_PATH}${element.edition}.json`;
                    saveJson(element, exportJson);
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

const tool7 = async () => {
    buildSetup();
    const jsonFilesPath = `${ASSETS_PATH}tool7/`;
    const filenames = await fs.readdir(jsonFilesPath);
    let payload = [];
    filenames.forEach(function (file) {
        if (file !== '_metadata.json') {
            const _mime = mime.lookup(file);
            if (_mime === 'application/json') {
                console.log(`Found json file: ${file}`);
                let _file = `${jsonFilesPath}${file}`;
                let rawdata = fs1.readFileSync(_file);
                let data = JSON.parse(rawdata);
                payload.push(data);
            }
        }
    });

    console.log(' ');
    if (payload.length > 0) {
        console.log('Ready to generate _metadata.json');
        const metadataJson = `${JSON_PATH}_metadata.json`;
        fs1.writeFileSync(
            metadataJson,
            JSON.stringify(payload, null, 2)
        );
        console.log(`Check in ${JSON_PATH}`);
    } else {
        console.log('No json files where found!!!!');
    }

    showSupport();
}

const tool8 = () => {
    buildSetup();
    const importCSV = `${ASSETS_PATH}tool8/import.csv`;
    const csvData = [];
    fs1.createReadStream(importCSV)
        .pipe(parse({ delimiter: '|' }))
        .on('data', function (csvrow) {
            csvData.push(csvrow);
        })
        .on('end', function () {
            if (csvData.length > 0) {
                const columnNames = csvData.shift();
                columnNames.shift();
                if (csvData.length > 0) {
                    for (let q = 0; q < csvData.length; q++) {
                        const line = csvData[q];
                        const attributes = [];
                        const fileName = line.shift();
                        const counterParts = fileName.split('.json');
                        const counter = counterParts[0];
                        for (let i = 0; i < line.length; i++) {
                            if (line[i] != '') {
                                const attribute = {
                                    "trait_type": `${columnNames[i]}`,
                                    "value": `${line[i]}`
                                };
                                attributes.push(attribute);
                            }
                        }
                        PROJECT_CONFIG.extraAttributes = attributes;
                        buildJson(counter - 1, null, `${JSON_PATH}${fileName}`);
                    }
                } else {
                    console.log('[ERROR] You have headers but no any CSV data!!!!');
                }
            } else {
                console.log('[ERROR] Could not find any CSV data!!!!');
            }
            showSupport();
        });
}

module.exports = {
    tool1,
    tool2,
    tool3,
    tool4,
    tool5,
    tool7,
    tool6,
    tool8,
    showSupport,
};
