const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vkick")
    .setDescription("Disconnect a member from voice channel")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Member to disconnect")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");

    if (!member || !member.voice.channel) {
      return interaction.reply({
        content: "❌ This member is not in a voice channel.",
        ephemeral: true,
      });
    }

    await member.voice.disconnect();

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🔊 Voice Kick")
      .addFields({ name: "User", value: member.user.tag, inline: true })
      .setFooter({ text: `By ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
