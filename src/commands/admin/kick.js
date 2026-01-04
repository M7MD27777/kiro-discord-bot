const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for kick")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!member || !member.kickable) {
      return interaction.reply({
        content: "❌ I cannot kick this member.",
        ephemeral: true,
      });
    }

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("👢 Member Kicked")
      .addFields(
        { name: "User", value: member.user.tag, inline: true },
        { name: "Reason", value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
