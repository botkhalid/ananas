const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("مسح")
    .setDescription("حذف عدد محدد من الرسائل في هذا الروم")
    .addIntegerOption(option =>
      option
        .setName("العدد")
        .setDescription("عدد الرسائل المطلوب حذفها")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(2147483647)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger("العدد", true);
    const channel = interaction.channel;

    if (!channel || !channel.isTextBased() || !channel.messages) {
      await interaction.reply({
        content: "❌ هذا الأمر يعمل داخل الرومات النصية فقط.",
        ephemeral: true
      });
      return;
    }

    if (!interaction.guild.members.me.permissionsIn(channel).has(PermissionFlagsBits.ManageMessages)) {
      await interaction.reply({
        content: "❌ البوت يحتاج صلاحية Manage Messages في هذا الروم.",
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    let deletedCount = 0;
    let lastMessageId;

    try {
      while (deletedCount < amount) {
        const batchSize = Math.min(100, amount - deletedCount);
        const messages = await channel.messages.fetch({
          limit: batchSize,
          ...(lastMessageId ? { before: lastMessageId } : {})
        });

        if (messages.size === 0) break;
        lastMessageId = messages.last().id;

        const recentMessages = messages.filter(message =>
          Date.now() - message.createdTimestamp < 14 * 24 * 60 * 60 * 1000
        );
        const oldMessages = messages.filter(message =>
          Date.now() - message.createdTimestamp >= 14 * 24 * 60 * 60 * 1000
        );

        if (recentMessages.size > 0) {
          const deleted = await channel.bulkDelete(recentMessages, true);
          deletedCount += deleted.size;
        }

        for (const message of oldMessages.values()) {
          try {
            await message.delete();
            deletedCount += 1;
          } catch (error) {
            // Continue with the remaining messages if one cannot be deleted.
            console.warn(`Could not delete old message ${message.id}: ${error.message}`);
          }
        }
      }

      await interaction.editReply(
        deletedCount > 0
          ? `✅ تم حذف ${deletedCount} رسالة من هذا الروم.`
          : "ℹ️ ما لقيت رسائل قابلة للحذف."
      );
    } catch (error) {
      console.error("Clear command failed:", error);
      await interaction.editReply(
        `❌ تعذر إكمال الحذف. تم حذف ${deletedCount} رسالة قبل حدوث الخطأ.`
      );
    }
  }
};
