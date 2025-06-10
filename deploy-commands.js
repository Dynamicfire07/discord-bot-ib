// my-discord-bot/deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'test',
        description: 'Responds with "test complete".',
    },
    {
        name: 'profile',
        description: 'Create or update your profile with subjects.',
    },
];

// Grab the Bot Token, Client ID, and Guild ID from the .env file
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// Deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
