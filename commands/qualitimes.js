const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  // Build new slash command and set details
  data: new SlashCommandBuilder()
    .setName('qualitimes')
    .setDescription('Get quali stats for a given track')
    // Will expect a trackname as an argument after the command
    .addStringOption(option => option.setName('trackname').setDescription('Enter a track name')),

  // Function to take place on command execution
  async execute(interaction) {
    // ... temporary message while processing command
    await interaction.deferReply();
    // retrieve option input value
    const trackName = interaction.options.getString('trackname');
    // Fetch trackData on circuit using option input
    const trackData = await fetch(`http://ergast.com/api/f1/2022/circuits/${trackName}/qualifying.json`)
      .then(response => response.json())
      .then(data => {
        // Parse relevant data
        return data.MRData.RaceTable.Races[0]
      });
  
    // If no data returned (no quali yet or track invalid)
    if (trackData === undefined) {
      // Fetch list of all tracks for current year
      const validTrackNames = await fetch('http://ergast.com/api/f1/current/circuits.json')
        .then(response => response.json())
        .then(data => {
          // parse relevant data
          let listOfCircuitObjs = data.MRData.CircuitTable.Circuits
          // Return array of valid circuit id's
          return listOfCircuitObjs.map((circuit) => `${circuit.circuitId}`)
        })
      
      // Edit ... temp message with list of valid track id's
      interaction.editReply(`No results found... Try a current circuit id:\n${validTrackNames.join('\n')}`)

    } else {
      // Find and add fastest time to each qualifying result 
      trackData.QualifyingResults = trackData.QualifyingResults.map((el) => {
        let Qs = [el.Q1, el.Q2, el.Q3].sort()
        return {
          ...el,
          QFastest: Qs[0] || '9:99.999' // (Set to 9:99.999 if no time at all)
        }
      });

      // Sort all QualifyingResults by QFastest
      trackData.QualifyingResults.sort((a, b) => a.QFastest < b.QFastest ? -1 : 0)

      // Get the top 5 results and map an embed object for them
      let qualiResults = trackData.QualifyingResults.map((result, i) =>{
        if(i > 4){
          return
        } else{
          return {
            name: `${i + 1}. ${result.Driver.givenName} ${result.Driver.familyName}`,
            value: `Fastest Time: ${result.QFastest}`
          }
        }
      }).filter(el => el !== undefined) 

      // Create embed object to add to message
      const embed = new MessageEmbed()
        .setColor('#e10600')
        .setTitle(`Round ${trackData.round} ${trackData.raceName}`)
        .setURL(`${trackData.url}`)
        .addFields(
          // add each object created as a field
          ...qualiResults
        )
      
      // Update ... temp message with embed data
      interaction.editReply({ embeds: [embed]})
    }
  }
}
