const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { PRIMARY_COLOR } = require('../config.json');

module.exports = {
  execute: function(kaccGuild) {

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
      newEmbed.addField(`${numberEmojis[i]} ** **`, suggestion.hidden ? "*deleted*" : suggestion.content, !false);
      i ++
    }

    // Edit embed
    lastMessage.edit({ embed: newEmbed }).then(
      mes => {
      // React with number equal to number of suggestions
      mes.react(numberEmojis[nextSuggestions.length - 1])
      })
    })

  }
}
