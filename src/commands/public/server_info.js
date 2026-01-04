const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server_info")
    .setDescription("Show information about the server"),

  async execute(interaction) {
    const { guild } = interaction;

    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`🏠 Server Info`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: "📛 Name", value: guild.name, inline: true },
        { name: "🆔 ID", value: guild.id, inline: true },
        { name: "👑 Owner", value: owner.user.tag, inline: true },

        { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
        {
          name: "🎭 Roles",
          value: `${guild.roles.cache.size - 1}`,
          inline: true,
        },
        {
          name: "💬 Channels",
          value: `${guild.channels.cache.size}`,
          inline: true,
        },

        {
          name: "📅 Created At",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: false,
        }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
