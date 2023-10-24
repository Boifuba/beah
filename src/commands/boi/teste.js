const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("boi")
    .setDescription("Index of GURPS Book")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("traits")
        .setDescription("List of traits")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Pick one!")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async autocomplete(interaction) {
    const value = interaction.options.getFocused().toLowerCase();

    const dados = require("../../json/boi.json");
    

    if (!Array.isArray(dados)) {
      dados = Array.from(dados);
    }
    
    const filtered = dados.filter((item) => item.name.toLowerCase().startsWith(value));
    try {
      const filtered = dados
        .filter((item) => item.name.toLowerCase().startsWith(value))
        .slice(0, 25);

      if (!interaction) return;

      await interaction.respond(
        filtered.map((choice) => ({
          name: choice.name,
          value: choice.calc.level,
        }))
      );
    } catch (error) {
      console.error("Erro na função autocomplete:", error);
    }
  },
};
