// Imports
const fs = require("fs");
const fetch = require("node-fetch");
const schedule = require("node-schedule");


function addHotlistEntry(data) {
  let votes = 0;
  let spinoffs = 0;
  let votesGrowth = 0;
  let spinoffGrowth = 0;
  let projectsInfo = [];

  let projects = data.scratchpads;
  for (let i = 0; i < projects.length; i++) {
    pro = projects[i];
    votes += pro.sumVotesIncremented;
    spinoffs += pro.spinoffCount;
    projectsInfo.push({
      title: pro.title,
      id: pro.url.slice(pro.url.length - 16),
      authorNickname: pro.authorNickname,
      votes: pro.sumVotesIncremented,
      spinoffs: pro.spinoffCount,
    });
  }

  // Create storage dir if it doesn't exist
  if (!fs.existsSync("storage")) fs.mkdirSync("storage");

  // Update hotlist.json
  let fileName = "./storage/hotlist.json";
  let db;
  if (fs.existsSync(fileName)) {
    db = JSON.parse(fs.readFileSync(fileName, "utf8")).list;
  } else {
    db = {
      list: [],
    };
  }
  for (let i = 0; i < projectsInfo.length; i++) {
    const newItem = projectsInfo[i];

    let matched = false;
    for (let j = 0; j < db.length; j++) {
      let oldItem = db[j];
      if (oldItem.id === newItem.id) {
        matched = true;
        votesGrowth += newItem.votes - oldItem.votes;
        spinoffGrowth += newItem.spinoffs - oldItem.spinoffs
        newItem.diffVotes = newItem.votes - oldItem.votes;
        newItem.diffPosition = j - i;
        break;
      }
    }
    if (!matched) {
      // New rising program on hotlist
      newItem.diffVotes = null;
      newItem.diffPosition = null;
    }
  }
  db = { list: projectsInfo };
  fs.writeFileSync(fileName, JSON.stringify(db, null, 2));

  // Log message (takes up too much space, commented out)
  // console.log("Wrote to hotlist.json", new Date().getTime(), votes, spinoffs);
}

module.exports = {
  execute: function() {
  fetch(
    "https://www.khanacademy.org/api/internal/scratchpads/top?casing=camel&sort=3&page=1&limit=30&subject=all&topic_id=xffde7c31",
    {
      headers: {},
      method: "GET",
      mode: "cors",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      addHotlistEntry(data);
    })
    .catch((err) => console.log(err));
  }
}