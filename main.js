require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageFlags, ButtonStyle, ActivityType, embedLength, ModalBuilder, TextInputAssertions, TextInputBuilder, TextInputStyle } = require("discord.js");
const token = process.env.bot_token;
const clientId = process.env.client_id;
const db = require("./db");
const allowuser = process.env.manager; // 관리자

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const commands = [
  { name: "인증", description: "고유번호를 발급합니다." }
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("슬래시 명령어 등록 중...");
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log(`전역 슬래시 명령어 등록 성공`);
  } catch (error) {
    console.error(error);
  }
})();

// 함수

function dbcheak(table, id, cheaker) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT ${cheaker} FROM ${table} WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row[cheaker] : 0);
    });
  });
}

function dbsetting(id, setresult, cheaker) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (id, ${cheaker}) VALUES (?, ?)
       ON CONFLICT(id) DO UPDATE SET ${cheaker} = excluded.${cheaker}`,
      [id, setresult],
      function (err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
  });
}

async function errorcode(error, interaction) {
  console.error(error);
  let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error.code === 50013) errorMessage = "봇의 권한이 부족합니다. 역할 순서와 '역할 관리' 권한을 확인해주세요.";
    else if (error.code === 10007) errorMessage = "해당 유저를 서버에서 찾을 수 없습니다.";
    else if (error.code === 10011) errorMessage = "설정된 역할을 찾을 수 없습니다.";

    const errorEmbed = new EmbedBuilder().setTitle("작업 실패").setColor("#FF0000").setDescription(errorMessage);
            if (interaction.deferred || interaction.replied) {
          await interaction.editReply({ embeds: [errorEmbed], components: [] });
        } else {
          await interaction.reply({ embeds: [errorEmbed], components: [] });
        }
}

async function outpermmision(interaction, ownerid, userid) {
    if (userid !== ownerid) {

      const block = new EmbedBuilder().setTitle("거부됨").setColor("#FF0000").setDescription("권한이 부족합니다")
    await interaction.reply({
      embeds: [block],
      flags: MessageFlags.Ephemeral
    });
    return true;
  }
  return false;
}

const rpsChoices = new Map();

client.on("interactionCreate", async (interaction) => {
  try {
    // 슬래시
    if (interaction.isChatInputCommand()) {
      const {commandName} = interaction;

      if (commandName === "인증") {

      }
    }

  } catch (error) {

  }
});

client.login(token);

client.once("clientready", () => {
  console.log(`로그인 성공: ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: '서버 관리 중', type: ActivityType.Watching }],
    status: 'online',
  });
});