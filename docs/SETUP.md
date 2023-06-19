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

It is highly recommended you use the setup script named `setup.mjs` to set the configuration.json settings. To do so, run the `node setup.mjs` script.

```
  cd server
  node setup.mjs
```


Once you have these files, go ahead and [configure them](CONFIGURATION.md)