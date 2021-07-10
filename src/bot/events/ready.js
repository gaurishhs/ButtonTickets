const chalk = require('chalk');
const figlet = require("figlet");

module.exports = async function(client) {
    console.log(chalk.yellow.bold(figlet.textSync("ApiDev234")));
    await console.log(chalk.red.bold(client.user.tag) + chalk.blue.bold(" Is Ready"));

    await client.user.setActivity(require('../../config/bot').prefix + "help || Made By Shinchan#2196"); // Don't Remove Credits Might Get You in Danger
    await client.user.setStatus("idle");
}
