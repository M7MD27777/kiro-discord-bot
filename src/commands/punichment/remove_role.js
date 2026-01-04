const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove_role")
    .setDescription("Remove a role from a member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Member to remove the role from")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("role").setDescription("Role to remove").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const role = interaction.options.getRole("role");

    if (!member) {
      return interaction.reply({
        content: "❌ Member not found.",
        ephemeral: true,
      });
    }

    // تأكد أن البوت يستطيع التعامل مع العضو
    if (!member.manageable) {
      return interaction.reply({
        content: "❌ I cannot modify this member.",
        ephemeral: true,
      });
    }

    // منع إزالة رول أعلى من البوت
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({
        content:
          "❌ I cannot remove a role higher or equal to my highest role.",
        ephemeral: true,
      });
    }

    // تأكد أن العضو لديه الرول
    if (!member.roles.cache.has(role.id)) {
      return interaction.reply({
        content: "❌ This member does not have this role.",
        ephemeral: true,
      });
    }

    await member.roles.remove(role);

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("❌ Role Removed")
      .addFields(
        { name: "User", value: member.user.tag, inline: true },
        { name: "Role", value: role.toString(), inline: true }
      )
      .setFooter({ text: `Removed by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
