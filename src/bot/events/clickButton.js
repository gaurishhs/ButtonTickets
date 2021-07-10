const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = async function(client, button) {
        try {
            await button.reply.defer();
            if (button.id == 'createTicket') {
                var nameer = `ticket-${button.clicker.user.username}`
                var checkTickets = button.guild.channels.cache.find(c => c.name == nameer.split(' ').join('-').toLocaleLowerCase());
                if (checkTickets) {
                    button.channel.send({
                        embed: {
                            color: 0xFF0000,
                            title: `**❌ | Error**`,
                            description: `You already have a ticket open before`
                        }
                    }).then(async function(m) {
                        setTimeout(() => {
                            m.delete();
                        }, 1000 * 7);
                    });
                    return
                }
                button.guild.channels.create(`ticket-${button.clicker.user.username}`, {
                    permissionOverwrites: [{
                            id: button.clicker.user.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        },
                        {
                            id: require('quick.db').fetch(`TicketAdminRole_${button.guild.id}`),
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        }, {
                            id: button.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ],
                    type: 'text'
                }).then(async function(channel) {
                    require('quick.db').set(`TicketControl_${channel.id}`, button.clicker.user.id);
                    let btn = new MessageButton()
                        .setStyle("grey")
                        .setEmoji("🔒")
                        .setID("configTicket");
                    let row = new MessageActionRow()
                        .addComponent(btn);
                    channel.send(`<@${button.clicker.user.id}>`, {
                        embed: {
                            description: `Please wait for a **ADMIN** response!!
                    Press **"🔒"** to close this ticket`,
                            color: 0x2F3136
                        },
                        component: row
                    });
                });
            } else if (button.id == 'configTicket') {
                if (!button.channel.name.includes("ticket-")) {
                    return;
                }
                var member = require('quick.db').fetch(`TicketControl_${button.channel.id}`);
                button.channel.overwritePermissions([{
                        id: member,
                        deny: ['SEND_MESSAGES'],
                        allow: ['VIEW_CHANNEL']
                    },
                    {
                        id: require('quick.db').fetch(`TicketAdminRole_${button.guild.id}`),
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                    }, {
                        id: button.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"]
                    }
                ]);
                button.channel.send({
                    embed: {
                        description: `Ticket has been Closed By <@!${button.clicker.user.id}>`,
                        color: 0xFFE700
                    }
                }).then(async function(m) {
                    setTimeout(() => {
                        m.delete();
                    }, 1000 * 5);
                });
                let btn = new MessageButton()
                    .setStyle("grey")
                    .setEmoji("🔓")
                    .setID("reopenTicket");
                let btn2 = new MessageButton()
                    .setStyle("grey")
                    .setEmoji("⛔")
                    .setID("deleteTicket");
                let row = new MessageActionRow()
                    .addComponent(btn2)
                    .addComponent(btn);
                button.channel.send({
                    embed: {
                        description: 'Press **"⛔"** to delete the ticket\nPress **"🔓"** to reopen the ticket',
                        color: 0xFF0000
                    },
                    component: row
                }).then(async function(m) {
                    setTimeout(() => {
                        m.delete();
                    }, 1000 * 25);
                });
            } else if (button.id == "deleteTicket") {
                require('quick.db').delete(`TicketControl_${button.channel.id}`);
                button.channel.send({
                    embed: {
                        description: 'Ticket will be deleted in a few seconds',
                        color: 0xFF0000
                    }
                });
                setTimeout(() => {
                    button.channel.delete();
                }, 1000 * 4.3);
            } else if (button.id == "reopenTicket") {
                button.channel.send({
                    embed: {
                        description: `Ticket has been reopened By <@!${button.clicker.user.id}>`,
                        color: 0xFFE700
                    }
                }).then(async function(m) {
                    setTimeout(() => {
                        m.delete();
                    }, 1000 * 5);
                })
                var member = require('quick.db').fetch(`TicketControl_${button.channel.id}`);
                button.channel.overwritePermissions([{
                        id: member,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                    },
                    {
                        id: require('quick.db').fetch(`TicketAdminRole_${button.guild.id}`),
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                    }, {
                        id: button.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"]
                    }
                ]);
            } else if (button.id == 'closeTicketTrue') {
                require('quick.db').delete(`TicketControl_${button.channel.id}`);
                button.channel.send({
                    embed: {
                        description: 'Ticket will be deleted in a few seconds',
                        color: 0xFF0000
                    }
                });
                setTimeout(() => {
                    button.channel.delete();
                }, 1000 * 4.3);
            } else if (button.id == 'closeTicketFalse') {
                var msg = require('quick.db').fetch(`DeleteMessage_${button.channel.id}`);
                button.channel.messages.fetch(msg).then(message => message.delete()).catch(err => { return });
                require('quick.db').delete(`DeleteMessage_${button.channel.id}`);
            } else if (button.id == 'createTicketFalse') {
                var msg = require('quick.db').fetch(`DeleteOpen_${button.channel.id}`);
                button.channel.messages.fetch(msg).then(message => message.delete()).catch(err => { return });
                require('quick.db').delete(`DeleteOpen_${button.channel.id}`);
            } else if (button.id == 'createTicketTrue') {
                var msg = require('quick.db').fetch(`DeleteOpen_${button.channel.id}`);
                button.channel.messages.fetch(msg).then(message => message.delete()).catch(err => { return });
                require('quick.db').delete(`DeleteOpen_${button.channel.id}`);
                button.guild.channels.create(`ticket-${button.clicker.user.username}`, {
                    permissionOverwrites: [{
                            id: button.clicker.user.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        },
                        {
                            id: require('quick.db').fetch(`TicketAdminRole_${button.guild.id}`),
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        }, {
                            id: button.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ],
                    type: 'text'
                }).then(async function(channel) {
                    require('quick.db').set(`TicketControl_${channel.id}`, button.clicker.user.id);
                    let btn = new MessageButton()
                        .setStyle("grey")
                        .setEmoji("🔒")
                        .setID("configTicket");
                    let row = new MessageActionRow()
                        .addComponent(btn);
                    channel.send(`<@${button.clicker.user.id}>`, {
                        embed: {
                            description: `Please wait for a **ADMIN** response!!
                    Press **"🔒"** to close this ticket`,
                            color: 0x2F3136
                        },
                        component: row
                    });
                });
            } else if (button.id == 'renameTicketFalse') {
                var msg = require('quick.db').fetch(`DeleteRenameMessage_${button.channel.id}`);
                button.channel.messages.fetch(msg).then(message => message.delete()).catch(err => { return });
                require('quick.db').delete(`DeleteRenameMessage_${button.channel.id}`);
            } else if (button.id == 'renameTicketTrue') {
                var msg = require('quick.db').fetch(`DeleteRenameMessage_${button.channel.id}`);
                button.channel.messages.fetch(msg).then(message => message.delete()).catch(err => { return });
                button.channel.setName('ticket-' + require('quick.db').fetch(`RenameTicket_${button.channel.id}`));
                button.channel.send({
                            embed: {
                                title: '✅',
                                description: `this ticket name has been renamed to \`${require('quick.db').fetch(`RenameTicket_${button.channel.id}`)}\``,
                    color: 0x00D700
                }
            })
            require('quick.db').delete(`DeleteRenameMessage_${button.channel.id}`);
        }
    } catch (err) {
        console.log(err)
    }
}
