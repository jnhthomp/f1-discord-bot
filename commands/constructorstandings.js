const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('constructorstandings')
    .setDescription('Get current scores in the constructors championship'),

  async execute(interaction) {
    await interaction.deferReply();
    // Fetch current driver standings data
    const standingsData = await fetch('http://ergast.com/api/f1/current/constructorStandings.json')
      .then(response => response.json())
      .then(data => {
        let standingsList = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
        console.log(standingsList)

        let standingFields = standingsList.map((position) => {
          return { name: `${position.position}`, value: `${position.points} - ${position.Constructor.name}` }
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
      .setTitle('Current Constructor Standings')
      .setURL('https://www.formula1.com/en/results/constructor-standings.html')
      .addFields(
        // Use array destructuring to drop all fields 
        ...standingsData
      )

    // Return embed in response
    interaction.editReply({ embeds: [embed] })
  }
}