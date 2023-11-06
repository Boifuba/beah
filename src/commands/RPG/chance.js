
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chance")
    .setDescription("Statistics")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("3d6")
        .setDescription("Roll 3d6")
        .addIntegerOption((option) =>  
          option
            .setName("value")
            .setDescription("Insert a value.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("1d100")
        .setDescription("Roll 1d100")
        .addIntegerOption((option) =>
          option
            .setName("target")
            .setDescription("Input a query")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    console.warn(subcommand)
    if (subcommand === "3d6") {
      let table = [
        {
          skill: 3,
          critical_success: "1.85",
          success: 0,
          failure: "72.22",
          critical_failure: "25.93",
        },
        {
          skill: 4,
          critical_success: "1.85",
          success: "0",
          failure: "81.94",
          critical_failure: "16.2",
        },
        {
          skill: 5,
          critical_success: "1.85",
          success: "2.78",
          failure: "86.11",
          critical_failure: "9.26",
        },
        {
          skill: 6,
          critical_success: "1.85",
          success: "7.41",
          failure: "86.11",
          critical_failure: "4.63",
        },
        {
          skill: 7,
          critical_success: "1.85",
          success: "14.35",
          failure: "81.94",
          critical_failure: "1.85",
        },
        {
          skill: 8,
          critical_success: "1.85",
          success: "24.07",
          failure: "72.22",
          critical_failure: "1.85",
        },
        {
          skill: 9,
          critical_success: "1.85",
          success: "35.65",
          failure: "60.65",
          critical_failure: "1.85",
        },
        {
          skill: 10,
          critical_success: "1.85",
          success: "48.15",
          failure: "48.15",
          critical_failure: "1.85",
        },
        {
          skill: 11,
          critical_success: "1.85",
          success: "60.65",
          failure: "35.65",
          critical_failure: "1.85",
        },
        {
          skill: 12,
          critical_success: "1.85",
          success: "72.22",
          failure: "24.07",
          critical_failure: "1.85",
        },
        {
          skill: 13,
          critical_success: "1.85",
          success: "81.94",
          failure: "14.35",
          critical_failure: "1.85",
        },
        {
          skill: 14,
          critical_success: "1.85",
          success: "88.89",
          failure: "7.41",
          critical_failure: "1.85",
        },
        {
          skill: 15,
          critical_success: "4.63",
          success: "90.74",
          failure: "2.78",
          critical_failure: "1.85",
        },
        {
          skill: 16,
          critical_success: "9.26",
          success: "88.89",
          failure: "1.39",
          critical_failure: "0.46",
        },
        {
          skill: 17,
          critical_success: "9.26",
          success: "88.89",
          failure: "1.39",
          critical_failure: "0.46",
        },
        {
          skill: 18,
          critical_success: "9.26",
          success: "88.89",
          failure: "1.39",
          critical_failure: "0.46",
        }
        ];
      
        let skillToSearch = interaction.options.getInteger("value");
        if (skillToSearch > 18) skillToSearch = 18;
        let foundObject = table.find((obj) => obj.skill === skillToSearch);
  
        if (foundObject) {
          let { critical_success, success, failure, critical_failure } = foundObject;
  
          const embed = new EmbedBuilder();
  
          embed
            .setColor(0x5506ce)
            .setThumbnail("https://i.imgur.com/nC0LfsR.png")
            .setTitle("Probabilities")
            .addFields(
              {
                name: "Critical Success.",
                value: `${critical_success}%`,
                inline: true,
              },
              { name: "\u200B", value: "\u200B", inline: true },
              {
                name: "Common Success.",
                value: `${success}%`,
                inline: true,
              },
              {
                name: "Common Failure.",
                value: `${failure}%`,
                inline: true,
              },
              { name: "\u200B", value: "\u200B", inline: true },
              {
                name: "Critical Failure.",
                value: `${critical_failure}%`,
                inline: true,
              }
            );
  
          await interaction.reply({ embeds: [embed], ephemeral: true });
      
            }
        } else if (subcommand === "1d100") {
          const userValue = interaction.options.getInteger("target");
          const rollResult = Math.floor(Math.random() * 100) + 1;
        
          let isSuccess = rollResult <= userValue;
        
          const embed = new EmbedBuilder();
          embed
            .setColor(0x5506ce)
            .setThumbnail("https://i.imgur.com/nC0LfsR.png")
            .setTitle("Probability")
            .addFields(
              {
                name: "Result",
                value: `Rolled ${rollResult}`,
                inline: true,
              },
              {
                name: "Success",
                value: isSuccess ? "Yes" : "No",
                inline: true,
              }
            );
        
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }}}