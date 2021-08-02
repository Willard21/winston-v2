
const { MessageEmbed } = require("discord.js");
const { KACC_GUILD_ID, PRIMARY_COLOR, SECONDARY_COLOR, KAUSER_COLOR } = require('../config.json');

module.exports = {
  execute(msg, apiData) {

    let d = apiData;

    let embed = new MessageEmbed({
      title: d.title,
      description: `${d.userAuthoredContentType} project`,
      color: KAUSER_COLOR,
      thumbnail: {
        url: d.imageUrl
      },
      fields: [
        {
          name: "Author",
          value: `[Loading...](https://www.khanacademy.org/profile/${d.kaid})`,
          inline: true
        },
        {
          name: "Lines of code",
          value: d.revision.code.split("\n").length,
          inline: true
        },
        {
          name: "Votes",
          value: d.sumVotesIncremented,
          inline: true
        },
        {
          name: "Position on hotlist",
          value: "Coming soon",
          inline: true
        },
        {
          name: "Spin-offs",
          value: `${d.spinoffCount} ([tree](https://githubium.github.io/spinoff-explorer/?${d.id}))`,
          inline: true
        },
        {
          name: "API",
          value: `[API endoint](https://www.khanacademy.org/api/internal/scratchpads/${d.id}?format=pretty)`,
          inline: true
        },
      ],
      footer: {
        text: "Date created"
      },
      timestamp: d.created
    });

    msg.channel.send(embed);
  }
}
