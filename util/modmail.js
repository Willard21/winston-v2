const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const { KACC_GUILD_ID, PRIMARY_COLOR } = require('../config.json');
const smartClean = require('./smartClean.js');

function updateLastDDEmbed(kaccGuild) {
  // Get last embedded message in #dailydose
  const channel = kaccGuild.channels.cache.find(channel => channel.name === "dailydose");
  const messages = channel.messages.fetch({ limit: 3 }).then(messages => {
  
  // Only include messages with embed
  const filteredMessages = messages.filter(message => message.embeds.length)

  // If no embeds, return
  if (filteredMessages.length === 0) return;

  // Get last embed
  const lastMessage = filteredMessages.last()

  // Create new embed
  let cotdData = JSON.parse(fs.readFileSync("./storage/cotd.json", "utf8"))
  let addedPart = `
.
.
*React below to vote for the best challenge - winner is revealed tomorrow*`
  let newEmbed = new MessageEmbed({
    title: "\\>\\>\\> DM me a challenge <<<",
    description: "DM this bot to suggest tomorrow's daily challenge. Include the #cotd tag to make your suggestion count! <:nomKA:528643226928807960>" + addedPart,
    color: PRIMARY_COLOR,
  });
  
  let nextSuggestions = cotdData.suggestions[cotdData.nextChallengeDay]
  let i = 0

  // Numbers in emoji form
  const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯']

  for (let suggestion of nextSuggestions) {
    newEmbed.addField(`${numberEmojis[i]}`, suggestion.content, false);
    i ++
  }

  // Edit embed
  lastMessage.edit({ embed: newEmbed }).then(
    mes => {
    // React with number equal to number of suggestions
    mes.react(numberEmojis[0])
    mes.react(numberEmojis[1])
    mes.react(numberEmojis[2])
    mes.react(numberEmojis[nextSuggestions.length - 1])
    })
  })
}

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
        "timestamp": Date.now()
      })
      fs.writeFileSync("./storage/cotd.json", JSON.stringify(cotdData, null, 2))

      // Update the info/voting embed in #dailydose
      updateLastDDEmbed(kaccGuild)

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