const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('speed')
    .setDescription('Mostra quantos membros tem no servidor e quais seus status'),
  async execute(interaction) {
    if (!interaction) {
      console.error('This command must be used as a Discord interaction.');
      return;
    }const tabela = `
    \`\`\`
    Speed/  |  Size   |    Linear
     Range  |         |  Measurement
    --------+---------+---------------
       0    |   -15   |      1/5”
       0    |   -14   |      1/3”
       0    |   -13   |      1/2”
       0    |   -12   |      2/3”
       0    |   -11   |      1”
       0    |   -10   |      1.5”
       0    |    -9   |      2”
       0    |    -8   |      3”
       0    |    -7   |      5”
       0    |    -6   |      8”
       0    |    -5   |      1 ft
       0    |    -4   |      1.5 ft
       0    |    -3   |      2 ft
       0    |    -2   |      1 yd
       0    |    -1   |      1.5 yd
       0    |     0   |      2 yd
      -1    |     1   |      3 yd
      -2    |     2   |      5 yd
      -3    |     3   |      7 yd
      -4    |     4   |     10 yd
      -5    |     5   |     15 yd
      -6    |     6   |     20 yd
      -7    |     7   |     30 yd
      -8    |     8   |     50 yd
      -9    |     9   |     70 yd
     -10    |    10   |    100 yd
     -11    |    11   |    150 yd
     -12    |    12   |    200 yd
     -13    |    13   |    300 yd
     -14    |    14   |    500 yd
     -15    |    15   |    700 yd
     -16    |    16   |  1,000 yd
     -17    |    17   |  1,500 yd
     -18    |    18   |    1 mile
     -19    |    19   |  3,000 yd
     -20    |    20   | 2.5 miles
     -21    |    21   |  7,000 yd
     -22    |    22   | 5 miles
     -23    |    23   | 15,000 yd
     -24    |    24   | 10 miles
     -25    |    25   | 30,000 yd
     -26    |    26   | 25 miles
     -27    |    27   | 70,000 yd
     -28    |    28   | 50 miles
     -29    |    29   | 150,000 yd
     -30    |    30   | 100 miles
    \`\`\`
    `;
    
    


    await interaction.reply({ content: tabela, ephemeral: true });
  },
};


