const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set slowmode for the current channel")
    .addIntegerOption(
      (option) =>
        option
          .setName("seconds")
          .setDescription("Slowmode duration in seconds (0 to disable)")
          .setRequired(true)
          .setMinValue(0)
          .setMaxValue(21600) // 6 hours (Discord limit)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;
    const seconds = interaction.options.getInteger("seconds");

    // تأكد أنه روم نصي
    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        content: "❌ This command can only be used in text channels.",
        ephemeral: true,
      });
    }

    await channel.setRateLimitPerUser(seconds);

    const embed = new EmbedBuilder()
      .setColor(seconds === 0 ? "Green" : "Orange")
      .setTitle("🐢 Slowmode Updated")
      .addFields(
        { name: "Channel", value: `<#${channel.id}>`, inline: true },
        {
          name: "Slowmode",
          value: seconds === 0 ? "Disabled" : `${seconds} seconds`,
          inline: true,
        }
      )
      .setFooter({ text: `By ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
