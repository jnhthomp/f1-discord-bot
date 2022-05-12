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
When `node deploy-commands.js` is run commands will be retrieved and stored in an array and submitted to the application
When bot is running `index.js` will perform a similar but different action to store the commands and execute the command in each file as needed


## Optimizations
I can make even nicer returns by considering using the following technique for better discord attachments this would allow me to design a small webpage for each bot response and fill it with api data as it is fetched. Then an npm package will process the generated html as an image to be attached as the bots response. This will allow very nice and custom output from the bot
- https://dev.to/en3sis/advanced-discord-js-custom-embeds-using-attachments-2bpn
  - Create html/css markup for webpage, use node-html-to-image to make it a jpeg image
  - Attach the generated jpeg to embed object

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