# Setup

Make sure you have [node](https://nodejs.org/) 18.16.0 or later installed.

## Install Client modules

```sh
cd client
npm install
```

## Install Server modules

```sh
cd server
npm install
```

## Setup configuration files

Create a `config.json` and `tokens.json` in the server folder using the examples files.

Navigate to the server folder and copy the example files to create your configuration files:

```bash
cd server
cp ./example.tokens.json ./tokens.json
cp ./example.config.json ./config.json

```

Once you have these files, go ahead and [configure them](CONFIGURATION.md)
