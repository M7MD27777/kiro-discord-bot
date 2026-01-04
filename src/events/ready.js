module.exports = (client) => {
  client.once("ready", () => {
    console.log(`🟢 Logged in as ${client.user.tag}`);
  });
};
