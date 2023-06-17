
## Configuration

### Create required JSON files

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

**WARNING**: The resulting `.json` files will contain sensitive information when filled in correctly. Do not share this information.

| Required file | Desired filename          | Example filename                  |
| ------------- | ------------------------- | --------------------------------- |
| required      | twitchConfig.json         | example.twitchConfig.json         |
| required      | tokens.json               | example.tokens.json               |
| required      | mongoDBConfig.json        | example.mongoDBConfig.json        |
| optional      | discordWebhookConfig.json | example.discordWebhookConfig.json |
| optional      | spotifyConfig.json        | example.spotifyConfig.json        |
| optional      | githubConfig.json         | example.githubConfig.json         |

The best way to begin is by copying the example versions of the required files (twitchConfig.json, tokens.json, and mongoDBConfig.json) and renaming them to the desired filenames.

### Where to get the data

The listed scopes are relevant for the existing commands in the repository. If you would like to add new features with more in-depth API interactions then you should adjust the scopes accordingly.

#### twitchConfig.json

To get the auth_code construct your URL and enter it into the browser: 

```
https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=channel%3Amanage%3Aredemptions+channel%3Aread%3Aredemptions+moderator%3Amanage%3Abanned_users+chat%3Aread+chat%3Aedit+moderator%3Aread%3Achatters+channel%3Amanage%3Abroadcast
```

The required scopes are `channel:manage:redemptions`, `channel:read:redemptions`, `moderator:manage:banned_users` and `channel:manage:broadcast`. 

#### spotifyConfig.json

Visit https://developer.spotify.com/documentation/web-api/tutorials/getting-started to create an app and obtain the `client_id` and `client_secret`

Use the [Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)

To get the auth_code construct your URL and enter it into the browser:

```
https://accounts.spotify.com/authorize?response_type=code&client_id=<your_client_id>&redirect_uri=<your_redirect_uri>&scope=user-read-currently-playing%20user-read-playback-state%20user-modify-playback-state
```

The required scopes are `user-read-currently-playing`, `user-read-playback-state`, and ``user-modify-playback-state`. 

#### githubConfig.json

Visit https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token to obtain the `access_token`

Ensure that the personal access token includes the scope to access and modify issues.

### Set up your commands

Open `server\src\handlers\botCommands.ts` and change the commands to fit your needs. There are several examples of different commands here.

Open `server\src\constants.ts` and change the values in the constants to fit your needs.

Alternatively use the `!addcommand` bot command when the server is running to create commands through the Bot itself. The functionality of commands created with `!addcommand` are limited in comparison to the hard-coded commands. For example: `!addcommand hello Hello everyone!` would add the command `!hello` which would send the message `Hello everyone!`.

You can use `%count%` in the message text to display how many times that command has been used. For example: `!addcommand test This command has been tested %count% times`.

You can use `%user%` and `%target` in the message text as placeholders for the command user and the user name of the command target. For example: `!addcommand wave %user% waves at %target%`.


To update descriptions use `!setdescription <commandId> this is my description`. Where `<commandId>` is replaced with the command ID in question. For example: `!setdescription test This is a test command!`

To update cooldowns use `!setcooldown <commandId> 1000`. Where `<commandId>` is replaced with the command ID in question, and the amount is in milliseconds. For example: `!setcooldown test 10000` would set a 10 second cooldown to the command "test".
