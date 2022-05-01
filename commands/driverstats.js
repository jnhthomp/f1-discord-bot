const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('driverstats')
    .setDescription('Get per race driver stats')
    .addStringOption(option => option.setName('drivername').setDescription('Enter a driver name').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    // store option input value
    const driverName = interaction.options.getString('drivername');
    const statsData = await fetch(`http://ergast.com/api/f1/current/drivers/${driverName}/results.json`)
      .then(response => response.json())
      .then(data => {
        let statsList = data.MRData.RaceTable.Races

        return statsList
        
      });
    
    if (statsData.length === 0) {
      const validDriverNames = await fetch('http://ergast.com/api/f1/current/drivers.json')
        .then(response => response.json())
        .then(data => {
          let listOfDriverObjs = data.MRData.DriverTable.Drivers
          return listOfDriverObjs.map((driver) => `${driver.driverId}`)
        })
      
      interaction.editReply(`No results found... Try a current driver id:\n${validDriverNames.join('\n')}`)
      
    } else {

      let statsFields = statsData.map((race, i) => {
        
        return {
        name: `Round: ${race.round} ${race.raceName} ${race.url}`,
          value: `Starting Position: ${race.Results[0].grid}\nFinish Position: ${race.Results[0].position}\nPoints: ${race.Results[0].points}\nFastest Lap Rank/Time (${race.Results[0].FastestLap.rank}) ${race.Results[0].FastestLap.Time.time}`
      }})

      
      const embed = new MessageEmbed()
        .setColor('#e10600')
        .setTitle(`${driverName} stats`)
        .setURL(statsData[0].Results[0].Driver.url)
        .addFields(
          // Use array destructuring to drop all fields 
          ...statsFields
        )
      
      interaction.editReply({ embeds: [embed] })
    }
  }
}