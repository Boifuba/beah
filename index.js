const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  MessageManager,
  Embed,
  Collection,
  TextChannel,
} = require(`discord.js`);
const fs = require("fs");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

require("dotenv").config();
const mongoose = require("mongoose");

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
  for (file of functions) {
    require(`./src/functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(process.env.token);
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

// client.once('ready', () => {
//   console.log(`Estou em ${client.guilds.cache.size} servidores!`);
//   client.guilds.cache.forEach((guild) => {
//     console.log(` - ${guild.name}`);
//   });
// });

// Lista Comandos
const listCommand = require("./src/commands/utilities/suporte");
client.commands.set(listCommand.data.name, listCommand);

//funciona
// client.on('ready', () => {
//   let totalMembros = 0;

//   client.guilds.cache.forEach((guild) => {
//     totalMembros += guild.memberCount;
//   });

//   console.log('**Tabela de servidores:**');
//   client.guilds.cache.forEach((guild) => {
//     console.log(` - ${guild.name}: ${guild.memberCount} membros`);
//   });

//   console.log(`**Total de membros:** ${totalMembros}`);
// });

client.on("ready", () => {
  let totalMembros = 0;

  client.guilds.cache.forEach((guild) => {
    totalMembros += guild.memberCount;
  });

  console.log(`\n
    \x1b[34m
  **************************************************
  *************** \x1b[33m Tabela de servidores \x1b[33m\x1b[34m************
  **************************************************
  \x1b[34m
    \x1b[37m
  `);
  const dados = client.guilds.cache.map((guild) => {
    return {
      Nome: guild.name,
      Membros: guild.memberCount,
    };
  });
  console.table(dados);

  console.log(`
  \x1b[34m
  ***************************************************
  ******************** \x1b[33m${totalMembros} Users\x1b[33m\x1b[34m********************
  ***************************************************
  \x1b[34m
  \n
  `);
});

////

// client.once('ready', () => {
//   console.log(`Bot está online como ${client.user.tag}`);

//   client.guilds.cache.forEach(async (guild) => {
//     try {
//       const invite = await guild.channels.cache
//         .random()
//         .createInvite({ maxAge: 0, unique: true });
//       console.log(`Convite para ${guild.name}: ${invite.url}`);
//     } catch (error) {
//       console.error(error);
//     }
//     console.log(`O servidor ${guild.name} tem ${guild.memberCount} membros.`);
//   });
// });

//Mongoose connection
(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO);
    console.log(`✅ Mongoose is working`);
  } catch (error) {
    console.log(` ⛔ Connection error with mongoose: ${error}`);
  }
})();
