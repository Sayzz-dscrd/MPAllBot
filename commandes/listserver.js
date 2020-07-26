const Discord = require("discord.js");

module.exports.run = async(client, message, args) => {
    client.guilds.cache.forEach(g => {
        let Embed = new Discord.MessageEmbed()
            .setTitle(`Liste des serveurs ( **${client.guilds.cache.size}** )`)
            .setDescription(`${g.name} | Membres : ${g.memberCount} | ID : ${g.id}\n`)
            .setColor("#fab7f4")
        message.channel.send(Embed);
    });
};

module.exports.help = {
    name: "listserver"
};