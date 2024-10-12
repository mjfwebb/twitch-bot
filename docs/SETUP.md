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

Follow the instructions in the [Twitch Developer Documentation](https://dev.twitch.tv/docs/authentication/register-app/) to create a new application.

Make sure you update the `redirect_uri` in `config.json` to the same URI that you entered in the `redirect_uri` field of the Twitch app you created. We suggest your `redirect_uri` is set to `http://localhost:3000`.

You will need to create an application and generate a client ID and client secret which will need to be entered into the ``twitch` section of the `config.json` file in the server folder. You can find more information about this in the [Twitch configuration guide](CONFIGURATION.md#twitch-auth-code)

## Spotify developer account

Follow the instructions in the [Spotify Developer Documentation](https://developer.spotify.com/documentation/web-api/tutorials/getting-started/) to create a new application.

Make sure you update the `redirect_uri` in `config.json` to the same URI that you entered in the `redirect_uri` field of the Spotify app you created. We suggest your `redirect_uri` is set to `http://localhost:3000`.

You will need to create an application and generate a client ID and client secret which will need to be entered into the ``spotify` section of the `config.json` file in the server folder. You can find more information about this in the [Spotify configuration guide](CONFIGURATION.md#spotify)

## Next steps... configuring the bot

Once you have done this, go ahead and [configure the bot](CONFIGURATION.md).
