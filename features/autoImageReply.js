const path = require("node:path");
const { AttachmentBuilder } = require("discord.js");

// Only these exact message contents trigger the fixed Ananas image.
const TRIGGER_PROMPTS = new Set([
  "1563381634072449054",
  "1563380002681266246"
]);

const image = new AttachmentBuilder(
  path.join(__dirname, "..", "assets", "ananas-banner.png"),
  { name: "ananas-banner.png" }
);

module.exports = async function handleAutoImageReply(message) {
  if (!message || message.author?.bot || !message.guild) return;

  const prompt = message.content.trim();
  if (!TRIGGER_PROMPTS.has(prompt)) return;

  await message.channel.send({ files: [image] });
};
