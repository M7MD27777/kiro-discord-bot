const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from the server")
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The ID of the banned user")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString("user_id");

    try {
      await interaction.guild.members.unban(userId);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ Member Unbanned")
        .addFields({ name: "User ID", value: userId })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({
        content: "❌ Unable to unban this user. Make sure the ID is correct.",
        ephemeral: true,
      });
    }
  },
};
