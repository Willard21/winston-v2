module.exports = {
  name: "stop",
  description: "Shuts down the bot.",
  aliases: ["shutdown"],
  ownerOnly: "admin",
  args: false,
  execute(msg, args) {
    msg.channel
      .send("Logging off...")
      .then((msg) => msg.client.destroy())
      .catch(console.error);
  },
};
