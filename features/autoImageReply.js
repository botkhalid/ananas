const path = require("node:path");
const { AttachmentBuilder } = require("discord.js");

// أضف معرّفات الرومات التي ترد فيها صورة Ananas تلقائياً.
const TRIGGER_CHANNELS = new Set([
  "1563381634072449054",
  "1563380002681266246",
  "1571228963429285938"
]);

module.exports = async function handleAutoImageReply(message) {
  if (!message || message.author?.bot || !message.guild) return;
  if (!TRIGGER_CHANNELS.has(message.channelId)) return;

  const image = new AttachmentBuilder(
    path.join(__dirname, "..", "assets", "ananas-banner.png"),
    { name: "ananas-banner.png" }
  );

  await message.channel.send({ files: [image] });
};
