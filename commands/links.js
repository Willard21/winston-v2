const { MessageEmbed } = require("discord.js");
const { PRIMARY_COLOR } = require('../config.json');
module.exports = {
	name: "links",
	cooldown: 5,
	description: "Common KACP links",
	args: false,
	execute(msg, args) {
		desc = `*Navigation*
[Hotlist](https://www.khanacademy.org/browse)
[Help requests](https://www.khanacademy.org/cs/projectfeedback)
[Contests homepage](https://www.khanacademy.org/cs/-/5745407636209664)

*Tools*
[Get program data](https://www.khanacademy.org/cs/-/6152415778373632)
[KA extension for Chrome](https://chrome.google.com/webstore/detail/-/gniggljddhajnfbkjndcgnomkddfcial)
[Program Search](https://willard.fun)

*Help Center*
[Home](https://support.khanacademy.org/hc/en-us)
[Report inappropriate behavior](https://support.khanacademy.org/hc/en-us/requests/new?ticket_form_id=261008)
[Ban appeal form](https://docs.google.com/forms/d/e/1FAIpQLSfT5mvSaMjLi9KoD3eKeypijof_2-t4__howlKHQiu2Voy9KQ/viewform)
[Hidden project appeal form](https://docs.google.com/forms/d/e/1FAIpQLSe8sOJPtzuYKxO12juR-G_7hFJXW-Jkt_zLD3JxMg3FuGvX5w/viewform)`;

		let embed = new MessageEmbed({
			title: "KACP Links",
			description: desc,
			color: PRIMARY_COLOR,
		});
		return msg.channel.send(embed);
	}
};


