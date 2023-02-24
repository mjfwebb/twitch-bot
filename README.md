<h1 align="center">Welcome to twitch-bot 👋</h1>
<p>
  <a href="" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/athanoquest" target="_blank">
    <img alt="Twitter: athanoquest" src="https://img.shields.io/twitter/follow/athanoquest.svg?style=social" />
  </a>
</p>

> Twitch Chat bot with custom commands, TTS, sounds, rewards, API integrations and more!

### ✨ [See it in action on Twitch](https://www.twitch.tv/athano)

Welcome to our Twitch Bot!

Please note that this bot is designed to be used by streamers who will also be running the bot themselves. While it may be possible to adapt the bot to work in other channels, this is outside the scope of this project.

If you need assistance with the Twitch API, you may find helpful information at https://dev.twitch.tv/docs/. 

We assume that users of this bot have some level of prior experience with programming. Please keep in mind that this project may not meet the needs of all users, but it does offer the ability to create a customized Twitch Bot.

This project was began with the example provided by Twitch at https://dev.twitch.tv/docs/irc/example-bot. Thanks for that, Twitch!

## 📦 Install

Client:

```sh
cd client
npm install
```

Server:

```sh
cd server
npm install
```

## 🔨 Usage

### Create required JSON files

**WARNING**: The resulting `.json` files will contain sensitive information when filled in correctly. Do not share this information.

| Required file | Desired filename          | Example filename                  | Required fields |
| ------------- | ------------------------- | --------------------------------- | --------------- |
| required      | twitchConfig.json         | example.twitchConfig.json         | all             |
| required      | tokens.json               | example.tokens.json               | all             |
| required      | mongoDBConfig.json        | example.mongoDBConfig.json        | all             |
| optional      | discordWebhookConfig.json | example.discordWebhookConfig.json | all             |
| optional      | spotifyConfig.json        | example.spotifyConfig.json        | all             |
| optional      | githubConfig.json         | example.githubConfig.json         | all             |

### Where to get the data

The listed scopes are relevant for the existing commands in the repository. If you would like to add new features with more in-depth API interactions then you should adjust the scopes accordingly.

#### twitchConfig.json

To get the auth_code construct your URL and enter it into the browser: 

```
https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=channel%3Amanage%3Aredemptions+channel%3Aread%3Aredemptions+moderator%3Amanage%3Abanned_users+chat%3Aread+chat%3Aedit+moderator%3Aread%3Achatters+channel%3Amanage%3Abroadcast
```

The required scopes are `channel:manage:redemptions`, `channel:read:redemptions`, `moderator:manage:banned_users` and `channel:manage:broadcast`. 

#### spotifyConfig.json

Visit https://developer.spotify.com/console/get-users-currently-playing-track/ to obtain the `oauth_token`.

The required scope is `user-read-currently-playing`.

#### githubConfig.json

Visit https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token to obtain the `access_token`

Ensure that the personal access token includes the scope to access and modify issues.

### Set up your commands

Open `server\src\handlers\botCommands.ts` and change the commands to fit your needs. There are several examples of different commands here.

Open `server\src\constants.ts` and change the values in the constants to fit your needs.

Alternatively use the `!addcommand` bot command when the server is running to create commands through the Bot itself. The functionality of commands created with `!addcommand` are limited in comparison to the hard-coded commands. For example: `!addcommand hello Hello everyone!` would add the command `!hello` which would send the message `Hello everyone!`.

You can use `%count%` in the message text to display how many times that command has been used. For example: `!addcommand test This command has been tested %count% times`.

To update descriptions use `!setdescription <commandId> this is my description`. Where `<commandId>` is replaced with the command ID in question. For example: `!setdescription test This is a test command!`

To update cooldowns use `!setcooldown <commandId> 1000`. Where `<commandId>` is replaced with the command ID in question, and the amount is in milliseconds. For example: `!setcooldown test 10000` would set a 10 second cooldown to the command "test".

### Start the bot

Client:

```sh
cd client
npm start
```

Server:

```sh
cd server
npm start
```

## 🕵️ Troubleshooting

Primarily, watch the console output for errors to troubleshoot issues.

For tokens that are saved in tokens.json (Twitch and Spotify), if you change your scope and there are already `access_token` and `refresh_token` present in the file, you should remove these token values. Once you have your new access code the program will retrieve a new `access_token` and `refresh_token`.

## 🔗 Links

* Twitch: [athano](https://twitch.tv/athano)
* Twitter: [@athanoquest](https://twitter.com/athanoquest)
* Game: [Between Worlds](https://www.betweenworlds.net)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/mjfwebb/twitch-bot/issues). 

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/athano">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## 📝 License

Copyright © 2022 [Michael Webb](https://github.com/mjfwebb).<br />
This project is [MIT](https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_  
