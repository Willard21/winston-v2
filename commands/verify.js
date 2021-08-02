module.exports = {
  name: "verify",
  cooldown: 1,
  description: "Manually verifies a user",
  ownerOnly: "admin",
  usage: '[user]',
  args: true,
  execute(msg, args) {
    if (args === "VERIFY_AUTHOR") {// For auto-verification
      let role = msg.guild.roles.cache.find(role => role.name === "Verified");
      msg.member.roles.add(role);
      role = msg.guild.roles.cache.find(role => role.name === "Unverified");
      msg.member.roles.remove(role).then(() => {
        msg.react("👍")
      })
      return;
    };

    if (msg.mentions.members.size < 1) {// Invalid input: no user
      msg.channel.send("Please specify a user");
      return;
    }

    // Input: user only
    let target
    if (args[0] == "VERIFY_TARGET") {
      target = msg.guild.members.cache.find(member => member.id === args[1])
    } else {
      target = msg.mentions.members.first()
      msg.react("👍")
    }
    let role = msg.guild.roles.cache.find(role => role.name === "Verified");
    target.roles.add(role).then(() => {
      role = msg.guild.roles.cache.find(role => role.name === "Unverified");
      target.roles.remove(role);
    })
  }
};