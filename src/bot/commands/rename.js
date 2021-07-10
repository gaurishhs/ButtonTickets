const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
    name: "close",
    cooldown: 5,
    aliases: ["end"],

    run: async function(client, message, args) {
        try {
            var renameMessage = args.join(' ');
            if (!message.channel.name.includes("ticket-")) {
                message.channel.send({
                    embed: {
                        title: `**❌ | Error**`,
                        description: `This is not a ticket channel`,
                        color: 0xFF0000
                    }
                }).then(async function(msg) {
                    setTimeout(() => {
                        msg.delete().catch(err => { return })
                    }, 1000 * 7);
                })
                return
            }
            if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                message.channel.send({
                    embed: {
                        title: `**❌ | Error**`,
                        description: `you need same permissions to use this command`,
                        color: 0xFF0000
                    }
                }).then(async function(msg) {
                    setTimeout(() => {
                        msg.delete().catch(err => { return })
                    }, 1000 * 7);
                })
                return
            }
            if (!renameMessage) {
                message.channel.send({
                    embed: {
                        title: `**❌ | Error**`,
                        description: `you need same permissions to use this command`,
                        color: 0xFF0000
                    }
                }).then(async function(msg) {
                    setTimeout(() => {
                        msg.delete().catch(err => { return })
                    }, 1000 * 7);
                })
                return
            }
            let btn = new MessageButton()
                .setStyle("green")
                .setEmoji("✅")
                .setID("renameTicketTrue");
            let btn2 = new MessageButton()
                .setStyle("grey")
                .setEmoji("⛔")
                .setID("renameTicketFalse");
            let row = new MessageActionRow()
                .addComponent(btn)
                .addComponent(btn2);
            message.channel.send({
                embed: {
                    title: `**⚠️ | Confirmation**`,
                    description: `Are you sure about rename this ticket?`,
                    color: 0xFFF200
                },
                component: row
            }).then(async function(msg) {
                setTimeout(() => {
                    msg.delete().catch(err => { return })
                }, 1000 * 7);
                require('quick.db').set(`RenameTicket_${message.channel.id}`, renameMessage)
                require('quick.db').set(`DeleteRenameMessage_${message.channel.id}`, msg.id)
            })
        } catch (err) {
            return;
        }
    }
}
