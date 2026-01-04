const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Display information about a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to display info for")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const joinServer = `<t:${Math.floor(
      member.joinedTimestamp / 1000
    )}:F>\n<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`;
    const joinDiscord = `<t:${Math.floor(
      user.createdTimestamp / 1000
    )}:F>\n<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;

    const roles =
      member.roles.cache
        .filter((role) => role.name !== "@everyone")
        .map((role) => role.toString())
        .join(" • ") || "None";

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`👤 User Information`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: "📛 Username", value: user.tag, inline: true },
        { name: "🆔 User ID", value: user.id, inline: true },

        { name: "📥 Joined Server", value: joinServer, inline: false },
        { name: "🌐 Joined Discord", value: joinDiscord, inline: false },

        { name: `🎭 Roles (${member.roles.cache.size - 1})`, value: roles }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
