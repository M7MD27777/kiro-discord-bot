const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = async (interaction) => {
  if (interaction.customId !== "ticket_select") return;

  const type = interaction.values[0];

  const modal = new ModalBuilder()
    .setCustomId(`ticket_modal_${type}`)
    .setTitle("Ticket Form");

  let question1;
  let question2;

  if (type === "general") {
    question1 = new TextInputBuilder()
      .setCustomId("subject")
      .setLabel("What is your issue about?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    question2 = new TextInputBuilder()
      .setCustomId("details")
      .setLabel("Please describe your issue")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);
  }

  if (type === "report") {
    question1 = new TextInputBuilder()
      .setCustomId("reported_user")
      .setLabel("Who are you reporting?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    question2 = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Reason for the report")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);
  }

  if (type === "staff") {
    question1 = new TextInputBuilder()
      .setCustomId("age")
      .setLabel("How old are you?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    question2 = new TextInputBuilder()
      .setCustomId("experience")
      .setLabel("Tell us about your experience")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);
  }

  modal.addComponents(
    new ActionRowBuilder().addComponents(question1),
    new ActionRowBuilder().addComponents(question2)
  );

  await interaction.showModal(modal);
};
