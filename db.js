const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.run("CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, RobloxUserId TEXT, DiscordUserId TEXT)");

db.run("CREATE TABLE IF NOT EXISTS verify (Discord_Id TEXT PRIMARY KEY, Roblox_Id TEXT, verify_code TEXT)");


module.exports = db;