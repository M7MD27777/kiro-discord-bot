const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to unmute")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");

    if (!member || !member.isCommunicationDisabled()) {
      return interaction.reply({
        content: "❌ This member is not muted.",
        ephemeral: true,
      });
    }

    await member.timeout(null);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🔊 Member Unmuted")
      .addFields({ name: "User", value: member.user.tag })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
