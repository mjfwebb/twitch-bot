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

It is highly recommended you use the setup script named `setup.mjs` to create these files. Do note however that the values in the created configuration files need to be updated with your own unique data.

Usage of setup.mjs:

```
  cd server
  node setup.mjs
```

If you want to forcefully recreate files:

```
  cd server
  node setup.mjs --force
```

If you want to create all files, including optional files:

```
  cd server
  node setup.mjs --all
```

If you want to forcefully recreate all files, including optional files:

```
  cd server
  node setup.mjs --all --force
```

Once you have these files, go ahead and [configure them](CONFIGURATION.md)