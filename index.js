require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  REST,
  Routes
} = require("discord.js");

const sendCommand = require("./commands/send");

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error("Missing DISCORD_TOKEN. Create a .env file based on .env.example.");
  process.exit(1);
}

const CHAT_CHANNEL_ID = "1563374252357460082";
const RULES_CHANNEL_ID = "1563279406179426505";
const STREAK_CHANNEL_ID = "1563381634072449054";
const WELCOME_CHANNEL_ID = "1538966902125371613";
const ROOM_EMOJI = "<:zz_dotheart:1569799693712625756>";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites
  ],
  partials: [Partials.GuildMember, Partials.User]
});

const inviteUses = new Map();

async function cacheGuildInvites(guild) {
  try {
    const invites = await guild.invites.fetch();
    inviteUses.set(
      guild.id,
      new Map(invites.map(invite => [invite.code, invite.uses ?? 0]))
    );
  } catch (error) {
    console.warn(`Could not fetch invites for ${guild.name}: ${error.message}`);
  }
}

client.once("clientReady", async readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`);

  // Register the slash command globally.
  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    await rest.put(
      Routes.applicationCommands(readyClient.user.id),
      { body: [sendCommand.data.toJSON()] }
    );
    console.log("Slash command /ارسال registered.");
  } catch (error) {
    console.error("Could not register slash commands:", error);
  }

  for (const guild of readyClient.guilds.cache.values()) {
    await cacheGuildInvites(guild);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === sendCommand.data.name) {
    await sendCommand.execute(interaction);
  }
});

client.on("inviteCreate", async invite => {
  await cacheGuildInvites(invite.guild);
});

client.on("inviteDelete", async invite => {
  await cacheGuildInvites(invite.guild);
});

client.on("guildMemberAdd", async member => {
  const guild = member.guild;
  let inviterText = "Unknown";

  try {
    const previous = inviteUses.get(guild.id) ?? new Map();
    const currentInvites = await guild.invites.fetch();

    const usedInvite = currentInvites.find(invite => {
      const oldUses = previous.get(invite.code) ?? 0;
      return (invite.uses ?? 0) > oldUses;
    });

    if (usedInvite?.inviter) {
      inviterText = `<@${usedInvite.inviter.id}>`;
    }

    inviteUses.set(
      guild.id,
      new Map(currentInvites.map(invite => [invite.code, invite.uses ?? 0]))
    );
  } catch (error) {
    console.warn(`Invite tracking unavailable in ${guild.name}: ${error.message}`);
  }

  const welcomeChannel = await guild.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);

  if (!welcomeChannel || !welcomeChannel.isTextBased()) {
    console.error(`Welcome channel ${WELCOME_CHANNEL_ID} was not found or is not a text channel.`);
    return;
  }

  const serverIcon = guild.iconURL({ extension: "png", size: 1024 });

  const embed = new EmbedBuilder()
    .setColor(0x242428)
    .setTitle("Welcome To Ananas")
    .setDescription(
      [
        "♥ **please check :**",
        "",
        `${ROOM_EMOJI} <#${CHAT_CHANNEL_ID}>`,
        `${ROOM_EMOJI} <#${RULES_CHANNEL_ID}>`,
        `${ROOM_EMOJI} <#${STREAK_CHANNEL_ID}>`,
        "",
        "",
        "♥ **Enjoy**",
        "",
        "**Invited By**",
        inviterText,
        "",
        "**Member Count**",
        `${guild.memberCount}`
      ].join("\n")
    )
    .setFooter({ text: "Go Ananas" });

  if (serverIcon) embed.setImage(serverIcon);

  await welcomeChannel.send({
    content: `Welcome ${member}!`,
    embeds: [embed]
  }).catch(error => {
    console.error(`Could not send welcome message: ${error.message}`);
  });
});

client.on("guildCreate", async guild => {
  await cacheGuildInvites(guild);
});

client.login(TOKEN);
