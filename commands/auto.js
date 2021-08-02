const fs = require("fs")
const { prefix } = require("../config.json")

module.exports = {
  name: "auto",
  description: `Automates various tasks. 
  
**Key**
W = send welcome message to #unverified upon join
V = auto-verify when user posts valid link to KA profile
D = auto-daily dose poster. searches the web for relevant content and posts during appropriate times
M = auto-mod by replacing bad words with asterisks

**Examples**
${prefix}auto VDM -> turn on auto-verify, auto-dd, auto-mod
${prefix}auto W -> turn on welcome messages only
${prefix}auto -> turn off all automations
`,
  ownerOnly: "admin",
  args: true,
  usage: '{W}{V}{D}{M}',
  execute(msg, args) {
    let newAuto, info
    if (!args.length) {
      newAuto = ""
      info = "None"
    } else {
      info = ""
      newAuto = args[0].toUpperCase()
    }
    newAuto.replace(/[^W|V|D|M]/gi, "")
    let automations = {
      "W": "Welcome messages",
      "V": "Auto-verification",
      "D": "Auto-daily dose",
      "M": "Auto-mod",
    }
    let active = []
    for (let a in automations) {
      if (newAuto.includes(a)) {
        active.push("`" + automations[a] + "`")
      }
    }
    let newConfig = JSON.parse(fs.readFileSync("./config.json"))
    newConfig.auto = newAuto
    fs.writeFileSync("./config.json", JSON.stringify(newConfig, null, 2))
    msg.channel.send("The following automations are now active: " + active.join(", "))
    global.configModified = true
  }
};
