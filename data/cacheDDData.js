const fetch = require('node-fetch');
const fs = require('fs');

let ddData = [];

async function cacheDDData(page) {
  console.log(`Caching DD Data for page ${page}`);
  const data = await fetch(`https://www.beagreatteacher.com/daily-fun-fact/page/${page}/`);
  // get text
  const text = await data.text();

  const mainContent = text.match(/<main class="content">.*?<\/main>/gms)[0]

  // get all the header tags
  const headerTags = mainContent.match(/<span style="color: .*?">.*?<\/span>|<h2>.*?<\/h2>/gms);
  // get all the <p> tags
  const pTags = mainContent.split(/<span style="color: .*?">.*?<\/span>|<h2>.*?<\/h2>|clear:both/gms).slice(1, -1);

  console.log(9999,headerTags?.length)

  // add each <p> tag to the ddData object
  for (let i = 0; i < pTags.length; i++) {
    ddData.push({
      page: page,
      fields: [
        {
          name: headerTags[i].replace(/<[^>]*>?/gm, '').replace(/\:/,''),
          value: pTags[i].replace(/<[^>]*>?/gm, '').match(/\S.*\S/gms)[0]
        }
      ]
    })

  }
}


async function main() {
  for (let page = 2; page <= 2619; page++) {
    try {
      await cacheDDData(page);
    } catch (e) {
      console.log(e);
      console.log(`https://www.beagreatteacher.com/daily-fun-fact/page/${page}/`);
    }
    // Log every 100 pages
    if (page % 100 === 0) {
      console.log('logged (backup)');
      fs.writeFileSync('data/dd.json', JSON.stringify(ddData, null, 2));
    }
  }
  fs.writeFileSync('data/dd.json', JSON.stringify(ddData, null, 2));
  console.log(`Cached DD Data to data/dd.json`);
}

main()