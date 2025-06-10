// my-discord-bot/index.js
require('dotenv').config(); // Load environment variables from .env file
const sqlite3 = require('sqlite3').verbose();
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

// SQLite based storage for user profiles
const dbPath = path.join(__dirname, 'data', 'profiles.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS profiles (
            user_id TEXT PRIMARY KEY,
            subjects TEXT
        )`
    );
});

function saveProfile(userId, subjects) {
    db.run(
        `INSERT INTO profiles(user_id, subjects) VALUES (?, ?)
         ON CONFLICT(user_id) DO UPDATE SET subjects=excluded.subjects`,
        [userId, JSON.stringify(subjects)],
        err => {
            if (err) console.error('Failed to save profile', err);
        }
    );
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
            saveProfile(interaction.user.id, interaction.values);

            await interaction.update({ content: 'Profile saved!', components: [] });
        }
    }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
