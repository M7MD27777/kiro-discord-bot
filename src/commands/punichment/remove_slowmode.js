const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove_slowmode")
    .setDescription("Disable slowmode in the current channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;

    // تأكد أنه روم نصي
    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        content: "❌ This command can only be used in text channels.",
        ephemeral: true,
      });
    }

    // إذا السلومود أصلاً متوقف
    if (channel.rateLimitPerUser === 0) {
      return interaction.reply({
        content: "ℹ️ Slowmode is already disabled in this channel.",
        ephemeral: true,
      });
    }

    await channel.setRateLimitPerUser(0);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🐢❌ Slowmode Disabled")
      .addFields({ name: "Channel", value: `<#${channel.id}>`, inline: true })
      .setFooter({ text: `By ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
