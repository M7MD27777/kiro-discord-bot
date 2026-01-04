const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const choices = ["rock", "paper", "scissors"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play Rock Paper Scissors")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Your choice")
        .setRequired(true)
        .addChoices(
          { name: "Rock 🪨", value: "rock" },
          { name: "Paper 📄", value: "paper" },
          { name: "Scissors ✂️", value: "scissors" }
        )
    ),

  async execute(interaction) {
    const userChoice = interaction.options.getString("choice");
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result;
    if (userChoice === botChoice) result = "🤝 Draw!";
    else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    )
      result = "🎉 You Win!";
    else result = "💀 You Lose!";

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("✂️ Rock Paper Scissors")
      .addFields(
        { name: "Your Choice", value: userChoice, inline: true },
        { name: "Bot Choice", value: botChoice, inline: true },
        { name: "Result", value: result, inline: false }
      )
      .setFooter({ text: interaction.user.tag })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
