const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vunmute")
    .setDescription("Unmute a member in voice channel")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Member to unmute")
        .setRequired(true)
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

    if (!member.voice.serverMute) {
      return interaction.reply({
        content: "ℹ️ This member is not voice muted.",
        ephemeral: true,
      });
    }

    await member.voice.setMute(false);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🔊 Voice Unmuted")
      .addFields(
        { name: "User", value: member.user.tag, inline: true },
        {
          name: "Channel",
          value: member.voice.channel.toString(),
          inline: true,
        }
      )
      .setFooter({ text: `By ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
