const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suporte")
    .setDescription("Informações de onde conseguir suporte."),
    
  
  async execute(interaction) {
  
    const embed = new EmbedBuilder();

    embed
      .setColor(0x5506ce)
      .setTitle('Suporte')
      .setDescription('Entre em contato nesses enderenços e deixe suas dúvidas FIque à vontade de convidar o bot para o seu canal ou juntar-se a nós em nosso servidor GURPS.')
      .setThumbnail("https://i.imgur.com/nC0LfsR.png")
      .addFields([
        { name: 'Postar um erro:', value: '[link](https://github.com/Boifuba/beah)', inline: true },
        { name: 'Campanhas do Boi:', value: '[Entrar](https://discord.gg/cJTttwHg)', inline: true },
        { name: 'Convidar o bot', value: '[link](https://top.gg/bot/997822340400418858)', inline: true },
      ]);

    await interaction.reply({ embeds: [embed] });
  },
};
