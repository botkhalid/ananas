# Ananas

Discord welcome bot and `/ارسال` embed command, built with discord.js v14.

## Setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Create `.env` from `.env.example` and set `DISCORD_TOKEN`.
4. Run `npm start`.

Never upload `.env` to GitHub. `.gitignore` excludes it.

## Required settings

Enable **Server Members Intent** and **Message Content Intent** in the Discord Developer Portal.

Bot permissions:
- View Channels
- Send Messages
- Embed Links
- Use Application Commands
- Manage Server (Manage Guild), for invite tracking

The `/ارسال` command is restricted to server administrators. It posts the entered text as an Embed in the same channel where the command is used.

## Channel IDs

- Welcome: `1538966902125371613`
- Chat: `1563374252357460082`
- Rules: `1563279406179426505`
- Streak: `1563381634072449054`

Room emoji: `<:zz_dotheart:1515881349863440519>`

Invite tracking may show `Unknown` when Discord does not expose a changed invite, such as vanity URLs or certain invite types.


## Automatic Ananas image reply

The bot replies with `assets/ananas-banner.png` only when a user sends a message whose entire trimmed content is exactly one of these values:

- `1563381634072449054`
- `1563380002681266246`

Other messages are ignored by this feature. The bot needs View Channel and Send Messages permissions in the channel.
