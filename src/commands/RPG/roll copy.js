const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// Função para rolar um dado de seis lados
function rolarD6() {
    return Math.floor(Math.random() * 6) + 1;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("r")
    .setDescription("Roll 3d6"),
  async execute(interaction) {



      
      const embed = new EmbedBuilder();
      const qtd = 3

      const resultados = [];
      let somaResultados = 0;

      for (let i = 0; i < qtd; i++) {
          const resultado = rolarD6();
          resultados.push(resultado);
          somaResultados += resultado;
      }

      let resultadoFormatado = resultados.join(" + ");
      embed
      .setColor(0x5506ce)
        .setThumbnail("https://i.imgur.com/6wqPtuq.png")
        .setTitle(`You rolled: ${somaResultados}`)
        .addFields({
          name: `Rolls:`,
          value: `\n${resultadoFormatado} = ${somaResultados}`,
          inline: true,
        });

        await interaction.reply({ embeds: [embed] });
      }
  }

