/**
 * Handles kicking a user from a guild.
 * @param {User} user - The user to be kicked.
 * @param {Guild} guild - The guild from which the user will be kicked.
 * @param {string} reason - The reason for the kick.
 * @returns {boolean} - Returns true if the user was successfully kicked, false otherwise.
 */
async function handleKick(user, guild, reason) {
    if (guild) {
        await guild.members.fetch(user.id).then((member) => {
            if (member.kickable) {
                try {
                    member.kick(reason)
                } catch (error) {
                    console.error(error)
                    return false;
                }
                return true;
            }
        })
    } else {
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
    return false
}

module.exports = handleKick