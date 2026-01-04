const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move_me")
    .setDescription("Move yourself to another voice channel")
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
    const member = interaction.member;

    if (!member.voice.channel) {
      return interaction.reply({
        content: "❌ You are not in a voice channel.",
        ephemeral: true,
      });
    }

    await member.voice.setChannel(targetChannel);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🔀 Moved Successfully")
      .setDescription(`You were moved to ${targetChannel}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
