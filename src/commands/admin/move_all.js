const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move_all")
    .setDescription("Move all members from your voice channel to another one")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Target voice channel")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),

  async execute(interaction) {
    const targetChannel = interaction.options.getChannel("channel");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: "❌ You must be in a voice channel.",
        ephemeral: true,
      });
    }

    for (const member of voiceChannel.members.values()) {
      await member.voice.setChannel(targetChannel).catch(() => {});
    }

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🔊 Members Moved")
      .setDescription(`All members moved to ${targetChannel}`)
      .setFooter({ text: `By ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
