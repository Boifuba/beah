const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const vantagensJSON = require("../../json/spells.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spells")
    .setDescription("Autocomplete test")
    .addStringOption((o) =>
      o
        .setName("query")
        .setDescription("Input a query")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    try {
      const value = interaction.options.getString("query").toLowerCase();

      // Mapeie os nomes das magias com base na estrutura do JSON
      const choices = vantagensJSON.rows.map((spell) => spell.name);
      const filtered = choices
        .filter((choice) => choice.toLowerCase().includes(value))
        .slice(0, 25);

      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    } catch (error) {
      console.error("Erro durante o comando de autocompletar:", error);
      await interaction.reply("Ocorreu um erro ao tentar autocompletar.");
    }
  },

  async execute(interaction) {
    try {
      const query = interaction.options.getString("query");

      // Encontre a spell correspondente no JSON
      const spell = vantagensJSON.rows.find((spell) =>
        spell.name.toLowerCase() === query.toLowerCase()
      );

      if (!spell) {
        await interaction.reply("spell não encontrada.");
        return;
      }
      const difficultyUppercase = spell.difficulty.toUpperCase();

      // Exiba as informações da spell
      const embed = new EmbedBuilder();
      embed.setColor(0x5506ce)
        .setTitle(spell.name)
        .setThumbnail('https://i.imgur.com/Yf1v9jh.jpg')
        .addFields(
          { name: 'Escola', value: `${spell.college}`},
          { name: 'Tipo', value: `${spell.spell_class}` },
          { name: 'Dificuldade', value: `${difficultyUppercase}` },
          { name: 'Custo', value: `${spell.casting_cost}` },
          { name: 'Duração', value: `${spell.duration}` },
          { name: 'Manutenção', value: `${spell.maintenance_cost}` },
          { name: 'Tempo de Lançamento', value: `${spell.casting_time}` },
          //{ name: '\u200B', value: '\u200B' },
          { name: 'Página', value: `${spell.reference}` },
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro durante o comando de execução:", error);
      await interaction.reply("Ocorreu um erro ao executar o comando.");
    }
  },
};
