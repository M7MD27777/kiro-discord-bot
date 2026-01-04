const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove timeout from a member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to remove timeout from")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");

    if (!member) {
      return interaction.reply({
        content: "❌ Member not found.",
        ephemeral: true,
      });
    }

    if (!member.isCommunicationDisabled()) {
      return interaction.reply({
        content: "❌ This member is not timed out.",
        ephemeral: true,
      });
    }

    await member.timeout(null);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🔓 Timeout Removed")
      .addFields({ name: "User", value: member.user.tag })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
