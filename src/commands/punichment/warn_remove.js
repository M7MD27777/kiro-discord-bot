const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const warningsPath = path.join(__dirname, "../../../warnings.json");

function loadWarnings() {
  if (!fs.existsSync(warningsPath)) return {};
  return JSON.parse(fs.readFileSync(warningsPath, "utf8"));
}

function saveWarnings(data) {
  fs.writeFileSync(warningsPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn_remove")
    .setDescription("Remove a specific warning from a member")
    .addUserOption((option) =>
      option.setName("user").setDescription("Member").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("Warning number to remove")
        .setRequired(true)
        .setMinValue(1)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const index = interaction.options.getInteger("number") - 1;

    const data = loadWarnings();
    const guildId = interaction.guild.id;

    if (
      !data[guildId] ||
      !data[guildId][member.id] ||
      data[guildId][member.id].length === 0
    ) {
      return interaction.reply({
        content: "❌ This member has no warnings.",
        ephemeral: true,
      });
    }

    const warnings = data[guildId][member.id];

    if (index < 0 || index >= warnings.length) {
      return interaction.reply({
        content: "❌ Invalid warning number.",
        ephemeral: true,
      });
    }

    const removed = warnings.splice(index, 1);
    data[guildId][member.id] = warnings;

    if (warnings.length === 0) {
      delete data[guildId][member.id];
    }

    saveWarnings(data);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Warning Removed")
      .addFields(
        { name: "User", value: member.user.tag, inline: true },
        { name: "Removed Warning", value: removed[0].reason }
      )
      .setFooter({ text: `Removed by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
