const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin 🪙"),

  async execute(interaction) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";

    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle("🪙 Coin Flip")
      .setDescription(`Result: **${result}**`)
      .setFooter({ text: interaction.user.tag })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
