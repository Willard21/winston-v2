const fetch = require("node-fetch");
const fs = require("fs");
const { prefix, KADISCORD_COLOR } = require('../config.json');
const { MessageEmbed } = require("discord.js");
const lookup = require("../util/lookup.js");

module.exports = {
  name: "profile",
  cooldown: 5,
  description: "View your stats on the server",
  usage: "{mention}",
  args: false,
  execute(msg, args) {

    let profileToSearch;
    let description;
    if (msg.mentions.members.size > 0) {// ;profile @User#0000
      profileToSearch = msg.mentions.members.first();
      description = `${profileToSearch.nickname}'s Khan Academy profile isn't linked. Set a profile with ${prefix}setprofile [KA username].`
    } else if (!args.length) {// ;profile
      profileToSearch = msg.author;
      description = `Your Khan Academy profile isn't linked! Set your profile with ${prefix}setprofile [KA username].`;
    } else {// ;profile sal
      return lookup.execute(msg, [args[0]]);
    }


    let db = JSON.parse(fs.readFileSync("./storage/verified_users.json"));
    let match = db.verified.find(entry => entry.did == profileToSearch.id);

    // If profile not verified on the system
    if (!match) {
      let embed = new MessageEmbed({
        title: profileToSearch.username,
        description: description,
        color: KADISCORD_COLOR,
      });
      return msg.channel.send(embed);
    }

    // If profile is on the system   
    lookup.execute(msg, [match.kaid]);
  }
};