const fetch = require("node-fetch")
const fs = require("fs").promises

async function stepTwoVerification(kaProfile, discordId, message) {
	if (!kaProfile) {
		return message.channel.send(`It looks like this profile is hidden or does not exist.`)
	}

	let db = JSON.parse(await fs.readFile("./storage/verified_users.json", 'utf-8'))
	db.verified = db.verified.filter(entry => entry.did != discordId) // Remove all existing entries with same discord id

	let match = db.verified.find(entry => entry.kaid == kaProfile.kaid) // If kaid is stolen by another discord user
	if (match) {
		let user = await message.client.users.fetch(match.did)
		return message.channel.send(`This profile is not available. ${user.username}#${user.discriminator} has the same profile linked.`)
	}

	match = db.banned.some(entry => entry.kaid === kaProfile.kaid) // If kaid is banned (@sal for example is unreasonable)
	if (match) {
		return message.channel.send(`This profile is not available.`)
	}
	db.verified.push({
		did: discordId,
		kaid: kaProfile.kaid
	})

	await fs.writeFile("./storage/verified_users.json", JSON.stringify(db, null, '\t'))
	message.client.commands.get('verify').execute(message, "VERIFY_AUTHOR")
}

module.exports = {
	name: "setprofile",
	cooldown: 5,
	description: "Sets profile of user",
	aliases: ['set_profile'],
	usage: '[profile link]',
	args: true,
	async execute(msg, args, overrideUserId) {
		let discordUserId = overrideUserId || msg.author.id

		let arg
		if (Array.isArray(args)) {
			arg = args[0]
		} else {
			arg = args
		}

		if (arg.includes("https://")) {
			arg = arg.replace("https://", "") // Strip https:// part
		}
		if (arg.includes("/")) {// khanacademy.org/profile/squishypill/projects becomes squishypill
			arg = arg.split("/")[2]
		}

		let number = parseInt(arg)
		if (isNaN(number)) {
			let query = ""
			if (arg.startsWith("kaid_")) query = `kaid=${arg}`
			else {
				if (arg[0] === "@") arg = arg.slice(1)
				query = `username=${arg}`
			}
			
			let kaProfile = await fetch(`https://www.khanacademy.org/api/internal/user/profile?${query}`).then(r => r.json())
			await stepTwoVerification(kaProfile, discordUserId, msg)
		} else {
			msg.channel.send("Invalid profile link... ")
			return
		}
	}
}