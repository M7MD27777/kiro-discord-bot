const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear messages from the channel (up to 10,000)")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete (1 - 10000)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(10000)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const channel = interaction.channel;
    const amount = interaction.options.getInteger("amount");

    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        content: "❌ This command can only be used in text channels.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    let deleted = 0;
    let remaining = amount;

    while (remaining > 0) {
      const limit = remaining > 100 ? 100 : remaining;

      const messages = await channel.messages.fetch({ limit });

      if (messages.size === 0) break;

      const filtered = messages.filter(
        (msg) => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000
      );

      if (filtered.size === 0) break;

      const bulkDeleted = await channel.bulkDelete(filtered, true);
      deleted += bulkDeleted.size;
      remaining -= bulkDeleted.size;

      if (bulkDeleted.size < limit) break;
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🧹 Messages Cleared")
      .addFields(
        { name: "Channel", value: `<#${channel.id}>`, inline: true },
        { name: "Deleted", value: `${deleted} messages`, inline: true }
      )
      .setFooter({ text: `By ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
