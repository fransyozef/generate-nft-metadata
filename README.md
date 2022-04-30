# generate-nft-metadata

Simple toolset to generate metadata


## Support
Like this tool? Want to support me? Please donate some crypto to me (so I can support my 4 wives and 11 kids and 3 dogs) 

** ETH : 0xb0e73af58a9fdece76ba74a0cfb09265ae7e45d0

** Polygon : 0x70a0D3c75853f706B17970727A25113a63bCAf1f

## NodeJS version
This tool was tested with nodejs version v14.19.1

## Install
Open your terminal and navigate to the project root folder and type :

```sh
npm install
```

## Config file

The config file is located in `/src/config.js`


## Tool #1 - Generate json file from images

Let's say you have some images, but don't have any metadata json file.

Put your images in the `/assets/` folder.

then run the command 

```sh
npm run generate:fromImages
```

this will generate the json files in `/build/json` and rename & copy your source images files to `/build/images/` folder.


## Tool #2 - Generate a collection with only 1 media

If you want to generate metadata for your collection witht only 1 media (png,mp4) , you can use the command

```sh
npm run generate:fixedMedia
```

In the config file you can set the filename and the editions to generate :

```
    fixedMedia : {
        filename : 'test.png',
        editions : 10
    }
```

This will generate 10 metadata with all pointing to the same filename.


## Tool #3 - Generate json files from the _metadata.json

If you want to generate json files that are stored in the _metadata.json, use the command

```sh
npm run generate:fromMetadata
```

Put the `_metadata.json` in the `/assets/` folder. The json files will be exported in the `/build/json/` folder.


## Tool #4 - Update the base uri

Once you have uploaded all your images to Pinata / IPFS , you need to update the baseUri in the json files.

Open the config file in `src/config.js`  and change the `baseUri` value. 

Next, in your terminal type

```sh
npm run updateBaseUri
```