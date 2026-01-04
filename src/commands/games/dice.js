const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll a dice 🎲"),

  async execute(interaction) {
    const result = Math.floor(Math.random() * 6) + 1;

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("🎲 Dice Roll")
      .setDescription(`You rolled **${result}**`)
      .setFooter({ text: interaction.user.tag })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
