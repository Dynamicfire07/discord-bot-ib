// my-discord-bot/index.js
require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');
const path = require('path');
const {
    Client,
    Events,
    GatewayIntentBits,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js');

// Available subjects a user can choose from
const SUBJECTS = [
    'IB Math AA',
    'IB Math AI',
    'IB Spanish AB',
    'IB English LAL',
    'IB Economics',
    'IB Business Management',
    'IB Hindi B',
    'IB Physics',
    'IB Chemistry'
];

// Simple JSON based storage for user profiles
const profilesPath = path.join(__dirname, 'data', 'profiles.json');

function loadProfiles() {
    try {
        return JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    } catch (err) {
        return {};
    }
}

function saveProfiles(profiles) {
    fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this once
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Listen for interactions (like slash commands)
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'test') {
            await interaction.reply('test complete');
        } else if (commandName === 'profile') {
            const menu = new StringSelectMenuBuilder()
                .setCustomId('subject-select')
                .setPlaceholder('Select your subjects')
                .setMinValues(1)
                .setMaxValues(SUBJECTS.length)
                .addOptions(SUBJECTS.map(s => ({ label: s, value: s })));

            const row = new ActionRowBuilder().addComponents(menu);

            await interaction.reply({
                content: 'Choose your subjects:',
                components: [row],
                ephemeral: true
            });
        }
    } else if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'subject-select') {
            const profiles = loadProfiles();
            profiles[interaction.user.id] = interaction.values;
            saveProfiles(profiles);

            await interaction.update({ content: 'Profile saved!', components: [] });
        }
    }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
