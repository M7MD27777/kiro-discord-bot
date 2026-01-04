const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Show user avatar")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to show avatar for")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const avatarURL = user.displayAvatarURL({
      size: 1024,
      dynamic: true,
    });

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`🖼️ Avatar of ${user.username}`)
      .setImage(avatarURL)
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
