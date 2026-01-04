const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move a member to another voice channel")
    .addUserOption((option) =>
      option.setName("user").setDescription("Member to move").setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Target voice channel")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const targetChannel = interaction.options.getChannel("channel");

    if (!member || !member.voice.channel) {
      return interaction.reply({
        content: "❌ This member is not in a voice channel.",
        ephemeral: true,
      });
    }

    await member.voice.setChannel(targetChannel);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("🔁 Member Moved")
      .addFields(
        { name: "User", value: member.user.tag, inline: true },
        { name: "Channel", value: targetChannel.toString(), inline: true }
      )
      .setFooter({ text: `By ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
