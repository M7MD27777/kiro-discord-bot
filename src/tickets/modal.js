const {
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

/* =====================
   Ticket Counter
===================== */
const counterPath = path.join(__dirname, "../../ticketCounter.json");

function getNextTicketNumber() {
  if (!fs.existsSync(counterPath)) {
    fs.writeFileSync(counterPath, JSON.stringify({ count: 0 }, null, 2));
  }

  const data = JSON.parse(fs.readFileSync(counterPath, "utf8"));
  data.count += 1;
  fs.writeFileSync(counterPath, JSON.stringify(data, null, 2));

  return String(data.count).padStart(4, "0");
}

module.exports = async (interaction) => {
  if (!interaction.customId.startsWith("ticket_modal_")) return;

  // ✅ مهم جدًا لتفادي Unknown interaction
  await interaction.deferReply({ ephemeral: true });

  const guild = interaction.guild;
  const user = interaction.user;
  const type = interaction.customId.replace("ticket_modal_", "");

  /* =====================
     منع فتح أكثر من تكت
  ===================== */
  const existingTicket = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      c.name.startsWith("ticket-") &&
      c.permissionOverwrites.cache.has(user.id)
  );

  if (existingTicket) {
    return interaction.editReply({
      content: `❌ You already have an open ticket: ${existingTicket}`,
    });
  }

  /* =====================
     البحث عن الكاتاجوري
  ===================== */
  const category = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildCategory &&
      ["support", "tickets", "help", "technical-support"].includes(
        c.name.toLowerCase()
      )
  );

  if (!category) {
    return interaction.editReply({
      content:
        "❌ Support category not found.\nPlease create a category named **Support** or **Tickets**.",
    });
  }

  /* =====================
     البحث عن رتبة الستاف
  ===================== */
  const staffRole = guild.roles.cache.find((r) =>
    ["staff", "support", "moderator"].includes(r.name.toLowerCase())
  );

  if (!staffRole) {
    return interaction.editReply({
      content:
        "❌ Staff role not found.\nPlease create a role named **Staff**.",
    });
  }

  /* =====================
     إنشاء التكت
  ===================== */
  const ticketNumber = getNextTicketNumber();
  const channelName = `ticket-${ticketNumber}`;

  const channel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: category.id,
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: staffRole.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
    ],
  });

  /* =====================
     Embed
  ===================== */
  const fields = interaction.fields.fields.map((f) => ({
    name: f.customId.replace(/_/g, " ").toUpperCase(),
    value: f.value || "N/A",
  }));

  const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle(`🎫 Ticket #${ticketNumber}`)
    .setDescription(`📌 **Category:** ${type}`)
    .addFields(fields)
    .setFooter({ text: `Opened by ${user.tag}` })
    .setTimestamp();

  /* =====================
     Buttons (Claim System)
  ===================== */
  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket_claim")
      .setLabel("Claim")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("ticket_unclaim")
      .setLabel("Unclaim")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("ticket_lock")
      .setLabel("Lock")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("ticket_close")
      .setLabel("Close")
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({
    content: `📣 <@&${staffRole.id}>`,
    embeds: [embed],
    components: [buttons],
  });

  //  الرد النهائي الصحيح
  await interaction.editReply({
    content: `✅ Your ticket has been created: ${channel}`,
  });
};
