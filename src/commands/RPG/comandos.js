const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comandos')
    .setDescription('Lista todos os comandos do bot'),
  async execute(interaction) {
    const commandList = interaction.client.commands.map((command) => command.data.name);
    const embed = new EmbedBuilder()
      .setColor(0x5506ce)
      .setThumbnail("https://i.imgur.com/nC0LfsR.png")
      .setTitle('Lista de comandos')
      .setDescription(commandList.join('\n'));
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
