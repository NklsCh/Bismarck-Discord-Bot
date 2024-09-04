# Proton

Ever wanted a Bot to help you manage your Server? Well the answer is Proton

It has all the features you want online user tracking or welcome and goodbye messages

## Getting started

1. Clone the Repository and run `npm install` or `pnpm install` to install all the dependencies
2. Create a `.env` file and add the following variables:

```
TOKEN=YOUR_BOT_TOKEN
DISCORD_APPLICATION_ID=YOUR_APPLICATION_ID
DISCORD_GUILD_ID=YOUR_GUILD_ID
```

3. Run `npm run syncdb` or `pnpm syncdb` to create the database
4. Run `npm run dev` or `pnpm dev` to start the bot in development mode

> Note: You only need to add the `DISCORD_GUILD_ID` if you have only one server on which the bot should run. This allows you to register the commands faster.

### For NixOS users
> :information_source: We have a `shell.nix` file that you can use to get all the dependencies you need to run the bot. <br>Just run `nix-shell` in the root directory of the project and you are good to go.

## Usage

`/help` - shows all of the Bots commands

## Badges

[![GPLv3 License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://choosealicense.com/licenses/gpl-3.0/)

## Co-Authors

-   [@LordVertice](https://github.com/LordVertice)
-   [@TomSnd01](https://github.com/TomSnd01)

## Support

For support, join our [Discord Server](https://discord.com/invite/vbRQB8PV9X)

## Copyright

Copyright (c) 2022-2042 Niklas Choinowski and contributors
