const Discord = require("discord.js");

module.exports.run = async(client, message, args) => {
    let Embed = new Discord.MessageEmbed()
        .setDescription(`__**${client.guilds.cache.size}**__ Serveurs\n__**${client.users.cache.size}**__ Membres`)
        .setColor("#fab7f4")
    message.channel.send(Embed);
};

module.exports.help = {
    name: "stats"
};