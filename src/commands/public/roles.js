const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Display all server roles"),

  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .filter((role) => role.name !== "@everyone")
      .sort((a, b) => b.position - a.position);

    if (roles.size === 0) {
      return interaction.reply({
        content: "❌ No roles found in this server.",
        ephemeral: true,
      });
    }

    const roleList = roles.map((role) => role.toString()).join(" • ");

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`🎭 Server Roles (${roles.size})`)
      .setDescription(
        roleList.length > 4096 ? roleList.slice(0, 4090) + "..." : roleList
      )
      .setFooter({ text: interaction.guild.name })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
