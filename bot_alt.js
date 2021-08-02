
// Imports
const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token, owner } = require("./config.json");
const { BOT_STATUS, UNVERIFIED_CHANNEL_ID, WELCOME_MESSAGE } = require("./config.json");


const client = new Discord.Client();

client.on("ready", () => {
  client.user.setActivity(BOT_STATUS);
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.includes("cavan")) {

    client.users.fetch('439076109678805004').then((user) => {
      let link = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
      user.send(message.author.tag + " mentioned you in KACC :) " + link);
   });

  }
})


client.login(token);