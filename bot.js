require('dotenv').config()
const fs = require("fs");
const Discord = require("discord.js");
const schedule = require("node-schedule");
const { KACC_GUILD_ID, BOT_STATUS, UNVERIFIED_CHANNEL_ID, WELCOME_MESSAGE } = require("./config.json");
const modmail = require("./util/modmail.js");
const lookup = require("./util/lookup.js");
const smartClean = require("./util/smartClean.js");
const updateHotlist = require("./util/updateHotlist.js");
global.configModified = false
const updateConfig = () => {
  ({ prefix, owner, auto } = JSON.parse(fs.readFileSync("./config.json")))
}
updateConfig()

// Global
var kaccGuildGlobal

// Setup
const client = new Discord.Client();

// File setup
if (!fs.existsSync("./storage")) fs.mkdirSync("./storage");
if (!fs.existsSync("./storage/hot100")) fs.mkdirSync("./storage/hot100");
if (!fs.existsSync("./storage/cotd.json")) {
  fs.writeFileSync(
    "./storage/cotd.json",
    JSON.stringify({ currentDay: -1, nextChallengeDay: 0, suggestions: {
      // 346: [
      //   {
      //    "authorDID": "1234567890" // Discord ID
      //    "content": "Drink water"
      //    "timestamp": "2019-01-01T00:00:00.000Z"
      //   },
      //   ...
      // ],
      // 348: [ ... ],
      // ...    
    } }),
    "utf8"
  );
}
if (!fs.existsSync("./storage/verified_users.json")) {
  fs.writeFileSync(
    "./storage/verified_users.json",
    JSON.stringify({ banned:[], verified:[] }, null, 2),
    "utf8"
  );
}


// Init webhooks
function initWebhooks(kaccGuild) {
  function createWebhookEveryChannel(guild) {
    const textChannels = guild.channels.cache.filter(c => c.type=='text');
    let i = 0
    textChannels.forEach( channel => {
      setTimeout(() => {
              try {
                channel.createWebhook("Winston helper", {
                  avatar: 'https://cdn.discordapp.com/avatars/746567249011146902/0551d768c27917ae43d475c2529c1f8c.png', // So when doing this command, you must give it an image URL (Should end in .jpg, .png, etc.)
                }).then(webhook => console.log(`Created webhook ${webhook}`))
                
              } catch (e) {}  

    }, 1000*(i++))
    })
  }
  kaccGuild.fetchWebhooks().then(webhooks => {
    global.webhooks = webhooks
    let alreadySetUp = false
    if (global.webhooks.some(w => w.name.includes("helper"))) {
      console.log("Webhooks already initialized.")
      alreadySetUp = true
    }
    if (!alreadySetUp) {
      createWebhookEveryChannel(guild)
    }
  })
}

function determineNextCotd(kaccGuild) {

  // Read content of last message sent in channel
  const channel = kaccGuild.channels.cache.find(channel => channel.name === "dailydose");
  const messages = channel.messages.fetch({ limit: 2 }).then(messages => {

    // Filter out messages with embed
    const filteredMessages = messages.filter(message => !message.embeds.length)

    const lastMessage = filteredMessages.last()
    const lastMessageContent = lastMessage.content
  
    // Read the daily dose number (#xxx)
    const dailyDoseNumber = lastMessageContent.match(/\#(\d+)/)?.[0]
    if (!dailyDoseNumber) {
      console.log("ERROR! No daily dose number found in last message.")
      return
    } else {
      console.log(`Last message had daily dose number ${dailyDoseNumber}.`)
    }
    
    // Get number part and set cotd to that number
    let cotdData = JSON.parse(fs.readFileSync("./storage/cotd.json", "utf8"));
    const dailyDoseNumberNumber = parseInt(dailyDoseNumber.substring(1))
    cotdData.currentDay = dailyDoseNumberNumber + 1;
    let nextChallengeDay = dailyDoseNumberNumber + 1
  
    // Determine next challenge day and set cotd to that number
    while (![0, 2, 4].includes(nextChallengeDay % 7)) {
      nextChallengeDay++
    }
    cotdData.nextChallengeDay = nextChallengeDay
  
    // Save cotd data
    fs.writeFileSync("./storage/cotd.json", JSON.stringify(cotdData, null, 2), "utf8")
  })

}


// Command/cooldown setup
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

client.on("ready", () => {
  client.user.setActivity(BOT_STATUS.replace(";", prefix), { type: 'LISTENING' });
  console.log(`Logged in as ${client.user.tag}!`);
  
  client.guilds.fetch(KACC_GUILD_ID).then(kaccGuild => {
    kaccGuildGlobal = kaccGuild
    initWebhooks(kaccGuild)
    determineNextCotd(kaccGuild)
    console.log(`Bot is ready!`);
  })
});

client.on('guildMemberAdd', member => {

  // Give unverified role upon join
  let role = member.guild.roles.cache.find(role => role.name === 'Unverified');
  member.roles.add(role).catch(e => console.error(e));// give unverified role
  
  let unverifiedChannel = member.guild.channels.cache.get(UNVERIFIED_CHANNEL_ID);

  // Auto-verify upon join
  if (auto.includes("V")) {
    let db = JSON.parse(fs.readFileSync("./storage/verified_users.json"));
    let match = db.verified.find(entry => entry.did == member.id)
    if (match) {
      return unverifiedChannel.send(`Verified <@${match.did}> as`)
      .then(msg => {
        lookup.execute(msg, [match.kaid])
        client.commands.get('verify').execute(msg, ["VERIFY_TARGET", match.did])// Verify user
      })
    }
  }

  
  // Auto-welcome
  if (auto.includes("W")) {
    unverifiedChannel.send(`<@${member.id}>, ${WELCOME_MESSAGE}`);
  }
  
});

client.on("message", (message) => {
  // Ignore other bots
  if (message.author.bot) return;

  // Update config as needed
  if (global.configModified) {
    updateConfig()
  }

  // For Modmail
  if (message.channel.type === "dm") {
    modmail.execute(client, message);
    return;
  }

  // April fools joke to react with a turtle on every message
  if (false) {
    // React to message
    message.react("🐢");
    console.log(message.content, message.author.username)
  }

  // Auto-verification
  if (auto.includes("V")) {
    if (message.channel.id == UNVERIFIED_CHANNEL_ID) {
      if (message.member.roles.cache.find(r => r.name === "Unverified")) {
        let found = message.content.match(/(khanacademy.org\/profile\/[^ ]+)/g);
        if (found) {
          let profileURL = found[0];
          client.commands.get('setprofile').execute(message, profileURL, message.author.id);// Verify user
        }
      }
    }
  }

  // Auto-moderation (replace bad words with *'s)
  if (auto.includes("M")) {
    let clean = smartClean.execute(message.content)

    if (clean !== message.content) {
      outWebhook = webhooks.find(w => w.channelID == message.channel.id)
      if (outWebhook) {
        outWebhook.send(Discord.Util.cleanContent(clean, message), {
          username: message.author.username,
          avatarURL: message.author.avatarURL(),
          allowMentions: false,
        }).then(() => {
          message.delete()
        })
      }
    }
  }

  
  // Command / args handling
  if (!message.content.startsWith(prefix)) return;
  if (message.channel.type !== "text") return;// Does not apply to special channel types like voice or news
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;
  if (command.ownerOnly && message.author.id.toString() !== owner.toString()) {
    return message.reply("this command is not public");
  }
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  // Cooldown
  if (message.author.id.toString() !== owner.toString()) {
    // The owner is not subject to cooldowns
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
          `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`
        );
      }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  // Execute command
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command.");
  }
});

client.login(process.env.TOKEN);


// Schedule daily dose prompt in #modmail at 17:00 (5:00 pm) local time
schedule.scheduleJob("0 21 * * *", sendDailyDoseInAppropriateChannel);

function sendDailyDoseInAppropriateChannel() {

  // If daily dose automation is enabled, send a message to #dailydose automatically 
  if (auto.includes("D")) {

    // Update CotD data
    determineNextCotd(kaccGuildGlobal)

    // Find daily dose channel      
    let channel = kaccGuildGlobal.channels.cache.find(ch => ch.name === "dailydose")
    if (!channel) {
      return console.log("ERROR: I can't find the dailydose channel!")
    }

    // Get last message and pass that in as a parameter (to send in correct channel)
    channel.messages.fetch({ limit: 1 }).then(messages => {
      anyDDMessage = messages.first()
      client.commands.get('dailydose').execute(anyDDMessage, [false])
    })
  }
}

// Update hotlist data every 10 minutes
schedule.scheduleJob("01,11,21,31,41,51 * * * *", function () {
  // Run at 6:01, 6:11, 6:21, 6:31, etc...
  updateHotlist.execute();
});