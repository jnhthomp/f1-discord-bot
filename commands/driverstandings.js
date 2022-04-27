const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('driverstandings')
    .setDescription('Get current scores in drivers championship'),

  async execute(interaction) {
    await interaction.deferReply();
    // Fetch current driver standings data
    const standingsData = await fetch('http://ergast.com/api/f1/current/driverStandings.json')
      .then(response => response.json())
      .then(data => {
        // get standings list from returned data
        let standingsList = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
        // map each entry in the standings to an embed field
        let standingFields = standingsList.map((position) => {
          return { name: `${position.position}`, value: `Points: ${position.points}\n${position.Driver.givenName} ${position.Driver.familyName}\n${position.Constructors[0].name}\n${position.Driver.permanentNumber}` }
        })
        
        // Return list of embed fields containing standings data
        return standingFields
      });

    // if no results found
    if (!standingsData) {
      interaction.editReply('No results found')
    }

    // console.log(standingsData)

    // Create embed object
    const embed = new MessageEmbed()
      .setColor('#e10600')
      .setTitle('Current Driver Standings')
      .setURL('https://www.formula1.com/en/results/driver-standings.html')
      .addFields(
        // Use array destructuring to drop all fields 
        ...standingsData
      )
      
    // Return embed in response
    interaction.editReply({ embeds: [embed]})
  }
}