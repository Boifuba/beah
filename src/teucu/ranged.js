const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ranged-fire')
    .setDescription('List ranged tables')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Input a query')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const value = interaction.options.getFocused().toLowerCase();

    const choices = [
      'RoF',
      'Range/Size/Speed',
      'Malf',
      'Firearm Malfunction Table'
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

    const query = interaction.options.getString('query');

    const embed = new EmbedBuilder()
      .setColor(0x5506ce)
      .setThumbnail("https://i.imgur.com/nC0LfsR.png")
      .setTitle(query)
      .setDescription(`This is the description of the ranged weapon attack ${query}.`)
      .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.avatarURL() });

    switch (query) {
      case 'RoF':
        embed.setDescription(`\`\`\`
+------------+------------------+
|   Shots    |   Bonus to Hit   |
+------------+------------------+
|    2-4     |        +0        |
|    5-8     |        +1        |
|    9-12    |        +2        |
|    13-16   |        +3        |
|    17-24   |        +4        |
|    25-49   |        +5        |
|    50-99   |        +6        |
|    > 100   |     +1 to hit    |
+------------+------------------+
\`\`\``);
        break;
      case 'Range/Size/Speed':
        embed.setDescription(`
          \`\`\`
+-------+---------+---------------+          
| Speed/ |  Size   |    Linear    | 
| Range  |         |  Measurement | 
+--------+---------+--------------+
|   0    |   -15   |      1/5”    |
|   0    |   -14   |      1/3”    |
|   0    |   -13   |      1/2”    |
|   0    |   -12   |      2/3”    |
|   0    |   -11   |      1”      |
|   0    |   -10   |      1.5”    |
|   0    |    -9   |      2”      | 
|   0    |    -8   |      3”      |
|   0    |    -7   |      5”      |
|   0    |    -6   |      8”      |
|   0    |    -5   |      1 ft    |
|   0    |    -4   |      1.5 ft  |
|   0    |    -3   |      2 ft    |
|   0    |    -2   |      1 yd    |
|   0    |    -1   |      1.5 yd  | 
|   0    |     0   |      2 yd    |
|  -1    |     1   |      3 yd    |
|  -2    |     2   |      5 yd    |
|  -3    |     3   |      7 yd    |
|  -4    |     4   |     10 yd    |
|  -5    |     5   |     15 yd    |
|  -6    |     6   |     20 yd    |
|  -7    |     7   |     30 yd    |
|  -8    |     8   |     50 yd    |
|  -9    |     9   |     70 yd    |
| -10    |    10   |    100 yd    |
| -11    |    11   |    150 yd    |
| -12    |    12   |    200 yd    |
| -13    |    13   |    300 yd    |
| -14    |    14   |    500 yd    |
| -15    |    15   |    700 yd    |
| -16    |    16   |  1,000 yd    |
| -17    |    17   |  1,500 yd    |
| -18    |    18   |    1 mile    |
| -19    |    19   |  3,000 yd    |
| -20    |    20   | 2.5 miles    |
| -21    |    21   |  7,000 yd    |
| -22    |    22   | 5 miles      |
| -23    |    23   | 15,000 yd    |
| -24    |    24   | 10 miles     |
| -25    |    25   | 30,000 yd    |
| -26    |    26   | 25 miles     |
| -27    |    27   | 70,000 yd    |
| -28    |    28   | 50 miles     |
| -29    |    29   | 150,000 yd           | 
| -30    |    30   | 100 miles    |
+--------+---------+--------------+
          \`\`\`
          `
        );
        break;
      case 'Malf':
        embed.setDescription(`\`\`\`
+-------+----------+
|  TL   |   Malf   |
+-------+----------+
|   3   |    12    |
|   4   |    14    | 
|   5   |    16    |
|   6+  |    17    |
+-------+----------+
\`\`\`
        `)
        break;
      case 'Firearm Malfunction Table':
        embed.setDescription(`\`\`\`
+--------+---------------------------------+     
|  3d6   |          Malfunction            |
+--------+---------------------------------+
|  3-4   |   Mechanical/electrical problem.| 
|  5-8   |   Misfire.                      |
|  9-11  |   Stoppage.                     |
| 12-14  |   Misfire.                      |
| 15-18  |   Mechanical/electrical prob-   |
|  ----  |   lem, and possible explosion.  | 
+--------+---------------------------------+
\`\`\``)
        break;
      default:
        embed.setDescription('This is a ranged weapon attack.');
        break;
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

