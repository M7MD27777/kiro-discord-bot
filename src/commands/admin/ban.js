const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for ban")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!member || !member.bannable) {
      return interaction.reply({
        content: "❌ I cannot ban this member.",
        ephemeral: true,
      });
    }

    await member.ban({ reason });

    const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setTitle("⛔ Member Banned")
      .addFields(
        { name: "User", value: member.user.tag, inline: true },
        { name: "Reason", value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
