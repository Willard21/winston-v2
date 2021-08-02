const { prefix } = require('../config.json');
const { MessageEmbed } = require("discord.js");
const { PRIMARY_COLOR } = require('../config.json');

module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['info'],
  cooldown: 5,
  execute(msg, args) {
    const { commands } = msg.client;
    if (args.length) { 
      commands.get('commands').execute(msg, args);
    } else {
      let embed = new MessageEmbed({
        title: "Help",
        description: `Type ${prefix}commands for a list of my commands.\nMore info coming soon.`,
        color: PRIMARY_COLOR,
      });
      return msg.channel.send(embed);
    }
  },
};