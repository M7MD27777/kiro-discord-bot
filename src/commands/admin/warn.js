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
    .setName("warn")
    .setDescription("Warn a member")
    .addUserOption((option) =>
      option.setName("user").setDescription("Member to warn").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");

    if (!member || !member.moderatable) {
      return interaction.reply({
        content: "❌ I cannot warn this member.",
        ephemeral: true,
      });
    }

    const data = loadWarnings();
    const guildId = interaction.guild.id;
    const userId = member.id;

    if (!data[guildId]) data[guildId] = {};
    if (!data[guildId][userId]) data[guildId][userId] = [];

    data[guildId][userId].push({
      reason,
      moderator: interaction.user.tag,
      date: new Date().toISOString(),
    });

    saveWarnings(data);

    // DM
    try {
      await member.send(
        `⚠️ You have been warned in **${interaction.guild.name}**\nReason: ${reason}`
      );
    } catch {}

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("⚠️ Warning Added")
      .addFields(
        { name: "User", value: member.user.tag },
        { name: "Reason", value: reason }
      )
      .setFooter({ text: `Warned by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
