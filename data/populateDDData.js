const fs = require('fs');


// Load fact, question, joke
  let ddData = JSON.parse(fs.readFileSync('./dd.json', 'utf8'));


  // Get daily fact
  let facts = ddData.filter(d => d.fields[0].name.toLowerCase().includes('fact')).map(
    d => { 
      return {
        page: d.page, 
        value: d.fields[0].value 
      }
    })
  fs.writeFileSync('./facts.json', JSON.stringify(facts, null, 2))

   facts = ddData.filter(d => d.fields[0].name.toLowerCase().includes('joke')).map(
    d => { 
      return {
        page: d.page, 
        value: d.fields[0].value 
      }
    })
  fs.writeFileSync('./jokes.json', JSON.stringify(facts, null, 2))

   facts = ddData.filter(d => d.fields[0].name.toLowerCase().includes('thought')).map(
    d => { 
      return {
        page: d.page, 
        value: d.fields[0].value 
      }
    })
  fs.writeFileSync('./thoughts.json', JSON.stringify(facts, null, 2))

  
   facts = ddData.filter(d => d.fields[0].name.toLowerCase().includes('journal')).map(
    d => { 
      return {
        page: d.page, 
        value: d.fields[0].value 
      }
    })
  fs.writeFileSync('./journal_entries.json', JSON.stringify(facts, null, 2))




  facts = ddData.filter(d => 
    
    !d.fields[0].name.toLowerCase().includes('fact') &&
    !d.fields[0].name.toLowerCase().includes('joke') &&
    !d.fields[0].name.toLowerCase().includes('thought') &&
    !d.fields[0].name.toLowerCase().includes('journal')
    
    
    ).map(
    d => { 
      return {
        page: d.page, 
        name: d.fields[0].name, 
        value: d.fields[0].value 
      }
    })
  fs.writeFileSync('./others.json', JSON.stringify(facts, null, 2))
