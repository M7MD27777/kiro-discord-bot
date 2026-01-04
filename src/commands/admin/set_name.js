const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set_name")
    .setDescription("Change a member nickname")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Member to rename")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("name").setDescription("New nickname").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const newName = interaction.options.getString("name");

    if (!member) {
      return interaction.reply({
        content: "❌ Member not found.",
        ephemeral: true,
      });
    }

    // منع تغيير اسم شخص أعلى من البوت
    if (!member.manageable) {
      return interaction.reply({
        content: "❌ I cannot change this member nickname.",
        ephemeral: true,
      });
    }

    await member.setNickname(newName);

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("✏️ Nickname Changed")
      .addFields(
        { name: "User", value: member.user.tag, inline: true },
        { name: "New Name", value: newName, inline: true }
      )
      .setFooter({ text: `Changed by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
