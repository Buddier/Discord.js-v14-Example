#!/usr/bin/env node
// -*- coding: utf-8 -*-

console.clear();
console.debug(`Booting up…`);

const Discord = require('discord.js');
const { Client, Collection, GatewayIntentBits } = Discord;
const handler = require("./src/handlers/index");

const client = new Client({
    // Or use https://discord-intents-calculator.vercel.app/
    intents: [Object.keys(GatewayIntentBits)],
});


// Call .env file to get Token
require('dotenv').config();

// Global Variables
client.discord  = Discord;
client.commands = new Collection();
client.slash    = new Collection();
client.config   = require('./config');
client.cwd      = require('process').cwd(); // require('path').resolve(``);

module.exports = client;

// Records commands and events
handler.loadEvents(client);
handler.loadCommands(client);
handler.loadSlashCommands(client);

// Error Handling
process.on("uncaughtException", (err) => {
    console.error('Uncaught Exception:', err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("[FATAL] Possibly Unhandled Rejection at: Promise", promise, "\nreason:", reason.message);
});

// Login Discord Bot Token
client.login(process.env.TOKEN);

