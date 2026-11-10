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
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const content = interaction.options.getString("النص", true);

    const embed = new EmbedBuilder()
      .setColor(0x242428)
      .setDescription(content);

    await interaction.channel.send({ embeds: [embed] });

    await interaction.reply({
      content: "تم إرسال الرسالة بنجاح.",
      ephemeral: true
    });
  }
};
