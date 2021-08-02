const fetch = require("node-fetch");
const fs = require("fs");

module.exports = {
  name: "banprofile",
  cooldown: 1,
  description: "Prevents new users from auto-verifying with using Khan Academy profile (by kaid)",
  usage: '[kaid]',
  ownerOnly: 'admin',
  args: true,
  execute(msg, args) {

    let db = JSON.parse(fs.readFileSync("./storage/verified_users.json"));
    db.banned = db.banned.filter(entry => entry.kaid != args[0]);// Prevent duplicates in db.banned
    db.verified = db.verified.filter(entry => entry.kaid != args[0]);// Removed current users that are using banned kaid
    db.banned.push({
      did: null,
      kaid: args[0]
    })
    
    fs.writeFileSync("./storage/verified_users.json", JSON.stringify(db, null, 2), "utf8");
    msg.channel.send("Banned `" +args[0]+ "` for verification");
  }
};