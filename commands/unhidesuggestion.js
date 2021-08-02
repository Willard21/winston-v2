const fs = require("fs");
const updateLastDDEmbed = require("../util/updateLastDDEmbed");
const { KACC_GUILD_ID } = require('../config.json');


module.exports = {
  name: "unhidesuggestion",
  cooldown: 1,
  description: "Unhide a daily dose CotD suggestion",
  aliases: ["unhide"],
  usage: "[index | emoji]",
  ownerOnly: "admin",
  args: true,
  execute(msg, [indOrEmoji]) {

    if (isNaN(indOrEmoji)) {
      const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯']
      indOrEmoji = numberEmojis.indexOf(indOrEmoji)
      if (indOrEmoji === -1) return msg.channel.createMessage(`${msg.author.mention} Invalid emoji!`)
    }
    
    // Get CotD data
    let cotdData = JSON.parse(fs.readFileSync("./storage/cotd.json", "utf8"));

    // Remove the suggestion
    cotdData.suggestions[cotdData.nextChallengeDay][indOrEmoji].hidden = false;

    // Save
    fs.writeFileSync("./storage/cotd.json", JSON.stringify(cotdData, null, 2));

    // Find kaccGuild
    msg.client.guilds.fetch(KACC_GUILD_ID).then(kaccGuild => {

      // Update embed
      updateLastDDEmbed.execute(kaccGuild)

      // Confirm
      msg.react("✅");
    })

  }
};
