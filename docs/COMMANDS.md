# Commands

You can use the `!addcommand` bot command when the server is running to create commands through the Bot itself. For example: `!addcommand hello Hello everyone!` would add the command `!hello` which would send the message `Hello everyone!`.

## Command Features

### %count%
You can use `%count%` in the message text to display how many times that command has been used. For example: `!addcommand test This command has been tested %count% times`.

### %user% and %target%
You can use `%user%` and `%target` in the message text as placeholders for the command user and the user name of the command target. For example: `!addcommand wave %user% waves at %target%`. This would then be used like `!wave FriendlyChatter` with the result `Athano waves at FriendlyChatter`.

### %sound:<name>%
You can use `%sound:<name>%` in the message text to play a sound. For example: `!addcommand %sound:beep%` would play the sound `beep.wav` from the `sounds` folder. If you want to play an mp3 file, you can use `%sound:bang.mp3%` which will play the file `bang.mp3` from the `sounds` folder.

### %now%
You can use `%now%` in the message text to display the current time. For example: `!addcommand time The current time is %now%`.

### %emit:<event>%
You can use `%emit:<event>%` in the message text to emit an event. For example: `!addcommand confetti %emit:confetti%` would emit the event `confetti` to the client.

### Updating command descriptions and cooldowns
To update descriptions use `!setdescription <commandId> this is my description`. Where `<commandId>` is replaced with the command ID in question. For example: `!setdescription test This is a test command!`

To update cooldowns use `!setcooldown <commandId> 1000`. Where `<commandId>` is replaced with the command ID in question, and the amount is in milliseconds. For example: `!setcooldown test 10000` would set a 10 second cooldown to the command "test".
