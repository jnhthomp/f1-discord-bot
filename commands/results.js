// Necessary to create/register a command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Cretaes new embed object to make output look nicer
const { MessageEmbed } = require('discord.js');
// Use for any fetch requests
const fetch = require('node-fetch');

module.exports = {
  // Build new slash command and set details
  data: new SlashCommandBuilder()
    .setName('results')
    .setDescription('Include year and round number to get results for that race\nExclude to get latest race results')
    // Accept options (arguments) after slash command
    // For different typing available if expecting a certain value type (string, int, bool, etc... See: https://discordjs.guide/interactions/slash-commands.html#option-types)
    .addStringOption(option => option.setName('year').setDescription('Year of race'))
    .addStringOption(option=> option.setName('round').setDescription('Round of the season')),

  // Function to take place on command execution
  async execute(interaction) {
    // ... temporary message while processing command
    await interaction.deferReply();

    // retrieve option input value if needed
    // const option = interaction.options.getString(optionName);

    // url to use for fetch requests
    const userInputYear = interaction.options.getString('year') || 'current' // set to option value when added
    const userInputRound = interaction.options.getString('round') ||'last' // set to option value when added
    const url = `http://ergast.com/api/f1/${userInputYear}/${userInputRound}/results.json`
    // If making fetch requests use this pattern
    const fetchedData = await fetch(url)
      .then(response => response.json())
      .then(data => {
        // Parse relevant data
        return data.MRData.RaceTable.Races[0]
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

      // set podium field for embed
      // Creates medal + info for top 3 drivers      
      const embedFieldsPodium = fetchedData.Results.map((result) => {
        let medal = ''
        if(result.position === '1'){medal = '🥇'}
        if (result.position === '2') { medal = '🥈' }
        if (result.position === '3') { medal = '🥉' }
        if(result.position <= 3){
          return {name: `${medal}${result.Driver.code}`, value: result.Time.time, inline: true}
        } else{ // add condition here to expand list past top 3 if needed without asisgning medlla and 'inline: false'
          return null
        }
      }).filter((el) => el !== null) // filter results we don't want to see

      // Create starting grid
      // Sort entire grid by starting position (finish position by default)
      const gridSort = fetchedData.Results.sort((res1, res2) => +res1.grid - +res2.grid)
      // Filter left/right and pit starts from each other
      const embedFieldsGridLeft = gridSort.filter(res=> +res.grid % 2 === 1 && +res.grid !== 0)
      const embedFieldsGridRight = gridSort.filter(res => +res.grid % 2 === 0 && +res.grid !== 0)
      const embedFieldsGridPit = gridSort.filter(res => +res.grid === 0)

      // Create string for each of the three starting lanes on the grid (left/right/pit)
      const embedFieldsGridLeftStr = embedFieldsGridLeft.reduce((acc, grid) => `${acc}\n${grid.grid}. ${grid.Driver.code}`, '')
      const embedFieldsGridRightStr = embedFieldsGridRight.reduce((acc, grid) => `${acc}\n${grid.grid}. ${grid.Driver.code}`, '')
      const embedFieldsGridPitStr = embedFieldsGridPit.length > 0 ?
        embedFieldsGridPit.reduce((acc, grid) => `${acc}\n${grid.grid}. ${grid.Driver.code}`, '') :
        null // No pit starts this race

      // Create grid embed field objects 
      const embedFieldsGridL = {name: 'Left', value: embedFieldsGridLeftStr, inline: true}
      const embedFieldsGridR = { name: 'Right', value: embedFieldsGridRightStr, inline: true }
      const embedFieldsGridP = embedFieldsGridPitStr !== null ? {name: 'Pit', value: embedFieldsGridPitStr, inline: false} : {name: 'Pit',value:'(none)'}

      // Create embed object to add to message
      const embed = new MessageEmbed()
        .setColor('#e10600')
        .setTitle(`Round ${fetchedData.round} ${fetchedData.raceName}`)
        .setURL(`${fetchedData.url}`)
        .addFields(
          // add embed fields
          ...embedFieldsPodium,
          embedFieldsGridL,
          embedFieldsGridR,
          embedFieldsGridP
          
        )

      // Update ... temp message with embed data
      interaction.editReply({ embeds: [embed] })
    }
  }
}
