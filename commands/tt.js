// Necessary to create/register a command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Cretaes new embed object to make output look nicer
const { MessageEmbed } = require('discord.js');
// Use for any fetch requests
const fetch = require('node-fetch');

module.exports = {
  // Build new slash command and set details
  data: new SlashCommandBuilder()
    .setName('tt')
    .setDescription('See times from the time trial database')
    // Accept options (arguments) after slash command
    // For different typing available if expecting a certain value type (string, int, bool, etc... See: https://discordjs.guide/interactions/slash-commands.html#option-types)
    .addStringOption(option => option.setName('game').setDescription('Game to retrieve').setRequired(false))
    .addStringOption(option => option.setName('track').setDescription('Track to retrieve').setRequired(false)),

  // Function to take place on command execution
  async execute(interaction) {
    // ... temporary message while processing command
    await interaction.deferReply();

    // retrieve option input value if needed
    // const option = interaction.options.getString(optionName);

    // create url to use for fetch requests
    // If no game is entered use null val
    const userInputGame = interaction.options.getString('game') || null // set to option value when added
    // If a game is submitted (!null) then the user input string is valid or can be set to null. Otherwise must be null
    const userInputTrack = userInputGame !== null ? interaction.options.getString('track') || null : null// set to option value when added
    
    // Build a fetch path based on whether a game/track was entered
    let fetchPath = ''
    if(userInputGame !== null){
      // If game was entered add game to path
      fetchPath += `${userInputGame}/`
    }
    if(userInputTrack !== null){
      // If track was entered add track to path 
      // Note this will be null if no game was entered
      fetchPath += `${userInputTrack}`
    }
    
    const url = `${process.env.API_URL}${fetchPath}`
    // If making fetch requests use this pattern
    const fetchedData = await fetch(url)
      .then(response => response.json())
      .then(data => {
        // Parse relevant data
        console.log('Data fetched from MongoDB...')
        console.log(data)
        return data
      }).catch(error => {
        // Log error in server 
        console.log(error)
        return false
      });

    // Handle bad data return (error from fetch request)
    if (!fetchedData) {
      // Set message something went wrong from bad data return 
      // (likely bad round number)
      interaction.editReply('Something went wrong...')
    } else { // Handle successful data fetch
      if (userInputGame !== null && userInputTrack !== null) { // Handle game and track entered
        console.log('Data fetched successfully')
        // set podium field for embed
        // Creates medal + info for top 3 drivers      
        const embedFieldsPodium = fetchedData.leaderboard.map((data, idx) => { 
          let medal = null
          if(idx === 0){ medal = '🥇' }
          if(idx === 1){ medal = '🥈' }
          if(idx === 2){ medal = '🥉' }

          return {...data, medal}
        }).filter((el, i) => el.time !== 'NaN' && i <= 9) // Ensure times are valid and only display top 10 times 

        console.log(embedFieldsPodium)
        // Create string of results
        const embedFieldsStr = embedFieldsPodium.reduce((acc, res, i) => `${acc}\n${res.medal ? res.medal : i + 1}: ${res.time} ${res.driverInitial} ${res.car}`, '')
        console.log(embedFieldsStr)

        const embedField = {name: `Leaderboard`, value: embedFieldsStr}
        const embed = new MessageEmbed()
          .setColor('#418e86')
          .setTitle(`${fetchedData.game} ${fetchedData.track}`)
          .setURL(`${process.env.BASE_URL}${fetchPath}`)
          .addFields(embedField)

        interaction.editReply({embeds: [embed]})
      } else if(userInputGame !== null && userInputTrack === null){ // Handle game only entered (no track specified - list tracks)
        let tracknames = fetchedData.map(el=> el.name).join('\n')
        console.log(tracknames)
        const embedField = {name: `Tracks`, value: tracknames}
        
        const embed = new MessageEmbed()
          .setColor('#418e86')
          .setTitle(`${userInputGame} Tracks`)
          .setURL(`${process.env.BASE_URL}${fetchPath}`)
          .addFields(embedField)

        interaction.editReply({embeds: [embed]})
      } else if(userInputGame === null && userInputTrack === null){ // Handle no game or track entered (list games)
        
        let gameNames = fetchedData.map(el=> el.name).join('\n')

        const embedField = {name: `Games`, value: gameNames}

        const embed = new MessageEmbed()
          .setColor('#418e86')
          .setTitle(`Available Games`)
          .setURL(`${process.env.BASE_URL}${fetchPath}`)
          .addFields(embedField)

        interaction.editReply({embeds: [embed]})
      } 
    }
  }
}
