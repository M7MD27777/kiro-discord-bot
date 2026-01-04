const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vmute")
    .setDescription("Voice mute a member")
    .addUserOption((option) =>
      option.setName("user").setDescription("Member to mute").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");

    if (!member || !member.voice.channel) {
      return interaction.reply({
        content: "❌ This member is not in a voice channel.",
        ephemeral: true,
      });
    }

    if (member.voice.serverMute) {
      return interaction.reply({
        content: "❌ This member is already voice muted.",
        ephemeral: true,
      });
    }

    await member.voice.setMute(true);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("🔇 Voice Muted")
      .addFields({ name: "User", value: member.user.tag, inline: true })
      .setFooter({ text: `By ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
