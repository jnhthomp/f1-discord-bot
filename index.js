const fetch = require('node-fetch');
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'server') {
    await interaction.reply(`Server info: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
  } else if (commandName === 'user') {
    await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
  } else if (commandName === 'nextrace') {
    await interaction.deferReply();
    const raceData = await fetch(`https://ergast.com/api/f1/2022.json`)
      .then(response => response.json())
      .then(data => {
        // reduce json object to array of races
        const raceList = data.MRData.RaceTable.Races
        // create date object for current date
        let today = new Date
        let todayISO = today.toISOString().slice(0, 10)
        // find next race and return race object
        let nextRace = () => { 
          return raceList.filter(el => el.date > todayISO)[0]
        }
        // create date with race object data


        return nextRace()
      });
  
    if(!raceData){
      interaction.editReply('No results found')
    }

    console.log(raceData)
    interaction.editReply(`${raceData.raceName} on ${raceData.date}`) 
  }
})


// Login to Discord with your client's token
client.login(token);