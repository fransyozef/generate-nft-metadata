# generate-nft-metadata

A simple tool to generate json metadata (and renaming the files) when you already have your own artwork for nft

# NodeJS version
This tools was tested with nodejs version v14.19.1

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

And you're all set


## Support

Like this tool? Want to support me? Please donate some ETH to me (so I can support my 4 wives and 11 kids and 3 dogs) : 0xb0e73af58a9fdece76ba74a0cfb09265ae7e45d0