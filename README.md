<h1 align="center">Welcome to twitch-bot 👋</h1>
<p>
  <a href="" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/athanoquest" target="_blank">
    <img alt="Twitter: athanoquest" src="https://img.shields.io/twitter/follow/athanoquest.svg?style=social" />
  </a>
</p>

> Twitch Chat bot with custom commands, sounds, rewards and more!

### ✨ [See it in action on Twitch](https://www.twitch.tv/athano)

Welcome to our Twitch Bot! At the moment, only the server functionality is available. However, we are working on adding client functionality in the near future.

Please note that this bot is designed to be used by streamers who will also be running the bot themselves. While it may be possible to adapt the bot to work in other channels, this is outside the scope of this project.

If you need assistance with the Twitch API, you may find helpful information at https://dev.twitch.tv/docs/. 

We assume that users of this bot have some level of prior experience with programming. Please keep in mind that this project may not meet the needs of all users, but it does offer the ability to create a customized Twitch Bot.

This project was began with the example provided by Twitch at https://dev.twitch.tv/docs/irc/example-bot. Thanks for that, Twitch!

## Install

```sh
cd server
npm install
```

## Usage

### Create required JSON files

Create a `twitchConfig.json` file using the example file `example.twitchConfig.json` as a basis. All fields are required.

**NOTE**: The resulting twitchConfig.json file will contains sensitive information when filled in correctly. Do not share this information.
```sh
cd server
cp example.twitchConfig.json twitchConfig.json
```

#### **Where to get oauth_password and auth_code**

To get the oauth_password (for logging into the Twitch chat) you can use for example TMI https://twitchapps.com/tmi/

To get the auth_code construct your URL and enter it into the browser: 

```
https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=channel%3Amanage%3Aredemptions+channel%3Aread%3Aredemptions+moderator%3Amanage%3Abanned_users
```

Required scopes are channel:manage:redemptions, channel:read:redemptions and moderator:manage:banned_users

NOTE: If you have an existing access_token and refresh_token and change your scope, you should remove these from the tokens.json file (so they are then empty strings). Once you have your new access code the program will retrieve a new access_token and refresh_token.

2. Create a `tokens.json` file using the example file `example.tokens.json` as a basis. All fields are required.

**NOTE**: The resulting tokens.json file will contains sensitive information when filled in correctly. Do not share this information.
```sh
cd server
cp example.tokens.json tokens.json
```

3. Create a `discordWebhookConfig.json` file using the example file `example.discordWebhookConfig.json` as a basis. All fields are required.

**NOTE**: The resulting discordWebhookConfig.json file will contains sensitive information when filled in correctly. Do not share this information.
```sh
cd server
cp example.discordWebhookConfig.json discordWebhookConfig.json
```

If you don't want to use a Discord Webhook then you will need to edit the call to `discordChatWebhook`.

### Set up your commands

Open `server\src\handlers\botCommands.ts` and change the commands to fit your needs. There are several examples of different commands here.

Open `server\src\constants.ts` and change the values in the constants to fir your needs.

### Start the server

```sh
cd server
npm start
```

Watch the output for errors to troubleshoot issues.

## Author

👤 **Michael Webb**

* Twitch: [athano](https://twitch.tv/athano)
* Twitter: [@athanoquest](https://twitter.com/athanoquest)
* Game: [Between Worlds ](https://www.betweenworlds.net)

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