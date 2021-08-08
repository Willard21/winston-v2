const { prefix } = require('../config.json');
const fetch = require("node-fetch");
const kauserCard = require("../util/kauser_card.js");
const kaprojectCard = require("../util/kaproject_card.js");

module.exports = {
  name: "lookup",
  description: "Display stats about a specific Khan Academy user or project given a @username, KAID, or project ID",
  aliases: ["l"],
  args: true,
  execute(msg, args) {
    for (let arg of args.splice(0, 5)) {
      let number = parseInt(arg);
      if (isNaN(number)) {
        if (arg.slice(0, 5) === "kaid_") {
          // kaid
          fetch(
            `https://www.khanacademy.org/api/internal/user/profile?kaid=${arg}`, { headers: {}, method: "GET", mode: "cors" })
            .then(r => r.json())
            .then(d => kauserCard.execute(msg, d))
            .catch(err => console.log(err));
        } else {
          // username
          if (arg[0] === "@") {
            arg = arg.slice(1);// @squishypill becomes squishypill
          }
          fetch(
            `https://www.khanacademy.org/api/internal/user/profile?username=${arg}`, { headers: {}, method: "GET", mode: "cors" })
            .then(r => r.json())
            .then(d => kauserCard.execute(msg, d))
            .catch(err => console.log(err));
        }
      } else {
        if (arg.length > 16) {
          // kaid wrong format
          msg.channel.send("Invalid input... did you mean `" + prefix + "lookup kaid_" + arg + "`?");
          return;
        } else {
          fetch(
            `https://www.khanacademy.org/api/internal/scratchpads/${arg}`, { headers: {}, method: "GET", mode: "cors" })
            .then(r => r.json())
            .then(d => kaprojectCard.execute(msg, d))
            .catch(err => console.log(err));          
        }
      }

    }
  }
}
