const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const { KACC_GUILD_ID } = require('../config.json');
const smartClean = require('./smartClean.js');
const updateLastDDEmbed = require('./updateLastDDEmbed.js');

module.exports = {
  execute(client, msg) {
    let kaccGuild = client.guilds.cache.find(guild => guild.id == KACC_GUILD_ID);

    if (msg.content.toLowerCase().includes("rickroll")) { // Rickrol the user
      let channel = kaccGuild.channels.cache.find(ch => ch.name == 'message_log');
      channel.send(`${msg.author.username}#${msg.author.discriminator} just got rickrolled!`).then(() => {
        // Rickroll url
        let rickroll = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        msg.reply(rickroll)
      })
      return
    }

    if (msg.content.toLowerCase().includes("#cotd")) {
      let realContent = msg.content.replace(/\#cotd/gmi, "").trim()

      // Save suggestion to file
      let cotdData = JSON.parse(fs.readFileSync("./storage/cotd.json", "utf8"))
      let nextCotdDay = cotdData.nextChallengeDay
      if (!cotdData.suggestions[nextCotdDay]) {
        cotdData.suggestions[nextCotdDay] = []
      }
      if (cotdData.suggestions[nextCotdDay].filter(s => s.discordId == msg.author.id).length >= 2) {
        // Already suggested 2 times
        msg.reply(`You have already suggested 2 times for Daily Dose #${nextCotdDay}. Please wait for the next cycle.`)
        return
      } else if (cotdData.suggestions[nextCotdDay].length >= 20) {
        // Already suggested 20 times
        msg.reply(`Daily Dose #${nextCotdDay} suggestion list already full. Please wait for the next cycle.`)
        return
      }
      cotdData.suggestions[nextCotdDay].push({
        "name": msg.author.username,
        "discriminator": msg.author.discriminator,
        "discordId": msg.author.id,
        "content": smartClean.execute(realContent),
        "timestamp": Date.now(),
        "hidden": false
      })
      fs.writeFileSync("./storage/cotd.json", JSON.stringify(cotdData, null, 2))

      // Update the info/voting embed in #dailydose
      updateLastDDEmbed.execute(kaccGuild)

      // Send embed to DMs
      let embed = new MessageEmbed({
        title: `CotD suggestion for Daily Dose #${485}`,
        description: `Suggestion by ${msg.author.username}#${msg.author.discriminator}\n\n**${realContent}**`,
        color: '#d4e4ff',
        timestamp: msg.createdTimestamp
      });
      let guild = client.guilds.cache.find(guild => guild.id == KACC_GUILD_ID);
      let channel = guild.channels.cache.find(ch => ch.name == 'message_log');
      channel.send(embed).then(() => {
        msg.react("👍")
      })
      return
    }   

    let embed = new MessageEmbed({
      title: `${msg.author.username}#${msg.author.discriminator}`,
      description: msg.content,
      color: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
      timestamp: msg.createdTimestamp
    });
    let guild = client.guilds.cache.find(guild => guild.id == KACC_GUILD_ID);
    let channel = guild.channels.cache.find(ch => ch.name == 'modmail');
    channel.send(embed).then(() => {
      msg.react("✅")
    })
  }

};