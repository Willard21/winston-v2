module.exports = {
  name: "unverify",
  cooldown: 1,
  description: "Manually verifies a user",
  ownerOnly: "admin",
  usage: '[user]',
  args: true,
  execute(msg, args) {
    if (msg.mentions.members.size < 1) {
      msg.channel.send("Please specify a user");
      return;
    }
    let role = msg.guild.roles.cache.find(role => role.name === "Unverified");
    msg.mentions.members.first().roles.add(role);
    role = msg.guild.roles.cache.find(role => role.name === "Verified");
    msg.mentions.members.first().roles.remove(role);
  }
};