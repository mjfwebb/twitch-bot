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

## Install
[View INSTALL instructions](./docs/INSTALL.md)


## Configuration
[View CONFIGURATION instructions](./docs/CONFIGURATION.md)

## Start the bot

Client for Chat, Tasks and Spotify overlays:

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
