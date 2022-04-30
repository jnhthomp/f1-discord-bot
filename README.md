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

# TODO:
1. `qualitimes <TRACK_NAME>` - Output quali times for each driver at the given track this year
  - Use options to get a circuit name
  - Make request using that circuit name
    -   ```js
        `http://ergast.com/api/f1/current/circuits/${inputCircuitName}/qualifying.json`
        ```
  - Will receive `qualiData` response sort through to get `qualiData.MRData.RaceTable.Races[0].QualifyingResults` array
  - Map resuting array to embed listings
    -   ```js
        let qualiRound = 0
        if(result.position > 15){ 
          qualiRound = 1 
        } else if(result.position > 10){
          qualiRound = 2
        } else {
          qualiRound = 3
        }

        { name: `${result.Driver.givenName} ${result.Driver.familyName} Highest Round: Q${qualiRound}`, value: `Q1: ${result.Q1 || 'none'}\nQ2: ${result.Q2 || 'none'}\nQ3: ${result.Q3 || 'none'}`}
        ```
  - Add array of embed listings to an embed object and return
  - Add error message if circuit name is invalid or if circuit hasn't been raced on yet this year

# Resources: 
- https://www.writebots.com/how-to-make-a-discord-bot/
- https://discordjs.guide/additional-info/async-await.html#how-do-promises-work
- https://discordjs.guide/additional-info/rest-api.html#using-node-fetch
- https://github.com/discordjs/guide/blob/main/code-samples/additional-info/rest-api/13/index.js