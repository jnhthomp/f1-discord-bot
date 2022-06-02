//Load .env file
require('dotenv').config()
// Node file system module
const fs = require('node:fs');
// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js');
// const { token } = require('./config.json');
const { logCommand } = require('./tools/log-command.js')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Create a collection of commands
client.commands = new Collection();
// Create an array of js files in the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

// Loop through array of js files in commands folder
for (const file of commandFiles) {
  // save the exported value fromt he file
  const command = require(`./commands/${file}`);
  // set a command using the name and command object from the js file
  client.commands.set(command.data.name, command)
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
  // Check that the interaction is a command
  if (!interaction.isCommand()) return;

  // Get the appropriate command file from the object we created by setting each command
  const command = client.commands.get(interaction.commandName);

  // Cancel if it doesn't exist
  if(!command) return;

  try {
    logCommand(interaction)
    // Execute the action for that command passing the interaction object as an argument
    await command.execute(interaction);
  } catch(error){
    // incase of errors
    console.error(error);
    await interaction.reply({content: 'There wa an error while executing this command!', ephemeral: true})
  }
})

// Login to Discord with your client's token
client.login(process.env.TOKEN);