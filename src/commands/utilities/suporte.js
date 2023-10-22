const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suportes")
    .setDescription("Lista comandos de suporte para o bot")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Escolha uma das opções.")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const value = interaction.options.getFocused().toLowerCase();

    const choices = ["Comandos do Bot", "Contato", "Downloads", "Status do Servidor"];

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

    const embed = new EmbedBuilder()
      .setColor(0x5506ce)
      .setTitle(query)
      .setThumbnail("https://i.imgur.com/nC0LfsR.png");

    switch (query) {
      case "Comandos do Bot":
        const commandList = interaction.client.commands.map(
          (command) => command.data.name
        );
        embed.setDescription(commandList.join("\n"));
        break;
      case "Contato":
        embed.setDescription(
          "Entre em contato nesses enderenços e deixe suas dúvidas FIque à vontade de convidar o bot para o seu canal ou juntar-se a nós em nosso servidor GURPS."
        );
        embed.addFields([
          {
            name: "Postar um erro:",
            value: "[GitHub](https://github.com/Boifuba/beah)",
            inline: true,
          },
          {
            name: "Canal do Bot:",
            value: "[Entrar](https://discord.gg/cJTttwHg)",
            inline: true,
          },
          {
            name: "Convidar o bot",
            value: "[link](https://top.gg/bot/997822340400418858)",
            inline: true,
          },
        ]);
        break;

      case "Downloads":
        embed.setDescription(
          "~~DIGA NÃO À PIRATARIA~~  \n Link para Downloads de materiais de apoio."
        );
        embed.addFields(
          {
            name: "\u200B",
            value: "\u200B",
          },
          {
            name: "MEGA1",
            value: "[DOWNLOAD](https://bit.ly/WarehouseTwentyFree)",
            inline: true,
          },
          {
            name: "MEGA2",
            value:
              "[DOWNLOAD](https://mega.nz/folder/QxkXGCIa#5xXDaK5bX-ThKceVFdXr7g)",
            inline: true,
          },
          {
            name: "Livros pt_BR",
            value:
              "[DOWNLOAD](https://drive.google.com/drive/folders/1fFD-8-qAidbAuyB5SIb8jjm6AaXM-r2B?usp=drive_link)",
            inline: true,
          }
        );
        break;
      case "Status do Servidor":
        const guild = interaction.guild; // Obter a guild da interação

        let a = guild.memberCount;
        let b = guild.members.cache.filter(
          (x) => x.presence?.status === "online"
        ).size;
        let c = guild.members.cache.filter(
          (x) => x.presence?.status === "idle"
        ).size;
        let d = guild.members.cache.filter(
          (x) => x.presence?.status === "dnd"
        ).size;

        embed.setTitle("Status do servidor");
        embed.setDescription(
          "Lista os membros do servidor de acordo com seus status!"
        );
        embed.setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })

        embed.addFields({
          name: "Online",
          value: `  🟢  ${b} membros`,
        });
        embed.addFields({
          name: "Ausentes",
          value: `  🟡  ${c} membros`,
        });
        embed.addFields({
          name: "Ocupados",
          value: `  🔴  ${d} membros`,
        });
        embed.addFields({
          name: "Membros totais",
          value: `👥 ${a} membros`,
        });

        break;
      default:
        embed.setDescription("Eu não sei que merda foi essa!");
        break;
    }

    await interaction.reply({ embeds: [embed] });
  },
};
