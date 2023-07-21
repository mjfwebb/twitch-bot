
# Configuration

Ensure you have [setup your environment and configuration file](SETUP.md) before continuing,

**WARNING**: The configuration file `config.json` files will contain sensitive information. Do not share this information. 

## Where to get the data

The listed scopes are relevant for the existing commands in the repository. If you would like to add new features with more in-depth API interactions then you should adjust the scopes accordingly.

### twitch

To get the auth_code construct your URL and enter it into the browser.  Here's an example:

`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=channel%3Amanage%3Aredemptions+channel%3Aread%3Aredemptions+moderator%3Amanage%3Abanned_users+chat%3Aread+chat%3Aedit+moderator%3Aread%3Achatters+channel%3Amanage%3Abroadcast`

Once you open this and authorize access, it will redirect you. Take the auth code from the new URL.

The required scopes are `chat:read`, `chat:edit`, `channel:manage:redemptions`, `channel:read:redemptions`, `moderator:manage:banned_users` and `channel:manage:broadcast`. 

### spotify

Visit https://developer.spotify.com/documentation/web-api/tutorials/getting-started to create an app and obtain the `client_id` and `client_secret`

Use the [Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)

To get the auth_code construct your URL and enter it into the browser. Here's an example:

`https://accounts.spotify.com/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=user-read-currently-playing%20user-read-playback-state%20user-modify-playback-state`

Once you open this and authorize access, it will redirect you. Take the auth code from the new URL.

The required scopes are `user-read-currently-playing`, `user-read-playback-state`, and `user-modify-playback-state`. 

### github

Visit https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token to obtain the `access_token`

Ensure that the personal access token includes the scope to access and modify issues.

### sevenTV

Enter your userId which you can get from the URL on your account page in 7tv.app.

### betterTTV

You probably want to set provider as twitch and the ID is your twitch broadcaster ID (likely the same as set in twitch).

### frankerFaceZ

Enter your broadcaster ID (likely the same as set in twitch).

## Setting up your commands

### Commands stored in commands.json

There are many features available with commands created through `!addcommand`. You can use `!addcommand` to create commands that play sounds, emit events, and more. You can find more information about these features in the [commands configuration guide](COMMANDS.md)

### Hard-coded commands

A lot of the power of the bot comes from the commands that you set up. While a large majority of the commands you may want to add can be done through the `!addcommand` command, there are some commands that are hard-coded into the bot. These commands are more powerful and can be used to connect to APIs and perform more complex actions.

## Channel point reward redemptions

The bot can automatically handle channel point reward redemptions.

You can find more information about these features in the [channel point rewards configuration guide](CHANNEL_POINT_REWARDS.md)

## Add users to the chat exclusion list

Open `chat-exclusion-list.txt` in the root directory of the project. Add the usernames of the users you want to exclude from chat commands. Each username should be on a new line.

This file will be created automatically when you run the server for the first time.
