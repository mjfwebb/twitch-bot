# Setup

Make sure you have [node](https://nodejs.org/) 18.16.0 or later installed.

## Code

### Clone the repository

```sh
git clone https://github.com/mjfwebb/twitch-bot.git
```

### Install Client modules

```sh
cd client
npm install
```

### Install Server modules

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

## Twitch developer account

You will need a [Twitch developer account](https://dev.twitch.tv/console/apps) to create a Twitch application.

Follow the instructions in the [Twitch Developer Documentation](https://dev.twitch.tv/docs/authentication/register-app/) to create a new application.

You will need to create an application and generate a client ID and secret which will need to be added to twitch section of the `config.json` file in the server folder.

## Next steps... configuring the bot

Once you have done this, go ahead and [configure the bot](CONFIGURATION.md).
