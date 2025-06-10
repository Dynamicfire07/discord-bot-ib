# discord-bot-ib

## Profile command

Run `/profile` to choose your IB subjects. Your selections are stored in
`data/profiles.json` keyed by your Discord user ID.

## Setup

Create a `.env` file in the project root containing your Discord bot
credentials. The following variables are required:

* `DISCORD_TOKEN` – your bot token
* `CLIENT_ID` – the application/client ID
* `GUILD_ID` – the ID of the guild where the commands will be deployed

Example `.env` contents:

```env
DISCORD_TOKEN=your-bot-token
CLIENT_ID=your-client-id
GUILD_ID=your-guild-id
```
