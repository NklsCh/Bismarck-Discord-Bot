/**
 * Handles banning a user from a guild.
 * @param {User} user - The user to be banned.
 * @param {Guild} guild - The guild where the user is being banned.
 * @param {string} reason - The reason for the ban.
 * @returns {boolean} - Returns true if the user was successfully banned, false otherwise.
 */
async function handleBan(user, guild, reason) {
    if (guild) {
        await guild.members.fetch(user.id).then((member) => {
            if (member.bannable) {
                try {
                    member.ban(reason)
                } catch (error) {
                    console.error(error)
                    return false;
                }
                return true;
            }
        })
    } else {
        if (user.bannable) {
            try {
                user.ban(reason)
            } catch (error) {
                console.error(error)
                return false;
            }
            return true;
        }
    }
    return false
}

module.exports = handleBan