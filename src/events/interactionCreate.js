const ticketSelect = require("../tickets/select");
const ticketModal = require("../tickets/modal");
const ticketButtons = require("../tickets/buttons");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    /* =====================
       Slash Commands
    ===================== */
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: "❌ حدث خطأ أثناء تنفيذ الأمر",
            ephemeral: true,
          });
        }
      }
    }

    /* =====================
       Ticket Select Menu
    ===================== */
    if (interaction.isStringSelectMenu()) {
      try {
        await ticketSelect(interaction);
      } catch (error) {
        console.error(error);
      }
    }

    /* =====================
       Ticket Modals
    ===================== */
    if (interaction.isModalSubmit()) {
      try {
        await ticketModal(interaction);
      } catch (error) {
        console.error(error);
      }
    }

    /* =====================
       Ticket Buttons
    ===================== */
    if (interaction.isButton()) {
      try {
        await ticketButtons(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  });
};
