<h1 align="center">Welcome to twitch-bot</h1>
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

This bot is intended for self-hosting streamers. Its adaptation for other channels is not covered in this project.

For Twitch API help, visit https://dev.twitch.tv/docs/.

This bot assumes users have programming experience. Please keep in mind that this project may not meet the needs of all users, but it does offer the ability to create a customized Twitch Bot.

We used Twitch's example at https://dev.twitch.tv/docs/irc/example-bot as a starting point. Thanks, Twitch!

## Features

- Twitch chat overlay
  - Supports Twitch emotes and badges, 7TV emotes, BTTV emotes and modifiers, and FFZ emotes and modifiers
  - Customisable formatting, colours, and animations
- Custom commands
- Text-to-speech with custom voices from streamelements and TikTok
- Sound effects
- Spotify integration with song requests
- Spotify song overlay
- Twitch rewards integration
- Interval commands (e.g. periodic messages)
- Twitch task overlay
- Discord webhook integration for announcing stream start
- Probably more!

## Setup

[View SETUP instructions](./docs/SETUP.md)

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

## Troubleshooting

Primarily, watch the console output for errors to troubleshoot issues.

For tokens that are saved in tokens.json (Twitch and Spotify), if you change your scope and there are already `access_token` and `refresh_token` present in the file, you should remove these token values. Once you have your new access code the program will retrieve a new `access_token` and `refresh_token`.

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check the [issues page](https://github.com/mjfwebb/twitch-bot/issues).

## License

This project is [MIT](https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE) licensed.
