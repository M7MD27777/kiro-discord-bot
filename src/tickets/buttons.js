module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "ticket_close") {
    await interaction.channel.delete();
  }

  if (interaction.customId === "ticket_lock") {
    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: false }
    );

    await interaction.reply({
      content: "🔒 Ticket locked.",
      ephemeral: true,
    });
  }
};
