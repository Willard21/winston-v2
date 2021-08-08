module.exports = {
  execute: function(content) {
    let wasContent = content + "";
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
  for (let badword of badwords) {
    if (content.toLowerCase().includes(badword)) {
      content = content.replace(
        new RegExp("\\b" + badword, "gmi"),
        "\\*".repeat(badword.length)
      )
    }
  }
  content = content.replace(/\@everyone/gi, 'e v e r y o n e').replace(/\@here/gi, 'h e r e');
  // Limit length
  if (content != wasContent) {
    content = content.substring(0, 2000);
  }
  return content;
}
}