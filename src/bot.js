require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// =====================
// Web Server (Render)
// =====================
const app = express();

app.get("/", (req, res) => {
  res.send("Kiro bot is alive 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// =====================
// Bot Setup
// =====================
client.commands = new Collection();

require("./handlers/commandHandler")(client);
require("./events/ready")(client);
require("./events/interactionCreate")(client);

client.login(process.env.TOKEN);
