// my-discord-bot/index.js
require('dotenv').config(); // Load environment variables from .env file
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this once
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Listen for interactions (like slash commands)
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return; // Only process chat input commands

    const { commandName } = interaction;

    if (commandName === 'test') {
        await interaction.reply('test complete');
    }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);