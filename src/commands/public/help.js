const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all bot commands"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🤖 Kiro Bot – Help")
      .setDescription("Here is a list of available commands:")
      .addFields(
        {
          name: "🛠️ Moderation",
          value:
            "`/ban`, `/unban`, `/kick`\n" +
            "`/timeout`, `/mute`, `/untimeout`, `/unmute`\n" +
            "`/warn`, `/warnings`, `/warn_remove`\n" +
            "`/lock`, `/unlock`\n" +
            "`/slowmode`, `/remove_slowmode`\n" +
            "`/clear`",
        },
        {
          name: "🎭 Roles",
          value: "`/give-role`, `/remove_role`\n" + "`/set_name`",
        },
        {
          name: "🔊 Voice",
          value:
            "`/move`, `/move_me`, `/move_all`\n" +
            "`/vkick`, `/vmute`, `/vunmute`",
        },
        {
          name: "🎫 Tickets",
          value: "`/ticket-panel`",
        },
        {
          name: "🌐 General",
          value:
            "`/help`, `/ping`, `/avatar`\n" +
            "`/user`, `/roles`, `/server_info`",
        }
      )
      .setFooter({ text: "Use slash commands ( / ) to execute a command" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
