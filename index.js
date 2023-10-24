const { Client, GatewayIntentBits,  EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, TextChannel } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); 

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./src/functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

//Others confs


  //autocomplete
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        return;
      }
      try {
        await command.autocomplete(interaction);
      } catch (err) {
        console.error(err);
      }
    }
  });

  client.once('ready', () => {
    console.log(`Estou em ${client.guilds.cache.size} servidores!`);
    client.guilds.cache.forEach((guild) => {
      console.log(` - ${guild.name}`);
    });
  });

  // Lista Comandos
  const listCommand = require('./src/commands/utilities/suporte');
  client.commands.set(listCommand.data.name, listCommand);
  
