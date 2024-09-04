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

Note that if you want to change the port the server runs on, you can do so in the `config.json` file. You must also change the value for VITE_BOT_SERVER in .env.development in the client folder.

Once you have these files, go ahead and [configure them](CONFIGURATION.md)
