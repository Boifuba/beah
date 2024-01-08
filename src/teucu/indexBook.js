const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const spellsJSON = require("../json/spells.json");
const dados = require("../json/babel.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("index")
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rules")
        .setDescription("List of rules.")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Choose one.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("spells")
        .setDescription("List of spells")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Input a query")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async autocomplete(interaction, client) {
    const value = interaction.options.getFocused().toLowerCase();
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "traits") {
      const dados = require("../json/babel.json");

      try {
        const filtered = dados
          .filter((item) => item.name_en.toLowerCase().includes(value))
          .slice(0, 25);

        if (!interaction) return;

        await interaction.respond(
          filtered.map((choice) => ({
            name: choice.name_en,
            value: choice.name_en,
          }))
        );
      } catch (error) {
        console.error("Erro na função autocomplete:", error);
      }
    }

    if (subcommand === "rules") {
      function extractTextFromNotes(notes, result = []) {
        notes.forEach((note) => {
          if (note.type === "note") {
            result.push({
              text: note.text,
              reference: note.reference, // Assumindo que a referência está disponível no objeto de nota
            });
          } else if (note.children) {
            extractTextFromNotes(note.children, result);
          }
        });
      }

      const jsonFiles = [
        path.resolve(__dirname, "../../json/rules.json"),
        path.resolve(__dirname, "../../json/rules_ma.json"),
        path.resolve(__dirname, "../../json/rules_m.json"),
      ];

      const choices = [];

      jsonFiles.forEach((jsonFile) => {
        try {
          const jsonData = fs.readFileSync(jsonFile, "utf-8");
          const jsonObject = JSON.parse(jsonData);
          extractTextFromNotes(jsonObject.rows, choices);
        } catch (error) {
          console.error(`❌ Erro ao ler o arquivo JSON ${jsonFile}:`, error);
        }
      });
      const value = interaction.options.getString("query").toLowerCase();

      const filtered = choices
        .filter((choice) => choice.text.toLowerCase().includes(value))
        .slice(0, 25);

      if (!interaction) return;

      await interaction.respond(
        filtered.map((choice) => ({ name: choice.text, value: choice.text }))
      );
    }

    if (subcommand === "spells") {
      try {
        const value = interaction.options.getString("query").toLowerCase();

        // Mapeie os nomes das magias com base na estrutura do JSON
        const choices = spellsJSON.rows.map((spell) => spell.name);
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
    }
  },

  /*
  
  FUNÇÃO EXECUTE
  
  */
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    /*
  
  EXECUTE TRAITS
  
 */
    if (subcommand === "traits") {
      try {
        const palavraChave = interaction.options.getString("query"); // Obtenha a palavra-chave a partir das opções

        const resultados = dados.filter(
          (item) =>
            item.name_br.includes(palavraChave) ||
            item.pg_br.includes(palavraChave) ||
            item.name_en.includes(palavraChave) ||
            item.cost.includes(palavraChave)
        );

        const embed = new EmbedBuilder() // Certifique-se de que está usando a classe EmbedBuilder corretamente
          .setColor(0x5506ce)
          .setDescription(`Results for "${palavraChave}"`);

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
    }

    /*
    
    EXECUTE RULES 
    
    
    */

    if (subcommand === "rules") {
      function extractTextFromNotes(notes, result = []) {
        notes.forEach((note) => {
          if (note.type === "note") {
            result.push({
              text: note.text,
              reference: note.reference, // Assumindo que a referência está disponível no objeto de nota
            });
          } else if (note.children) {
            extractTextFromNotes(note.children, result);
          }
        });
      }

      const jsonFiles = [
        path.resolve(__dirname, "../../json/rules.json"),
        path.resolve(__dirname, "../../json/rules_ma.json"),
        path.resolve(__dirname, "../../json/rules_m.json"),
      ];

      const choices = [];

      jsonFiles.forEach((jsonFile) => {
        try {
          const jsonData = fs.readFileSync(jsonFile, "utf-8");
          const jsonObject = JSON.parse(jsonData);
          extractTextFromNotes(jsonObject.rows, choices);
        } catch (error) {
          console.error(`❌  Can´t Read the JSON ${jsonFile}:`, error);
        }
      });

      const query = interaction.options.getString("query").toLowerCase();

      const chosenNote = choices.find(
        (choice) => choice.text.toLowerCase() === query
      );

      if (chosenNote) {
        await interaction.reply({
          content: `A Regra ${chosenNote.text} is on page ${chosenNote.reference}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "We don´t have this rule.",
          ephemeral: true,
        });
      }
    }

    /*
    
    EXECUTE SPELLS
    
    
    */
    if (subcommand === "spells") {
      try {
        const query = interaction.options.getString("query");

        // Encontre a spell correspondente no JSON
        const spell = spellsJSON.rows.find(
          (spell) => spell.name.toLowerCase() === query.toLowerCase()
        );

        if (!spell) {
          await interaction.reply("spell não encontrada.");
          return;
        }
        const difficultyUppercase = spell.difficulty.toUpperCase();

        // Exiba as informações da spell
        const embed = new EmbedBuilder();
        embed
          .setColor(0x5506ce)
          .setTitle(spell.name)
          .setThumbnail("https://i.imgur.com/Yf1v9jh.jpg")
          .addFields(
            { name: "College", value: `${spell.college}` },
            { name: "Type", value: `${spell.spell_class}` },
            { name: "Difficulty", value: `${difficultyUppercase}` },
            { name: "Coust", value: `${spell.casting_cost}` },
            { name: "Duration", value: `${spell.duration}` },
            { name: "Maintenance", value: `${spell.maintenance_cost}` },
            { name: "Casting Time", value: `${spell.casting_time}` },
            //{ name: '\u200B', value: '\u200B' },
            { name: "Page", value: `${spell.reference}` }
          );

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error("Erro durante o comando de execução:", error);
        await interaction.reply("Ocorreu um erro ao executar o comando.");
      }
    }
  },
};
