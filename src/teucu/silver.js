const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("silver")
    .setDescription("Fill one of the fields to convert")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("converter")
        .setDescription("Convert silver")
        .addStringOption((option) =>
          option.setName("kilos").setDescription("Kilos")
        )
        .addStringOption((option) =>
          option.setName("pounds").setDescription("Pounds")
        )
        .addStringOption((option) =>
          option.setName("coins").setDescription("Coins")
        )
        .addStringOption((option) =>
          option.setName("value").setDescription("Value")
        )
        .addStringOption((option) =>
           option
            .setName("help")
            .setDescription(
              "Press any key to continue and press enter to continue.."
            )
            .setAutocomplete(true)
         )
    ),

  async autocomplete(interaction) {
    const value = interaction.options.getFocused().toLowerCase();
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "converter") {
      choices = ["Help!"];

      const filtered = choices
        .filter((choice) => choice.toLowerCase().includes(value))
        .slice(0, 25);

      if (!interaction) return;

      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    }
  },

  async execute(interaction) {
    const kilos = parseFloat(interaction.options.getString("kilos"));
    const pounds = parseFloat(interaction.options.getString("pounds"));
    const coins = parseFloat(interaction.options.getString("coins"));
    const value = parseFloat(interaction.options.getString("value"));
    const help = interaction.options.getString("help");

    console.log(interaction.options);

    const silverPrice = 4;
    const silverWeightKilos = 0.0018;
    const silverWeightPounds = 0.004;

    let kilosResult = 0;
    let poundsResult = 0;
    let coinsResult = 0;
    let valueResult = 0;

    const embed = new EmbedBuilder();

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "converter") {
      if (kilos) {
        title = `${kilos}kg to...`;
        poundsResult = kilos * 2.20462; // Converter quilos para libras
        coinsResult = kilos / silverWeightKilos;
        valueResult = coinsResult * silverPrice;
        kilosResult = kilos;
        embed.addFields(
          {
            name: "Pounds",
            value: `${formatNumberWithCommas(poundsResult.toFixed(2))} lbs`,
            inline: true,
          },
          {
            name: "Coins",
            value: ` ${formatNumberWithCommas(coinsResult.toFixed(0))}`,
            inline: true,
          },
          {
            name: "Value",
            value: `$${Math.floor(valueResult).toLocaleString()}`,
            inline: true,
          }
        );
      }

      if (pounds) {
        title = `${pounds} lbs to...`;
        kilosResult = pounds / 2.20462; // Converter libras para quilos
        coinsResult = pounds / silverWeightPounds;
        valueResult = coinsResult * silverPrice;
        poundsResult = pounds;
        embed.addFields(
          {
            name: "Kilos",
            value: `${formatNumberWithCommas(kilosResult.toFixed(2))} Kg`,
            inline: true,
          },
          {
            name: "Coins",
            value: ` ${formatNumberWithCommas(coinsResult.toFixed(0))}`,
            inline: true,
          },
          {
            name: "Value",
            value: `$${Math.floor(valueResult).toLocaleString()}`,
            inline: true,
          }
        );
      }

      if (coins) {
        title = `${coins} coins to...`;
        kilosResult = coins * silverWeightKilos;
        poundsResult = coins * silverWeightPounds;
        valueResult = coins * silverPrice;
        coinsResult = coins;
        embed.addFields(
          {
            name: "Pounds",
            value: `${formatNumberWithCommas(poundsResult.toFixed(2))} lbs`,
            inline: true,
          },
          {
            name: "Kilos",
            value: `${formatNumberWithCommas(kilosResult.toFixed(2))} Kg`,
            inline: true,
          },
          {
            name: "Value",
            value: `$${Math.floor(valueResult).toLocaleString()}`,
            inline: true,
          }
        );
      }

      if (value) {
        title = `$${value} to...`;
        coinsResult = value / silverPrice;
        kilosResult = coinsResult * silverWeightKilos;
        poundsResult = coinsResult * silverWeightPounds;
        valueResult = value;
        embed.addFields(
          {
            name: "Pounds",
            value: `${formatNumberWithCommas(poundsResult.toFixed(2))} lbs`,
            inline: true,
          },
          {
            name: "Coins",
            value: ` ${formatNumberWithCommas(coinsResult.toFixed(0))}`,
            inline: true,
          },
          {
            name: "Kilos",
            value: `${formatNumberWithCommas(kilosResult.toFixed(2))} Kg`,
            inline: true,
          }
        );
      }
    }

    if (help) {
      title = "Help!";
      embed.setColor(0x5506ce);
      embed.setDescription('This converter uses the following values for conversion: 0.004 pounds, 0.0018 kilograms, and $4 based on GURPS Basic Set. If you need different values, please send me a message')

    }

    function formatNumberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    embed
      .setColor(0x5506ce)
      .setTitle(`${title}`)
      .setImage('https://i.imgur.com/znZmkq3.jpg')
      //   `Weight in kilograms: ${formatNumberWithCommas(
      //     kilosResult.toFixed(2)
      //   )} kg\n` +
      //     `Weight in pounds: ${formatNumberWithCommas(
      //       poundsResult.toFixed(2)
      //     )} lb\n` +
      //     `Number of coins: ${formatNumberWithCommas(
      //       coinsResult.toFixed(0)
      //     )}\n` +
      //     `Value in dollars: $${Math.floor(valueResult).toLocaleString()}`
      // )

      .setThumbnail("https://i.imgur.com/nC0LfsR.png");

    await interaction.reply({ embeds: [embed], ephemeral: true});
  },
};
