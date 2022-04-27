# How to install/use
1. Create a discord bot application and receive a token following the instructions at the following website
  - https://www.writebots.com/how-to-make-a-discord-bot/
2. Make note of token, get guild id (server id) and client id of bot once it is in your channel
  - Enable developer mode in discord advanced settings and right click to find these id's
  - Bot id is also listed in the discord dev panel used to add bot to discord channel
3. Clone project locally
4. Run `npm install` on project
5. Create `config.json` file and add key:value pairs for `clientId`, `guildId`, and `token`
  -   ```json
      {
        "clientId": "botid",
        "guildId": "serverid",
        "token": "bottokenhere"
      }
      ```
6. Deploy commands to the bot by running `node deploy-commands.js`
7. Run application with `node .` while in project folder

# Create new commands
1. Create a file matching what you want the name of the command to be
  - ex: `ping.js`
2. Use this skeleton and fill the appropriate information ()
  -   ```js
      const { SlashCommandBuilder } = require('@discordjs/builders');
      
      const commandName = '';
      const commandDescription = '';

      module.exports = {
        data: new SlashCommandBuilder()
          .setName(`${commandName}`)
          .setDescription(`${commandDescription}`),

        async execute(interaction) {
          // Add logic to execute here
          // await interaction.reply('Pong!');
        },
      };
      ```

If you need any npm packages such as fetch import them using require within these files
When `node deploy-commands.js` is run commands will be retrieved and stored in an array and submitted to the application
When bot is running `index.js` will perform a similar but different action to store the commands and execute the command in each file as needed

# Resources: 
- https://www.writebots.com/how-to-make-a-discord-bot/
- https://discordjs.guide/additional-info/async-await.html#how-do-promises-work
- https://discordjs.guide/additional-info/rest-api.html#using-node-fetch
- https://github.com/discordjs/guide/blob/main/code-samples/additional-info/rest-api/13/index.js