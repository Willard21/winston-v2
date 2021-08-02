module.exports = {
  execute: function(content) {
  let badwords = [
    "cum",
    "testbadword",
    "bastard",
    "fucker",
    "lmfao",
    "dick",
    "nigga",
    "slut",
    "cock",
    "omfg",
    "fucking",
    "wtf",
    "dildo",
    "nigger",
    "goddamn",
    "shit",
    "whore",
    "fuck",
    "motherfuck",
    "bitch",
    "cunt",
    "retard",
    "pussy",
    "crap",
    "cuck",
  ];
  badwords.push("@everyone", "@here");
  for (let badword of badwords) {
    if (content.toLowerCase().includes(badword)) {
      content = content.replace(
        new RegExp("\\b" + badword, "gmi"),
        "\\*".repeat(badword.length)
      );
    }
  }
  return content;
}
}