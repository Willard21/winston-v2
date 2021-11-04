const fetch = require("node-fetch")
const fs = require("fs").promises
const Discord = require("discord.js")

module.exports = {
	name: "eval",
	description: "Executes code",
	ownerOnly: true,
	args: true,
	usage: '[javascript code]',
	async execute(message, args) {
		if (args[0]?.startsWith("```")) {
			args[0] = args[0].replace(/```\w+/, "")
			args[args.length -1] = args[args.length -1].replace(/```/, "")
		}

		let evaled
		let err = false
		try {
			let lines = args.join(" ").split("\n").map(line => line.trim()).filter(line => line)
			let last = lines.pop()
			evaled = await eval(`(async function() {
				${lines.join("\n")}
				return ${last}
			})()`)
		} catch (e) {
			evaled = `${e.name}: ${e.message}`
			err = true
		}

		try {
			switch (typeof evaled) {
				case "undefined":
					evaled = "undefined";
					break;
				case "bigint":
				case "number":
					evaled = `${evaled}${evaled > 9999 ? ` (${evaled.toLocaleString()})` : ""}`
					break;
				case "function":
				case "symbol":
					evaled = String(evaled)
					break;
				case "object":
					evaled = evaled ? JSON.stringify(evaled, null, 2) : "null"
					break;
				case "string":
					evaled = err ? evaled : `"${evaled.trim()}"`
					break;
				case "boolean":
					evaled = String(evaled)
			}
		// eslint-disable-next-line no-empty
		} catch(e) {
			console.log(evaled)
			message.channel.send("Something broke. Printed to console instead.")
		}

		if (evaled.length < 1991) {
			message.channel.send("```js\n" + evaled + "```")
		} else {
			console.log("\n\n", evaled, "\n\n")
			message.channel.send("Soz this is too long. Printed to console instead.")
		}
	}
};
	