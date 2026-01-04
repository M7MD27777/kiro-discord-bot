const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give-role")
    .setDescription("Give a role to a member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The member to give the role to")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to give")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const role = interaction.options.getRole("role");

    // تحقق أساسي
    if (!member) {
      return interaction.reply({
        content: "❌ Member not found.",
        ephemeral: true,
      });
    }

    // منع إعطاء رول أعلى من البوت
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({
        content: "❌ I cannot give a role higher or equal to my highest role.",
        ephemeral: true,
      });
    }

    // منع التكرار
    if (member.roles.cache.has(role.id)) {
      return interaction.reply({
        content: "❌ This member already has this role.",
        ephemeral: true,
      });
    }

    await member.roles.add(role);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Role Given")
      .addFields(
        { name: "User", value: member.user.tag, inline: true },
        { name: "Role", value: role.toString(), inline: true }
      )
      .setFooter({ text: `Given by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
