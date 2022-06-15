// Necessary to create/register a command
const { SlashCommandBuilder, isEquatable } = require('@discordjs/builders');
// Cretaes new embed object to make output look nicer
const { MessageEmbed } = require('discord.js');
// Use for any fetch requests
const fetch = require('node-fetch');

module.exports = {
  // Build new slash command and set details
  data: new SlashCommandBuilder()
    .setName('ttadd')
    .setDescription('Add a new time to the time trial database')
    // Accept options (arguments) after slash command
    // For different typing available if expecting a certain value type (string, int, bool, etc... See: https://discordjs.guide/interactions/slash-commands.html#option-types)
    .addStringOption(option => option.setName('game').setDescription('Game to retrieve').setRequired(true))
    .addStringOption(option => option.setName('track').setDescription('Track to retrieve').setRequired(true))
    .addStringOption(option => option.setName('initial').setDescription('Your 3 Letter initial').setRequired(true))
    .addStringOption(option => option.setName('time').setDescription('Time in either of the following formats 1:23.456 or 83.456').setRequired(true))
    .addStringOption(option => option.setName('car').setDescription('Car used to set time').setRequired(false)),


  // Function to take place on command execution
  async execute(interaction) {
    // ... temporary message while processing command
    await interaction.deferReply();

    // url to use for POST request
    const userInputGame = interaction.options.getString('game') || null // set to option value when added (null should never trigger as long as set.Required(true))
    const userInputTrack = interaction.options.getString('track') || null // set to option value when added (null should never trigger as long as set.Required(true))
    const fetchPath = `${userInputGame}/${userInputTrack}`
    const url = `${process.env.API_URL}${fetchPath}`  
  
    // JSON object to submit in post body
    const leaderboardData = {
      driverInitial: interaction.options.getString('initial') || 'AAA',
      time: interaction.options.getString('time') || 999.999,
      car: interaction.options.getString('car') || 'equal performance'
    }

    // If making fetch requests use this pattern
    const fetchedData = await fetch(url, {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leaderboardData)
    })
      .then(response => response)
      .catch(error => {
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

      console.log(`New time posted to ${userInputGame} ${userInputTrack}`)
      const fetchLeaderboard = await fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error=> console.log(error))
      // set podium field for embed
      // Creates medal + info for top 3 drivers
      let firstInstanceArray = [];      
      const embedFieldsPodium = fetchLeaderboard.leaderboard.map((data, idx) => {
        let medal = null
        if (idx === 0) { medal = '🥇' }
        if (idx === 1) { medal = '🥈' }
        if (idx === 2) { medal = '🥉' }

        let driverInitial = data.driverInitial

        if(!firstInstanceArray.includes(data.driverInitial)){
          firstInstanceArray.push(data.driverInitial)
          driverInitial = `**${data.driverInitial}**`
        }
        return { ...data, medal, driverInitial}
      }).filter((el, i) => el.time !== 'NaN' && i <= 9) // Ensure times are valid and only display top 10 times 

      console.log(embedFieldsPodium)
      // Create string of results
      const embedFieldsStr = embedFieldsPodium.reduce((acc, res, i) => `${acc}\n${res.medal ? res.medal : i + 1}: ${res.time} ${res.driverInitial} ${res.car}`, '')
      console.log(embedFieldsStr)

      const embedField = { name: `Leaderboard`, value: embedFieldsStr }
      const embed = new MessageEmbed()
        .setColor('#418e86')
        .setTitle(`${fetchLeaderboard.game} ${fetchLeaderboard.track}`)
        .setURL(`${process.env.BASE_URL}${fetchPath}`)
        .addFields(embedField)

      interaction.editReply({ embeds: [embed] })
    }
  }
}
