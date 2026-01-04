require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Collections
client.commands = new Collection();

// Handlers
require("./handlers/commandHandler")(client);

// Events
require("./events/ready")(client);
require("./events/interactionCreate")(client);

// Login
client.login(process.env.TOKEN);
