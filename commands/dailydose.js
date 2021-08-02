const fs = require("fs");
const fetch = require("node-fetch")
const { DAILYDOSE_ROLE_ID, PRIMARY_COLOR, KACC_GUILD_ID } = require('../config.json');
const { MessageEmbed } = require("discord.js");


function decodeHTML(str) {
  return str.replace(/&#(\d+);?/g, function() {
      return String.fromCharCode(arguments[1])
  });
}

function between(s, start, end) {
    return s.split(start)[1].split(end)[0]
}

async function lookup(url, start=null, end=null) {
    let res = await fetch(url)
    let text = await res.text()
    if (!text) return false
    if (start == null) return text
    return between(text, start, end)
}

async function getDDAsync(msg, dailyDoseNumber, challengeOfTheDay="No submission! Make a project on Khan Academy https://www.khanacademy.org/computer-programming/new/pjs") {
  /*
  Structure

  Word, Fact, Quote, Extra (challenge,joke, or phobia)
  */

  // Get daliy word
  url = "http://www.wordfindercheat.com/scrabble-word-of-the-day/"
  let page = await lookup(url)
  let word = between(page, `wf_portlet_heading">`, `</h2`)
  let definition = between(page, `<dd>`, `</dd>`).trim()
  let wordPart = `${word} - ${definition}`

  // Get daily fact
  let facts = JSON.parse(fs.readFileSync("./data/facts.json", "utf8"))
  let factPart = facts[dailyDoseNumber % facts.length]?.value||"[redacted]"

  // Get daily quote
  let quotes = JSON.parse(fs.readFileSync("./data/thoughts.json", "utf8"))
  let quotePart = quotes[dailyDoseNumber % quotes.length]?.value||"[redacted]"

  // Get daily challenge/joke/phobia (extra)
  let extraPart = "(error retrieving)"
  let extraName = "(unknown)"
  switch (dailyDoseNumber % 7) {
    case 0: case 2: case 4:
      // Get daily challenge
      extraName = "Challenge"

     
      /* Tally up votes on last daily dose voting box to choose a challenge */
      const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯']
      let kaccGuild = await msg.client.guilds.fetch(KACC_GUILD_ID)
      let channel = kaccGuild.channels.cache.find(ch => ch.name === "dailydose")
      const messages = await channel.messages.fetch({ limit: 1 })
      const lastMessage = await messages.first()

      // Get all reactions on last message
      const reactions = lastMessage.reactions.cache
      
      // Find the emoji reaction with the most votes
      let max = 0
      for (let emoji of numberEmojis) {
        let reaction = reactions.find(r => r.emoji.name === emoji)
        if (!reaction) continue
        let count = reaction.count
        max = count > max ? count : max
      }

      // Build a list of all the challenges (their indices) with the most votes
      let challengesIndices = []
      let i = 0
      for (let emoji of numberEmojis) {
        let reaction = reactions.find(r => r.emoji.name === emoji)
        if (!reaction) continue
        let count = reaction.count
        if (count === max) {
          challengesIndices.push(i)
        }
        i ++
      }
      console.log(`Winning suggestion has ${max} votes, in event of a tie a random winner is chosen.`);

      // Choose a challenge at random
      let winnerIndex = challengesIndices[Math.floor(Math.random() * challengesIndices.length)]

      // Get the challenge text
      let cotdData = JSON.parse(fs.readFileSync("./storage/cotd.json", "utf8"))
      let suggestionWinner = cotdData.suggestions[cotdData.nextChallengeDay][winnerIndex]

      // Assign the challenge to extraPart
      extraPart = `${suggestionWinner.content} (challenge by <@${suggestionWinner.discordId}>)`
      break;

    case 1: case 3: case 5:
      // Get daily joke
      extraName = "Joke"
      let jokes = JSON.parse(fs.readFileSync("./data/jokes.json", "utf8"))
      extraPart = jokes[dailyDoseNumber % jokes.length]?.value||"[redacted]"
      break;
    
    case 6:
      // Get daily phobia
      extraName = "Phobia"
      let phobias = fs.readFileSync("./data/Phobias.txt", "utf8")
      phobias = phobias.split("\n")
      phobiaAndDefinition = phobias[(dailyDoseNumber*137)%phobias.length].split("- ")
      extraPart = "*"+phobiaAndDefinition[0]+"* - "+phobiaAndDefinition[1]
      break;
  }

  let embedPart = false
  if ([6, 1, 3].indexOf(dailyDoseNumber % 7) != -1) {// If it's the day before a new challenge, ask for a new one
     embedPart = new MessageEmbed({
        title: "\\>\\>\\> DM me a challenge <<<",
        description: "DM this bot to suggest tomorrow's daily challenge. Include the #cotd tag to make your suggestion count! <:nomKA:528643226928807960>",
        color: PRIMARY_COLOR,
    });
    
    
    
  }


  return {
    content: decodeHTML(`<@&${DAILYDOSE_ROLE_ID}> #${dailyDoseNumber}

**Word of the day:** ${wordPart}

**Fact of the day:** ${factPart}

**Quote of the day:** ${quotePart}

**${extraName} of the day:** ${extraPart}`),
    embed: embedPart

  }
} 

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  name: "dailydose",
  cooldown: 60 * 60, // 1 hour
  description: "Creates daily dose",
  aliases: ['dd', "daily_dose"],
  usage: '',
  ownerOnly: true,
  args: false,
  execute(msg, [dailyDoseNumber]) {

    // If no argument is given, get the current daily dose number
    if (!dailyDoseNumber) {
      dailyDoseNumber = JSON.parse(fs.readFileSync("./storage/cotd.json", "utf8")).currentDay
    }
    getDDAsync(msg, dailyDoseNumber).then(output => {
        msg.channel.send(output.content).then(() => {
          if (output.embed) {
            msg.channel.send(output.embed).catch(console.error);
          }
        })
    })

  }
};