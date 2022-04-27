const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nextrace')
    .setDescription('Get next F1 race event info'),

    async execute(interaction){
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

      if (!raceData) {
        interaction.editReply('No results found')
      }

      console.log(`Next race data: ${raceData}`)

      const embed = new MessageEmbed()
        .setColor('#e10600')
        .setTitle(raceData.raceName)
        .setURL(raceData.url)
        .addFields(
          { name: 'Round', value: raceData.round },
          { name: 'Date', value: raceData.date },
          { name: 'Time', value: raceData.time },
        )

      interaction.editReply({ embeds: [embed] })
    }
}