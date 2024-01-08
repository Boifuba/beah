const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

let list = []; // Declare a list variable outside of the file reading block
let characterName = ''; 


fs.readFile('src/json/boi.json', 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading JSON file: ' + err);
      return;
  }

  const jsonData = JSON.parse(data);
  characterName = jsonData.profile.name; // Atribua o valor à variável global

  jsonData.skills.forEach(element => {
      list.push({
          name: element.name,
          level: element.calc.level
      });
  });

  //console.log(list);
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("boi")
    .setDescription("Rola contra o NH")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("skill")
        .setDescription("Roll against NH")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Informe o nível de habilidade")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async autocomplete(interaction) {
    const jsonData = JSON.parse(fs.readFileSync('src/json/boi.json', 'utf8'));
    const choices = jsonData.skills.map((skill) => skill.name);
    const value = interaction.options.getString("query");

    const filtered = choices
      .filter((choice) => choice.includes(value))
      .slice(0, 25);

    if (!interaction) return;

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const skillName = interaction.options.getString("query"); // Get the selected skill name

    if (subcommand === "skill") {
      function findLevelByName(name) {
        const skill = list.find(skill => skill.name === name);
        if (skill) {
            return skill.level;
        } else {
            return "Nome não encontrado";
        }
      }

      const nameToFind = skillName;
      const nh = findLevelByName(nameToFind);

      const embed = new EmbedBuilder();

      var dado1 = Math.floor(Math.random() * 6) + 1;
      var dado2 = Math.floor(Math.random() * 6) + 1;
      var dado3 = Math.floor(Math.random() * 6) + 1;
      var roll = dado1 + dado2 + dado3;

      if (roll < nh && roll !== 16 && roll !== 17 && roll <= nh - 10) {
        embed
          .setColor("Yellow")
          .setThumbnail("https://i.imgur.com/Iso6SyT.png")
          .setTitle("Sucesso Decisivo!")
          .addFields({
            name: `Resultado:`,
            value: `\nVocê rolou  ${skillName}-${nh} e tirou um **sucesso decisivo** na rolagem! \n*${dado1}* + *${dado2}* + *${dado3}* = **${roll}**`,
            inline: true,
          });
      } else if (roll < nh && (roll === 16 || roll === 17)) {
        embed
          .setColor("White")
          .setThumbnail("https://i.imgur.com/PjQkhE8.png")
          .setTitle(`Falhou! por ${(nh-roll)* (-1)}`)
          .addFields({
            name: `${characterName}`,
            value: `\nVocê rolou  ${skillName}-${nh} e *Falhou* por ${nh-roll} na rolagem! \n*${dado1}* + *${dado2}* + *${dado3}* = **${roll}**`,
            inline: true,
          });
      } else if (roll === 18) {
        embed
          .setColor("Black")
          .setThumbnail("https://i.imgur.com/PWWFewM.png")
          .setTitle("Crítico")
          .addFields({
            name: `${characterName}`,
            value: `\nVocê rolou  ${skillName}-${nh} e tirou um *Crítico* na rolagem! \n*${dado1}* + *${dado2}* + *${dado3}* = **${roll}**`,
            inline: true,
          });
      } else if (roll > nh) {
        embed
          .setColor("Red")
          .setThumbnail("https://i.imgur.com/w4j2xUx.png")
          .setTitle(`Falhou por ${(nh-roll)*(-1)}`)
          .addFields({
            name: `${characterName}`,
            value: `\nVocê rolou  ${skillName}-${nh} e *Falhou* por ${nh-roll} na rolagem! \n*${dado1}* + *${dado2}* + *${dado3}* = **${roll}**`,
            inline: true,
          });
      } else {
        embed
          .setColor("Green")
          .setThumbnail("https://i.imgur.com/VJPhbAX.png")
          .setTitle(`${characterName}`)
          .addFields({
            name: `Sucesso por ${nh-roll}`,
            value: `\nVocê rolou ${skillName}-${nh} e teve *Sucesso* na rolagem! \n*${dado1}* + *${dado2}* + *${dado3}* = **${roll}** `,
            inline: true,
          });
      }

      await interaction.reply({ embeds: [embed] });
    }
  }
};
