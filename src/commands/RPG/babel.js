const { SlashCommandBuilder, EmbedBuilder } = require("discord.js"); // Certifique-se de que a classe EmbedBuilder está corretamente importada
const dados = require("./babel.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vantagens")
    .setDescription("Lista as páginas das vantagens no livro em português e inglês")
    .addStringOption((option) =>
      option
        .setName("vantagens")
        .setDescription("A palavra-chave para a pesquisa.")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    try {
      const value = interaction.options.getString("vantagens");

      const filtered = dados
        .filter((item) => item.name_br.toLowerCase().includes(value))
        .slice(0, 25);

      if (!interaction) return;

      await interaction.respond(
        filtered.map((choice) => ({
          name: choice.name_br,
          value: choice.name_br,
        }))
      );
    } catch (error) {
      console.error("Erro na função autocomplete:", error);
    }
  },
  async execute(interaction) {
    try {
      const palavraChave = interaction.options.getString("vantagens"); // Obtenha a palavra-chave a partir das opções

      const resultados = dados.filter(
        (item) =>
          item.name_br.includes(palavraChave) ||
          item.pg_br.includes(palavraChave) ||
          item.name_en.includes(palavraChave) ||
          item.cost.includes(palavraChave)
      );

      const embed = new EmbedBuilder() // Certifique-se de que está usando a classe EmbedBuilder corretamente
        .setColor(0x5506ce)
        .setDescription(`Resultados para "${palavraChave}"`);

      resultados.forEach((resultado) => {
        const { name_br, name_en, pg_br, pg_en, cost } = resultado;
        embed
          .setTitle(`${name_en}`)
          .setThumbnail("https://i.imgur.com/MaLBvJU.png")
          .setDescription(`Cost: ${cost}`)
          .addFields(
            {
              name: `🇧🇷`,
              value: `B${pg_br}`,
              inline: true,
            },
            {
              name: `🇺🇸`,
              value: `B${pg_en}`,
              inline: true,
            }
          );
      });

      // Responder à interação com o objeto EmbedBuilder
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro na função execute:", error);
    }
  },
};
