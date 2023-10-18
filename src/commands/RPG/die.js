const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("morte")
    .setDescription("Testes de morte.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Escolha uma opção.")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction, client) {
    const value = interaction.options.getFocused().toLowerCase();

    const { todayThumbnail } = todayGame();

    let choices = [
      "Less than 1/3 your HP left",
      "0 HP or less",
      "-1xHP",
      "-5xHP",
      "-10xHP",
    ];

    const filtered = choices
      .filter((choice) => choice.toLowerCase().includes(value))
      .slice(0, 25);

    if (!interaction) return;

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  async execute(interaction) {
    const query = interaction.options.getString("query");

    if (query === "Less than 1/3 your HP left")
      desc = `You
      are reeling from your wounds.
      Halve your Move and Dodge
      (round up).
`;

    if (query === "0 HP or less")
      desc = `You are in immediate
      danger of collapse. In addition to
      the above effects, make a HT roll at
      the start of your next turn, at -1 per
      full multiple of HP below zero.
      Failure means you fall unconscious
      (or simply stop working, if you
      weren’t truly alive or conscious in
      the first place); see Recovering from
      Unconsciousness (p. 423). Success
      means you can act normally, but
      must roll again every turn to continue
      functioning. Exception: If you
      choose Do Nothing on your turn,
      and do not attempt any defense
      rolls, you can remain conscious
      without rolling. Roll only on turns
      during which you attempt a
      defense roll or choose a maneuver
      other than Do Nothing.
        `;
    if (query === "-1xHP")
      desc = `In addition to the above
      effects, make an immediate HT roll
      or die. (If you fail by only 1 or 2,
      you’re dying, but not dead – see
      Mortal Wounds, p. 423). If you succeed,
      you can still talk, fight, etc.,
      as above (until you fail a HT roll
      and collapse). Roll again each time
      you suffer injury equal to a further
      multiple of your HP, whether as a
      result of one wound or many. For
      instance, if you have 11 HP, you
      must roll to avoid death at -11 HP.
      If you survive, you must roll again
      at -22 HP, -33 HP, and so on . . .
        `;
    if (query === "-5xHP")
      desc = `You die immediately. You
      have lost a total of 6 times your HP!
      Nobody can survive that much
      injury.`;

    if (query === "-10xHP")
      desc = `Total bodily destruction, if
      this makes sense given the source
      of the damage – 200 points of
      arrow wounds leave a messy but
      recognizable corpse; 200 points of
      fire injury leaves nothing but an unrecognizable lump of charcoal.
      The difference can be important in
      settings where resurrection, reanimation,
      etc. are possible!
    `;

    const embed = new EmbedBuilder();

    embed
      .setColor(0x5506ce)
      .setTitle(query)
      .setDescription(desc)
      .setThumbnail(todayThumbnail);

    await interaction.reply({ embeds: [embed] });
  },
};
