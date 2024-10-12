Ensure you have [setup your environment and configuration file](SETUP.md) before continuing,

**WARNING**: The configuration file `config.json` files will contain sensitive information. Do not share this information.

- [config.json](#configjson)
  - ["features"](#features)
    - [interval\_commands](#interval_commands)
    - [bit\_handler](#bit_handler)
    - [sub\_handler](#sub_handler)
    - [first\_message\_handler](#first_message_handler)
    - [first\_message\_of\_stream\_handler](#first_message_of_stream_handler)
    - [returning\_chatter\_handler](#returning_chatter_handler)
    - [commands\_handler](#commands_handler)
    - [built\_in\_commands\_handler](#built_in_commands_handler)
    - [events\_handler](#events_handler)
  - ["repeat\_message\_handler"](#repeat_message_handler)
- [Where to get the data](#where-to-get-the-data)
  - [Twitch auth code](#twitch-auth-code)
    - [Method 1: Automated Retrieval (Recommended)](#method-1-automated-retrieval-recommended)
    - [Method 2: Manual URL Construction](#method-2-manual-url-construction)
  - [Spotify](#spotify)
    - [country\_code](#country_code)
    - [auth\_code](#auth_code)
      - [Method 1: Automated Retrieval (Recommended)](#method-1-automated-retrieval-recommended-1)
      - [Method 2: Manual URL Construction](#method-2-manual-url-construction-1)
  - [SevenTV](#seventv)
  - [BetterTTV](#betterttv)
  - [FrankerFaceZ](#frankerfacez)
  - [TikTok](#tiktok)
- [Setting up your commands](#setting-up-your-commands)
  - [Commands stored in commands.json](#commands-stored-in-commandsjson)
  - [Hard-coded commands](#hard-coded-commands)
- [Channel point reward redemptions](#channel-point-reward-redemptions)
- [Add users to the chat user exclusion list](#add-users-to-the-chat-user-exclusion-list)
- [Add commands to the chat command inclusion list](#add-commands-to-the-chat-command-inclusion-list)

# config.json

The configuration file is located in the root directory of the project. It is a JSON file and contains several configuration options. It is worth your time to read through the configuration file to understand what different features are available and how to configure them.

## "features"

You can toggle several features in the features configuration in `config.json`. For example, if you would like to greet users on their first message, ensure `first_message_handler` is set to true, thus enabled.

### interval_commands

Interval commands are commands that are executed on a regular interval. For example, you can set up a command that says "Hello World" every 5 minutes.

You can find more information about these features in the [interval commands configuration guide](INTERVAL_COMMANDS.md)

### bit_handler

Enabling this feature will allow the bot to handle Bit events. It's recommended to personalise the reaction to your liking.

The code for this handler is located in [bitHandler.ts](..\server\src\handlers\twitch\irc\bitHandler.ts)


### sub_handler

Enabling this feature will allow the bot to handle Sub events. It's recommended to personalise the reactions to different sub events to your liking.

The code for this handler is located in [subHandler.ts](..\server\src\handlers\twitch\irc\subHandler.ts)


### first_message_handler

Enabling this feature will allow the bot to handle First Message events. It's recommended to personalise the reaction to first message events to your liking.

The code for this handler is located in [firstMessageHandler.ts](..\server\src\handlers\twitch\irc\firstMessageHandler.ts)


### first_message_of_stream_handler

Enabling this feature will allow the bot to handle First Message of Stream events. This message is sent on the first message of a user per stream. By default this message is not set, but the user can edit it by using the `!welcome` command.

The code for this handler is located in [firstMessageOfStreamHandler.ts](..\server\src\handlers\twitch\irc\firstMessageOfStreamHandler.ts)

The code for the welcome command is located in [welcome.ts](..\server\src\commands\welcome.ts)


### returning_chatter_handler

Enabling this feature will allow the bot to handle Returning Chatter events. This message is sent when a user sends a message and Twitch includes the returning chatter flag in the message. It is recommended to personalise the reaction to returning chatter events to your liking.

The code for this handler is located in [returningChatterHandler.ts](..\server\src\handlers\twitch\irc\returningChatterHandler.ts)


### commands_handler

Enabling this feature will allow the bot to interpret commands in chat and run them. These commands are stored in the `commands.json` file. See the [commands configuration guide](COMMANDS.md) for more information.


### built_in_commands_handler

Enabling this feature will allow the bot to handle built in commands. Built in commands are commands that written in code. The list of built in commands that will be loaded is stored in the builtInCommands array found in [botCommands.ts](..\server\src\botCommands.ts).


### events_handler

Enabling this feature will allow the bot to handle subscription events. The default subscription events are:

- Follows
- Raids
- Redeems
- Stream Online Notifications
- Stream Offline Notifications

You can edit the handling of subscription events in [twitchEventSubHandler.ts](..\server\src\handlers\twitch\event-sub\twitchEventSubHandler.ts) and [twitchEventSubWebsocket.ts](..\server\src\handlers\twitch\event-sub\twitchEventSubWebsocket.ts)

## "repeat_message_handler"

When enabled the repeat message handler will automatically use TTS to say the message which has been repeated n amount of times by users in chat.

# Where to get the data

The listed scopes are relevant to the existing commands in the repository. If you would like to add new features with more in-depth API interactions then you should adjust the scopes accordingly.

## Twitch auth code

Ensure you have setup your Twitch developer account and application by following the [Twitch setup guide](SETUP.md#twitch-developer-account)

Note: The required scopes are `chat:read`, `chat:edit`, `channel:manage:redemptions`, `channel:read:redemptions`, `moderator:manage:banned_users`, `channel:manage:broadcast` and `moderator:read:followers`.

### Method 1: Automated Retrieval (Recommended)

Fill in the required details in `config.json` for Twitch, leaving the `auth_code` field empty. We suggest your `redirect_uri` is set to `http://localhost:3000`. The bot will listen on whichever port you specify in the `redirect_uri`.

Once set, run the server with `npm run start` within the server directory. The bot will automatically retrieve and update your Twitch `auth_code`. You will need to restart the server once more after the `auth_code` is updated.

### Method 2: Manual URL Construction

To get the auth_code construct your URL and enter it into the browser. Here's an example:

`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=channel%3Amanage%3Aredemptions+channel%3Aread%3Aredemptions+moderator%3Amanage%3Abanned_users+chat%3Aread+chat%3Aedit+moderator%3Aread%3Achatters+channel%3Amanage%3Abroadcast`

Once you open this and authorize access, it will redirect you. Take the auth code from the new URL.

## Spotify

Ensure you have setup your Spotify developer account and application by following the [Spotify setup guide](SETUP.md#spotify-developer-account)

Note: The required scopes are `user-read-currently-playing`, `user-read-playback-state`, and `user-modify-playback-state`.

### country_code

The country code is used to help the bot determine if songs are available in the Spotify account's country.

### auth_code

Use the [Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)

#### Method 1: Automated Retrieval (Recommended)

Fill in ``client_id`, `client_secret` and `grant_type` fields in `config.json` for Spotify, leaving the `auth_code` field empty. We suggest your `redirect_uri` is set to `http://localhost:3000`. The bot will listen on whichever port you specify in the `redirect_uri`.

#### Method 2: Manual URL Construction

To get the auth_code construct your URL and enter it into the browser. Here's an example:

`https://accounts.spotify.com/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=user-read-currently-playing%20user-read-playback-state%20user-modify-playback-state`

Once you open this and authorize access, it will redirect you. Take the auth code from the new URL and paste it into the `auth_code` field in `config.json`.

## SevenTV

You only need to toggle the enabled flag to `true`. Internally the bot will use the Twitch account's ID to find your SevenTV ID.

## BetterTTV

You only need to toggle the enabled flag to `true`. Internally the bot will use the Twitch account's ID to find your BTTV ID.

## FrankerFaceZ

You only need to toggle the enabled flag to `true`. Internally the bot will use the Twitch account's ID to find your FFZ ID.

## TikTok

To get the `session_id` to use the TikTok voices in the `!tts` command you need to create a TikTok account and extract the `session_id` from your browser. This can be done by accessing the cookies in your browser and copying the value of the `session_id` cookie.

# Setting up your commands

## Commands stored in commands.json

It is recommended not to change the commands stored in the `commands.json` manually. Instead, use the `!addcommand` command when the bot is running to create commands that play sounds, emit events, and more. You can find more information about these features in the [commands configuration guide](COMMANDS.md)

## Hard-coded commands

A lot of the power of the bot comes from the commands that you set up. While a large majority of the commands you may want to add can be done through the `!addcommand` command, there are some commands that are hard-coded into the bot. These commands are more powerful and can be used to connect to APIs and perform more complex actions. For example the [TTS command](..\server\src\commands\tts.ts) which calls out to different TTS providers.

# Channel point reward redemptions

The bot can automatically handle channel point reward redemptions.

You can find more information about these features in the [channel point rewards configuration guide](CHANNEL_POINT_REDEEMS.md)

# Add users to the chat user exclusion list

If you would like certain users' messages to be filtered from the chat client, you can add them to the `chat-user-exclusion-list.txt` file in the root directory of the project.

Each username should be on a new line.

For example, to exclude the users `troll` and `troll2` from chat commands, you would add the following lines to the file:

```plaintext
troll
troll2
```

Note that `chat-user-exclusion-list.txt` will be created automatically when you run the server for the first time.

# Add commands to the chat command inclusion list

By default, messages the start with `!` are not sent to the chat client. If you would like certain commands to appear in the chat overlay, you can add them to the `chat-command-inclusion-list.txt` file in the root directory of the project.

Each command should be on a new line.

For example, to add the `!tts` and `!hello` commands to the chat command inclusion list, you would add the following lines to the file:

```plaintext
tts
hello
```

Note that `chat-command-inclusion-list.txt` will be created automatically when you run the server for the first time.
