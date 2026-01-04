const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Create a ticket panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🎫 Support Tickets")
      .setDescription(
        "Please select the type of your issue from the menu below.\n" +
          "Our staff will assist you as soon as possible."
      )
      .setFooter({ text: "Kiro Tickets System" });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("ticket_select")
      .setPlaceholder("Choose a ticket category")
      .addOptions([
        {
          label: "General Support",
          value: "general",
          emoji: "💬",
        },
        {
          label: "Report a Member",
          value: "report",
          emoji: "🚨",
        },
        {
          label: "Staff Application",
          value: "staff",
          emoji: "📝",
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
