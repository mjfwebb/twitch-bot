# Interval commands

Interval commands are commands that are run on a set interval. These commands are useful for things like sending periodic messages, updating the bot's status, updating the bot's game, or updating the bot's title.

Interval commands are configured in `intervalCommands.json`.

All times are in milliseconds.

An example of an interval command is:

```json
{
  "tickInterval": 60000,
  "startDelay": 10000,
  "actions": [
    {
      "message": "This is a test message!",
      "command": "test",
      "commandParams": "This is a test command!",
    }
  ],
  "mustBeStreaming": true,
}
```

The `tickInterval` field is the interval in milliseconds between each time the command is run.

The `startDelay` field is the delay in milliseconds before the command is run for the first time.

The `message` field is the message that will be sent to chat when the command is run. If the message is an empty string, no message will be sent to chat.

The `command` field is the command that will be run when the command is run. If the command is an empty string, no command will be run.

The `commandParams` field is the parameters that will be passed to the command when it is run. If the commandParams is an empty string, no parameters will be passed to the command.

The `mustBeStreaming` field is a boolean that determines whether or not the command will be run if the bot is not streaming. If this is set to `true`, the command will only be run if the bot is streaming. If this is set to `false`, the command will be run regardless of whether or not the bot is streaming.