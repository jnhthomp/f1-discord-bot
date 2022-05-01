const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List commands available to F1Bot'),

  async execute(interaction) {
    await interaction.deferReply();

    // Retrieve list of commands
    // [['commandName', {...commandObj}], ...]
    let commands = [...interaction.client.commands]

    // map each command to how it should be output
    commands = commands.map((command) => { 
      let details = command[1].data; 
      // Special case for commands with options (probably a better way to handle this)
      if(details.name === 'driverstats') {details.name = 'driverstats <DRIVER_ID>'}
      if (details.name === 'qualitimes') { details.name = 'qualitimes <TRACK_ID>' }
      
      // Return command object to be used for description
      return {name: `/${details.name}`, description:`${details.description}`}
    })

    const embed = new MessageEmbed()
      .setColor('#418e86')
      .setTitle('F1Bot Commands')
      .setURL('https://github.com/jnhthomp/f1-discord-bot')
      .addFields(
        ...commands.map((command) => ({name: `\`${command.name}\``, value: command.description }))
      )

    interaction.editReply({ embeds: [embed] })
  }
}