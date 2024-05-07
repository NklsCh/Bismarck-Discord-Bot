const { GuildMember } = require("discord.js");

/**
 * Handles banning a user from a guild.
 * @param {GuildMember} user - The user to be banned.
 * @param {string} reason - The reason for the ban.
 * @returns {boolean} - Returns true if the user was successfully banned, false otherwise.
 */
async function handleBan(user, reason) {
    if (user.bannable) {
        try {
            user.ban({ reason: reason })
        } catch (error) {
            console.error(error)
            return false;
        }
        return true;
    }
    return false;
}

module.exports = handleBan