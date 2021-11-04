module.exports = function(content) {
	let wasContent = content + "";
	let badwords = [
		"cum",
		"testbadword",
		"bastard",
		"bullshit",
		"dogshit",
		"fucker",
		"lmfao",
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
		"cuck",
	]
	for (let badword of badwords) {
		if (content.toLowerCase().includes(badword)) {
		content = content.replace(
			new RegExp("\\b" + badword, "gmi"),
			"\\*".repeat(badword.length)
		)
		}
	}
	content = content.replace(/\@everyone/gi, '(everyone)').replace(/\@here/gi, '(here)');
	// Limit length
	if (content != wasContent) {
		content = content.substring(0, 2000);
	}
	return content;
}