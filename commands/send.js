const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ارسال")
    .setDescription("إرسال رسالة بتنسيق Embed في نفس الروم")
    .addStringOption(option =>
      option
        .setName("النص")
        .setDescription("اكتب محتوى الرسالة")
        .setRequired(true)
        .setMaxLength(4000)
    )
    .addAttachmentOption(option =>
      option
        .setName("الصورة")
        .setDescription("أرفق صورة اختيارية مع الرسالة")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const content = interaction.options.getString("النص", true);
    const image = interaction.options.getAttachment("الصورة");

    if (image && !(image.contentType || "").startsWith("image/")) {
      await interaction.reply({
        content: "❌ الملف المرفق يجب أن يكون صورة.",
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x242428)
      .setDescription(content);

    if (image) {
      embed.setImage(image.url);
    }

    // إرسال الإعلان كرسالة مستقلة من البوت، وليس كرد على رسالة.
    await interaction.channel.send({ embeds: [embed] });

    // يبقى تأكيد التنفيذ خاصاً بمستخدم الأمر فقط.
    await interaction.reply({
      content: "تم إرسال الرسالة بنجاح.",
      ephemeral: true
    });
  }
};
