const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = async(client, message, args) => {

    let prefixes = JSON.parse(fs.readFileSync("./config/prefixes.json", "utf8"));
    let prefix = prefixes[message.guild.id].prefixes

    let Embed = new Discord.MessageEmbed()
        .setTitle("Commandes d'aide")
        .addField(prefix + "puballembed", "Pub tout les membres avec un embed completement personnalisable.")
        .addField(prefix + "pubembed", "Pub tout les membres d'un serveur précis avec un embed completement personnalisable.")
        .addField(prefix + "puball", "Pub tout les membres avec un message que vous envoyez.")
        .addField(prefix + "pub", "Pub tout les membres d'un serveur précis avec un message que vous envoyez")
        .addField(prefix + "setactivity", "Change l'activité de votre bot.")
        .addField(prefix + "listserver", "Liste entière des serveurs.")
        .addField(prefix + "stats", "Totales de serveurs et de membres.")
        .addField(prefix + "prefix", "Change le prefix du bot sur le serveur.")
        .setColor("#fab7f4")
        .setFooter(message.author.username, message.author.avatarURL).setTimestamp()
    message.channel.send(Embed);
}

module.exports.help = {
    name: "help"
};