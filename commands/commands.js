const { prefix } = require('../config.json');
const { MessageEmbed } = require("discord.js");
const { PRIMARY_COLOR, SECONDARY_COLOR } = require('../config.json');

module.exports = {
  name: 'commands',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['command', 'cmd', 'cmds'],
  usage: '{command name}',
  cooldown: 5,
  args: false,
  execute(msg, args) {
    const { commands } = msg.client;

    if (!args.length) {
      let helpStr = 'Here\'s a list of my main commands:\n• ';
      let userCommands = commands.filter(command => !command.ownerOnly);
      helpStr += userCommands.map(command => `\`${command.name}\` ` + (command.usage ? (command.usage) : "")).join('\n• ');
      let embed = new MessageEmbed({
        title: "Commands",
        description: helpStr,
        color: PRIMARY_COLOR,
        footer: {
          text: `For a list of staff commands, type "${prefix}commands admin". For more info about a specific commands, type "${prefix}command (command name)".`,
          icon_url: 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/questionmark.png',
        },
      });
      return msg.channel.send(embed);
    } else if (args[0].toLowerCase() === "admin") {
      let helpStr = 'Admin-only commands:\n• ';
      let adminCommands = commands.filter(command => command.ownerOnly === "admin");
      let ownerCommands = commands.filter(command => command.ownerOnly === true);
      helpStr += adminCommands.map(command => `\`${command.name}\` ` + (command.usage ? (command.usage) : "")).join('\n• ');
      helpStr += "\n\nRestricted:\n• "
      helpStr += ownerCommands.map(command => `\`${command.name}\` ` + (command.usage ? (command.usage) : "")).join('\n• ');
      let embed = new MessageEmbed({
        title: "Admin Commands",
        description: helpStr,
        color: SECONDARY_COLOR,
        footer: {
          text: `For more info about a specific commands, type "${prefix}command (command name)".`,
          icon_url: 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/questionmark.png',
        },
      });
      return msg.channel.send(embed);
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return msg.channel.send('That\'s not a valid command!');
    }

    let embed = new MessageEmbed({
      title: `Command: ${command.name}`,
      color: PRIMARY_COLOR
    });

    if (command.description) embed.setDescription(command.description);
    if (command.aliases) embed.addField(`**Aliases**`, `${command.aliases.join(', ')}`);
    if (command.usage) embed.addField(`**Usage**`, `${prefix}${command.name} ${command.usage}`);
    if (command.ownerOnly) {
      if (command.ownerOnly === "admin") {
        embed.addField(`**Access**`, "Admin");
      } else {
        embed.addField(`**Access**`, "Owner");
      }
    } else {
      embed.addField(`**Access**`, "Public");
    }
    if (command.cooldown) {
      embed.addField(`**Cooldown**`, `${command.cooldown} second(s)`);
    }

    msg.channel.send(embed);
  },
};