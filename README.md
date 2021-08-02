# Winston v2
Multi-purpose Discord bot created for the Discord server Khan Academy Community Center (KACC). Second iteration of this project.


Invite permissions # is 2952916032

Invite to KACC with https://discord.com/api/oauth2/authorize?client_id=746567249011146902&permissions=2952916032&scope=bot

## Set up bot

### 1. Clone repository to server

### 2. Init

Run these commmands

`npm init`

`npm i fs dotenv node-fetch discord.js`

Create .env file with the following contents:

`TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxx`

Replace with your Discord bot token.

Open config.json and verify the following values:

  "owner": // Discord ID of bot owner
  "KACC_GUILD_ID": // Server ID of Khan Academy Community Center
  "UNVERIFIED_CHANNEL_ID": // Channel ID of #unverified
  "MODERATOR_ROLE_ID": // Role ID of @Moderator
  "DAILYDOSE_ROLE_ID": // Role ID of @Daily Dose
  "WELCOME_MESSAGE": // Welcome message

### 3. Run

`npm start`

If required webhooks do not exist, this will create a webhook in every text channel.

### 4. Configure on Discord

To enable modmail, create a text channel *#modmail*. Make sure this bot has view channel and send message permissions in *#modmail*

Type `;cmds admin` to view staff commands.

The most important staff command is `;auto`. Here you can turn on 4 different automations. Here is a breakdown of what each automation does:
- W - Send welcome messages to new members.
- V - Automatically verifiy members who post a link to their Khan Academy profile & verify returning users upon join.
- M - Filter out bad words from incomming messages. This uses webhooks.
- D - Automatically post "daily doses" in the #dailydose channel. A channel named *#dailydose* must exist.


## Public Commands
commands  
help  
hotlist  
links  
ping  
profile {username | kaid | @mention | link}  
setprofile [username | kaid | link] 

## Admin Commands
prefix [new_prefix]  
**banprofile [kaid]** - Ban this Khan Academy username/KAID for verification  
**verify [@mention]** - Manually unverify a member  
**unverify [@mention]** - Manually verify a member   
auto [int, see commands/auto for details]  
stop  


## Owner Commands
eval [javascript]  
reload [command name]

## Other Features
