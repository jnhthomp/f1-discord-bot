# F1 Discord Bot
<a href="https://jtdev.netlify.app/" target="_blank" rel="noreferrer"> <img src="https://drive.google.com/uc?id=19ZZ2aDajCwqqMiawXZRcjEKScT1z5657" alt="JTDEV" width="100%" height="auto"/> </a> 
This is a Discord bot created using `Discord.js`
You can install the bot to a server or local machine and provide a config.json file with the appropriate information to run your own instance of the bot in discord servers you own/admin
Many commands are run by utilizing the [Ergast F1 api](http://ergast.com/mrd/)

<!-- Portfolio gif -->
<a href="https://jtdev.netlify.app/" target="_blank" rel="noreferrer"> <img src="https://drive.google.com/uc?id=1zcfI4eSi-x1Osif5Ic1FCKQuhpV1NLwE" alt="JTDEV" width="100%" height="auto" /> </a> 

## How It's Made:
**Tech used:** <!--JavaSCript =>--><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <!-- Node.js =>--><a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a><!-- Discord.js =>--><a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/discordjs/discordjs-original-wordmark.svg" alt="Discordjs" width="40" height="40"/> </a><!-- Postman =>--><a href="https://postman.com" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" alt="postman" width="40" height="40"/> </a> 

I used the Discord.js docs as my primary guidance along with a few other resources linked in the resources section.
Index.js is the first to load and gets a list of commands by using a node file system package and storing a command object for each file in the `/commands` folder.
Most commands utilize the [Ergast F1 api](http://ergast.com/mrd/) to fetch data and is processed by the bot before being returned to the user as a discord embed object. This allows some styling/organization of the returned content compared to plain text.

### Available Commands
- `/constructorstandings`
  - Get current scores in the constructors championship
- `/driverstandings`
  - Get current scores in drivers championship
- `/driverstats <DRIVER_ID>`
  - Get per race driver stats
- `/help`
  - List commands available to F1Bot
- `/nextrace`
  - Get next F1 race event info
- `/qualitimes <TRACK_ID>`
  - Get quali stats for a given track
- `/results <YEAR> <ROUND>`
  - Include year and round number to get results for that race
  - Exclude to get latest race results

### How to install/use
1. Create a discord bot application and receive a token following the instructions at the following website
    - https://www.writebots.com/how-to-make-a-discord-bot/
2. Make note of token, get guild id (server id) and client id of bot once it is in your channel
    - Enable developer mode in discord advanced settings and right click to find these id's
    - Bot id is also listed in the discord dev panel used to add bot to discord channel
3. Clone project locally
4. Run `npm install` on project
5. Create '.env' file
    - add 'key=value' pairs for 'CLIENT_ID', 'GUILD_ID', and 'TOKEN'
    - include api links for the time trials commands as those will need a database/server
      - If you need a server to run a timetrials data base see my `time-trials-server` project on [github](https://github.com/jnhthomp/time-trial-api-server)
    -   ```env
        # .env-example
        
        # Discord Bot Connection info
        CLIENT_ID=botid
        GUILD_ID=serverid
        TOKEN=botToken.Here

        # Backend/API Server urls
        BASE_URL=https://link-to-your-server.herokuapp.com/
        API_URL=https://link-to-your-server.herokuapp.com/api/
        ```
6. Deploy commands to the bot by running `npm run depcom` or `node deploy-commands.js`
    - This command only has to be done once with new commands. After creating the command on the dev environment and pushing it with this command, you DO NOT need to run this command when the project is deployed on heroku
7. Run application with `npm run start` or `node index.js` while in project folder

### Create new commands
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
When `node deploy-commands.js` is run commands will be retrieved and stored in an array and submitted to the discord application itself and be registered and save within the server you have added.
When bot is running `index.js` will perform a similar but different action to store the commands and execute the command in each file as needed

### Trouble Shooting + Tips
If the app won't start properly in heroku make sure that the dynos are set correctly and the worker dyno is turned  on
You can set this through the console (after logging in) with:
```bash
$heroku ps:scale worker=1
```

Alternatively in order to turn the heroku bot off while developing and testing locally you can use a value of 0 to shut down the bot until you reset the value to 1
```bash
$heroku ps:scale worker=0
```

## Optimizations
I can make even nicer returns by considering using the following technique for better discord attachments this would allow me to design a small webpage for each bot response and fill it with api data as it is fetched. Then an npm package will process the generated html as an image to be attached as the bots response. This will allow very nice and custom output from the bot
- https://dev.to/en3sis/advanced-discord-js-custom-embeds-using-attachments-2bpn
  - Create html/css markup for webpage, use node-html-to-image to make it a jpeg image
  - Attach the generated jpeg to embed object

- Learn how to auto assign static driver initials to users with a command (so the bot doesn't forget and can be access via other commands)
  - Then use these initials automatically whenever `/ttadd` is used
  - This will allow the `initials` option to be optional and if not included it would default to the users Initials

- Create and utilize economy by creating commands that allow specific users to 'give/gift' coins. Later add betting/trading and award coins based on performance in leaderboard charts.

## Lessons Learned
- Creating Node applications
- Using discord.js
- Asyncronous JavaScript and API calls
- Hosting bots on heroku for 100% uptime

## Resources: 
- http://ergast.com/mrd/
- https://www.writebots.com/how-to-make-a-discord-bot/
- https://discordjs.guide/additional-info/async-await.html#how-do-promises-work
- https://discordjs.guide/additional-info/rest-api.html#using-node-fetch
- https://github.com/discordjs/guide/blob/main/code-samples/additional-info/rest-api/13/index.js

## Other Examples:
Take a look at other examples from my <a href="https://jtdev.netlify.app/">portfolio</a> using the lessons learned from these classes:


**Blog Site W/ Categories and Authentification:** https://github.com/jnhthomp/alpha-blog2

**Stock Based Social Network:** https://github.com/jnhthomp/finance-tracker

**Restaurant Web-Based Ordering System:** https://github.com/jnhthomp/practice-food-order-app


___
# Notes on Next TODO:
Reference: https://www.youtube.com/watch?v=w0LxGWajE-4
# Add Dependencies
1. Download mongo currency https://www.npmjs.com/package/discord-mongo-currency
  ```bash
  $npm install discord-mongo-currency
  ```
2. Require in `index.js` and use to connect
  ```js
  const mongoCurrency = require('discord-mongo-currency');

  // ... some code

  // Connect
  mongoCurrency.connect('mongodb.connection.string.from.env')
  ```


# Add Commands/Example commands
## give 
Give coin/currency to other users
Ex `/give coin:50 @user`

1. Initialize commands with template (will need a non-optional argument called `coin`)
  - See https://www.npmjs.com/package/slash-command-builder and ctrl+f Option: Integer
    - If it doesn't work this way just accept it as a string and convert it to a number
      - If taking this approach be sure to convert to a number and return an error if not (see 10:16 in source vid)
  ```js
  {
    data: new SlashCommandBuilder()
      .setName('give')
      .setDescription('Give coins to another user')
      // Accept options (arguments) after slash command
      // For different typing available if expecting a certain value type (string, int, bool, etc... See: https://discordjs.guide/interactions/slash-commands.html#option-types)
      .addIntegerOption(option => option.setName('coin').setDescription('Amount of coins to give').setRequired(true))
      .addMentionableOption(option => option.setName('user').setDescription('User to give coins to').setRequired(true)),
  }
  ```
2. Find the user to give the coin to
  (see interaction object: https://discord.com/developers/docs/interactions/receiving-and-responding)
  ```js
  // First person mentioned in the message (hopefully, see discord docs above)
  // (This will only work if the user is not passed in as an option like above (probably))
  const member = interaction.messages.mentions[0] 

  // if user is passed as an option try this:
  const member2 = interaction.options.getMentionable('user')

  
  // Example code from vid if that doesn't work
  // const member = message.mentions.members.first()
  ```
3. Retrieve number of coins from user options
  ```js
  const userInputCoins = interaction.options.getInteger('coin')
  ```
2. Give coins to that user by user id (see giveCoins in mongo currency npm page)
  ```js
  // giveCoins(userId, guildId, amount) 
  await mongoCurrency.giveCoins(member.id, message.author.guild, userInputCoins)
  ```
3. Confirmation message after coins were given
  ```js
  interaction.editReply(`${member} received ${userInputCoins} coins`)
  ```