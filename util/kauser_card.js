
const { MessageEmbed } = require("discord.js");
const { KACC_GUILD_ID, PRIMARY_COLOR, SECONDARY_COLOR, KAUSER_COLOR } = require('../config.json');

module.exports = {
  execute(msg, apiData) {

    let d = apiData;
    let embed = new MessageEmbed({
      title: d.nickname,
      description: `[@${d.username}](https://www.khanacademy.org/profile/${d.username}) - ${d.bio}`,
      color: KAUSER_COLOR,
      fields: [
        {
          name: "Energy points",
          value: d.points,
          inline: true
        },
        /*{
          name: "Videos watched",
          value: d.countVideosCompleted,
          inline: true
        },*/ // Useless info
        {
          name: "Avatar",
          value: d.avatar.displayName,
          inline: true
        },
        {
          name: "Public",
          value: d.isPublic ? "Yes" : "No",
          inline: true
        },
        {
          name: "API",
          value: `[API endoint](https://www.khanacademy.org/api/internal/user/profile?kaid=${d.kaid}&format=pretty)`,
          inline: true
        },
      ],
      footer: {
        text: "Date joined"
      },
      timestamp: d.dateJoined
    });

    msg.channel.send(embed);
  }
}
