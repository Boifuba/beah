const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const { Client, GatewayIntentBits } = require("discord.js");
//
module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Support itens")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Pick an option.")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const value = interaction.options.getFocused().toLowerCase();

    const choices = [
      "Bot commands",
      "Contacts",
      "Server Status",
      "Public",
    ];

    const filtered = choices
      .filter((choice) => choice.toLowerCase().includes(value))
      .slice(0, 25);

    if (!interaction) return;

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  async execute(interaction) {
    const query = interaction.options.getString("query");

    const embed = new EmbedBuilder()
      .setColor(0x5506ce)
      .setTitle(query)
      .setThumbnail("https://i.imgur.com/nC0LfsR.png");

    switch (query) {
      case "Bot commands":
        const commandList = interaction.client.commands.map(
          (command) => command.data.name
        );
        embed.setDescription(commandList.join("\n"));
        break;
      case "Contacts":
        embed.setDescription(
          "Contact us at these addresses and leave your questions. Feel free to invite the bot to your channel or join us on our GURPS server."
        );
        embed.addFields([
          {
            name: "Create an issue:",
            value: "[GitHub](https://github.com/Boifuba/beah)",
            inline: true,
          },
          {
            name: "Bot Channel:",
            value: "[Enter](https://discord.gg/cJTttwHg)",
            inline: true,
          },
          {
            name: "Invite a bot",
            value: "[Link](https://top.gg/bot/997822340400418858)",
            inline: true,
          },
        ]);
        break;

      case "Public":
        let totalUsers = 0;

        interaction.client.guilds.cache.forEach((guild) => {
          totalUsers += guild.memberCount;
        });
        const guildCount = interaction.client.guilds.cache.size;

        await interaction.reply;
        embed
          .setTitle("Server Status")
          .setDescription(
            `The bot is on **${guildCount}** servers and helping **${totalUsers}** players.`
          );
        break;
      case "Server Status":
        const guild = interaction.guild; // Obter a guild da interação

        let a = guild.memberCount;
        let b = guild.members.cache.filter(
          (x) => x.presence?.status === "online"
        ).size;
        let c = guild.members.cache.filter(
          (x) => x.presence?.status === "idle"
        ).size;
        let d = guild.members.cache.filter(
          (x) => x.presence?.status === "dnd"
        ).size;

        embed.setTitle("Server Status");
        embed.setDescription(
          "List of users by activity."
        );
        embed.setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.avatarURL(),
        });

        embed.addFields({
          name: "Online",
          value: `  🟢  ${b} members`,
        });
        embed.addFields({
          name: "Idle",
          value: `  🟡  ${c} members`,
        });
        embed.addFields({
          name: "Busy",
          value: `  🔴  ${d} members`,
        });
        embed.addFields({
          name: "Total members",
          value: `👥 ${a} members`,
        });

        break;
      default:
        embed.setDescription("Oh Sheit!");
        break;
    }

    await interaction.reply({ embeds: [embed] });
  },
};
