# generate-nft-metadata

A simple tool to generate json metadata (and renaming the files) when you already have your own artwork for nft


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

## Supply your source images

Put your images in the `assets` folder.

## Config

in `src/config.js` you will find the base configuration for each json file.

## Start building

in your terminal type 

```sh
npm run rebuild
```

this will generate the json in `build/json` and rename / copy your source files to `build/images` folder.

## Update the base uri

Once you have uploaded all your images to Pinata / IPFS , you need to update the baseUri in the json files.

Open the config file in `src/config.js`  and change the `baseUri` value. 

Remember to always end with a `/`. So for example `ipfs://sdflkjdsfg` is INCORRECT. The correct way is `ipfs://sdflkjdsfg/`

Next, in your terminal type

```sh
npm run updateBaseUri
```

## Generate a collection with only 1 media

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