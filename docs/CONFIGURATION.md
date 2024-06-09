# Configuration

Ensure you have [setup your environment and configuration file](SETUP.md) before continuing,

**WARNING**: The configuration file `config.json` files will contain sensitive information. Do not share this information.

## Where to get the data

The listed scopes are relevant to the existing commands in the repository. If you would like to add new features with more in-depth API interactions then you should adjust the scopes accordingly.

### Twitch

The required scopes are `chat:read`, `chat:edit`, `channel:manage:redemptions`, `channel:read:redemptions`, `moderator:manage:banned_users`, `channel:manage:broadcast` and `moderator:read:followers`.

#### Method 1: Automated Retrieval

Fill in the required details in `config.json` for Twitch, leaving the `auth_code` field empty. Ensure your `redirect_uri` is set to `http://localhost:3000`.

Once set, run the server with `npm run start` within the server directory. The bot will automatically retrieve and update your `auth_code`.

#### Method 2: Manual URL Construction

To get the auth_code construct your URL and enter it into the browser. Here's an example:

`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=channel%3Amanage%3Aredemptions+channel%3Aread%3Aredemptions+moderator%3Amanage%3Abanned_users+chat%3Aread+chat%3Aedit+moderator%3Aread%3Achatters+channel%3Amanage%3Abroadcast`

Once you open this and authorize access, it will redirect you. Take the auth code from the new URL.

### Spotify

The required scopes are `user-read-currently-playing`, `user-read-playback-state`, and `user-modify-playback-state`.

Visit https://developer.spotify.com/documentation/web-api/tutorials/getting-started to create an app and obtain the `client_id` and `client_secret`

Use the [Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)

To get the auth_code construct your URL and enter it into the browser. Here's an example:

`https://accounts.spotify.com/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=user-read-currently-playing%20user-read-playback-state%20user-modify-playback-state`

Once you open this and authorize access, it will redirect you. Take the auth code from the new URL.

### SevenTV

You only need to toggle the enabled flag to `true`. Internally the bot will use the Twitch account's ID to find your SevenTV ID.

### BetterTTV

You only need to toggle the enabled flag to `true`. Internally the bot will use the Twitch account's ID to find your BTTV ID.

### FrankerFaceZ

You only need to toggle the enabled flag to `true`. Internally the bot will use the Twitch account's ID to find your FFZ ID.

### TikTok

To get the `session_id` to use the TikTok voices in the `!tts` command you need to create a TikTok account and extract the `session_id` from your browser. This can be done by accessing the cookies in your browser and copying the value of the `session_id` cookie.

## Setting up your commands

### Commands stored in commands.json

There are many features available with commands created through `!addcommand`. You can use `!addcommand` to create commands that play sounds, emit events, and more. You can find more information about these features in the [commands configuration guide](COMMANDS.md)

### Hard-coded commands

A lot of the power of the bot comes from the commands that you set up. While a large majority of the commands you may want to add can be done through the `!addcommand` command, there are some commands that are hard-coded into the bot. These commands are more powerful and can be used to connect to APIs and perform more complex actions.

## Channel point reward redemptions

The bot can automatically handle channel point reward redemptions.

You can find more information about these features in the [channel point rewards configuration guide](CHANNEL_POINT_REDEEMS.md)

## Interval commands

Sometimes you want something to occur on a regular interval. You can set up interval commands to do this.

You can find more information about these features in the [interval commands configuration guide](INTERVAL_COMMANDS.md)

## Add users to the chat user exclusion list

If you would like certain users' messages to be filtered from the chat client, you can add them to the `chat-user-exclusion-list.txt` file in the root directory of the project.

Each username should be on a new line.

For example, to exclude the users `troll` and `troll2` from chat commands, you would add the following lines to the file:

```plaintext
troll
troll2
```

Note that `chat-user-exclusion-list.txt` will be created automatically when you run the server for the first time.

## Add commands to the chat command inclusion list

By default, messages the start with `!` are not sent to the chat client. If you would like certain commands to appear in the chat overlay, you can add them to the `chat-command-inclusion-list.txt` file in the root directory of the project.

Each command should be on a new line.

For example, to add the `!tts` and `!hello` commands to the chat command inclusion list, you would add the following lines to the file:

```plaintext
tts
hello
```

Note that `chat-command-inclusion-list.txt` will be created automatically when you run the server for the first time.
