# Channel point reward redemptions

To enable this feature, you must first create the rewards in your Twitch channel. This can be done via the Twitch dashboard or through the API. You can find more information about creating rewards in the [Twitch documentation](https://dev.twitch.tv/docs/api/reference#create-custom-rewards).

Once you have created the rewards, you can get a list of the rewards by enabling debug level logging in the main `config.json` file. Once you have enabled debug level logging, you can start the bot and it will print a list of the channel point reward titles and IDs to the console.

With the titles and IDs you can enter custom channel point reward redemption actions into `channelPointRedeems.json`.

An example of a channel point reward redemption action is:

```json
{
  "id": "this-is-my-reward-id",
  "title": "Test Reward",
  "actions": [
    {
      "message": "This is a test message!",
      "command": "test",
      "commandParams": "This is a test command!",
      "onStatus": "fulfilled"
    }
  ]
}
```

The `id` and `title` fields are the ID and title of the channel point reward.

The `message` field is the message that will be sent to chat when the reward is redeemed. If the message is an empty string, no message will be sent to chat.

The `timesUsed` field is the number of times the reward has been redeemed.

The `command` field is the command that will be run when the reward is redeemed. If the command is an empty string, no command will be run.

The `commandParams` field is the parameters that will be passed to the command when it is run. If the commandParams is an empty string, no parameters will be passed to the command.

The `onlyRunWhenFulfilled` field is a boolean that determines if the command will be run when the
reward is redeemed or when the reward is fulfilled. If this is set to `true`, the command will only be run when the reward is fulfilled. If this is set to `false`, the command will be run when the reward is redeemed and not automatically set to fulfilled.

Fulfilled in this case means either of the following:

- When the streamer or a moderator clicks the "Mark as Complete" button on the reward redemption in the Twitch dashboard.
- A redemption that is set to automatically be fulfilled is redeemed. This can be set in the Twitch dashboard when creating the reward and is usually referred to as skipping the rewards request queue.

## Redeems with user input

Here's another example using the user input provided in the redeem:

```json
{
  "id": "this-is-my-reward-id",
  "title": "Song request",
  "actions": [
    {
      "message": "",
      "command": "queuesong",
      "commandParams": "%input%",
      "onStatus": "unfulfilled"
    }
  ]
}
```
