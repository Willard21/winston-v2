const fs = require("fs");

module.exports = {
  name: "clearprofile",
  cooldown: 5,
  description: "Clears profile of self",
  aliases: ['clear_profile'],
  usage: '',
  args: false,
  execute(msg) {
    let discordId = msg.author.id
    let db = JSON.parse(fs.readFileSync("./storage/verified_users.json"));
    db.verified = db.verified.filter(entry => entry.did != discordId);
    fs.writeFileSync("./storage/verified_users.json", JSON.stringify(db, null, 2), "utf8");
    msg.react("👍")
  }
};