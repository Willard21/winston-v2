const fs = require("fs");

module.exports = {
  name: "setprefix",
  cooldown: 1,
  description: "Returns bot latency in milliseconds",
  aliases: ["prefix"],
  usage: "[prefix]",
  ownerOnly: "admin",
  args: true,
  execute(msg, args) {
    if (!args.length) {
      return msg.reply("Please provide a new prefix")
    }
    let newConfig = JSON.parse(fs.readFileSync("./config.json"))
    newConfig.prefix = args[0]
    fs.writeFileSync("./config.json", JSON.stringify(newConfig, null, 2))
    msg.channel.send("New prefix `" + args[0] + "` set. Reload bot for changes to take full effect.")
    global.configModified = true
  }
};
