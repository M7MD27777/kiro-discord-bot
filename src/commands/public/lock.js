const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription(
      "Lock the current channel (prevent members from sending messages)"
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for locking the channel")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    // نسمح فقط برومات الكتابة
    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        content: "❌ This command can only be used in text channels.",
        ephemeral: true,
      });
    }

    // تعديل صلاحيات @everyone
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
    });

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🔒 Channel Locked")
      .setDescription(`This channel has been locked.`)
      .addFields(
        { name: "Channel", value: `<#${channel.id}>`, inline: true },
        { name: "Reason", value: reason, inline: true }
      )
      .setFooter({ text: `Locked by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
