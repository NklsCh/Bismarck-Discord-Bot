const { GuildMember } = require("discord.js");

/**
 * Handles kicking a user from a guild.
 * @param {GuildMember} user - The user to be kicked.
 * @param {string} reason - The reason for the kick.
 * @returns {boolean} - Returns true if the user was successfully kicked, false otherwise.
 */
async function handleKick(user, reason) {
    if (user.kickable) {
        try {
            user.kick(reason)
        } catch (error) {
            console.error(error)
            return false;
        }
        return true;
    }
}

module.exports = handleKick