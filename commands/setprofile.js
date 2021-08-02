const fetch = require("node-fetch");
const fs = require("fs");

function stepTwoVerification(d, discordId, message) {
  if (d == null) {
    return message.channel.send(`It looks like this profile is hidden or does not exist.`);
  }
  let db = JSON.parse(fs.readFileSync("./storage/verified_users.json"));
  db.verified = db.verified.filter(entry => entry.did != discordId);// Remove all existing entries with same discord id
  let match = db.verified.find(entry => entry.kaid == d.kaid);// If kaid is stolen by another discord user
  if (match) {
    let user = message.guild.members.cache.get(match.did).user;
    return message.channel.send(`This profile is not available. ${user.username}#${user.discriminator} has the same profile linked.`);
  }

  match = db.banned.some(entry => entry.kaid == d.kaid);// If kaid is banned (@sal for example is unreasonable)
  if (match) {
    return message.channel.send(`This profile is not available.`);
  }
  db.verified.push({
    did: discordId,
    kaid: d.kaid
  });

  fs.writeFileSync("./storage/verified_users.json", JSON.stringify(db, null, 2), "utf8");
  const { commands } = message.client;
  commands.get('verify').execute(message, "VERIFY_AUTHOR");
}

module.exports = {
  name: "setprofile",
  cooldown: 5,
  description: "Sets profile of user",
  aliases: ['set_profile'],
  usage: '[profile link]',
  args: true,
  execute(msg, args, overrideUserId) {

    let discordUserId = overrideUserId || msg.author.id;

    let arg;
    if (Array.isArray(args)) {
      arg = args[0];
    } else {
      arg = args;
    }

    if (arg.includes("https://")) {
      arg = arg.replace("https://", "");// Strip https:// part
    }
    if (arg.includes("/")) {// khanacademy.org/profile/squishypill/projects becomes squishypill
      arg = arg.split("/")[2];
    }

    let number = parseInt(arg);
    if (isNaN(number)) {
      if (arg.slice(0, 5) === "kaid_") {
        // kaid
        fetch(
          `https://www.khanacademy.org/api/internal/user/profile?kaid=${arg}`, { headers: {}, method: "GET", mode: "cors" })
          .then(r => r.json())
          .then(d => {
            stepTwoVerification(d, discordUserId, msg);
          })
          .catch(console.error);
      } else {
        // username
        if (arg[0] === "@") {
          arg = arg.slice(1);// @squishypill becomes squishypill
        }
        fetch(
          `https://www.khanacademy.org/api/internal/user/profile?username=${arg}`, { headers: {}, method: "GET", mode: "cors" })
          .then(r => r.json())
          .then(d => {
            stepTwoVerification(d, discordUserId, msg);
          })
          .catch(console.error);
      }
    } else {
      msg.channel.send("Invalid profile link... ")
      return;
    }
  }
};