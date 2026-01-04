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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Show warnings of a member")
    .addUserOption((option) =>
      option.setName("user").setDescription("Member").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const data = loadWarnings();

    const guildWarnings = data[interaction.guild.id];
    const userWarnings = guildWarnings?.[member.id];

    if (!userWarnings || userWarnings.length === 0) {
      return interaction.reply({
        content: "✅ This member has no warnings.",
        ephemeral: true,
      });
    }

    const description = userWarnings
      .map(
        (w, i) =>
          `**${i + 1}.** ${w.reason}\n👮 ${w.moderator}\n📅 <t:${Math.floor(
            new Date(w.date).getTime() / 1000
          )}:R>`
      )
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle(`⚠️ Warnings for ${member.user.tag}`)
      .setDescription(description)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
